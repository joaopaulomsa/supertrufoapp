export type GameMode = 'bot' | 'local';

export type AttributeKey =
  | 'altura'
  | 'envergadura'
  | 'forca'
  | 'agilidade'
  | 'resistencia'
  | 'reflexo'
  | 'inteligencia';

export type Rarity = 'Comum' | 'Rara' | 'Épica' | 'Lendária';

export interface CardAttributes {
  altura: number;
  envergadura: number;
  forca: number;
  agilidade: number;
  resistencia: number;
  reflexo: number;
  inteligencia: number;
}

export interface Card {
  id: string;
  name: string;
  title: string;
  rarity: Rarity;
  color: string;
  symbol: string;
  attributes: CardAttributes;
}

export interface RoundResult {
  round: number;
  chosenAttribute: AttributeKey;
  playerCard: Card;
  opponentCard: Card;
  playerValue: number;
  opponentValue: number;
  winner: 'player' | 'opponent' | 'draw';
}

export interface GameState {
  mode: GameMode;
  playerName: string;
  opponentName: string;
  playerDeck: Card[];
  opponentDeck: Card[];
  playerDiscard: Card[];
  opponentDiscard: Card[];
  currentPlayerCard: Card | null;
  currentOpponentCard: Card | null;
  round: number;
  activeTurn: 'player' | 'opponent';
  lastResult: RoundResult | null;
  history: RoundResult[];
  status: 'menu' | 'playing' | 'round-result' | 'finished';
  winnerName: string | null;
}
