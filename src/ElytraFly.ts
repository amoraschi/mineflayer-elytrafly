import { Bot } from 'mineflayer'
import vec3, { Vec3 } from 'vec3'

// Thanks WurstClient for the "inspiration"
// https://github.com/Wurst-Imperium/Wurst7/blob/master/src/main/java/net/wurstclient/hacks/ExtraElytraHack.java
class ElytraFly {
  private readonly bot: Bot
  private heightDir: number = 0
  private moveDir: number = 1
  private tryingToTakeOff: boolean = false
  private prevVelocity: number
  private currentGoalPos: Vec3 | null = null

  public options: {
    speed: number
    velocityUpRate: number
    velocityDownRate: number
  }

  constructor (bot: Bot, options?: { speed: number, velocityUpRate: number, velocityDownRate: number }) {
    this.bot = bot
    this.options = {
      speed: options?.speed ?? 0.05,
      velocityUpRate: options?.velocityUpRate ?? 0.1,
      velocityDownRate: options?.velocityDownRate ?? 0.01
    }

    this.onTick = this.onTick.bind(this)
  }

  public start () {
    this.bot.look(this.bot.entity.yaw, 0, true)

    this.tryingToTakeOff = true
    this.bot.on('physicsTick', this.onTick)
  }

  public stop () {
    this.bot.removeListener('physicsTick', this.onTick)
  }

  public setControlState (state: string, value: boolean) {
    switch (state) {
      case 'up':
        this.heightDir = value ? 1 : 0
        break
      case 'down':
        this.heightDir = value ? -1 : 0
        break
      case 'forward':
        this.moveDir = value ? 1 : 0
        break
      case 'back':
        this.moveDir = value ? -1 : 0
        break
    }
  }

  private onTick () {
    const slot = this.bot.getEquipmentDestSlot('torso')
    const item = this.bot.inventory.slots[slot]
    if (item == null || item.name !== 'elytra') {
      this.stop()
      return
    }

    const block = this.bot.blockAt(this.bot.entity.position)
    if (block != null && block.name === 'water') {
      this.stop()
      return
    }

    this.controlSpeed()
    this.controlHeight()

    if (this.bot.entity.onGround && this.tryingToTakeOff) {
      this.doInstantFly()
      this.tryingToTakeOff = false
    }
  }

  private sendStartStopPacket () {
    this.bot._client.write('entity_action', {
      actionId: 8
    })
  }

  private controlHeight () {
    const vel = this.bot.entity.velocity
  
    if (this.heightDir === 1) {
      this.bot.entity.velocity.set(vel.x, vel.y + this.options.velocityUpRate, vel.z)
    } else if (this.heightDir === -1) {
      this.bot.entity.velocity.set(vel.x, vel.y - this.options.velocityUpRate, vel.z)
    } else if (this.heightDir === 0) {
      this.bot.entity.velocity.set(vel.x, vel.y + 0.07545, vel.z)
    }
  }

  private controlSpeed () {
    const yaw = this.bot.entity.yaw
    const forward = vec3({ x: Math.sin(yaw) * this.options.speed, y: 0, z: Math.cos(yaw) * this.options.speed })

    const vel = this.bot.entity.velocity

    if (this.moveDir === -1) {
      const add = vel.add(forward)
      this.bot.entity.velocity.set(add.x, add.y, add.z)
    } else if (this.moveDir === 1) {
      const subtract = vel.subtract(forward)
      this.bot.entity.velocity.set(subtract.x, subtract.y, subtract.z)
    } else if (this.moveDir === 0) {
      this.bot.entity.velocity.set(0, vel.y, 0)
    }
  }

  private doInstantFly () {
    this.bot.setControlState('jump', true)
    setTimeout(() => {
      this.sendStartStopPacket()
      this.bot.setControlState('jump', false)
    }, 55)
  }

  public async elytraFlyTo (pos: Vec3) {
    this.prevVelocity = this.options.speed
    this.options.speed = 0.05
    pos.y = this.bot.entity.position.y + this.bot.entity.height
    await this.bot.lookAt(pos, true)

    // this.setControlState('up', true)
    this.setControlState('forward', true)
    this.start()

    this.currentGoalPos = pos
    this.onMove = this.onMove.bind(this)
    this.bot.on('move', this.onMove)
  }

  private onMove () {
    (this.currentGoalPos as Vec3).y = this.bot.entity.position.y + this.bot.entity.height
    this.bot.lookAt(this.currentGoalPos as Vec3, true)
    const velToSet = this.options.speed * this.bot.entity.position.xzDistanceTo(this.currentGoalPos as Vec3) / 100
    this.options.speed = velToSet > 0.5 ? 0.4 : (velToSet < 0.05 ? 0.05 : velToSet)
    if (this.bot.entity.position.xzDistanceTo(this.currentGoalPos as Vec3) < 5) {
      this.bot.removeListener('move', this.onMove)
      this.options.speed = this.prevVelocity
      this.currentGoalPos = null
      this.setControlState('forward', false)
      this.stop()
      this.waitForGround = this.waitForGround.bind(this)
      this.bot.on('move', this.waitForGround)
    }
  }

  private waitForGround () {
    if (this.bot.entity.onGround) {
      this.bot.removeListener('move', this.waitForGround)
      this.bot.emit('elytraFlyGoalReached')
    }
  }
}

export {
  ElytraFly
}
