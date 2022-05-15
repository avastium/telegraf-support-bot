# Install
* Create a bot, add a token to `process.env.BOT_TOKEN`.
* Create a MongoDB database, add connection string to `process.env.DB`.
* Create a group, add your bot to it.
* Add a group ID to `process.env.GROUP_ID`.

# Usage
The bot will forward all user messages to the group.

When you reply to a forwarded message, the bot will forward your reply back to the user.