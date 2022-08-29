import { Telegraf } from 'telegraf';
import mongoose from 'mongoose';

const bot = new Telegraf(process.env.BOT_TOKEN);
await mongoose.connect(process.env.DB);

const messageSchema = new mongoose.Schema({
  tg_id: {type: Number, default: 0},
  msg_id: {type: Number, default: 0}
}, {collection: 'support', autoCreate: false, timestamps: true, versionKey: false});
const Message = mongoose.model('Message', messageSchema);

bot.start((ctx) => ctx.reply('Welcome to Support Bot.\nPlease ask your question and wait for the answer.'));

bot.on('message', async (ctx) => {
  if (ctx.chat.id == process.env.GROUP_ID) {
    if ('reply_to_message' in ctx.message) {
      const { tg_id } = await Message.findOne({msg_id: ctx.message.reply_to_message.message_id});
      await ctx.telegram.copyMessage(tg_id, process.env.GROUP_ID, ctx.message.message_id).catch(e => console.log(e));
    }
  } else {
    const { message_id } = await ctx.telegram.forwardMessage(process.env.GROUP_ID, ctx.chat.id, ctx.message.message_id);
    await Message.create({tg_id: ctx.chat.id, msg_id: message_id});
  }
});

bot.launch();