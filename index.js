// Require the necessary discord.js classes
const { Client, Intents, MessageEmbed } = require("discord.js");
const { SlashCommandBuilder, userMention } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientId, guildId, token } = require("./config.json");
const { Client: pgClient } = require("pg");
const fetch = require("node-fetch");
let testid = "923216142791766046";

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
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("getrole").setDescription("Get a Role")
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
  const { commandName, user, options, guild, member } = interaction;
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
    } else if (_subcommand === "getrole") {
      const role_id = "1004367039856656414";
      const data = async (data) => {
        //제일 처음 부분
        await pgclient
          .query(`select id from users where discord = '${data}'`)
          .then((res) => {
            if (res.rows.length == 0) {
              const exampleEmbed = new MessageEmbed()
                .setTitle("회원가입 하러 가기")
                .setDescription(`트레져스클럽 아이디가 없습니다.`)
                .setImage(
                  "https://storage.googleapis.com/daios/treasures/discord_banner.png"
                )
                .setURL(`https://treasuresclub.io/signup?user_id=${data}`);

              return interaction.reply({
                embeds: [exampleEmbed],
                ephemeral: true,
              });
            } else {
              const discordid = res.rows
                .map(({ id }) => id)
                .sort()
                .slice(0)[0];
              //db에 디스코드 아이디 출력하는 부분
              return discordid;
            }
          })
          .then((data) => {
            if (!data) return;
            return (
              //Db에 디스코드 아이디로 지갑 주소 가져오는 부분
              pgclient
                .query(`select address from ad where user_id = ${data}`)
                .then((res) => {
                  return res?.rows[0].address;
                })
                .then((data) => {
                  //madapp 에서 지갑주소로 nft 개수 가져오는 부분
                  fetch(`https://treasurelab-api.com/v1/wallet/info/${data}`)
                    .then((res) => res.json())
                    .then(async (data) => {
                      let mount = 0;
                      data.collections.map((data) => {
                        if (
                          data.address ==
                          "0x4007cb1fb9d1158add29cf5d88568dd44a1f516e"
                        ) {
                          mount += data.quantity;
                        }
                      });

                      //총 nft 개수 가져온 후 처리하는 부분
                      if (mount < 1) {
                        const exampleEmbed = new MessageEmbed()
                          .setTitle(`롤이 부여되지 않습니다. `)
                          // 헤드 사진 자리
                          .setDescription(`master nft 가 없습니다.`);
                        // 오른쪽 사진 자리
                        // 제일 큰 사진 자리 이동하는 곳의 로고 들어갈 듯

                        return interaction.reply({
                          embeds: [exampleEmbed],
                          ephemeral: true,
                        });
                      } else {
                        const role = member?._roles.filter(
                          (data) => data === role_id
                        );
                        if (role.length != 1) {
                          var testRole = guild.roles.cache.get(role_id);
                          member.roles.add(testRole);
                          const exampleEmbed = new MessageEmbed()
                            .setTitle(`Collector 롤이 부여되었습니다. `)
                            .setDescription(`지갑에 master nft 가 존재합니다.`);

                          return interaction.reply({
                            embeds: [exampleEmbed],
                            ephemeral: true,
                          });
                        }

                        const exampleEmbed = new MessageEmbed()
                          .setTitle(`Collector 인증 완료 `)
                          .setDescription(`이미 롤이 부여되었습니다.`);

                        return interaction.reply({
                          embeds: [exampleEmbed],
                          ephemeral: true,
                        });
                      }
                    });
                })
            );
          });
      };
      data(user.id);
    }
  }
});
// Login to Discord with your client's token
client.login(token);

console.log("run");
