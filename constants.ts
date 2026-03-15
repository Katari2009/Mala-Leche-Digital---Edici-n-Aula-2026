
import { Card, CardType, GameMode } from './types';

export const INITIAL_LUCAS = 5000;
export const INITIAL_HAND_SIZE = 10;
export const SWAP_HAND_COST = 1000;
export const EXTRA_CARD_COST = 500;

export const UI_STRINGS = {
  WIN_POT: "¡Ganaste el pozo, sacaste los pasos prohibidos! 🔥",
  LOSE_ROUND: "Te quedaste sin lucas, eres el lacho de la ronda... 💀",
  DEALER_TURN: "Eres el Dealer. Elige la mejor y la peor combinación. No te pongai barsa.",
  WAITING_PLAYERS: "Esperando que los giles jueguen sus cartas...",
  REVEAL_TIME: "Momento de la verdad. ¡Revela esa ordinariez!",
  AULA_MODE_MSG: "Modo Aula Activo: Enfocados en Pensamiento Crítico y Colaboración. 🎓",
};

export const EDUCATIONAL_DECK: Card[] = [
  // White Cards (Situations/Questions)
  { id: 'w1', type: CardType.WHITE, text: "Para fomentar el Pensamiento Crítico en el aula, el docente propone ______." },
  { id: 'w2', type: CardType.WHITE, text: "El mayor desafío de la Gamificación en entornos vulnerables es ______." },
  { id: 'w3', type: CardType.WHITE, text: "Según las Habilidades del Siglo XXI, un estudiante exitoso debe dominar ______." },
  { id: 'w4', type: CardType.WHITE, text: "La evaluación formativa falló rotundamente cuando el alumno respondió con ______." },
  { id: 'w5', type: CardType.WHITE, text: "En el consejo de profesores, la directora sugirió solucionar el conflicto con ______." },
  { id: 'w6', type: CardType.WHITE, text: "La IA generativa reemplazará al profesor cuando logre simular ______." },
  { id: 'w7', type: CardType.WHITE, text: "El Aprendizaje Basado en Proyectos (ABP) terminó en desastre por culpa de ______." },
  { id: 'w8', type: CardType.WHITE, text: "¿Qué falta en el currículum nacional? Obviamente ______." },
  { id: 'w9', type: CardType.WHITE, text: "Para motivar a la Generación Z, necesitamos integrar ______ en la planificación." },
  { id: 'w10', type: CardType.WHITE, text: "La neurociencia aplicada a la educación dice que el cerebro aprende mejor con ______." },
  
  // Black Cards (Responses)
  { id: 'b1', type: CardType.BLACK, text: "Un meme de Gatito Educador." },
  { id: 'b2', type: CardType.BLACK, text: "Hacer un TikTok sobre la Revolución Francesa." },
  { id: 'b3', type: CardType.BLACK, text: "Cinco minutos de meditación budista antes de la prueba." },
  { id: 'b4', type: CardType.BLACK, text: "Pedirle a ChatGPT que haga la planificación." },
  { id: 'b5', type: CardType.BLACK, text: "Fomentar la resiliencia mediante el sufrimiento." },
  { id: 'b6', type: CardType.BLACK, text: "El uso excesivo de Kahoot!." },
  { id: 'b7', type: CardType.BLACK, text: "Una rúbrica escrita en servilletas." },
  { id: 'b8', type: CardType.BLACK, text: "Trabajo colaborativo que termina en pelea." },
  { id: 'b9', type: CardType.BLACK, text: "Alfabetización digital extrema." },
  { id: 'b10', type: CardType.BLACK, text: "Educación emocional con gritos." },
  { id: 'b11', type: CardType.BLACK, text: "Pensamiento lateral, muy lateral." },
  { id: 'b12', type: CardType.BLACK, text: "Gamificar hasta el recreo." },
  { id: 'b13', type: CardType.BLACK, text: "Un seminario aburridísimo por Zoom." },
  { id: 'b14', type: CardType.BLACK, text: "Aprendizaje invisible, literal, no se ve nada." },
  { id: 'b15', type: CardType.BLACK, text: "Metacognición nivel Dios." },
  { id: 'b16', type: CardType.BLACK, text: "Un PowerPoint con demasiadas transiciones." },
  { id: 'b17', type: CardType.BLACK, text: "El enfoque STEM pero sin la M." },
  { id: 'b18', type: CardType.BLACK, text: "Competencias del siglo XXII (adelantado)." },
  { id: 'b19', type: CardType.BLACK, text: "Autoaprendizaje por osmosis." },
  { id: 'b20', type: CardType.BLACK, text: "Design Thinking para arreglar el baño del colegio." },
];

export const NORMAL_DECK_WHITE: Card[] = [
  { id: 'nw1', type: CardType.WHITE, text: "Chile es el mejor país de Chile porque tenemos ______." },
  { id: 'nw2', type: CardType.WHITE, text: "Mi tía dice que el secreto para un buen asado es ______." },
  { id: 'nw3', type: CardType.WHITE, text: "Se filtró que el próximo reality de la tele trata sobre ______." },
  { id: 'nw4', type: CardType.WHITE, text: "Me echaron de la pega por andar ______ en el baño." },
  { id: 'nw5', type: CardType.WHITE, text: "Lo más cuma que he hecho en mi vida es ______." },
];

export const NORMAL_DECK_BLACK: Card[] = [
  { id: 'nb1', type: CardType.BLACK, text: "Un completo italiano con mucha palta." },
  { id: 'nb2', type: CardType.BLACK, text: "Bailar la cueca zapateando como loco." },
  { id: 'nb3', type: CardType.BLACK, text: "Comprar pan calientito con 2 lucas." },
  { id: 'nb4', type: CardType.BLACK, text: "El Fantasma del Descenso." },
  { id: 'nb5', type: CardType.BLACK, text: "Un terremoto pero con helado de piña vencido." },
];
