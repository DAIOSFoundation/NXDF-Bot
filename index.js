// Require the necessary discord.js classes
const { Client, Intents, MessageEmbed } = require("discord.js");
const { SlashCommandBuilder, userMention } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientId, guildId, token } = require("./config.json");

const commands = [
  new SlashCommandBuilder()
    .setName("nxdf")
    .setDescription("Replies with boop!")
    .addSubcommand((subcommand) =>
      subcommand.setName("event").setDescription("go to event page")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("lotto").setDescription("go to lottery page")
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

  if (commandName === "nxdf") {
    if (_subcommand === "lotto") {
      const exampleEmbed = new MessageEmbed()
        .setTitle("NeXt-DeFi Lottery Event Page")
        // 헤드 사진 자리
        .setDescription(
          `NXDF is run by Decentralized Autonomous Organization.
			GNXD staking power always belongs to ownership of community.`
        )
        // 오른쪽 사진 자리
        // 제일 큰 사진 자리 이동하는 곳의 로고 들어갈 듯
        .setImage("https://storage.googleapis.com/daios/lotto_banner.png")
        .setURL(
          `https://nxdf-airdrop.web.app/events/lotto.html?user_id=${user.id}`
        );

      await interaction.reply({ embeds: [exampleEmbed], ephemeral: true });
    } else if (_subcommand === "event") {
      const exampleEmbed = new MessageEmbed()
        .setTitle("NeXt-DeFi airdrop event page")
        // 헤드 사진 자리
        .setDescription(
          `NXDF is run by Decentralized Autonomous Organization.
			GNXD staking power always belongs to ownership of community.`
        )
        // 오른쪽 사진 자리
        // 제일 큰 사진 자리 이동하는 곳의 로고 들어갈 듯
        .setImage("https://storage.googleapis.com/daios/nxdf_banner.png")
        .setURL(`https://nxdf-airdrop.web.app/?user_id=${user.id}`);

      await interaction.reply({ embeds: [exampleEmbed], ephemeral: true });
      await interaction.reply({ embeds: [exampleEmbed], ephemeral: true });
    }
  }
});

// Login to Discord with your client's token
client.login(token);

console.log("run");
