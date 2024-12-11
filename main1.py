import asyncio
import logging
import sys
from aiogram import Bot, Dispatcher, html
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart, Command
from aiogram.types import Message, InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo

# Ваш токен
TOKEN = '7556550957:AAFvp8wDZA-x1m0vCem5iFs6BX8TQVjRKDQ'

# Ініціалізація диспетчера
dp = Dispatcher()

@dp.message(CommandStart())
async def command_start_handler(message: Message) -> None:
    await message.answer(f"Hello, {html.bold(message.from_user.full_name)}!")

@dp.message(Command('google'))
async def command_google_handler(message: Message) -> None:
    # Створення інлайн-клавіатури
    markup = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="Open Google",
                    web_app=WebAppInfo(url="https://codee25.github.io/Hiramtoken.io/")
                )
            ]
        ]
    )
    await message.answer("Click the button below to open Google:", reply_markup=markup)

@dp.message()
async def echo_handler(message: Message) -> None:
    try:
        await message.send_copy(chat_id=message.chat.id)
    except TypeError:
        await message.answer("Nice try!")

async def main() -> None:
    # Ініціалізація бота
    bot = Bot(token=TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
    await dp.start_polling(bot)

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    asyncio.run(main())
