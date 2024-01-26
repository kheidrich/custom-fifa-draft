const crypto = require("crypto");
const readline = require("readline");
const participants = [
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
    const order = drawSelectionOrder(participants);
    await chooseRound({ order, round: choose });
  }

  console.table(
    formatToTable(participants)
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

async function chooseRound({ order, round }) {
  console.log(`Escolha #${round}: ${order.map((participant) => participant.name).join(",")}`);
  for (let participant of order) {
    participant.chosen.push(await prompt(`${participant.name}: `));
  }
}

function formatToTable(players) {
  return players.reduce((acc, p) => {
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
      rl.close()
    });
  });
}
