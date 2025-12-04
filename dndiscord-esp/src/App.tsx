import { createSignal } from 'solid-js';
import { Swords, Settings } from 'lucide-solid'
import { useNavigate } from '@solidjs/router'
import { GameIconsFoldedPaper } from './components/common/GameIconsFoldedPaper'
import { GameIconsPencilBrush } from './components/common/GameIconsPencilBrush'
import { GameIconsCrossedSwords } from './components/common/GameIconsCrossedSwords'

export default function App() {
	const [hovered, setHovered] = createSignal<string | null>(null);
    const navigate = useNavigate();

	return (
		<div class="relative min-h-full w-full overflow-hidden bg-brand-gradient">
			{/* Subtle vignette to increase contrast in iframe */}
			<div class="vignette absolute inset-0"></div>

			<main class="relative z-10 mx-auto flex min-h-full max-w-5xl flex-col items-center justify-center gap-10 p-6 sm:p-10">
				<header class="text-center">
					<button class="settings-btn" aria-label="Paramètres" onClick={() => (location.hash = '#parametres')}>
						<Settings class="settings-icon h-5 w-5" />
					</button>
					<h1 class="title-shine title-gradient font-display text-5xl sm:text-6xl md:text-7xl tracking-wide bg-clip-text text-transparent drop-shadow-[0_2px_0_rgba(0,0,0,0.35)]">
						DnDiscord 
					</h1>
					<p class="mt-3 text-slate-100/90 max-w-xl mx-auto">
						Retrouvez l'univers Donjons & Dragons dans un format Discord.
					</p>
					<div class="mt-6 mx-auto decorative-divider">

</div>
				</header>

				<section class="flex w-full flex-col items-center gap-4">
					<div class="menu-row w-full sm:w-auto">
					<span class="menu-badge"><span class="menu-badge-inner"><GameIconsCrossedSwords class="menu-badge-icon h-12 w-12" /></span></span>
					<button
						class="menu-button"
						onMouseEnter={() => setHovered('play')}
						onMouseLeave={() => setHovered(null)}
						onClick={() => navigate('/play')}
					>
						<span class="font-old text-lg">Jouer</span>
						</button>
					</div>
					<div class="menu-row w-full sm:w-auto">
						<span class="menu-badge"><span class="menu-badge-inner"><GameIconsPencilBrush class="menu-badge-icon h-10 w-10" /></span></span>
					<button
						class="menu-button"
						onMouseEnter={() => setHovered('create')}
						onMouseLeave={() => setHovered(null)}
						onClick={() => navigate('/create')}
					>
						<span class="font-old text-lg">Créer nouveau personnage</span>
						</button>
					</div>
					<div class="menu-row w-full sm:w-auto">
						<span class="menu-badge"><span class="menu-badge-inner"><GameIconsFoldedPaper class="menu-badge-icon h-10 w-10" /></span></span>
						<button
						class="menu-button"
						onMouseEnter={() => setHovered('rules')}
						onMouseLeave={() => setHovered(null)}
					onClick={() => navigate('/rules')}
					>
						<span class="font-old text-lg">Règles du jeu</span>
						</button>
					</div>
				</section>

				{/* Context hint area */}
				<footer class="mt-2 text-center text-xs text-slate-200/80">
					{hovered() === 'play' && <p>Commencez une aventure en un clic.</p>}
					{hovered() === 'create' && <p>Forgez un héros pour vos quêtes.</p>}
					{hovered() === 'rules' && <p>Consultez les règles du jeu.</p>}
				</footer>
			</main>
		</div>
	);
}


