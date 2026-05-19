export const sendTelegramMessage = async (message) => {
  const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn("Telegram: Token ou Chat ID não configurados.");
    return;
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message
      })
    });
    if (!response.ok) {
      console.error("Erro na resposta do Telegram:", await response.text());
    }
  } catch (err) {
    console.error("Erro ao enviar mensagem pro Telegram:", err);
  }
};
