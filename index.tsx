
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GameState, GameStatus, GameMode, Card, CardType, Player } from './types';
import { UI_STRINGS, EDUCATIONAL_DECK, NORMAL_DECK_BLACK, INITIAL_LUCAS } from './constants';
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

  // Check if tutorial was already seen
  useEffect(() => {
    const seen = localStorage.getItem('ml_tutorial_seen');
    if (seen) setShowTutorial(false);
  }, []);

  const closeTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('ml_tutorial_seen', 'true');
  };

  const createRoom = (mode: GameMode) => {
    const initialState = createInitialState('CHILE2025', 'Tú', mode);
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
    
    // Simulate other bots playing automatically
    const bots = nextState.players.filter(p => p.isBot && !p.isDealer);
    bots.forEach(bot => {
      if (bot.hand.length > 0) {
        // Randomly pick a card from hand for bot
        const randomCard = bot.hand[Math.floor(Math.random() * bot.hand.length)];
        nextState = playCard(nextState, bot.id, [randomCard.id]);
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
    if (gameState?.submissions.some(s => s.playerId === currentPlayerId)) return;
    if (selectedCards.includes(id)) {
      setSelectedCards(selectedCards.filter(c => c !== id));
    } else {
      setSelectedCards([id]); // Simple version: select 1 card
    }
  };

  if (!gameState) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-neutral-900 to-black">
        <div className="text-center mb-12 animate-in fade-in zoom-in duration-700">
          <h1 className="text-7xl md:text-9xl font-bebas mb-2 text-white tracking-tighter drop-shadow-2xl">MALA LECHE</h1>
          <p className="text-yellow-500 font-bold tracking-[0.3em] text-xs md:text-sm uppercase">Edición Digital Multiplataforma</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl px-4">
          <button 
            onClick={() => createRoom(GameMode.NORMAL)}
            className="group relative p-8 bg-neutral-900 border border-neutral-800 rounded-2xl hover:border-yellow-500 transition-all overflow-hidden shadow-xl"
          >
            <div className="relative z-10 text-left">
              <h3 className="text-2xl font-bebas text-white mb-2">MODO NORMAL</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">La experiencia clásica chilena. Completa la frase con la ordinariez más grande que tengai en la mano.</p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-20 transition-opacity">
              <span className="text-9xl font-bebas">ML</span>
            </div>
          </button>

          <button 
            onClick={() => createRoom(GameMode.AULA)}
            className="group relative p-8 bg-indigo-950 border border-indigo-900 rounded-2xl hover:border-indigo-400 transition-all overflow-hidden shadow-xl"
          >
            <div className="relative z-10 text-left">
              <h3 className="text-2xl font-bebas text-indigo-200 mb-2 flex items-center gap-2">MODO AULA 🎓</h3>
              <p className="text-indigo-300/80 text-sm leading-relaxed">Enfocado en Habilidades del Siglo XXI, pedagogía y pensamiento crítico. Ideal para docentes y estudiantes.</p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-30 transition-opacity">
              <span className="text-9xl font-bebas">AI</span>
            </div>
          </button>
        </div>

        <footer className="mt-16 text-neutral-600 text-[10px] uppercase tracking-[0.2em] flex flex-col items-center gap-2">
          <span>Inspirado en el juego chileno Mala Leche</span>
          <span className="opacity-50">Creado por: Christian Núñez V., 2026</span>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-black text-white selection:bg-yellow-500/30">
      {/* Sidebar */}
      <PlayerBar players={gameState.players} currentPlayerId={currentPlayerId} />

      {/* Main Game Area */}
      <main className="flex-1 flex flex-col h-screen relative overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900/20 via-black to-black">
        
        {/* Header */}
        <header className="p-4 border-b border-neutral-900 flex justify-between items-center bg-black/50 backdrop-blur-md z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setGameState(null)} className="text-neutral-500 hover:text-white text-xs uppercase font-bold tracking-tighter">← Salir</button>
            <div className="h-8 w-[1px] bg-neutral-800" />
            <div>
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 block leading-none mb-1">SALA: {gameState.roomCode}</span>
              <h2 className="font-bebas text-2xl text-yellow-500 leading-none">Ronda {gameState.currentRound}</h2>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {gameState.mode === GameMode.AULA && (
              <span className="hidden md:inline-block text-[10px] bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/30 uppercase font-bold tracking-widest">
                Modo Aula Activo
              </span>
            )}
            <div className="bg-neutral-900 px-4 py-2 rounded-xl border border-neutral-800 shadow-inner">
              <span className="text-green-400 font-mono text-sm font-bold">{gameState.pot.toLocaleString()} LUCAS</span>
            </div>
          </div>
        </header>

        {/* Game Board */}
        <div className="flex-1 p-6 overflow-y-auto pb-80 scroll-smooth">
          
          {gameState.status === GameStatus.LOBBY && (
            <div className="h-full flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-700">
              <div className="text-center">
                <h2 className="text-6xl font-bebas mb-4 tracking-tight">Sala de Espera</h2>
                <p className="text-neutral-500 max-w-sm mx-auto">Invita a tus amigos (o juega contra los bots que ya están aquí). ¿Están listos para el show?</p>
              </div>
              <button 
                onClick={handleStartGame}
                className="group relative px-12 py-5 bg-yellow-500 text-black font-bebas text-4xl rounded-full hover:bg-yellow-400 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-yellow-500/30"
              >
                EMPEZAR PARTIDA
                <div className="absolute inset-0 rounded-full animate-ping bg-yellow-400/20 group-hover:block hidden" />
              </button>
            </div>
          )}

          {(gameState.status === GameStatus.PLAYING || gameState.status === GameStatus.JUDGING || gameState.status === GameStatus.ROUND_RESULTS) && (
            <div className="space-y-16 max-w-6xl mx-auto pt-4">
              
              {/* White Cards (The Questions) */}
              <section className="flex flex-col items-center">
                <h3 className="text-[10px] uppercase tracking-[0.4em] text-neutral-500 mb-8 font-bold">La Situación</h3>
                <div className="flex flex-wrap gap-6 justify-center">
                  {gameState.whiteCardsOnTable.map(card => (
                    <div key={card.id} className="animate-in slide-in-from-bottom-8 duration-500">
                      <GameCard card={card} disabled />
                    </div>
                  ))}
                </div>
              </section>

              {/* Submissions Zone */}
              <section className="flex flex-col items-center min-h-[350px]">
                <h3 className="text-[10px] uppercase tracking-[0.4em] text-neutral-500 mb-8 font-bold">Respuestas Jugadas</h3>
                <div className="flex flex-wrap gap-6 justify-center">
                  {gameState.status === GameStatus.PLAYING && gameState.submissions.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-48">
                      <div className="w-12 h-12 border-4 border-neutral-800 border-t-yellow-500 rounded-full animate-spin mb-4" />
                      <p className="text-neutral-600 italic text-sm tracking-wide">Esperando jugadas de los giles...</p>
                    </div>
                  )}
                  {gameState.submissions.map((sub, idx) => {
                    // Try to find the card text from both decks
                    const card = [...EDUCATIONAL_DECK, ...NORMAL_DECK_BLACK].find(c => c.id === sub.cardIds[0]);
                    const isDealer = currentPlayer?.isDealer;
                    const canJudge = gameState.status === GameStatus.JUDGING && isDealer;

                    return (
                      <div key={idx} className="flex flex-col items-center gap-3 animate-in fade-in duration-300" style={{animationDelay: `${idx * 150}ms`}}>
                        <GameCard 
                          card={card || {id: '?', text: '...', type: CardType.BLACK}} 
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
                        {gameState.status === GameStatus.JUDGING && (
                          <div className="h-6 flex items-center">
                            {winnerChoice === sub.playerId && <span className="text-[10px] bg-green-500 text-white px-3 py-1 rounded-full font-bold uppercase tracking-widest shadow-lg shadow-green-500/20">La Mejor 🔥</span>}
                            {loserChoice === sub.playerId && <span className="text-[10px] bg-red-500 text-white px-3 py-1 rounded-full font-bold uppercase tracking-widest shadow-lg shadow-red-500/20">La Peor 💀</span>}
                            {!winnerChoice && !loserChoice && canJudge && <span className="text-[9px] text-neutral-600 uppercase font-bold tracking-widest">Seleccionar</span>}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {gameState.status === GameStatus.JUDGING && currentPlayer?.isDealer && (
                  <div className="mt-12 flex flex-col items-center animate-bounce-slow">
                    <p className="text-yellow-500 font-bold mb-6 text-sm uppercase tracking-widest text-center">{UI_STRINGS.DEALER_TURN}</p>
                    <button 
                      disabled={!winnerChoice || !loserChoice}
                      onClick={handleDealerDecision}
                      className="px-10 py-4 bg-white text-black font-bebas text-2xl rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:bg-yellow-400 transition-colors shadow-2xl"
                    >
                      CONFIRMAR ELECCIÓN
                    </button>
                  </div>
                )}
              </section>

              {gameState.status === GameStatus.ROUND_RESULTS && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl animate-in fade-in duration-500">
                  <div className="text-center p-12 bg-neutral-900/50 border border-neutral-800 rounded-[3rem] max-w-lg w-full shadow-[0_0_100px_rgba(234,179,8,0.1)]">
                    <h2 className="text-6xl font-bebas text-yellow-500 mb-2 tracking-tighter">FIN DE RONDA</h2>
                    <p className="text-neutral-500 text-xs uppercase tracking-[0.3em] mb-10">Resultados oficiales</p>
                    
                    <div className="space-y-8 mb-12">
                       <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-3xl">
                         <div className="text-[10px] text-green-500 font-bold uppercase tracking-widest mb-1">Ganador del Pozo</div>
                         <div className="text-2xl font-bold">{gameState.players.find(p => p.id === gameState.lastWinnerId)?.name}</div>
                         <p className="text-xs text-neutral-400 mt-2 italic">{UI_STRINGS.WIN_POT}</p>
                       </div>
                       
                       <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl">
                         <div className="text-[10px] text-red-500 font-bold uppercase tracking-widest mb-1">Lacho de la Ronda</div>
                         <div className="text-2xl font-bold">{gameState.players.find(p => p.id === gameState.lastLoserId)?.name}</div>
                         <p className="text-xs text-neutral-400 mt-2 italic">{UI_STRINGS.LOSE_ROUND}</p>
                       </div>
                    </div>

                    <button 
                      onClick={() => setGameState(startNextRound(gameState))}
                      className="w-full py-5 bg-yellow-500 text-black font-bebas text-3xl rounded-2xl hover:bg-yellow-400 transition-transform active:scale-95 shadow-xl shadow-yellow-500/20"
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
          <div className="absolute bottom-0 left-0 right-0 bg-neutral-950/90 backdrop-blur-2xl border-t border-neutral-900 p-8 transform transition-transform duration-500 translate-y-0 z-30 shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-[10px] uppercase tracking-[0.4em] text-neutral-500 font-bold">Tu Mano</h3>
                  <div className="h-4 w-[1px] bg-neutral-800" />
                  <span className="text-[10px] text-neutral-600 font-mono">{currentPlayer?.hand.length} Cartas</span>
                </div>
                <div className="flex gap-4">
                   <button className="text-[10px] uppercase font-bold text-neutral-500 hover:text-white transition-colors flex items-center gap-2">
                     <span className="bg-neutral-800 p-1 rounded">🔄</span> Cambiar Mano (-1000)
                   </button>
                </div>
              </div>
              
              <div className="flex gap-4 overflow-x-auto pb-8 px-2 no-scrollbar mask-fade-edges">
                {currentPlayer?.hand.map((card, i) => (
                  <div key={card.id} className="animate-in slide-in-from-right-10 duration-500" style={{animationDelay: `${i * 50}ms`}}>
                    <GameCard 
                      card={card} 
                      selected={selectedCards.includes(card.id)}
                      onClick={() => toggleCardSelection(card.id)}
                      disabled={gameState.submissions.some(s => s.playerId === currentPlayerId)}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-2">
                <button 
                  disabled={selectedCards.length === 0 || gameState.submissions.some(s => s.playerId === currentPlayerId)}
                  onClick={handlePlayCard}
                  className={`
                    px-20 py-5 bg-yellow-500 text-black font-bebas text-4xl rounded-full transition-all 
                    ${selectedCards.length > 0 ? 'scale-110 shadow-2xl shadow-yellow-500/40' : 'opacity-30 grayscale cursor-not-allowed'}
                    active:scale-95
                  `}
                >
                  {gameState.submissions.some(s => s.playerId === currentPlayerId) ? 'CARTA JUGADA' : 'JUGAR CARTA'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tutorial Modal */}
        {showTutorial && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-800 p-10 rounded-[2.5rem] max-w-lg w-full shadow-2xl shadow-yellow-500/5 animate-in zoom-in duration-300">
              <div className="text-center mb-8">
                <h2 className="text-5xl font-bebas text-white mb-2 tracking-tight">CÓMO JUGAR</h2>
                <div className="h-1 w-20 bg-yellow-500 mx-auto rounded-full" />
              </div>
              
              <div className="space-y-8 mb-12">
                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-10 h-10 bg-neutral-800 rounded-2xl flex items-center justify-center font-bebas text-2xl text-yellow-500">1</div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-widest text-white mb-1">Reparto</h4>
                    <p className="text-neutral-400 text-sm leading-relaxed">Recibes 10 cartas negras y 5.000 LUCAS iniciales. El Dealer revela la carta blanca con una situación.</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-10 h-10 bg-neutral-800 rounded-2xl flex items-center justify-center font-bebas text-2xl text-yellow-500">2</div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-widest text-white mb-1">La Jugada</h4>
                    <p className="text-neutral-400 text-sm leading-relaxed">Elige tu mejor carta negra para completar la frase. ¡Sé creativo, cruel o simplemente ordinario!</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-10 h-10 bg-neutral-800 rounded-2xl flex items-center justify-center font-bebas text-2xl text-yellow-500">3</div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-widest text-white mb-1">El Veredicto</h4>
                    <p className="text-neutral-400 text-sm leading-relaxed">El Dealer elige la mejor (gana el pozo) y la peor (paga multa de 1 Luca al ganador). El rol de Dealer rota cada ronda.</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={closeTutorial}
                className="w-full py-5 bg-white text-black font-bebas text-3xl rounded-2xl hover:bg-yellow-400 transition-colors shadow-xl"
              >
                ¡VAMOS ALLÁ!
              </button>
            </div>
          </div>
        )}
      </main>
      <footer className="fixed bottom-4 right-4 text-neutral-600 text-[10px] uppercase tracking-widest z-[60] pointer-events-none opacity-40">
          Creado por: Christian Núñez V., 2026
      </footer>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .mask-fade-edges {
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
          50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); }
        }
        .animate-bounce-slow { animation: bounce-slow 3s infinite; }
      `}</style>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
