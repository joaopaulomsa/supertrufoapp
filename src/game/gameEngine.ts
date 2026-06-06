import { cards } from '../data/cards';
import type { AttributeKey, Card, GameMode, GameState, RoundResult } from '../types';

export const attributes: { key: AttributeKey; label: string; suffix?: string }[] = [
  { key: 'altura', label: 'Altura', suffix: 'cm' },
  { key: 'envergadura', label: 'Envergadura', suffix: 'cm' },
  { key: 'forca', label: 'Força' },
  { key: 'agilidade', label: 'Agilidade' },
  { key: 'resistencia', label: 'Resistência' },
  { key: 'reflexo', label: 'Reflexo' },
  { key: 'inteligencia', label: 'Inteligência' }
];

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function createGame(mode: GameMode): GameState {
  const deck = shuffle(cards);
  const half = Math.ceil(deck.length / 2);
  const playerDeck = deck.slice(0, half);
  const opponentDeck = deck.slice(half);

  return {
    mode,
    playerName: 'Jogador 1',
    opponentName: mode === 'bot' ? 'IA Trufo' : 'Jogador 2',
    playerDeck,
    opponentDeck,
    playerDiscard: [],
    opponentDiscard: [],
    currentPlayerCard: playerDeck[0] ?? null,
    currentOpponentCard: opponentDeck[0] ?? null,
    round: 1,
    activeTurn: 'player',
    lastResult: null,
    history: [],
    status: 'playing',
    winnerName: null
  };
}

export function chooseBotAttribute(card: Card): AttributeKey {
  const ranked = attributes
    .map((attribute) => ({ key: attribute.key, value: card.attributes[attribute.key] }))
    .sort((a, b) => b.value - a.value);
  return ranked[0].key;
}

export function playRound(state: GameState, chosenAttribute: AttributeKey): GameState {
  const playerCard = state.currentPlayerCard;
  const opponentCard = state.currentOpponentCard;

  if (!playerCard || !opponentCard) {
    return finishIfNeeded(state);
  }

  const playerValue = playerCard.attributes[chosenAttribute];
  const opponentValue = opponentCard.attributes[chosenAttribute];
  const winner: RoundResult['winner'] =
    playerValue > opponentValue ? 'player' : opponentValue > playerValue ? 'opponent' : 'draw';

  const nextPlayerDeck = state.playerDeck.slice(1);
  const nextOpponentDeck = state.opponentDeck.slice(1);
  let nextPlayerDiscard = [...state.playerDiscard];
  let nextOpponentDiscard = [...state.opponentDiscard];

  if (winner === 'player') {
    nextPlayerDiscard = [...nextPlayerDiscard, playerCard, opponentCard];
  } else if (winner === 'opponent') {
    nextOpponentDiscard = [...nextOpponentDiscard, opponentCard, playerCard];
  } else {
    nextPlayerDiscard = [...nextPlayerDiscard, playerCard];
    nextOpponentDiscard = [...nextOpponentDiscard, opponentCard];
  }

  const result: RoundResult = {
    round: state.round,
    chosenAttribute,
    playerCard,
    opponentCard,
    playerValue,
    opponentValue,
    winner
  };

  return finishIfNeeded({
    ...state,
    playerDeck: recycleIfNeeded(nextPlayerDeck, nextPlayerDiscard).deck,
    playerDiscard: recycleIfNeeded(nextPlayerDeck, nextPlayerDiscard).discard,
    opponentDeck: recycleIfNeeded(nextOpponentDeck, nextOpponentDiscard).deck,
    opponentDiscard: recycleIfNeeded(nextOpponentDeck, nextOpponentDiscard).discard,
    currentPlayerCard: null,
    currentOpponentCard: null,
    activeTurn: winner === 'opponent' ? 'opponent' : 'player',
    lastResult: result,
    history: [result, ...state.history].slice(0, 12),
    status: 'round-result'
  });
}

function recycleIfNeeded(deck: Card[], discard: Card[]): { deck: Card[]; discard: Card[] } {
  if (deck.length > 0 || discard.length === 0) {
    return { deck, discard };
  }
  return { deck: shuffle(discard), discard: [] };
}

export function nextRound(state: GameState): GameState {
  const checked = finishIfNeeded(state);
  if (checked.status === 'finished') return checked;

  const nextState = {
    ...checked,
    round: checked.round + 1,
    currentPlayerCard: checked.playerDeck[0] ?? null,
    currentOpponentCard: checked.opponentDeck[0] ?? null,
    lastResult: null,
    status: 'playing' as const
  };

  return finishIfNeeded(nextState);
}

export function totalCards(state: GameState, side: 'player' | 'opponent'): number {
  return side === 'player'
    ? state.playerDeck.length + state.playerDiscard.length + (state.currentPlayerCard ? 0 : 0)
    : state.opponentDeck.length + state.opponentDiscard.length + (state.currentOpponentCard ? 0 : 0);
}

function finishIfNeeded(state: GameState): GameState {
  const playerCount = state.playerDeck.length + state.playerDiscard.length + (state.currentPlayerCard ? 1 : 0);
  const opponentCount = state.opponentDeck.length + state.opponentDiscard.length + (state.currentOpponentCard ? 1 : 0);

  if (playerCount === 0) {
    return { ...state, status: 'finished', winnerName: state.opponentName };
  }

  if (opponentCount === 0) {
    return { ...state, status: 'finished', winnerName: state.playerName };
  }

  return state;
}
