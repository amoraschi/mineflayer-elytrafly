<h1 align="center">mineflayer-elytrafly</h1>
<p align="center">Plugin for Mineflayer bots to make them fly (i.e. blatantly cheat)</p>

<p align="center">
  <img src="https://img.shields.io/github/repo-size/amoraschi/mineflayer-elytrafly?style=for-the-badge&logo=github" />
  <img src="https://img.shields.io/npm/v/mineflayer-elytrafly?style=for-the-badge&logo=npm" />
</p>

<h3>How to use with mineflayer bots</h3>

---

First install the package with npm:

```
npm i mineflayer-elytrafly
```

Then load the plugin by adding:

```js
bot.loadPlugin(elytrafly)
```

In your code (preferably after spawning the bot)

<h3>API</h3>

---

Assuming the bot has already an elytra equipped

```js
bot.elytrafly.options
```

Options for the plugin, applies even while flying

```js
{
  speed: number // Default: 0.05
  velocityUpRate: number // Default: 0.1
  velocityDownRate: number // Default: 0.01
}
```

*Warning* | I don't recommend changing the speed option, `bot.elytrafly.flyTo` changes it but reverts it back when it's finished

---

```js
bot.elytrafly.start()
```

Makes the bot fly with the elytra, by default it will go forwards, you can change this before starting with:

---

```js
bot.elytrafly.setControlState(state: string, value: boolean)
```

The bot should follow its sight, this means you can change its course by changing the bot's `yaw`

States:

- forward
- back
- up
- down

---

```js
bot.elytrafly.stop()
```

Stops the bot without closing the elytra and makes it descend slowly (shouldn't take fall damage)

---

```js
bot.elytrafly.forceStop()
```

Stops the bot closing the elytra (could potentially kill the bot with fall damage)

---

```js
bot.elytrafly.flyTo(position: Vec3)
```

*Experimental* | The bot will attempt to go near the position by flying (doesn't pathfind, just looks straight at the position and flies there, needs an open space)

The flying speed is proportional to the distance to the goal, but once it gets near, it slows down, and slowly descends to the ground
