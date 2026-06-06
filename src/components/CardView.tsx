import type { AttributeKey, Card } from '../types';
import { attributes } from '../game/gameEngine';

interface CardViewProps {
  card: Card | null;
  hidden?: boolean;
  selectedAttribute?: AttributeKey | null;
}

export function CardView({ card, hidden = false, selectedAttribute = null }: CardViewProps) {
  if (!card) {
    return <div className="card empty-card">Sem carta</div>;
  }

  if (hidden) {
    return (
      <div className="card card-back">
        <div className="card-back-symbol">ST</div>
        <strong>Super Trufo</strong>
        <span>Carta oculta</span>
      </div>
    );
  }

  return (
    <article className="card" style={{ ['--card-color' as string]: card.color }}>
      <div className="card-header">
        <div>
          <span className="rarity">{card.rarity}</span>
          <h2>{card.name}</h2>
          <p>{card.title}</p>
        </div>
        <div className="avatar" aria-hidden="true">
          <span>{card.symbol}</span>
        </div>
      </div>

      <div className="character-art">
        <div className="head" />
        <div className="body" />
        <div className="arm left" />
        <div className="arm right" />
        <div className="leg left" />
        <div className="leg right" />
      </div>

      <div className="attributes-list">
        {attributes.map((attribute) => (
          <div
            className={`attribute-row ${selectedAttribute === attribute.key ? 'selected' : ''}`}
            key={attribute.key}
          >
            <span>{attribute.label}</span>
            <strong>
              {card.attributes[attribute.key]}
              {attribute.suffix ? ` ${attribute.suffix}` : ''}
            </strong>
          </div>
        ))}
      </div>
    </article>
  );
}
