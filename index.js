// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [
	new SlashCommandBuilder()
	.setName('nxdf').setDescription('Replies with boop!')
	.addSubcommand(subcommand =>
		subcommand
			.setName('event')
			.setDescription('Info about a user')
	)]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);



// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES ] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});


client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
  })

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName, user , options } = interaction;
	const { _subcommand, _hoistedOptions} = options;



	 if (commandName === 'nxdf') {

		 if(_subcommand === 'event'){
			
				await interaction.reply(`https://nxdf-airdrop.web.app/user_id=${user.id}`);
		}
		
	}
});


// Login to Discord with your client's token
client.login(token);

console.log("run");