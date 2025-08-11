from aiogram import Bot, Dispatcher, types
from aiogram.filters import CommandStart
from aiogram.types import WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton
import asyncio
import os

TOKEN = os.getenv('TG_BOT_TOKEN', '8214003874:AAGaJBiuahA7GukglcuztgBus8fpLYHL9bE')
WEBAPP_URL = os.getenv('WEBAPP_URL', 'https://testgamemyownclarity.onrender.com')

bot = Bot(token=TOKEN)
dp = Dispatcher()

@dp.message(CommandStart())
async def start(message: types.Message):
    kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text='🚀 Открыть игру', web_app=WebAppInfo(url=WEBAPP_URL))],
            [InlineKeyboardButton(text='👥 Реферальная ссылка', callback_data='ref')]
        ]
    )
    await message.answer(
        f'Привет, {message.from_user.first_name}!\nЭто официальный бот игры. Жми кнопку, чтобы начать!',
        reply_markup=kb
    )

@dp.callback_query(lambda c: c.data == 'ref')
async def send_ref(call: types.CallbackQuery):
    ref_link = f'{WEBAPP_URL}/?ref={call.from_user.id}'
    await call.message.answer(f'Ваша реферальная ссылка:\n{ref_link}')
    await call.answer()

async def main():
    await dp.start_polling(bot)

if __name__ == '__main__':
    asyncio.run(main())
