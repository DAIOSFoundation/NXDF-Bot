// Require the necessary discord.js classes
const { Client, Intents, MessageEmbed } = require("discord.js");
const { SlashCommandBuilder, userMention } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientId, guildId, token } = require("./config.json");
const { Client: pgClient } = require("pg");

const dbconfig = {
  host: "34.64.164.109",
  user: "postgres",
  password: "hellowoong",
  database: "woong",
  port: "5432",
  ssl: {
    rejectUnauthorized: false,
  },
};

const pgclient = new pgClient(dbconfig);

pgclient.connect((err) => {
  if (err) {
    console.log("Failed to connect db " + err);
  } else {
    console.log("Connect to db done!");
  }
});

const commands = [
  new SlashCommandBuilder()
    .setName("treasures")
    .setDescription("Go to Page")
    .addSubcommand((subcommand) =>
      subcommand.setName("signup").setDescription("Go to SignUp Page")
    ),
].map((command) => command.toJSON());

const rest = new REST({ version: "9" }).setToken(token);

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);

// Create a new client instance
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Ready!");
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, user, options } = interaction;
  const { _subcommand, _hoistedOptions } = options;

  if (commandName === "treasures") {
    if (_subcommand === "signup") {
      const exampleEmbed = new MessageEmbed()
        .setTitle("Treasures Club Sign Up")
        // 헤드 사진 자리
        .setDescription(`트레져스 클럽 회원 가입 페이지 이동`)
        // 오른쪽 사진 자리
        // 제일 큰 사진 자리 이동하는 곳의 로고 들어갈 듯
        .setImage(
          "https://storage.googleapis.com/daios/treasures/discord_banner.png"
        )
        .setURL(`https://treasuresclub.io/signup?user_id=${user.id}`);

      await interaction.reply({ embeds: [exampleEmbed], ephemeral: true });
    }
  }
});

// Login to Discord with your client's token
client.login(token);

console.log("run");
