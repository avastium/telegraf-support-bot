const {Telegraf} = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);
const mongoose = require('mongoose');

const createConn = async () => await mongoose.connect(process.env.DB).then().catch(e => console.log(e));
createConn();

const groupID = -1001234567890; // YOUR GROUP ID

const db = mongoose.connection;
const messageSchema = new mongoose.Schema({
  tg_id: {type: Number, default: 0},
  msg_id: {type: Number, default: 0},
  time: {type: Date, default: Date()}
});
const Message = mongoose.model('Message', messageSchema);

bot.start((ctx) => ctx.reply('Welcome to Support Bot.\nPlease ask your question and wait for the answer.'));

bot.on('message', (ctx) => {
  if (ctx.chat.id != groupID) {
    ctx.telegram.forwardMessage(groupID, ctx.chat.id, ctx.message.message_id).then((res) => {
      db.collection('support').insertOne(new Message({tg_id: ctx.chat.id, msg_id: res.message_id, time: Date.now()})).then().catch(e => console.log(e));
    }).catch(e => console.log(e));
  }
  if (ctx.chat.id == groupID) {
    if ('reply_to_message' in ctx.message) {
      db.collection('support').find({msg_id: ctx.message.reply_to_message.message_id}).toArray().then((res) => {
        ctx.telegram.copyMessage(res[0]['tg_id'], groupID, ctx.message.message_id);
      }).catch(e => console.log(e));
    }
  }
});

bot.launch();