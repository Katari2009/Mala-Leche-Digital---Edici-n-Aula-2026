
import React from 'react';
import { Card, CardType } from '../types';

interface GameCardProps {
  card: Card;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  isFlipped?: boolean;
}

export const GameCard: React.FC<GameCardProps> = ({ card, selected, onClick, disabled, isFlipped = true }) => {
  const isWhite = card.type === CardType.WHITE;
  
  return (
    <div 
      onClick={!disabled ? onClick : undefined}
      className={`
        relative w-40 h-56 rounded-xl p-4 cursor-pointer transition-all duration-300 transform
        ${isWhite ? 'bg-white text-black shadow-lg' : 'bg-neutral-900 text-white border border-neutral-700'}
        ${selected ? 'ring-4 ring-yellow-400 -translate-y-4 scale-105 z-10' : 'hover:-translate-y-2'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        flex flex-col justify-between overflow-hidden
      `}
    >
      {!isFlipped ? (
        <div className="w-full h-full flex items-center justify-center bg-neutral-800 rounded-lg">
          <span className="font-bebas text-4xl text-neutral-600">ML</span>
        </div>
      ) : (
        <>
          <p className="text-sm font-bold leading-snug">{card.text}</p>
          <div className="flex justify-between items-end">
            <span className="font-bebas text-xl opacity-30">Mala Leche</span>
            <div className={`w-3 h-3 rounded-full ${isWhite ? 'bg-black' : 'bg-white'}`} />
          </div>
        </>
      )}
    </div>
  );
};
