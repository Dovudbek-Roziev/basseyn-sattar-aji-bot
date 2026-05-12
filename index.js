require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { connectDB, getUserLang, saveUser, getSettings, saveBooking, updateBookingStatus } = require("./database");
const { t } = require("./translations");
const { isAdmin, handleAdminCommand, handleAdminCallback, handleAdminPhoto, handleAdminState } = require("./admin");

const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = Number(process.env.ADMIN_ID);

// Bot ni ishga tushiramiz
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Foydalanuvchi holatlari (xotirada saqlanadi)
// { userId: { state: "...", data: {...} } }
const userStates = {};

console.log("🚀 Basseyn Sattar Aji boti ishga tushdi...");

// ─── Til tanlash klaviaturasi ───────────────────────────────────────────────
function langKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: "🇺🇿 O'zbek",  callback_data: "lang_uz" },
        { text: "🇷🇺 Русский", callback_data: "lang_ru" },
        { text: "🇰🇬 Кыргызча", callback_data: "lang_ky" },
      ],
    ],
  };
}

// ─── Keyingi 7 kun klaviaturasi ─────────────────────────────────────────────
function dateKeyboard(lang) {
  const days = ["Yak", "Du", "Se", "Cho", "Pa", "Ju", "Sha"];
  const dayNamesRu = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  const dayNamesKy = ["Жк", "Дш", "Шш", "Шр", "Бш", "Жм", "Иш"];
  const dayMap = { uz: days, ru: dayNamesRu, ky: dayNamesKy };
  const names = dayMap[lang] || days;

  const buttons = [];
  const row = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const label = `${names[d.getDay()]} ${day}.${month}`;
    const value = `${day}.${month}.${d.getFullYear()}`;
    row.push({ text: label, callback_data: `bdate_${value}` });
    if (row.length === 4) { buttons.push([...row]); row.length = 0; }
  }
  if (row.length) buttons.push([...row]);
  buttons.push([{ text: t(lang, "cancel"), callback_data: "booking_cancel" }]);
  return { inline_keyboard: buttons };
}

// ─── Vaqt klaviaturasi ───────────────────────────────────────────────────────
function timeKeyboard(lang) {
  const times = ["08:00","09:00","10:00","11:00","12:00","13:00",
                 "14:00","15:00","16:00","17:00","18:00","19:00","20:00"];
  const buttons = [];
  for (let i = 0; i < times.length; i += 4) {
    buttons.push(times.slice(i, i + 4).map(t => ({
      text: t, callback_data: `btime_${t}`
    })));
  }
  buttons.push([{ text: t(lang, "cancel"), callback_data: "booking_cancel" }]);
  return { inline_keyboard: buttons };
}

// ─── Kishilar soni klaviaturasi ──────────────────────────────────────────────
function peopleKeyboard(lang) {
  return {
    inline_keyboard: [
      [
        { text: "1", callback_data: "bpeople_1" },
        { text: "2", callback_data: "bpeople_2" },
        { text: "3", callback_data: "bpeople_3" },
        { text: "4", callback_data: "bpeople_4" },
      ],
      [
        { text: "5", callback_data: "bpeople_5" },
        { text: "6", callback_data: "bpeople_6" },
        { text: "7+", callback_data: "bpeople_7+" },
      ],
      [{ text: t(lang, "cancel"), callback_data: "booking_cancel" }],
    ],
  };
}

// ─── Asosiy menyu klaviaturasi ──────────────────────────────────────────────
function mainMenuKeyboard(lang, adminUser = false) {
  const keyboard = [
    [
      { text: t(lang, "menu").prices,  callback_data: "menu_prices" },
      { text: t(lang, "menu").hours,   callback_data: "menu_hours" },
    ],
    [
      { text: t(lang, "menu").address,  callback_data: "menu_address" },
      { text: t(lang, "menu").contact,  callback_data: "menu_contact" },
    ],
    [
      { text: t(lang, "menu").booking,  callback_data: "menu_booking" },
      { text: t(lang, "menu").photos,   callback_data: "menu_photos" },
    ],
    [
      { text: t(lang, "menu").settings, callback_data: "menu_settings" },
    ],
  ];

  // Faqat admin uchun qo'shimcha tugma
  if (adminUser) {
    keyboard.push([{ text: "⚙️ Admin panel", callback_data: "open_admin" }]);
  }

  return { inline_keyboard: keyboard };
}

// ─── /start buyrug'i ────────────────────────────────────────────────────────
bot.onText(/\/start/, async (msg) => {
  const userId = msg.from.id;
  const chatId = msg.chat.id;

  // Avvaldan tili bormi tekshiramiz
  const savedLang = await getUserLang(userId);

  if (savedLang) {
    const name = msg.from.first_name || "Mehmon";
    bot.sendMessage(chatId, t(savedLang, "welcome", name), {
      parse_mode: "HTML",
      reply_markup: mainMenuKeyboard(savedLang, isAdmin(userId)),
    });
  } else {
    bot.sendMessage(chatId, t("uz", "chooseLanguage"), {
      reply_markup: langKeyboard(),
    });
  }
});

// ─── /admin buyrug'i ────────────────────────────────────────────────────────
bot.onText(/\/admin/, async (msg) => {
  await handleAdminCommand(bot, msg);
});

// ─── Barcha callback (tugma bosilishi) ─────────────────────────────────────
bot.on("callback_query", async (query) => {
  const userId = query.from.id;
  const chatId = query.message.chat.id;
  const msgId = query.message.message_id;
  const data = query.data;

  bot.answerCallbackQuery(query.id);

  // ── Til tanlash ──────────────────────────────────────────────────────────
  if (data.startsWith("lang_")) {
    const lang = data.split("_")[1]; // uz, ru, ky
    const name = query.from.first_name || "Mehmon";

    await saveUser(userId, query.from.username || "", name, lang);

    bot.editMessageText(t(lang, "welcome", name), {
      chat_id: chatId,
      message_id: msgId,
      parse_mode: "HTML",
      reply_markup: mainMenuKeyboard(lang, isAdmin(userId)),
    });
    return;
  }

  // ── Admin panel tugmasi (menyudan) ───────────────────────────────────────
  if (data === "open_admin") {
    await handleAdminCommand(bot, { from: query.from, chat: { id: chatId } });
    return;
  }

  // ── Admin callback'lari ───────────────────────────────────────────────────
  if (data.startsWith("admin_")) {
    await handleAdminCallback(bot, query, userStates);
    return;
  }

  // Til olish
  const lang = await getUserLang(userId) || "uz";

  // ── Asosiy menyu callback'lari ────────────────────────────────────────────
  if (data === "menu_prices") {
    const settings = await getSettings();
    const text = settings.prices
      ? `${t(lang, "pricesTitle")}\n\n${settings.prices}`
      : t(lang, "noPrices");

    bot.editMessageText(text, {
      chat_id: chatId,
      message_id: msgId,
      parse_mode: "HTML",
      reply_markup: { inline_keyboard: [[{ text: t(lang, "menu").back, callback_data: "menu_back" }]] },
    });
    return;
  }

  if (data === "menu_hours") {
    const settings = await getSettings();
    const text = settings.workingHours
      ? `${t(lang, "hoursTitle")}\n\n${settings.workingHours}`
      : t(lang, "noHours");

    bot.editMessageText(text, {
      chat_id: chatId,
      message_id: msgId,
      parse_mode: "HTML",
      reply_markup: { inline_keyboard: [[{ text: t(lang, "menu").back, callback_data: "menu_back" }]] },
    });
    return;
  }

  if (data === "menu_address") {
    const settings = await getSettings();

    if (!settings.address) {
      bot.editMessageText(t(lang, "noAddress"), {
        chat_id: chatId,
        message_id: msgId,
        reply_markup: { inline_keyboard: [[{ text: t(lang, "menu").back, callback_data: "menu_back" }]] },
      });
      return;
    }

    const keyboard = { inline_keyboard: [] };
    if (settings.mapsLink) {
      keyboard.inline_keyboard.push([{ text: t(lang, "mapsLink"), url: settings.mapsLink }]);
    }
    keyboard.inline_keyboard.push([{ text: t(lang, "menu").back, callback_data: "menu_back" }]);

    bot.editMessageText(`${t(lang, "addressTitle")}\n\n${settings.address}`, {
      chat_id: chatId,
      message_id: msgId,
      parse_mode: "HTML",
      reply_markup: keyboard,
    });
    return;
  }

  if (data === "menu_contact") {
    const settings = await getSettings();
    const text = settings.phone
      ? `${t(lang, "contactTitle")}\n\n📞 ${settings.phone}`
      : t(lang, "noContact");

    bot.editMessageText(text, {
      chat_id: chatId,
      message_id: msgId,
      parse_mode: "HTML",
      reply_markup: { inline_keyboard: [[{ text: t(lang, "menu").back, callback_data: "menu_back" }]] },
    });
    return;
  }

  if (data === "menu_photos") {
    const settings = await getSettings();

    if (!settings.photos || settings.photos.length === 0) {
      bot.editMessageText("📸 Hozircha rasmlar yo'q.", {
        chat_id: chatId,
        message_id: msgId,
        reply_markup: { inline_keyboard: [[{ text: t(lang, "menu").back, callback_data: "menu_back" }]] },
      });
      return;
    }

    // Bir rasmdan ko'p bo'lsa media group yuboramiz
    if (settings.photos.length === 1) {
      bot.sendPhoto(chatId, settings.photos[0]);
    } else {
      const mediaGroup = settings.photos.slice(0, 10).map((fileId, i) => ({
        type: "photo",
        media: fileId,
        ...(i === 0 && { caption: "📸 Basseyn Sattar Aji" }),
      }));
      bot.sendMediaGroup(chatId, mediaGroup);
    }

    bot.sendMessage(chatId, "⬇️", {
      reply_markup: { inline_keyboard: [[{ text: t(lang, "menu").back, callback_data: "menu_back" }]] },
    });
    return;
  }

  // ── Sozlamalar ────────────────────────────────────────────────────────────
  if (data === "menu_settings") {
    bot.editMessageText(t(lang, "settingsTitle"), {
      chat_id: chatId,
      message_id: msgId,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: t(lang, "settingsLang"), callback_data: "settings_lang" }],
          [{ text: t(lang, "menu").back,    callback_data: "menu_back" }],
        ],
      },
    });
    return;
  }

  if (data === "settings_lang") {
    bot.editMessageText(t("uz", "chooseLanguage"), {
      chat_id: chatId,
      message_id: msgId,
      reply_markup: langKeyboard(),
    });
    return;
  }

  // ── Joy band qilish ───────────────────────────────────────────────────────
  if (data === "menu_booking") {
    userStates[userId] = { state: "booking_name" };
    bot.sendMessage(chatId, t(lang, "bookingStart"), {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: t(lang, "cancel"), callback_data: "booking_cancel" }]],
      },
    });
    return;
  }

  // Sana tanlash
  if (data.startsWith("bdate_")) {
    const date = data.replace("bdate_", "");
    userStates[userId] = { ...userStates[userId], state: "booking_time", date };
    bot.sendMessage(chatId, t(lang, "bookingTime"), {
      reply_markup: timeKeyboard(lang),
    });
    return;
  }

  // Vaqt tanlash
  if (data.startsWith("btime_")) {
    const time = data.replace("btime_", "");
    userStates[userId] = { ...userStates[userId], state: "booking_people", time };
    bot.sendMessage(chatId, t(lang, "bookingPeople"), {
      reply_markup: peopleKeyboard(lang),
    });
    return;
  }

  // Kishilar soni tanlash
  if (data.startsWith("bpeople_")) {
    const people = data.replace("bpeople_", "");
    const stateInfo = userStates[userId];
    userStates[userId] = { ...stateInfo, state: "booking_final", people };

    const confirmText = t(lang, "bookingConfirm",
      stateInfo.name, stateInfo.phone, stateInfo.date, stateInfo.time, people
    );
    bot.sendMessage(chatId, confirmText, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            { text: t(lang, "confirmYes"), callback_data: "booking_confirm" },
            { text: t(lang, "confirmNo"),  callback_data: "booking_deny" },
          ],
        ],
      },
    });
    return;
  }

  if (data === "booking_cancel") {
    delete userStates[userId];
    const name = query.from.first_name || "Mehmon";
    bot.sendMessage(chatId, t(lang, "bookingCancel"));
    setTimeout(() => {
      bot.sendMessage(chatId, t(lang, "welcome", name), {
        parse_mode: "HTML",
        reply_markup: mainMenuKeyboard(lang, isAdmin(userId)),
      });
    }, 500);
    return;
  }

  // ── Band qilish tasdiqi ───────────────────────────────────────────────────
  if (data === "booking_confirm") {
    const stateInfo = userStates[userId];
    if (!stateInfo || !stateInfo.name || !stateInfo.phone) return;

    // Bazaga saqlaymiz
    const booking = await saveBooking({
      userId,
      username: query.from.username || "",
      firstName: query.from.first_name || "",
      name: stateInfo.name,
      phone: stateInfo.phone,
      date: stateInfo.date || "",
      time: stateInfo.time || "",
      people: stateInfo.people || "",
      language: lang,
    });

    // Adminga Qabul/Rad tugmalari bilan xabar yuboramiz
    const adminText = t("uz", "adminBookingNotify",
      stateInfo.name, stateInfo.phone,
      stateInfo.date, stateInfo.time, stateInfo.people,
      query.from.username, userId
    );
    bot.sendMessage(ADMIN_ID, adminText, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[
          { text: "✅ Qabul qilish", callback_data: `accept_${booking._id}` },
          { text: "❌ Rad etish",    callback_data: `reject_${booking._id}` },
        ]],
      },
    });

    delete userStates[userId];

    bot.editMessageText(t(lang, "bookingSuccess"), {
      chat_id: chatId,
      message_id: msgId,
      parse_mode: "HTML",
    });
    return;
  }

  if (data === "booking_deny") {
    delete userStates[userId];
    bot.editMessageText(t(lang, "bookingCancel"), {
      chat_id: chatId,
      message_id: msgId,
    });
    return;
  }

  // ── Admin: Qabul / Rad etish ──────────────────────────────────────────────
  if (data.startsWith("accept_") || data.startsWith("reject_")) {
    if (!isAdmin(userId)) return;
    const isAccept = data.startsWith("accept_");
    const bookingId = data.replace(isAccept ? "accept_" : "reject_", "");

    const booking = await updateBookingStatus(bookingId, isAccept ? "accepted" : "rejected");

    // Foydalanuvchiga xabar
    if (booking) {
      const userLang = booking.language || "uz";
      const userMsg = isAccept
        ? t(userLang, "bookingAccepted", booking.date, booking.time)
        : t(userLang, "bookingRejected");
      bot.sendMessage(booking.userId, userMsg, { parse_mode: "HTML" });
    }

    // Admin xabarini yangilaymiz
    bot.editMessageReplyMarkup({ inline_keyboard: [] }, {
      chat_id: chatId,
      message_id: msgId,
    });
    bot.sendMessage(chatId, isAccept ? "✅ Qabul qilindi! Foydalanuvchiga xabar yuborildi." : "❌ Rad etildi! Foydalanuvchiga xabar yuborildi.");
    return;
  }

  // ── Orqaga tugmasi ────────────────────────────────────────────────────────
  if (data === "menu_back") {
    const name = query.from.first_name || "Mehmon";
    bot.editMessageText(t(lang, "welcome", name), {
      chat_id: chatId,
      message_id: msgId,
      parse_mode: "HTML",
      reply_markup: mainMenuKeyboard(lang, isAdmin(userId)),
    });
    return;
  }
});

// ─── Matnli xabarlarni qayta ishlash ───────────────────────────────────────
bot.on("message", async (msg) => {
  // Buyruqlarni o'tkazib yuboramiz
  if (msg.text && msg.text.startsWith("/")) return;

  const userId = msg.from.id;
  const chatId = msg.chat.id;
  const text = msg.text;

  // ── Admin rasm yuborish ─────────────────────────────────────────────────
  if (isAdmin(userId) && msg.photo) {
    const handled = await handleAdminPhoto(bot, msg, userStates);
    if (handled) return;
  }

  if (!text) return;

  // ── Admin holatlari ─────────────────────────────────────────────────────
  if (isAdmin(userId)) {
    const handled = await handleAdminState(bot, msg, userStates);
    if (handled) return;
  }

  // ── Mijoz holatlari ─────────────────────────────────────────────────────
  const stateInfo = userStates[userId];
  if (!stateInfo) return;

  const lang = await getUserLang(userId) || "uz";

  // Ism kutilmoqda
  if (stateInfo.state === "booking_name") {
    userStates[userId] = { state: "booking_phone", name: text };
    bot.sendMessage(chatId, t(lang, "bookingPhone"), {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: t(lang, "cancel"), callback_data: "booking_cancel" }]],
      },
    });
    return;
  }

  // Telefon kutilmoqda → sana tanlashga o'tamiz
  if (stateInfo.state === "booking_phone") {
    userStates[userId] = { ...stateInfo, state: "booking_date", phone: text };
    bot.sendMessage(chatId, t(lang, "bookingDate"), {
      reply_markup: dateKeyboard(lang),
    });
    return;
  }
});

// ─── Render va UptimeRobot uchun HTTP server ────────────────────────────────
const http = require("http");
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Bot ishlayapti!");
}).listen(PORT, () => {
  console.log(`🌐 HTTP server ${PORT} portda ishga tushdi`);
});

// ─── MongoDB ga ulanib botni ishga tushiramiz ───────────────────────────────
connectDB().then(() => {
  console.log("✅ Bot tayyor! Foydalanuvchilar yozishi mumkin.");
}).catch((err) => {
  console.error("❌ Xato:", err);
});
