import { Telegraf } from 'telegraf';
import mongoose from 'mongoose';

const bot = new Telegraf(process.env.BOT_TOKEN);
await mongoose.connect(process.env.DB).then().catch(e => console.log(e));

const messageSchema = new mongoose.Schema({
  tg_id: {type: Number, default: 0},
  msg_id: {type: Number, default: 0},
  time: {type: Date, default: Date()}
}, {versionKey: false});
const Message = mongoose.model('Message', messageSchema);

bot.start((ctx) => ctx.reply('Welcome to Support Bot.\nPlease ask your question and wait for the answer.'));

bot.on('message', (ctx) => {
  if (ctx.chat.id == process.env.GROUP_ID && reply_to_message in ctx.message) {
    Message.findOne({msg_id: ctx.message.reply_to_message.message_id}).then((res) => {
      ctx.telegram.copyMessage(res.tg_id, process.env.GROUP_ID, ctx.message.message_id).then().catch(e => console.log(e));
    }).catch(e => console.log(e));
  } else {
    ctx.telegram.forwardMessage(process.env.GROUP_ID, ctx.chat.id, ctx.message.message_id).then((res) => {
      Message.create({tg_id: ctx.chat.id, msg_id: res.message_id, time: Date.now()}).then().catch(e => console.log(e));
    }).catch(e => console.log(e));
  }
});

bot.launch();