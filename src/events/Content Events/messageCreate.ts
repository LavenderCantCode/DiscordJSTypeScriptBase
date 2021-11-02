import { Message } from "discord.js";
import { Event, Run } from "../../structures/Event";

export const event: Event = {
   name: "messageCreate"
}
export const run: Run = async (client, message: Message) => {
   if (message.author.bot || !message.guild || !message.content.startsWith(client.config.PREFIX)) return
   const [cmd, ...args] = message.content.slice(client.config.PREFIX.length).trim().split(/ +/g)
   const command: any = client.commands.get(cmd.toLowerCase()) || client.commands.find(c => c.aliases?.includes(cmd.toLowerCase()))
   if (!command) return
   await command.run(client, message, args)
}