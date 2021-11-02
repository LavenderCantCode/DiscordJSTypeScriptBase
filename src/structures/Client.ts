import { Client , Collection } from "discord.js"
import { Command } from "./Command"
import { Event } from "./Event"
import Config from "./Config"
import { glob } from "glob"
import { promisify } from "util"
import { config } from "dotenv"
import { connect } from "mongoose"
config()
const { TOKEN, DB } = process.env
const globPromise = promisify(glob)

export default class ExtendedClient extends Client {
   constructor() {
      super({
         intents: ["GUILDS", "GUILD_BANS", "GUILD_EMOJIS_AND_STICKERS", "GUILD_INTEGRATIONS", "GUILD_INVITES", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_MESSAGE_TYPING", "GUILD_VOICE_STATES", "GUILD_PRESENCES", "GUILD_WEBHOOKS"],
         partials: ["CHANNEL","GUILD_MEMBER","MESSAGE","REACTION","USER"]
      })
   }
   public commands: Collection<string, Command> = new Collection()
   public config: Config = {
      OWNERS: [""],
      PREFIX: "::"
   }

   async init() {
      this.login(TOKEN)
      if (DB) {
         connect(DB)
            .then(() => {
               console.log(`Connected to database`);
            })
            .catch((err) => {
               console.log(`Failed to connect to database`);
               console.log(err);
            });
      }

      // Commands
      const commandFiles = await globPromise(
         `${process.cwd()}/src/commands/**/*.ts`
      );
      commandFiles.map((value) => {
         const file = require(value);
         const splitted = value.split("/");
         const directory = splitted[splitted.length - 2];
         if (file.command.name) {
            const run = file.run;
            const properties = { directory, ...file.command, run };
            this.commands.set(file.command.name, properties);
         }
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