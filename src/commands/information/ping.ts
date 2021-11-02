import { Run, Command } from "../../structures/Command";
import { Message, MessageEmbed } from "discord.js";
import ExtendedClient from "../../structures/Client";

export const command: Command = {
   name: "ping",
   description: "A simple ping command",
   category: "Information",
}
export const run: Run = async (client: ExtendedClient, message: Message, args: string[]) => {
   message.reply({content: `${client.ws.ping}ms`})
}