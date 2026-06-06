import type { GameState } from '../types';

interface ScoreBoardProps {
  state: GameState;
}

export function ScoreBoard({ state }: ScoreBoardProps) {
  const playerTotal = state.playerDeck.length + state.playerDiscard.length + (state.currentPlayerCard ? 1 : 0);
  const opponentTotal = state.opponentDeck.length + state.opponentDiscard.length + (state.currentOpponentCard ? 1 : 0);

  return (
    <section className="score-board">
      <div>
        <span>{state.playerName}</span>
        <strong>{playerTotal}</strong>
        <small>cartas</small>
      </div>
      <div className="round-pill">Rodada {state.round}</div>
      <div>
        <span>{state.opponentName}</span>
        <strong>{opponentTotal}</strong>
        <small>cartas</small>
      </div>
    </section>
  );
}
