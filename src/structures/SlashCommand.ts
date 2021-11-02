import ExtendedClient from "./Client"
import { CommandInteraction } from "discord.js"

export interface Run {
   (client: ExtendedClient, interaction: CommandInteraction, args: Array<string>)
}

export interface SlashCommand {
   name: string,
   description?: string,
   category?: string,
   type: "CHAT_INPUT" | "MESSAGE" | "USER",
   options?: Array<object>
}

export interface BaseCommand {
   name: string,
   description: string,
   category?: string,
   type: "CHAT_INPUT" | "MESSAGE" | "USER",
   options?: Array<object>,
   run: Run
}