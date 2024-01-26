const crypto = require("crypto");
const readline = require("readline");
const players = [
  { name: "Kevin", chosen: [] },
  { name: "Maico", chosen: [] },
  { name: "Rafael", chosen: [] },
];
const teams = [
  "PSG",
  // "BARÇA",
  // "REAL",
  // "ATLÉTICO",
  // "LIVERPOOL",
  // "CHELSEA",
  // "UNITED",
  // "CITY",
  // "TOTTENHAN",
  // "ARSENAL",
  // "NEWCASTLE",
  // "BAYERN",
  // "BORUSSIA",
  // "RB LEIPZIG",
  // "MILAN",
  // "INTER MILÃO",
  // "NAPOLI",
  // "PORTO",
  // "BENFICA",
  // "RESTO DO MUNDO"
];

(async () => {
  console.log(`Total de escolhas: ${teams.length}`);
  printNewLine();
  for (let choose = 1; choose <= teams.length; choose++) {
    const order = drawSelectionOrder(players);
    console.log(`Escolha #${choose}: ${order.map((p) => p.name).join(",")}`);
    for (let player of order) {
      player.chosen.push(await prompt(`${player.name}: `));
    }
  }

  console.table(
    players.reduce((acc, p) => {
      if (acc.length === 0)
        for (let chosen of p.chosen)
          acc.push({
            [p.name]: chosen,
          });
      else 
        for(let i = 0; i < acc.length; i++) {
          acc[i][p.name] = p.chosen[i];
        }
      return acc;
    }, [])
  );
})();

function drawSelectionOrder(players) {
  return players
    .map((p) => {
      p.order = crypto.randomInt(1, 1000);

      return p;
    })
    .sort((p1, p2) => p1.order - p2.order);
}

function printNewLine() {
  console.log("");
}

function prompt(message) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(message, (answer) => {
      resolve(answer);
      rl.close();
    });
  });
}
