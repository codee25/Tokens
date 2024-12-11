import telebot 
from telebot import types
import webbrowser
import sqlite3

bot = telebot.TeleBot('7556550957:AAFvp8wDZA-x1m0vCem5iFs6BX8TQVjRKDQ')

@bot.message_handler(commands=['start'])
def start(message):
    conn = sqlite3.connect('hiram.sqlite3')
    cur = conn.cursor()
    cur.execute('CREATE TABLE IF NOT EXISTS users (id int auto_increment primary key, name varchar(50), pass varchar(50)')
    conn.commit()
    cur.close()
    conn.close()
    markup = types.ReplyKeyboardMarkup()
    btn1 = types.KeyboardButton('FAV')
    markup.row(btn1)
    btn2 = types.KeyboardButton('Vaf')
    btn3 = types.KeyboardButton('GAF')
    markup.row(btn2,btn3)
    bot.send_message(message.chat.id, f'Привіт! {message.from_user.first_name} {message.from_user.last_name}', reply_markup=markup)
    


@bot.message_handler(commands=['site', 'website'])
def site(message):
    webbrowser.open('https://www.youtube.com/watch?v=-l_CYgBj4IE&list=PL0lO_mIqDDFUev1gp9yEwmwcy8SicqKbt&index=2')

@bot.message_handler(commands=['telegram', 'tg', 'tgc'])
def main(message):
    markup = types.InlineKeyboardMarkup()
    markup.add (types.InlineKeyboardButton('Перейти до спільноти', url='https://t.me/+v4eRZWYMttdlNWEy'))
    bot.send_message(message.chat.id, 'Долучайся до нашого телеграм каналу: https://t.me/+v4eRZWYMttdlNWEy', reply_markup=markup)


@bot.message_handler(commands=['help'])
def main(message):
    bot.send_message(message.chat.id, 'Help information')

@bot.message_handler(content_types=['photo'])
def get_photo(message):
    bot.reply_to(message, 'Яке гарне фото!')

@bot.message_handler()
def info(message):
    if message.text.lower() == 'привіт':
       bot.send_message(message.chat.id, f'Привіт! {message.from_user.first_name} {message.from_user.last_name}')
    elif message.text.lower == 'id':
       bot.reply_to(message, f'ID: {message.from_user.id}')


bot.polling(none_stop=True)