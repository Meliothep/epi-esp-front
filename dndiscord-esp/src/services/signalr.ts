import { GameRoomState, GameAction, GameBoard } from '../types';

// SignalR WebSocket service for real-time multiplayer game synchronization
class SignalRService {
  private connection: any;
  private listeners: Map<string, Set<Function>> = new Map();
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;

  constructor() {
    // SignalR connection will be initialized when needed
  }

  /**
   * Initialiser la connexion WebSocket
   */
  async connect(url: string): Promise<void> {
    try {
      // Pour l'instant, on simule la connexion
      // En production, utiliser @microsoft/signalr
      console.log('Connecting to SignalR:', url);
      this.isConnected = true;
      this.emit('connected', { message: 'Connected to game server' });
    } catch (error) {
      console.error('SignalR connection error:', error);
      this.handleReconnect();
    }
  }

  /**
   * Déconnecter
   */
  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
    }
    this.isConnected = false;
  }

  /**
   * S'abonner à un événement
   */
  on(eventName: string, handler: Function): void {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    this.listeners.get(eventName)!.add(handler);
  }

  /**
   * Se désabonner d'un événement
   */
  off(eventName: string, handler: Function): void {
    if (this.listeners.has(eventName)) {
      this.listeners.get(eventName)!.delete(handler);
    }
  }

  /**
   * Émettre un événement
   */
  private emit(eventName: string, data: any): void {
    if (this.listeners.has(eventName)) {
      this.listeners.get(eventName)!.forEach((handler) => {
        handler(data);
      });
    }
  }

  /**
   * Envoyer une action de jeu
   */
  async sendGameAction(action: GameAction): Promise<void> {
    if (!this.isConnected) {
      console.warn('Not connected to server');
      return;
    }
    // this.connection.invoke('SendGameAction', action);
    console.log('Game action sent:', action);
    this.emit('gameAction', action);
  }

  /**
   * Joindre une room de campagne
   */
  async joinCampaign(campaignId: string, characterId: string): Promise<void> {
    if (!this.isConnected) {
      console.warn('Not connected to server');
      return;
    }
    // this.connection.invoke('JoinCampaign', campaignId, characterId);
    console.log('Joined campaign:', campaignId, 'with character:', characterId);
    this.emit('campaignJoined', { campaignId, characterId });
  }

  /**
   * Quitter une room de campagne
   */
  async leaveCampaign(campaignId: string): Promise<void> {
    if (!this.isConnected) {
      console.warn('Not connected to server');
      return;
    }
    // this.connection.invoke('LeaveCampaign', campaignId);
    console.log('Left campaign:', campaignId);
    this.emit('campaignLeft', { campaignId });
  }

  /**
   * Mettre à jour l'état du plateau
   */
  async updateBoardState(board: GameBoard): Promise<void> {
    if (!this.isConnected) {
      console.warn('Not connected to server');
      return;
    }
    // this.connection.invoke('UpdateBoardState', board);
    console.log('Board state updated:', board);
    this.emit('boardUpdated', board);
  }

  /**
   * Obtenir l'état actuel de la room
   */
  getRoomState(): GameRoomState | null {
    // À implémenter selon le backend
    return null;
  }

  /**
   * Gestionnaire de reconnexion
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      
      setTimeout(() => {
        // Tenter la reconnexion
      }, this.reconnectDelay);
    } else {
      console.error('Failed to reconnect after maximum attempts');
      this.emit('connectionFailed', { message: 'Failed to connect to server' });
    }
  }

  /**
   * Vérifier si connecté
   */
  isConnectedToServer(): boolean {
    return this.isConnected;
  }
}

export const signalRService = new SignalRService();
