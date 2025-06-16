// utils/sendTelegramAlert.js
const axios = require("axios");

const sendTelegramAlert = async (message) => {
    try {
        await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
            chat_id: process.env.CHAT_ID,
            text: message,
            parse_mode: "HTML",
        });
        console.log("✅ Telegram alert sent");
    } catch (err) {
        console.error("❌ Failed to send Telegram alert", err.response?.data || err.message);
    }
};

module.exports = sendTelegramAlert;
