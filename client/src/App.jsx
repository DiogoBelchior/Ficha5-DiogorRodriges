import { useState, useEffect } from "react";
import Card from "./Card.jsx";

function App() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("Todas");
  const [search, setSearch] = useState("");
  const [randomCard, setRandomCard] = useState(null);
  const [sorted, setSorted] = useState(false);

  const emptyForm = { name: "", type: "Criatura", attack: "" };
  const [form, setForm] = useState(emptyForm);

  function handleFormChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newCard = {
      name: form.name,
      type: form.type,
      attack: Number(form.attack),
      defense: 0,
    };

    fetch("http://localhost:3000/api/cartas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCard),
    })
      .then((res) => res.json())
      .then((card) => {
        setCards([...cards, card]);
        setForm(emptyForm);
      });
  }

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch("http://localhost:3000/api/cartas")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setCards(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  let visible = cards
    .filter((card) => filter === "Todas" || card.type === filter)
    .filter((card) => card.name.toLowerCase().includes(search.toLowerCase()));

  if (sorted) {
    visible = [...visible].sort((a, b) => b.attack - a.attack);
  }

  function pickRandom() {
    if (cards.length > 0) {
      setRandomCard(cards[Math.floor(Math.random() * cards.length)]);
    }
  }

  return (
    <main>
      <h1>A minha coleção</h1>

      {loading && <p>A carregar…</p>}

      {error && !loading && (
        <p style={{ color: "red" }}>Ocorreu um erro: {error}</p>
      )}

      {!loading && !error && (
        <>
          <p>
            Tenho {cards.length} cartas · a mostrar {visible.length}
          </p>

          <div>
            <button onClick={() => setFilter("Todas")}>Todas</button>
            <button onClick={() => setFilter("Criatura")}>Só criaturas</button>
            <button onClick={() => setFilter("Feitiço")}>Só feitiços</button>
            <button onClick={() => setSorted(!sorted)}>
              {sorted ? "Ordem original" : "Ordenar por ataque"}
            </button>
          </div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Procurar pelo nome…"
          />

          <h2>Adicionar carta</h2>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              value={form.name}
              onChange={handleFormChange}
              placeholder="Nome"
              required
            />
            <select name="type" value={form.type} onChange={handleFormChange}>
              <option value="Criatura">Criatura</option>
              <option value="Feitiço">Feitiço</option>
            </select>
            <input
              name="attack"
              type="number"
              min="0"
              value={form.attack}
              onChange={handleFormChange}
              placeholder="Ataque"
              required
            />
            <button type="submit">Adicionar</button>
          </form>

          {visible.length === 0 ? (
            <p>Nenhuma carta corresponde.</p>
          ) : (
            <ul>
              {visible.map((card) => (
                <Card key={card.name} {...card} />
              ))}
            </ul>
          )}

          <h2>Carta à sorte</h2>
          <button onClick={pickRandom}>Escolher outra</button>
          {randomCard && (
            <p>
              <b>{randomCard.name}</b> — {randomCard.type} · ataque {randomCard.attack} ·
              defesa {randomCard.defense}
            </p>
          )}
        </>
      )}
    </main>
  );
}

export default App;