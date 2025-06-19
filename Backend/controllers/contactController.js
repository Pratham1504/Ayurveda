const sendTelegramAlert = require('./sendMessageAlert');

const contactUs = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const telegramMessage = `
<b>📬 New Contact Message</b>

👤 <b>${name}</b>
📧 <b>Email:</b> ${email}
📝 <b>Message:</b>
${message}

🔗 <b>Link:</b> https://swasthamana.netlify.app/
`;

    await sendTelegramAlert(telegramMessage);
    res.status(200).json({ success: true, message: 'Message sent to admin.' });
  } catch (err) {
    console.error('Error sending contact message:', err);
    res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
};

module.exports = { contactUs };
