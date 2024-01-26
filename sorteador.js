const crypto = require("crypto");
const readline = require("readline");
const fs = require("fs");
const path = require("path");

const participants = [
  { name: "Kevin", chosen: [] },
  { name: "Maico", chosen: [] },
  { name: "Rafael", chosen: [] },
];
const playersList = loadPlayersList();

(async () => {
  let totalChooses;

  totalChooses = await prompt(`Total de escolhas: `);
  console.log('--------------------------------');
  for (let choose = 1; choose <= totalChooses; choose++) {
    const order = drawSelectionOrder(participants);
    await chooseRound({ order, round: choose });
    console.table(formatToTable(participants));
  }

})();

function loadPlayersList() {
  const inputFile = path.join(__dirname, "FIFA23_official_data.csv");
  const csvContent = fs.readFileSync(inputFile, "utf-8").trim();
  const csvLines = csvContent.split("\n");
  const headers = csvLines.shift().trim().split(",");
  const jsonArray = csvLines.map((line) => {
    const values = line.split(",");
    const lineAsObj = {};
    for (let index = 0; index < headers.length; index++)
      lineAsObj[headers[index]] = values[index];

    return lineAsObj;
  });
  const removeAccent = (string) =>
    string
      .replace(/á|à|ã/gi, "a")
      .replace(/é/gi, "e")
      .replace(/í|ì/gi, "i")
      .replace(/ó|õ/gi, "o")
      .replace(/ú/gi, "u")
      .replace(/ñ/gi, "n")
      .replace(/ç/gi, "c");
  const normalized = jsonArray.map((item) => {
    item.Name = removeAccent(item.Name);
    return item;
  });

  return normalized;
}

function drawSelectionOrder(players) {
  return players
    .map((p) => {
      p.order = crypto.randomInt(1, 1000);

      return p;
    })
    .sort((p1, p2) => p1.order - p2.order);
}

async function chooseRound({ order, round }) {
  // prettier-ignore
  console.log(`Escolha #${round}: ${order.map((participant) => participant.name).join(",")}`);
  printNewLine();
  for (let participant of order) {
    participant.chosen.push(await choosePlayer(participant));
    printNewLine();
  }
}

async function choosePlayer(participant) {
  const getPlayerText = (player) => {
    const [, position] = player.Position.split(">");
    const name = player.Name;
    const club = player.Club;

    return `${position.replace('"', "")} - ${name} - ${club}`;
  };

  while (true) {
    const search = await prompt(`${participant.name}: `);
    const playersFound = searchPlayers(search);

    if (playersFound.length === 0) {
      console.log("Nenhum jogador encontrado, escolha novamente");
      continue;
    }

    if (playersFound.length > 1) {
      console.log("Encontrado mais de um jogador. Detalhe mais o nome.");
      for (const player of playersFound) console.log(getPlayerText(player));
      continue;
    }

    const chosenPlayer = getPlayerText(playersFound[0]);
    console.log(chosenPlayer);

    return chosenPlayer;
  }
}

function searchPlayers(search) {
  return playersList.filter((player) =>
    new RegExp(`${search}`, "i").test(player.Name)
  );
}

function formatToTable(players) {
  return players.reduce((acc, p) => {
    if (acc.length === 0)
      for (let chosen of p.chosen)
        acc.push({
          [p.name]: chosen,
        });
    else
      for (let i = 0; i < acc.length; i++) {
        acc[i][p.name] = p.chosen[i];
      }
    return acc;
  }, []);
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
