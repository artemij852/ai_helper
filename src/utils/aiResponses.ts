import { AISettings } from '../types';

export function getAIResponse(userMessage: string, userName: string, aiSettings: AISettings): string {
  const lowerMsg = userMessage.toLowerCase();
  const name = userName || 'друг';
  const aiName = aiSettings.aiName || 'Заботушка';

  if (lowerMsg.includes('привет') || lowerMsg.includes('здравствуй') || lowerMsg.includes('добрый')) {
    return `Здравствуйте, ${name}! Рада вас видеть! Как ваше самочувствие сегодня? 😊`;
  }
  if (lowerMsg.includes('давлен') || lowerMsg.includes('тонометр')) {
    return `${name}, не забудьте измерить давление! Это очень важно для вашего здоровья. Запишите результат, и я сохраню его в памяти 📝`;
  }
  if (lowerMsg.includes('таблетк') || lowerMsg.includes('лекарств') || lowerMsg.includes('пил')) {
    return `Не забудьте принять таблетки по расписанию, ${name}! Если нужно, я напомню вам время приёма 💊`;
  }
  if (lowerMsg.includes('спасибо') || lowerMsg.includes('благодар')) {
    return `Всегда рада помочь, ${name}! Берегите себя ❤️`;
  }
  if (lowerMsg.includes('как дела') || lowerMsg.includes('как вы')) {
    return `У меня всё отлично, ${name}! Главное — как вы себя чувствуете? Не забывайте пить воду и отдыхать 💧`;
  }
  if (lowerMsg.includes('рецепт') || lowerMsg.includes('еда') || lowerMsg.includes('готов')) {
    return `У меня есть много полезных рецептов! Загляните в раздел "Рецепты" — там есть блюда для здоровья 🍲`;
  }
  if (lowerMsg.includes('плохо') || lowerMsg.includes('болит') || lowerMsg.includes('головокруж')) {
    return `${name}, если вам плохо, пожалуйста, позвоните врачу или близким. Сядьте удобно, не делайте резких движений. Я рядом с вами 🤗`;
  }
  if (lowerMsg.includes('память') || lowerMsg.includes('запис') || lowerMsg.includes('истори')) {
    return `Я запоминаю все ваши показатели давления и приёма таблеток. Данные сохраняются в вашем аккаунте 📊`;
  }
  if (lowerMsg.includes('пока') || lowerMsg.includes('до свидания')) {
    return `До свидания, ${name}! Берегите себя и не забывайте о таблетках. Я всегда на связи! 👋`;
  }
  if (lowerMsg.includes('контакт') || lowerMsg.includes('друг') || lowerMsg.includes('написа')) {
    return `${name}, вы можете общаться с другими пользователями в разделе "Контакты"! Добавьте близких и пишите им 📱`;
  }

  const responses = [
    `${name}, я вас слушаю! Расскажите подробнее 🤔`,
    `Интересно, ${name}! А как вы себя сегодня чувствуете?`,
    `${name}, помните — здоровье самое важное! Не забывайте про таблетки 💊`,
    `Хорошо, ${name}. Я здесь, если вам что-то понадобится!`,
    `${name}, может быть вам пора измерить давление? Это займёт всего пару минут 🩺`,
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}
