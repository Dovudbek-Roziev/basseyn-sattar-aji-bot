const { getSettings, updateSetting, getAllBookings } = require("./database");

const ADMIN_ID = Number(process.env.ADMIN_ID);

// Admin ekanligini tekshirish
function isAdmin(userId) {
  return userId === ADMIN_ID;
}

// Admin panel asosiy menyu
function adminMenuKeyboard() {
  return {
    inline_keyboard: [
      [{ text: "💰 Narxlarni o'zgartirish", callback_data: "admin_prices" }],
      [{ text: "🕒 Ish vaqtini o'zgartirish", callback_data: "admin_hours" }],
      [{ text: "📍 Manzilni o'zgartirish", callback_data: "admin_address" }],
      [
        {
          text: "📞 Telefon raqamni o'zgartirish",
          callback_data: "admin_phone",
        },
      ],
      [
        {
          text: "📋 Band qilinganlar ro'yxati",
          callback_data: "admin_bookings",
        },
      ],
    ],
  };
}

// /admin buyrug'i
async function handleAdminCommand(bot, msg) {
  const userId = msg.from.id;

  if (!isAdmin(userId)) {
    return bot.sendMessage(msg.chat.id, "⛔ Sizda admin huquqi yo'q.");
  }

  const settings = await getSettings();

  const text =
    `🔧 <b>Admin Panel — Basseyn Sattar Aji</b>\n\n` +
    `💰 Narxlar: ${settings.prices || "<i>kiritilmagan</i>"}\n` +
    `🕒 Ish vaqti: ${settings.workingHours || "<i>kiritilmagan</i>"}\n` +
    `📍 Manzil: ${settings.address || "<i>kiritilmagan</i>"}\n` +
    `📞 Telefon: ${settings.phone || "<i>kiritilmagan</i>"}`;

  bot.sendMessage(msg.chat.id, text, {
    parse_mode: "HTML",
    reply_markup: adminMenuKeyboard(),
  });
}

// Admin callback'larini qayta ishlash
// userStates — index.js dan keladi (band qilish holatlari bilan birgalikda ishlatiladi)
async function handleAdminCallback(bot, query, userStates) {
  const userId = query.from.id;
  const chatId = query.message.chat.id;
  const data = query.data;

  if (!isAdmin(userId)) return;

  bot.answerCallbackQuery(query.id);

  // Band qilinganlar ro'yxati
  if (data === "admin_bookings") {
    const bookings = await getAllBookings();

    if (bookings.length === 0) {
      return bot.sendMessage(chatId, "📋 Hozircha band qilinganlar yo'q.");
    }

    // Har 10 tasini alohida xabar qilib yuboramiz (Telegram limit)
    let text = "📋 <b>Band qilinganlar ro'yxati:</b>\n\n";
    bookings.forEach((b, i) => {
      const date = new Date(b.createdAt).toLocaleString("uz-UZ");
      text += `${i + 1}. 👤 ${b.name} | 📞 ${b.phone} | @${b.username || "yo'q"} | 🕐 ${date}\n`;
    });

    return bot.sendMessage(chatId, text, { parse_mode: "HTML" });
  }

  // O'zgartirish tugmalari — foydalanuvchini kutish holatiga qo'yamiz
  const stateMap = {
    admin_prices: { state: "admin_waiting_prices", prompt: "💰 Yangi narxlarni kiriting:" },
    admin_hours:  { state: "admin_waiting_hours",  prompt: "🕒 Yangi ish vaqtini kiriting:" },
    admin_address:{ state: "admin_waiting_address", prompt: "📍 Yangi manzilni kiriting:\n\n📌 Google Maps linkini ham kiritishni unutmang (keyingi xabarda so'raymiz)" },
    admin_phone:  { state: "admin_waiting_phone",   prompt: "📞 Yangi telefon raqamni kiriting:" },
  };

  const matched = stateMap[data];
  if (matched) {
    userStates[userId] = { state: matched.state };
    bot.sendMessage(chatId, matched.prompt, { parse_mode: "HTML" });
  }
}

// Admin holatlarida kelgan xabarlarni qayta ishlash
async function handleAdminState(bot, msg, userStates) {
  const userId = msg.from.id;
  const chatId = msg.chat.id;
  const text = msg.text;
  const stateInfo = userStates[userId];

  if (!stateInfo) return false; // Admin holati yo'q

  switch (stateInfo.state) {
    case "admin_waiting_prices":
      await updateSetting("prices", text);
      delete userStates[userId];
      bot.sendMessage(chatId, "✅ Narxlar yangilandi!", { reply_markup: adminMenuKeyboard() });
      return true;

    case "admin_waiting_hours":
      await updateSetting("workingHours", text);
      delete userStates[userId];
      bot.sendMessage(chatId, "✅ Ish vaqti yangilandi!", { reply_markup: adminMenuKeyboard() });
      return true;

    case "admin_waiting_address":
      // Avval manzilni saqlaymiz, keyin maps link so'raymiz
      userStates[userId] = { state: "admin_waiting_maps", address: text };
      bot.sendMessage(chatId,
        `📌 Endi Google Maps linkini kiriting:\n\n` +
        `<b>🇺🇿 O'zbek:</b>\n` +
        `Google Maps ni oching → Basseynni toping → "Ulashish" tugmasini bosing → "Havolani nusxalash" ni tanlang → shu linkni yuboring\n\n` +
        `<b>🇷🇺 Русский:</b>\n` +
        `Откройте Google Maps → Найдите бассейн → Нажмите "Поделиться" → "Копировать ссылку" → отправьте эту ссылку\n\n` +
        `<b>🇰🇬 Кыргызча:</b>\n` +
        `Google Maps ачыңыз → Бассейнди табыңыз → "Бөлүшүү" баскычын басыңыз → "Шилтемени көчүрүү" → ошол шилтемени жөнөтүңүз\n\n` +
        `❌ Link yo'q bo'lsa — <b>yo'q</b> deb yozing`,
        { parse_mode: "HTML" }
      );
      return true;

    case "admin_waiting_maps":
      await updateSetting("address", stateInfo.address);
      if (text.toLowerCase() !== "yo'q" && text.toLowerCase() !== "йок") {
        await updateSetting("mapsLink", text);
      }
      delete userStates[userId];
      bot.sendMessage(chatId, "✅ Manzil yangilandi!", { reply_markup: adminMenuKeyboard() });
      return true;

    case "admin_waiting_phone":
      await updateSetting("phone", text);
      delete userStates[userId];
      bot.sendMessage(chatId, "✅ Telefon raqam yangilandi!", { reply_markup: adminMenuKeyboard() });
      return true;

    default:
      return false;
  }
}

module.exports = {
  isAdmin,
  handleAdminCommand,
  handleAdminCallback,
  handleAdminState,
};
