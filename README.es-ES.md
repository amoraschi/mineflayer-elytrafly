

<h1 align="center">mineflayer-elytrafly</h1>
<p align="center">Plugin para bots de Mineflayer que les permite volar (es decir, hacer trampas descaradamente)</p>
<p align="center">Compatible con la sintaxis CommonJS y ES</p>

<p align="center">
  <a href="https://discord.gg/https://discord.gg/prismarinejs-413438066984747026"><img src="https://img.shields.io/badge/DISCORD-JOIN-7289da?style=for-the-badge" alt="PrismarineJS Discord"></a>
  <a href="https://github.com/amoraschi/mineflayer-elytrafly" target="_blank"><img src="https://img.shields.io/github/repo-size/amoraschi/mineflayer-elytrafly?style=for-the-badge&logo=github" alt="Repository size"/></a>
  <a href="https://www.npmjs.com/package/mineflayer-elytrafly" target="_blank"><img src="https://img.shields.io/npm/v/mineflayer-elytrafly?style=for-the-badge&logo=npm" alt="NPM version" /></a>
</p>

<!-- <h2 align="center">Advertencia, este proyecto no ha sido actualizado en mucho tiempo, no garantizo que funcione</h2> -->

<h3>Cómo usarlo con bots de mineflayer</h3>

---

Primero instala el paquete con npm:

```
npm i mineflayer-elytrafly
```

Luego carga el plugin agregando:

```js
bot.loadPlugin(elytrafly)
```

En tu código (preferiblemente después de crear al bot)

<h3>API</h3>

---

<h4><i>Propiedades</i></h4>

Asumiendo que el bot ya tiene un elytra equipado

```js
bot.elytrafly.options
```

Opciones para el plugin, se aplican incluso mientras vuela

```js
{
  speed: number // Predeterminado: 0.05
  velocityUpRate: number // Predeterminado: 0.1
  velocityDownRate: number // Predeterminado: 0.01
  proportionalSpeed: boolean // Predeterminado: true
}
```

*Advertencia* | No recomiendo cambiar la opción de velocidad, `bot.elytrafly.flyTo` la cambia pero la restaura cuando termina

---

<h4><i>Métodos</i></h4>

```js
bot.elytrafly.start()
```

Hace que el bot vuele con el elytra, por defecto avanzará hacia adelante, puedes cambiar esto antes de iniciar con:

---

```js
bot.elytrafly.setControlState(state: string, value: boolean)
```

El bot seguirá su línea de visión, esto significa que puedes cambiar su rumbo modificando el `yaw` del bot

Estados:

- forward
- back
- up
- down

---

```js
bot.elytrafly.stop()
```

Detiene al bot sin cerrar el elytra y hace que descienda lentamente (no debería recibir daño por caída)

---

```js
bot.elytrafly.forceStop()
```

Detiene al bot cerrando el elytra (podría potencialmente matar al bot por daño de caída)

---

```js
bot.elytrafly.flyTo(position: Vec3)
```

*Experimental* | El bot intentará acercarse a la posición volando (no busca ruta, simplemente mira directamente hacia la posición y vuela allí, requiere un espacio abierto)

Si `proportionalSpeed` está configurado en `true`, la velocidad de vuelo es proporcional a la distancia hacia el objetivo, pero una vez que se acerca, reduce la velocidad y desciende lentamente hacia el suelo

---

<h4><i>Eventos</i></h4>

- `elytraFlyGoalReached`

Autoexplicativo, se emite cuando ha alcanzado el objetivo con `bot.elytrafly.flyTo`
