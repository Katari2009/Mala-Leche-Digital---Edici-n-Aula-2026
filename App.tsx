
import React, { useState, useEffect, useCallback } from 'react';
import { GameState, GameStatus, GameMode, Card, CardType, Player } from './types';
import { UI_STRINGS, EDUCATIONAL_DECK, NORMAL_DECK_BLACK } from './constants';
import { createInitialState, startNextRound, playCard, resolveRound } from './services/gameLogic';
import { PlayerBar } from './components/PlayerBar';
import { GameCard } from './components/GameCard';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentPlayerId] = useState('p1');
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [showTutorial, setShowTutorial] = useState(true);
  const [winnerChoice, setWinnerChoice] = useState<string | null>(null);
  const [loserChoice, setLoserChoice] = useState<string | null>(null);

  const currentPlayer = gameState?.players.find(p => p.id === currentPlayerId);

  // Initial lobby setup
  const createRoom = (mode: GameMode) => {
    const initialState = createInitialState('CHILE2024', 'Jugador 1', mode);
    setGameState(initialState);
  };

  const handleStartGame = () => {
    if (gameState) {
      setGameState(startNextRound(gameState));
    }
  };

  const handlePlayCard = () => {
    if (!gameState || selectedCards.length === 0) return;
    
    // Play the user card
    let nextState = playCard(gameState, currentPlayerId, selectedCards);
    
    // Simulate other bots playing
    const bots = nextState.players.filter(p => p.isBot && !p.isDealer);
    bots.forEach(bot => {
      if (bot.hand.length > 0) {
        nextState = playCard(nextState, bot.id, [bot.hand[0].id]);
      }
    });

    setGameState(nextState);
    setSelectedCards([]);
  };

  const handleDealerDecision = () => {
    if (gameState && winnerChoice && loserChoice) {
      const nextState = resolveRound(gameState, winnerChoice, loserChoice);
      setGameState(nextState);
      setWinnerChoice(null);
      setLoserChoice(null);
    }
  };

  const toggleCardSelection = (id: string) => {
    if (selectedCards.includes(id)) {
      setSelectedCards(selectedCards.filter(c => c !== id));
    } else {
      setSelectedCards([id]); // Simple version: select 1 card
    }
  };

  if (!gameState) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-neutral-900 to-black">
        <h1 className="text-7xl md:text-9xl font-bebas mb-2 text-white tracking-tighter">MALA LECHE</h1>
        <p className="text-yellow-500 mb-12 font-bold tracking-widest text-sm uppercase">Edición Digital Multiplataforma</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <button 
            onClick={() => createRoom(GameMode.NORMAL)}
            className="group relative p-8 bg-neutral-900 border border-neutral-800 rounded-2xl hover:border-yellow-500 transition-all overflow-hidden"
          >
            <div className="relative z-10 text-left">
              <h3 className="text-2xl font-bebas text-white mb-2">MODO NORMAL</h3>
              <p className="text-neutral-400 text-sm">La experiencia clásica chilena. Completa la frase con la ordinariez más grande que tengai.</p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-20 transition-opacity">
              <span className="text-9xl font-bebas">ML</span>
            </div>
          </button>

          <button 
            onClick={() => createRoom(GameMode.AULA)}
            className="group relative p-8 bg-indigo-950 border border-indigo-900 rounded-2xl hover:border-indigo-400 transition-all overflow-hidden"
          >
            <div className="relative z-10 text-left">
              <h3 className="text-2xl font-bebas text-indigo-200 mb-2">MODO AULA 🎓</h3>
              <p className="text-indigo-300 text-sm">Educativo y neutro. Habilidades del Siglo XXI, pedagogía y gamificación. Ideal para profes choros.</p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-30 transition-opacity">
              <span className="text-9xl font-bebas">AI</span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-black text-white">
      {/* Sidebar */}
      <PlayerBar players={gameState.players} currentPlayerId={currentPlayerId} />

      {/* Main Game Area */}
      <main className="flex-1 flex flex-col h-screen relative overflow-hidden">
        
        {/* Header */}
        <header className="p-4 border-b border-neutral-900 flex justify-between items-center bg-black/50 backdrop-blur-md z-20">
          <div>
            <span className="text-xs uppercase tracking-widest text-neutral-500">SALA: {gameState.roomCode}</span>
            <h2 className="font-bebas text-2xl text-yellow-500">Ronda {gameState.currentRound}</h2>
          </div>
          <div className="bg-neutral-900 px-4 py-2 rounded-full border border-neutral-800">
            <span className="text-green-400 font-mono text-sm">POZO: {gameState.pot} LUCAS</span>
          </div>
        </header>

        {/* Game Board */}
        <div className="flex-1 p-6 overflow-y-auto pb-64">
          
          {gameState.status === GameStatus.LOBBY && (
            <div className="h-full flex flex-col items-center justify-center space-y-8">
              <div className="text-center">
                <h2 className="text-5xl font-bebas mb-2">Sala de Espera</h2>
                <p className="text-neutral-500">¿Están listos los cabros?</p>
              </div>
              <button 
                onClick={handleStartGame}
                className="px-12 py-4 bg-yellow-500 text-black font-bebas text-3xl rounded-full hover:bg-yellow-400 transition-transform active:scale-95 shadow-xl shadow-yellow-500/20"
              >
                EMPEZAR PARTIDA
              </button>
            </div>
          )}

          {(gameState.status === GameStatus.PLAYING || gameState.status === GameStatus.JUDGING || gameState.status === GameStatus.ROUND_RESULTS) && (
            <div className="space-y-12">
              
              {/* White Cards (The Questions) */}
              <section className="flex flex-col items-center">
                <h3 className="text-xs uppercase tracking-widest text-neutral-500 mb-6">La Situación</h3>
                <div className="flex gap-4 justify-center">
                  {gameState.whiteCardsOnTable.map(card => (
                    <GameCard key={card.id} card={card} disabled />
                  ))}
                </div>
              </section>

              {/* Submissions Zone */}
              <section className="flex flex-col items-center min-h-[300px]">
                <h3 className="text-xs uppercase tracking-widest text-neutral-500 mb-6">Respuestas Jugadas</h3>
                <div className="flex flex-wrap gap-4 justify-center">
                  {gameState.status === GameStatus.PLAYING && (
                    <div className="text-neutral-600 italic text-sm animate-pulse">Esperando jugadas...</div>
                  )}
                  {gameState.submissions.map((sub, idx) => {
                    const card = (gameState.mode === GameMode.AULA ? EDUCATIONAL_DECK : NORMAL_DECK_BLACK).find(c => c.id === sub.cardIds[0]);
                    const isDealer = currentPlayer?.isDealer;
                    const canJudge = gameState.status === GameStatus.JUDGING && isDealer;

                    return (
                      <div key={idx} className="flex flex-col items-center gap-2">
                        <GameCard 
                          card={card || {id: '?', text: '?', type: CardType.BLACK}} 
                          isFlipped={gameState.status !== GameStatus.PLAYING}
                          onClick={() => {
                            if (canJudge) {
                              if (winnerChoice === sub.playerId) setWinnerChoice(null);
                              else if (loserChoice === sub.playerId) setLoserChoice(null);
                              else if (!winnerChoice) setWinnerChoice(sub.playerId);
                              else if (!loserChoice) setLoserChoice(sub.playerId);
                            }
                          }}
                          selected={winnerChoice === sub.playerId || loserChoice === sub.playerId}
                          disabled={!canJudge}
                        />
                        {winnerChoice === sub.playerId && <span className="text-xs text-green-500 font-bold uppercase tracking-wider">La Mejor 🔥</span>}
                        {loserChoice === sub.playerId && <span className="text-xs text-red-500 font-bold uppercase tracking-wider">La Peor 💀</span>}
                      </div>
                    );
                  })}
                </div>
                
                {gameState.status === GameStatus.JUDGING && currentPlayer?.isDealer && (
                  <div className="mt-8 flex flex-col items-center">
                    <p className="text-yellow-500 font-bold mb-4">{UI_STRINGS.DEALER_TURN}</p>
                    <button 
                      disabled={!winnerChoice || !loserChoice}
                      onClick={handleDealerDecision}
                      className="px-8 py-3 bg-white text-black font-bebas text-xl rounded-full disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      CONFIRMAR ELECCIÓN
                    </button>
                  </div>
                )}
              </section>

              {gameState.status === GameStatus.ROUND_RESULTS && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl animate-in fade-in duration-500">
                  <div className="text-center p-8 bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md">
                    <h2 className="text-5xl font-bebas text-yellow-500 mb-4">Fin de Ronda</h2>
                    <div className="space-y-6 mb-8">
                       <p className="text-lg">{UI_STRINGS.WIN_POT}</p>
                       <div className="text-sm text-neutral-400">
                         Ganador: <span className="text-white font-bold">{gameState.players.find(p => p.id === gameState.lastWinnerId)?.name}</span>
                       </div>
                       <div className="text-sm text-neutral-400">
                         Lacho de la ronda: <span className="text-white font-bold">{gameState.players.find(p => p.id === gameState.lastLoserId)?.name}</span>
                       </div>
                    </div>
                    <button 
                      onClick={() => setGameState(startNextRound(gameState))}
                      className="w-full py-4 bg-yellow-500 text-black font-bebas text-2xl rounded-2xl"
                    >
                      SIGUIENTE RONDA
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Player Hand / Actions (Sticky Bottom) */}
        {gameState.status === GameStatus.PLAYING && !currentPlayer?.isDealer && (
          <div className="absolute bottom-0 left-0 right-0 bg-neutral-950/80 backdrop-blur-xl border-t border-neutral-800 p-6 transform transition-transform duration-500 translate-y-0 z-30">
            <div className="max-w-7xl mx-auto flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xs uppercase tracking-widest text-neutral-500">Tu Mano</h3>
                <div className="flex gap-4">
                   <button className="text-[10px] uppercase font-bold text-neutral-500 hover:text-white transition-colors">🔄 Cambiar Mano (-1000)</button>
                </div>
              </div>
              
              <div className="flex gap-3 overflow-x-auto pb-4 px-2 no-scrollbar">
                {currentPlayer?.hand.map(card => (
                  <GameCard 
                    key={card.id} 
                    card={card} 
                    selected={selectedCards.includes(card.id)}
                    onClick={() => toggleCardSelection(card.id)}
                    disabled={gameState.submissions.some(s => s.playerId === currentPlayerId)}
                  />
                ))}
              </div>

              <div className="flex justify-center">
                <button 
                  disabled={selectedCards.length === 0 || gameState.submissions.some(s => s.playerId === currentPlayerId)}
                  onClick={handlePlayCard}
                  className="px-20 py-4 bg-yellow-500 text-black font-bebas text-3xl rounded-full disabled:opacity-30 disabled:grayscale transition-all hover:scale-105 active:scale-95"
                >
                  JUGAR CARTA
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tutorial Modal */}
        {showTutorial && (
          <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl max-w-lg w-full">
              <h2 className="text