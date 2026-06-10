import { createSignal, onCleanup, onMount, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { signalRService } from "../services/signalr/SignalRService";
import {
  ensureMultiplayerHandlersRegistered,
  joinSession,
  subscribeActivity,
  unsubscribeActivity,
} from "../services/signalr/multiplayer.service";
import { getDiscordContextIds } from "../services/discord";
import { authStore } from "../stores/auth.store";
import { sessionState, getHubUserId } from "../stores/session.store";
import { CampaignService, hasScenario } from "../services/campaign.service";

type SessionStartedPayload = {
  sessionId: string;
  campaignId?: string;
  startedByUserId?: string;
  startedByUserName?: string;
  guildId?: string;
  voiceChannelId?: string;
  timestamp?: string;
};

// Mémoire module : invites refusées/déjà vues — pas de re-pop en changeant de page.
const handledSessionIds = new Set<string>();

function parsePayload(data: Record<string, unknown>): SessionStartedPayload {
  return {
    sessionId: String(data.sessionId ?? data.SessionId ?? ""),
    campaignId: String(data.campaignId ?? data.CampaignId ?? ""),
    startedByUserId: (data.startedByUserId ?? data.StartedByUserId) as string | undefined,
    startedByUserName: (data.startedByUserName ?? data.StartedByUserName) as string | undefined,
    guildId: (data.guildId ?? data.GuildId) as string | undefined,
    voiceChannelId: (data.voiceChannelId ?? data.VoiceChannelId) as string | undefined,
    timestamp: (data.timestamp ?? data.Timestamp) as string | undefined,
  };
}

export default function SessionInviteListener() {
  const navigate = useNavigate();
  const [invite, setInvite] = createSignal<SessionStartedPayload | null>(null);
  const [joining, setJoining] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  let cleanupFn: (() => void) | null = null;
  onCleanup(() => cleanupFn?.());

  const isOwnInvite = (payload: SessionStartedPayload): boolean => {
    if (!payload.startedByUserId) return false;
    const ids = [authStore.user()?.id, getHubUserId()].filter(Boolean).map(String);
    return ids.includes(String(payload.startedByUserId));
  };

  const showInvite = (payload: SessionStartedPayload) => {
    if (!payload.sessionId) return;
    if (handledSessionIds.has(payload.sessionId)) return;
    if (isOwnInvite(payload)) return;
    // Pas d'invite si déjà dans une session en cours.
    if (sessionState.session) return;

    handledSessionIds.add(payload.sessionId);
    setError(null);
    setInvite(payload);
  };

  onMount(async () => {
    if (!authStore.isAuthenticated()) return;

    try {
      if (!signalRService.isConnected) {
        await signalRService.connect();
        ensureMultiplayerHandlersRegistered();
      }

      let ctx = getDiscordContextIds();
      let guildId = ctx?.guildId || "";
      let voiceChannelId = ctx?.voiceChannelId || ctx?.channelId || "";

      if (!guildId || !voiceChannelId) {
        await new Promise<void>((resolve) => setTimeout(resolve, 2500));
        ctx = getDiscordContextIds();
        guildId = ctx?.guildId || "";
        voiceChannelId = ctx?.voiceChannelId || ctx?.channelId || "";
      }

      const activityHandler = (data: Record<string, unknown>) =>
        showInvite(parsePayload(data));
      // Invite de campagne — envoyée par le back à tous les membres connectés,
      // où qu'ils soient dans l'app.
      const campaignHandler = (data: Record<string, unknown>) =>
        showInvite(parsePayload(data));

      signalRService.on("ActivitySessionStarted", activityHandler);
      signalRService.on("SessionStarted", campaignHandler);

      if (guildId && voiceChannelId) {
        await subscribeActivity(guildId, voiceChannelId);
      }

      cleanupFn = () => {
        try {
          signalRService.off("ActivitySessionStarted", activityHandler);
          signalRService.off("SessionStarted", campaignHandler);
        } catch {}

        if (signalRService.isConnected && guildId && voiceChannelId) {
          unsubscribeActivity(guildId, voiceChannelId).catch(() => undefined);
        }
      };
    } catch (e) {
      console.warn("SessionInviteListener init failed:", e);
    }
  });

  const decline = () => {
    setInvite(null);
    // L'invite reste rejoignable depuis la page de la campagne (bannière).
  };

  const accept = async () => {
    const i = invite();
    if (!i) return;
    setJoining(true);
    setError(null);
    try {
      if (!signalRService.isConnected) {
        await signalRService.connect();
        ensureMultiplayerHandlersRegistered();
      }

      const res = await joinSession(i.sessionId);
      if (!res.success) {
        setError(res.message ?? "Failed to join session.");
        return;
      }
      setInvite(null);

      // Campagne avec scénario → lobby de campagne, sinon lobby multijoueur libre.
      if (i.campaignId) {
        try {
          const campaign = await CampaignService.getCampaign(i.campaignId);
          if (hasScenario(campaign.campaignTreeDefinition)) {
            navigate(`/campaigns/${i.campaignId}/lobby`);
            return;
          }
        } catch {
          // Détail campagne indisponible — fallback lobby générique.
        }
        navigate(`/practice/multiplayer`);
      } else {
        navigate("/practice");
      }
    } catch (err: any) {
      setError(err?.message ?? "Failed to join session.");
    } finally {
      setJoining(false);
    }
  };

  return (
    <Show when={invite()}>
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={decline}
      >
        <div
          class="bg-game-dark border border-white/10 rounded-2xl p-6 max-w-md w-full mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 class="text-xl font-display text-white mb-3">
            Game session started
          </h3>
          <p class="text-slate-300 mb-4">
            <span class="text-purple-300 font-semibold">
              {invite()?.startedByUserName || "A player"}
            </span>{" "}
            started a game session. Do you want to join?
          </p>

          <Show when={error()}>
            <p class="mb-3 text-red-400 text-sm">{error()}</p>
          </Show>

          <div class="flex gap-3">
            <button
              onClick={decline}
              class="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all"
              disabled={joining()}
            >
              Plus tard
            </button>
            <button
              onClick={accept}
              class="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-xl text-white transition-all disabled:opacity-50"
              disabled={joining()}
            >
              {joining() ? "Rejoindre..." : "Rejoindre"}
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
}
