import { Client, Collection } from "discord.js";
import { Event } from "./Event";
import Config from "./Config";
import { glob } from "glob";
import { promisify } from "util";
import { config } from "dotenv";
import { connect } from "mongoose";
import { SlashCommand } from "./SlashCommand";
config();
const { TOKEN, DB } = process.env;
const globPromise = promisify(glob);

class ExtendedClient extends Client {
	constructor() {
		super({
			intents: [
				"GUILDS",
				"GUILD_BANS",
				"GUILD_EMOJIS_AND_STICKERS",
				"GUILD_INTEGRATIONS",
				"GUILD_INVITES",
				"GUILD_MEMBERS",
				"GUILD_MESSAGES",
				"GUILD_MESSAGE_REACTIONS",
				"GUILD_MESSAGE_TYPING",
				"GUILD_VOICE_STATES",
				"GUILD_PRESENCES",
				"GUILD_WEBHOOKS",
			],
			partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"],
		});
	}
	public slashCommands: Collection<string, SlashCommand> = new Collection();
	public config: Config = {
		OWNERS: [""],
		PREFIX: "::",
	};

	public async init() {
		this.login(TOKEN);
		// connect(DB)
		//    .then(() => {
		//       console.log(`Connected to database`);
		//    })
		//    .catch((err) => {
		//       console.log(`Failed to connect to database`);
		//       console.log(err);
		//    });

		// Slash Commands
		const slashCommandFiles = await globPromise(
			`${process.cwd()}/src/commands/**/*.ts`
		);
		const arrayOfSlashCommands = [];
		slashCommandFiles.map((value) => {
         const file = require(value);
			if (!file.command?.name) return;
         const run = file.run;
         const propertiesObject = { ...file.command  };
         const properties = Object.assign(propertiesObject, { run: run });
			this.slashCommands.set(properties.name, properties);
         if (["MESSAGE", "USER"].includes(properties.type)) delete properties.description;
			arrayOfSlashCommands.push(properties);
      });
		this.on("ready", async () => {
			await this.guilds.cache
				.find((g) => g.id === "guild id here")
				.commands.set(arrayOfSlashCommands);
			// await this.application.commands.set(arrayOfSlashCommands);
		});

		// Events
		const eventFiles: string[] = await globPromise(
			`${process.cwd()}/src/events/**/*.ts`
		);
		eventFiles.map(async (evenFile: string) => {
			const event = await import(evenFile);
			this.on(event.event.name, event.run.bind(null, this));
		});
	}
}

export default ExtendedClient;
