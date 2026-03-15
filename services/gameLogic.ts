
import { 
  GameState, Player, Card, CardType, GameStatus, GameMode, Submission 
} from '../types';
import { 
  EDUCATIONAL_DECK, NORMAL_DECK_WHITE, NORMAL_DECK_BLACK, 
  INITIAL_LUCAS, INITIAL_HAND_SIZE 
} from '../constants';

const shuffle = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export const createInitialState = (roomCode: string, playerName: string, mode: GameMode): GameState => {
  const host: Player = {
    id: 'p1',
    name: playerName,
    lucas: INITIAL_LUCAS,
    hand: [],
    isDealer: true,
    isHost: true,
    score: 0,
    isBot: false,
  };

  const bots: Player[] = [
    { id: 'b1', name: 'El Brayan (Bot)', lucas: INITIAL_LUCAS, hand: [], isDealer: false, isHost: false, score: 0, isBot: true },
    { id: 'b2', name: 'La Profe Rosa (Bot)', lucas: INITIAL_LUCAS, hand: [], isDealer: false, isHost: false, score: 0, isBot: true },
    { id: 'b3', name: 'Tío Aceite (Bot)', lucas: INITIAL_LUCAS, hand: [], isDealer: false, isHost: false, score: 0, isBot: true },
  ];

  return {
    roomCode,
    status: GameStatus.LOBBY,
    mode,
    players: [host, ...bots],
    whiteCardsOnTable: [],
    submissions: [],
    currentRound: 0,
    pot: 0,
  };
};

export const startNextRound = (state: GameState): GameState => {
  const newState = { ...state };
  newState.currentRound += 1;
  newState.status = GameStatus.DEALING;
  newState.submissions = [];
  
  // Determine Dealer (rotative)
  const dealerIndex = (newState.currentRound - 1) % newState.players.length;
  newState.players = newState.players.map((p, idx) => ({
    ...p,
    isDealer: idx === dealerIndex,
  }));

  // Select White Cards (2 for this game rule)
  const deck = newState.mode === GameMode.AULA ? EDUCATIONAL_DECK : [...NORMAL_DECK_WHITE];
  const whiteCards = shuffle(deck.filter(c => c.type === CardType.WHITE)).slice(0, 2);
  newState.whiteCardsOnTable = whiteCards;

  // Initial Deal if Round 1
  if (newState.currentRound === 1) {
    const blackCards = shuffle(newState.mode === GameMode.AULA ? EDUCATIONAL_DECK : NORMAL_DECK_BLACK).filter(c => c.type === CardType.BLACK);
    let cardIdx = 0;
    newState.players = newState.players.map(p => {
      const hand = blackCards.slice(cardIdx, cardIdx + INITIAL_HAND_SIZE);
      cardIdx += INITIAL_HAND_SIZE;
      return { ...p, hand };
    });
  }

  // Auto-play for bots
  newState.status = GameStatus.PLAYING;
  
  return newState;
};

export const playCard = (state: GameState, playerId: string, cardIds: string[]): GameState => {
  const submission: Submission = {
    playerId,
    cardIds,
    isRevealed: false
  };
  
  const newState = { 
    ...state, 
    submissions: [...state.submissions, submission] 
  };

  // Check if all non-dealer players have submitted
  const activePlayers = newState.players.filter(p => !p.isDealer);
  if (newState.submissions.length >= activePlayers.length) {
    newState.status = GameStatus.JUDGING;
  }

  return newState;
};

export const resolveRound = (state: GameState, winnerId: string, loserId: string): GameState => {
  const newState = { ...state };
  const winner = newState.players.find(p => p.id === winnerId);
  const loser = newState.players.find(p => p.id === loserId);

  if (winner && loser) {
    // Winner takes pot + fine from loser
    const fine = 1000; // 1 LUCA
    winner.lucas += (newState.pot + fine);
    loser.lucas -= fine;
    winner.score += 1;
    
    newState.lastWinnerId = winnerId;
    newState.lastLoserId = loserId;
    newState.pot = 0;
  }

  newState.status = GameStatus.ROUND_RESULTS;
  return newState;
};
