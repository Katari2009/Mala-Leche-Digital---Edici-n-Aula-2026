
export enum CardType {
  WHITE = 'WHITE', // Question / Situation
  BLACK = 'BLACK'  // Response
}

export enum GameStatus {
  LOBBY = 'LOBBY',
  DEALING = 'DEALING',
  PLAYING = 'PLAYING',
  JUDGING = 'JUDGING',
  ROUND_RESULTS = 'ROUND_RESULTS',
  GAME_OVER = 'GAME_OVER'
}

export enum GameMode {
  NORMAL = 'NORMAL',
  FAST = 'FAST',
  CASINO = 'CASINO',
  AULA = 'AULA'
}

export interface Card {
  id: string;
  text: string;
  type: CardType;
}

export interface Player {
  id: string;
  name: string;
  lucas: number;
  hand: Card[];
  isDealer: boolean;
  isHost: boolean;
  score: number;
  isBot: boolean;
}

export interface Submission {
  playerId: string;
  cardIds: string[];
  isRevealed: boolean;
}

export interface GameState {
  roomCode: string;
  status: GameStatus;
  mode: GameMode;
  players: Player[];
  whiteCardsOnTable: Card[];
  submissions: Submission[];
  currentRound: number;
  pot: number;
  lastWinnerId?: string;
  lastLoserId?: string;
}
