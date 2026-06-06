import { attributes } from '../game/gameEngine';
import type { RoundResult } from '../types';

interface HistoryProps {
  history: RoundResult[];
}

export function History({ history }: HistoryProps) {
  if (history.length === 0) {
    return (
      <aside className="history-panel">
        <h3>Histórico</h3>
        <p className="muted">As rodadas aparecerão aqui.</p>
      </aside>
    );
  }

  return (
    <aside className="history-panel">
      <h3>Histórico</h3>
      <div className="history-list">
        {history.map((item) => {
          const attribute = attributes.find((att) => att.key === item.chosenAttribute);
          const winnerLabel = item.winner === 'draw' ? 'Empate' : item.winner === 'player' ? 'Jogador 1' : 'Oponente';
          return (
            <div className="history-item" key={`${item.round}-${item.playerCard.id}-${item.opponentCard.id}`}>
              <strong>Rodada {item.round}</strong>
              <span>{attribute?.label}: {item.playerValue} x {item.opponentValue}</span>
              <small>{winnerLabel}</small>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
