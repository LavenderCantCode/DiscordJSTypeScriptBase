import { Message, PermissionFlags } from "discord.js";
import ExtendedClient from "./Client";

export interface Run {
   (client: ExtendedClient, message: Message, args: Array<string>)
}

export interface Command {
   name: string,
   description?: string,
   aliases?: Array<string>,
   usages?: Array<string>,
   category?: string,
   permissions?: Array<keyof PermissionFlags>,
   botPermissions?: Array<keyof PermissionFlags>,
}