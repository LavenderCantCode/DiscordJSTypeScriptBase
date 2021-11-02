import { Base, Interaction } from "discord.js";
import { Event, Run } from "../../structures/Event";
import { BaseCommand } from "../../structures/SlashCommand";

export const event: Event = {
   name: "interactionCreate"
}
export const run: Run = (client, interaction: Interaction) => {
     
   if (interaction.isCommand()) {
      const command = client.slashCommands.find(cmd => cmd.name === interaction.commandName) as BaseCommand
      if (!command) return;
      const args = []
      for (let option of interaction.options.data) {
          if (option.type === "SUB_COMMAND") {
                if (option.name) args.push(option.name);
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value);
                });
          } else if (option.value) {
             args.push(option.value);
          }
      }
      interaction.member = interaction.guild.members.cache.find(m => m.id === interaction.user.id)
      command.run(client, interaction, args)
   }

   
}