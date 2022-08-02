const Discord = require("discord.js");

module.exports = {
  name: "역할부여",
  excute(message) {
    if (!message.mentions.members.first())
      return message.channel.send("역할 부여할 유저 선택");
    const user = message.mentions.member.roles.add("916206242119159829");
  },
};
