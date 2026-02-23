const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals: { GoalBlock } } = require('mineflayer-pathfinder')

// Настройки
const SERVER_HOST = '135.181.126.142' // IP сервера
const SERVER_PORT = 25982              // Порт
const BOT_USERNAME = 'Mr_hvik'           // Ник (или email/логин, если надо)
const LOGIN_COMMAND = '/l 12345678'   // Команда логина
const AFK_TIME = 60 * 60 * 1000        // 1 час (в миллисекундах)

// Точка, куда бот должен прийти и стоять
const TARGET_POS = { x: 1422, y: 185, z: 596 }
#{ x: 1422, y: 185, z: 596 } порох
#{ x: -348, y: 243, z: 143 } золото

function startBot() {
  const bot = mineflayer.createBot({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username: BOT_USERNAME,
    // auth: 'microsoft' // если нужен Microsoft-логин
  })

  bot.loadPlugin(pathfinder)

  bot.once('spawn', () => {
    console.log(`[BOT] Зашёл на сервер как ${bot.username}`)

    // Отправляем команду логина
    bot.chat(LOGIN_COMMAND)
    console.log(`[BOT] Отправлена команда: ${LOGIN_COMMAND}`)

    // Двигаемся в указанную точку
    const mcData = require('minecraft-data')(bot.version)
    const defaultMove = new Movements(bot, mcData)
    bot.pathfinder.setMovements(defaultMove)

    const goal = new GoalBlock(TARGET_POS.x, TARGET_POS.y, TARGET_POS.z)
    bot.pathfinder.setGoal(goal)

    bot.once('goal_reached', () => {
      console.log(`[BOT] Достиг точки (${TARGET_POS.x}, ${TARGET_POS.y}, ${TARGET_POS.z})`)
    })

    // Через час выходим и перезапускаем
    setTimeout(() => {
      console.log('[BOT] Время вышло, отключаюсь...')
      bot.quit()
    }, AFK_TIME)
  })

  bot.on('end', () => {
    console.log('[BOT] Вышел. Перезапуск...')
    setTimeout(startBot, 5000) // Подождать 5 секунд и зайти снова
  })

  bot.on('error', (err) => {
    console.error('[BOT] Ошибка:', err)
  })
}


startBot()



