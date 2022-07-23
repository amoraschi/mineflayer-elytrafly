import { Bot } from 'mineflayer'
import { ElytraFly } from './ElytraFly.js'

function elytrafly (bot: Bot) {
  bot.elytrafly = new ElytraFly(bot)
}

declare module 'mineflayer' {
  interface BotEvents {
    elytraFlyGoalReached: () => void | Promise<void>
  }
  
  interface Bot {
    elytrafly: ElytraFly
  }
}

export {
  elytrafly
}
