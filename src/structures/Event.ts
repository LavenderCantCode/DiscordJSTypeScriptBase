import { ClientEvents } from "discord.js";
import ExtendedClient from "./Client";

export interface Run {
   (client: ExtendedClient, ...args: any[])
}

export interface Event {
   name: keyof ClientEvents
}