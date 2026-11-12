const express = require("express");

const app = express();
const PORT = 3000;

const cards = [
  { name: "Dragão de Cobalto", type: "Criatura", attack: 7, defense: 5 },
  { name: "Guardiã das Marés", type: "Criatura", attack: 4, defense: 8 },
  { name: "Rito de Ferro", type: "Feitiço", attack: 0, defense: 0 },
  { name: "Sentinela de Âmbar", type: "Criatura", attack: 6, defense: 6 },
  { name: "Eco do Vazio", type: "Feitiço", attack: 0, defense: 0 },
];


app.get("/api/cartas", (req, res) => {
  res.set("Access-Control-Allow-Origin", "http://localhost:5173");
  const { tipo } = req.query;

  if (tipo && tipo !== "Todas") {
    const filtradas = cards.filter((card) => card.type === tipo);
    return res.json(filtradas);
  }

  res.json(cards);
});


app.get("/api/cartas/aleatoria", (req, res) => {
  res.set("Access-Control-Allow-Origin", "http://localhost:5173");
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



app.use((req, res) => {
 
  res.set("Access-Control-Allow-Origin", "http://localhost:5173");


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