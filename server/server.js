const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
const PORT = 3000;

const CARTAS_FILE = "./cartas.json";
const cards = JSON.parse(fs.readFileSync(CARTAS_FILE, "utf-8"));


app.get("/api/cartas", (req, res) => {
  const { tipo } = req.query;

  if (tipo && tipo !== "Todas") {
    const filtradas = cards.filter((card) => card.type === tipo);
    return res.json(filtradas);
  }

  res.json(cards);
});


app.get("/api/cartas/aleatoria", (req, res) => {
  const randomIndex = Math.floor(Math.random() * cards.length);
  res.json(cards[randomIndex]);
});


function page(title, body) {
  return `<!DOCTYPE html>
<html lang="pt">
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
  </head>
  <body>
    <nav>
      <a href="/">Início</a> ·
      <a href="/cartas">Cartas</a> ·
      <a href="/sobre">Sobre</a> ·
      <a href="/agora">Agora</a>
    </nav>
    <h1>${title}</h1>
    ${body}
  </body>
</html>`;
}

app.get("/", (req, res) => {
  res.send(
    page(
      "A minha coleção",
      `<p>Neste momento tenho <b>${cards.length}</b> cartas na coleção.</p>`
    )
  );
});

app.get("/sobre", (req, res) => {
  res.send(
    page(
      "Sobre",
      `<p>Feito por <b>&lt;Diogo Rodrigues&gt;</b>, turma &lt;TGPSI-T&gt;.</p>`
    )
  );
});

app.get("/cartas", (req, res) => {
  const items = cards
    .map(
      (card) =>
        `<li><b>${card.name}</b> — ${card.type}, ataque ${card.attack}</li>`
    )
    .join("");

  res.send(page("Cartas", `<ul>${items}</ul>`));
});

app.get("/cartas/aleatoria", (req, res) => {
  const card = cards[Math.floor(Math.random() * cards.length)];

  res.send(
    page(
      "Carta à sorte",
      `<h2>${card.name}</h2>
       <p>${card.type} · ataque ${card.attack} · defesa ${card.defense}</p>`
    )
  );
});

app.get("/agora", (req, res) => {
  const now = new Date().toLocaleString("pt-PT", {
    dateStyle: "long",
    timeStyle: "medium",
  });

  res.send(page("Agora", `<p>Este pedido foi respondido às <b>${now}</b>.</p>`));
});



app.post("/api/cartas", (req, res) => {
  const card = req.body;

  if (!card.name || !card.type) {
    return res.status(400).json({ error: "Nome e tipo são obrigatórios" });
  }

  card.id = Date.now();
  cards.push(card);
  fs.writeFileSync(CARTAS_FILE, JSON.stringify(cards, null, 2));
  res.status(201).json(card);
});

app.delete("/api/cartas/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = cards.findIndex((c) => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Carta não encontrada" });
  }

  cards.splice(index, 1);
  fs.writeFileSync(CARTAS_FILE, JSON.stringify(cards, null, 2));
  res.status(204).end();
});


app.use((req, res) => {

  if (req.url.startsWith("/api/")) {
    return res.status(404).send("HTTP 404 - Rota não encontrada");
  }

  
  res.status(404).send(
    page(
      "404 — não encontrado",
      `<p>Não existe nada em <code>${req.url}</code>.</p>
       <p><a href="/">Voltar ao início</a></p>`
    )
  );
});

app.listen(PORT, () => {
  console.log(`Server a correr em http://localhost:${PORT}`);
});