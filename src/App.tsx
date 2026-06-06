import { useMemo, useState } from 'react';
import { Bot, RotateCcw, Swords, Users } from 'lucide-react';
import { CardView } from './components/CardView';
import { History } from './components/History';
import { ScoreBoard } from './components/ScoreBoard';
import { attributes, chooseBotAttribute, createGame, nextRound, playRound } from './game/gameEngine';
import type { AttributeKey, GameMode, GameState } from './types';

export default function App() {
  const [game, setGame] = useState<GameState | null>(null);

  const selectedAttribute = game?.lastResult?.chosenAttribute ?? null;

  const resultText = useMemo(() => {
    if (!game?.lastResult) return '';
    if (game.lastResult.winner === 'draw') return 'Empate técnico. Cada lado mantém uma carta.';
    const winner = game.lastResult.winner === 'player' ? game.playerName : game.opponentName;
    return `${winner} venceu a rodada.`;
  }, [game]);

  function start(mode: GameMode) {
    setGame(createGame(mode));
  }

  function selectAttribute(attribute: AttributeKey) {
    if (!game || game.status !== 'playing') return;
    setGame(playRound(game, attribute));
  }

  function botPlay() {
    if (!game?.currentOpponentCard) return;
    const attribute = chooseBotAttribute(game.currentOpponentCard);
    setGame(playRound(game, attribute));
  }

  function continueGame() {
    if (!game) return;
    setGame(nextRound(game));
  }

  if (!game || game.status === 'menu') {
    return (
      <main className="app-shell landing">
        <section className="hero-card">
          <span className="eyebrow">MVP GitHub Pages</span>
          <h1>Super Trufo App</h1>
          <p>
            Um Super Trunfo simples, com cartas de personagens fantásticos, atributos corporais e habilidades.
            Esta versão roda inteira no navegador.
          </p>
          <div className="mode-grid">
            <button className="mode-card" onClick={() => start('bot')}>
              <Bot />
              <strong>Jogar contra IA</strong>
              <span>Rápido, direto e sem depender de servidor.</span>
            </button>
            <button className="mode-card" onClick={() => start('local')}>
              <Users />
              <strong>2 jogadores local</strong>
              <span>Dois jogadores usando o mesmo navegador.</span>
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (game.status === 'finished') {
    return (
      <main className="app-shell landing">
        <section className="hero-card finish-card">
          <span className="eyebrow">Fim de partida</span>
          <h1>{game.winnerName} venceu</h1>
          <p>A mesa foi limpa. O baralho não teve chance.</p>
          <button className="primary-button" onClick={() => setGame(null)}>
            <RotateCcw size={18} /> Nova partida
          </button>
        </section>
      </main>
    );
  }

  const isBotTurn = game.mode === 'bot' && game.activeTurn === 'opponent' && game.status === 'playing';
  const activeCard = game.activeTurn === 'player' ? game.currentPlayerCard : game.currentOpponentCard;

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <span className="eyebrow">Super Trufo</span>
          <h1>Humanos Fantásticos</h1>
        </div>
        <button className="ghost-button" onClick={() => setGame(null)}>
          <RotateCcw size={16} /> Reiniciar
        </button>
      </header>

      <ScoreBoard state={game} />

      {game.status === 'round-result' && game.lastResult ? (
        <section className="result-banner">
          <Swords size={22} />
          <div>
            <strong>{resultText}</strong>
            <span>
              Atributo: {attributes.find((att) => att.key === game.lastResult?.chosenAttribute)?.label} —{' '}
              {game.lastResult.playerValue} x {game.lastResult.opponentValue}
            </span>
          </div>
          <button className="primary-button" onClick={continueGame}>Próxima rodada</button>
        </section>
      ) : (
        <section className="turn-panel">
          <strong>Vez de {game.activeTurn === 'player' ? game.playerName : game.opponentName}</strong>
          <span>Escolha o atributo da carta ativa para comparar.</span>
        </section>
      )}

      <section className="game-layout">
        <div className="table-area">
          <div className="player-zone">
            <h2>{game.playerName}</h2>
            <CardView card={game.currentPlayerCard} selectedAttribute={selectedAttribute} />
          </div>

          <div className="versus">VS</div>

          <div className="player-zone">
            <h2>{game.opponentName}</h2>
            <CardView
              card={game.currentOpponentCard}
              hidden={game.status === 'playing' && game.activeTurn === 'player'}
              selectedAttribute={selectedAttribute}
            />
          </div>
        </div>

        <aside className="action-panel">
          <h3>Atributos</h3>
          {isBotTurn ? (
            <button className="primary-button full" onClick={botPlay}>
              IA escolher atributo
            </button>
          ) : (
            <div className="attribute-buttons">
              {attributes.map((attribute) => (
                <button
                  key={attribute.key}
                  disabled={game.status !== 'playing'}
                  onClick={() => selectAttribute(attribute.key)}
                >
                  <span>{attribute.label}</span>
                  <strong>
                    {activeCard?.attributes[attribute.key]}
                    {attribute.suffix ? ` ${attribute.suffix}` : ''}
                  </strong>
                </button>
              ))}
            </div>
          )}
          <History history={game.history} />
        </aside>
      </section>
    </main>
  );
}
