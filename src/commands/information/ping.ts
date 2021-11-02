import { SlashCommand, Run } from "../../structures/SlashCommand";
import { CommandInteraction } from "discord.js";
import ExtendedClient from "../../structures/Client";

export const command: SlashCommand = {
   name: "ping",
   description: "A simple ping command",
   type: "CHAT_INPUT"
}
export const run: Run = (client: ExtendedClient, interaction: CommandInteraction, args: Array<string>) => {
   interaction.reply({content: "Pong!"})
}