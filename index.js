require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { connectDB, getUserLang, saveUser, getSettings, saveBooking, updateBookingStatus } = require("./database");
const { t } = require("./translations");
const { isAdmin, handleAdminCommand, handleAdminCallback, handleAdminPhoto, handleAdminState } = require("./admin");

const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = Number(process.env.ADMIN_ID);

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const userStates = {};

console.log("🚀 Basseyn Sattar Aji boti ishga tushdi...");

// ─── Klaviaturalar ──────────────────────────────────────────────────────────

function langKeyboard() {
  return {
    inline_keyboard: [[
      { text: "🇺🇿 O'zbek",   callback_data: "lang_uz" },
      { text: "🇷🇺 Русский",  callback_data: "lang_ru" },
      { text: "🇰🇬 Кыргызча", callback_data: "lang_ky" },
    ]],
  };
}

function mainMenuKeyboard(lang, adminUser = false) {
  const m = t(lang, "menu");
  const keyboard = [
    [
      { text: m.prices,  callback_data: "menu_prices" },
      { text: m.hours,   callback_data: "menu_hours"  },
    ],
    [
      { text: m.address, callback_data: "menu_address" },
      { text: m.contact, callback_data: "menu_contact" },
    ],
    [
      { text: m.booking, callback_data: "menu_booking" },
      { text: m.photos,  callback_data: "menu_photos"  },
    ],
    [
      { text: m.settings, callback_data: "menu_settings" },
    ],
  ];
  if (adminUser) {
    keyboard.push([{ text: "⚙️ Admin panel", callback_data: "open_admin" }]);
  }
  return { inline_keyboard: keyboard };
}

function backKeyboard(lang) {
  return {
    inline_keyboard: [[{ text: t(lang, "menu").back, callback_data: "menu_back" }]],
  };
}

// Telefon raqam ulashish uchun reply keyboard
function contactKeyboard(lang) {
  return {
    keyboard: [
      [{ text: t(lang, "bookingPhoneBtn"), request_contact: true }],
      [{ text: t(lang, "cancelBtn") }],
    ],
    resize_keyboard: true,
    one_time_keyboard: true,
  };
}

// Reply keyboardni olib tashlash
function removeKeyboard() {
  return { remove_keyboard: true };
}

function dateKeyboard(lang) {
  const dayNamesMap = {
    uz: ["Yak", "Du", "Se", "Cho", "Pa", "Ju", "Sha"],
    ru: ["Вс",  "Пн", "Вт", "Ср",  "Чт", "Пт", "Сб"],
    ky: ["Жк",  "Дш", "Шш", "Шр",  "Бш", "Жм", "Иш"],
  };
  const names = dayNamesMap[lang] || dayNamesMap.uz;
  const rows = [];
  const row = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const day   = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const label = `${names[d.getDay()]} ${day}.${month}`;
    const value = `${day}.${month}.${d.getFullYear()}`;
    row.push({ text: label, callback_data: `bdate_${value}` });
    if (row.length === 4) { rows.push([...row]); row.length = 0; }
  }
  if (row.length) rows.push([...row]);
  rows.push([{ text: t(lang, "cancel"), callback_data: "booking_cancel" }]);
  return { inline_keyboard: rows };
}

function timeKeyboard(lang) {
  const times = ["08:00","09:00","10:00","11:00","12:00","13:00",
                 "14:00","15:00","16:00","17:00","18:00","19:00","20:00"];
  const rows = [];
  for (let i = 0; i < times.length; i += 4) {
    rows.push(times.slice(i, i + 4).map(tm => ({
      text: tm, callback_data: `btime_${tm}`
    })));
  }
  rows.push([{ text: t(lang, "cancel"), callback_data: "booking_cancel" }]);
  return { inline_keyboard: rows };
}

function peopleKeyboard(lang) {
  return {
    inline_keyboard: [
      [
        { text: "1 👤", callback_data: "bpeople_1" },
        { text: "2 👥", callback_data: "bpeople_2" },
        { text: "3 👥", callback_data: "bpeople_3" },
        { text: "4 👥", callback_data: "bpeople_4" },
      ],
      [
        { text: "5 👥", callback_data: "bpeople_5" },
        { text: "6 👥", callback_data: "bpeople_6" },
        { text: "7+ 👥",callback_data: "bpeople_7+" },
      ],
      [{ text: t(lang, "cancel"), callback_data: "booking_cancel" }],
    ],
  };
}

// ─── Yordamchi funksiya: asosiy menyuni ko'rsatish ─────────────────────────
async function showMainMenu(bot, chatId, userId, firstName) {
  const lang = await getUserLang(userId) || "uz";
  const name = firstName || "Mehmon";
  bot.sendMessage(chatId, t(lang, "welcome", name), {
    parse_mode: "HTML",
    reply_markup: mainMenuKeyboard(lang, isAdmin(userId)),
  });
}

// ─── /start ─────────────────────────────────────────────────────────────────
bot.onText(/\/start/, async (msg) => {
  const userId = msg.from.id;
  const chatId = msg.chat.id;
  delete userStates[userId];

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

// ─── /admin ──────────────────────────────────────────────────────────────────
bot.onText(/\/admin/, async (msg) => {
  await handleAdminCommand(bot, msg);
});

// ─── Callback query'lar ───────────────────────────────────────────────────
bot.on("callback_query", async (query) => {
  const userId = query.from.id;
  const chatId = query.message.chat.id;
  const msgId  = query.message.message_id;
  const data   = query.data;

  bot.answerCallbackQuery(query.id);

  // ── Til tanlash ─────────────────────────────────────────────────────────
  if (data.startsWith("lang_")) {
    const lang = data.split("_")[1];
    const name = query.from.first_name || "Mehmon";
    await saveUser(userId, query.from.username || "", name, lang);
    bot.editMessageText(t(lang, "welcome", name), {
      chat_id: chatId, message_id: msgId,
      parse_mode: "HTML",
      reply_markup: mainMenuKeyboard(lang, isAdmin(userId)),
    });
    return;
  }

  // ── Admin panel (menyudan) ───────────────────────────────────────────────
  if (data === "open_admin") {
    await handleAdminCommand(bot, { from: query.from, chat: { id: chatId } });
    return;
  }

  // ── Admin callbacklari ───────────────────────────────────────────────────
  if (data.startsWith("admin_")) {
    await handleAdminCallback(bot, query, userStates, async (bot, query) => {
      await showMainMenu(bot, query.message.chat.id, query.from.id, query.from.first_name);
    });
    return;
  }

  const lang = await getUserLang(userId) || "uz";

  // ── Narxlar ──────────────────────────────────────────────────────────────
  if (data === "menu_prices") {
    const settings = await getSettings();
    const text = settings.prices
      ? `${t(lang, "pricesTitle")}\n\n${settings.prices}`
      : t(lang, "noPrices");
    bot.editMessageText(text, {
      chat_id: chatId, message_id: msgId,
      parse_mode: "HTML",
      reply_markup: backKeyboard(lang),
    });
    return;
  }

  // ── Ish vaqti ────────────────────────────────────────────────────────────
  if (data === "menu_hours") {
    const settings = await getSettings();
    const text = settings.workingHours
      ? `${t(lang, "hoursTitle")}\n\n${settings.workingHours}`
      : t(lang, "noHours");
    bot.editMessageText(text, {
      chat_id: chatId, message_id: msgId,
      parse_mode: "HTML",
      reply_markup: backKeyboard(lang),
    });
    return;
  }

  // ── Manzil ───────────────────────────────────────────────────────────────
  if (data === "menu_address") {
    const settings = await getSettings();
    if (!settings.address) {
      bot.editMessageText(t(lang, "noAddress"), {
        chat_id: chatId, message_id: msgId,
        reply_markup: backKeyboard(lang),
      });
      return;
    }
    const kb = { inline_keyboard: [] };
    if (settings.mapsLink) {
      kb.inline_keyboard.push([{ text: t(lang, "mapsLink"), url: settings.mapsLink }]);
    }
    kb.inline_keyboard.push([{ text: t(lang, "menu").back, callback_data: "menu_back" }]);
    bot.editMessageText(`${t(lang, "addressTitle")}\n\n${settings.address}`, {
      chat_id: chatId, message_id: msgId,
      parse_mode: "HTML",
      reply_markup: kb,
    });
    return;
  }

  // ── Bog'lanish ───────────────────────────────────────────────────────────
  if (data === "menu_contact") {
    const settings = await getSettings();
    const text = settings.phone
      ? `${t(lang, "contactTitle")}\n\n📞 ${settings.phone}`
      : t(lang, "noContact");
    bot.editMessageText(text, {
      chat_id: chatId, message_id: msgId,
      parse_mode: "HTML",
      reply_markup: backKeyboard(lang),
    });
    return;
  }

  // ── Rasmlar ──────────────────────────────────────────────────────────────
  if (data === "menu_photos") {
    const settings = await getSettings();
    if (!settings.photos || settings.photos.length === 0) {
      bot.editMessageText(t(lang, "noPhotos"), {
        chat_id: chatId, message_id: msgId,
        reply_markup: backKeyboard(lang),
      });
      return;
    }
    const photos = settings.photos.slice(0, 10);
    if (photos.length === 1) {
      bot.sendPhoto(chatId, photos[0], {
        caption: t(lang, "photosCaption"),
        parse_mode: "HTML",
        reply_markup: backKeyboard(lang),
      });
    } else {
      const mediaGroup = photos.map((fileId, i) => ({
        type: "photo",
        media: fileId,
        ...(i === 0 && { caption: t(lang, "photosCaption"), parse_mode: "HTML" }),
      }));
      bot.sendMediaGroup(chatId, mediaGroup);
      bot.sendMessage(chatId, "📸", { reply_markup: backKeyboard(lang) });
    }
    return;
  }

  // ── Sozlamalar ───────────────────────────────────────────────────────────
  if (data === "menu_settings") {
    bot.editMessageText(t(lang, "settingsTitle"), {
      chat_id: chatId, message_id: msgId,
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
      chat_id: chatId, message_id: msgId,
      reply_markup: langKeyboard(),
    });
    return;
  }

  // ── Orqaga ───────────────────────────────────────────────────────────────
  if (data === "menu_back") {
    const name = query.from.first_name || "Mehmon";
    bot.editMessageText(t(lang, "welcome", name), {
      chat_id: chatId, message_id: msgId,
      parse_mode: "HTML",
      reply_markup: mainMenuKeyboard(lang, isAdmin(userId)),
    });
    return;
  }

  // ── Joy band qilish boshlash ──────────────────────────────────────────────
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

  // ── Sana tanlash ─────────────────────────────────────────────────────────
  if (data.startsWith("bdate_")) {
    const date = data.replace("bdate_", "");
    userStates[userId] = { ...userStates[userId], state: "booking_time", date };
    bot.sendMessage(chatId, t(lang, "bookingTime"), {
      reply_markup: timeKeyboard(lang),
    });
    return;
  }

  // ── Vaqt tanlash ─────────────────────────────────────────────────────────
  if (data.startsWith("btime_")) {
    const time = data.replace("btime_", "");
    userStates[userId] = { ...userStates[userId], state: "booking_people", time };
    bot.sendMessage(chatId, t(lang, "bookingPeople"), {
      reply_markup: peopleKeyboard(lang),
    });
    return;
  }

  // ── Kishilar soni tanlash ─────────────────────────────────────────────────
  if (data.startsWith("bpeople_")) {
    const people = data.replace("bpeople_", "");
    const stateInfo = userStates[userId] || {};
    userStates[userId] = { ...stateInfo, state: "booking_final", people };
    const confirmText = t(lang, "bookingConfirm",
      stateInfo.name, stateInfo.phone, stateInfo.date, stateInfo.time, people
    );
    bot.sendMessage(chatId, confirmText, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[
          { text: t(lang, "confirmYes"), callback_data: "booking_confirm" },
          { text: t(lang, "confirmNo"),  callback_data: "booking_deny" },
        ]],
      },
    });
    return;
  }

  // ── Band qilishni bekor qilish ────────────────────────────────────────────
  if (data === "booking_cancel") {
    delete userStates[userId];
    bot.sendMessage(chatId, t(lang, "bookingCancel"), {
      reply_markup: removeKeyboard(),
    });
    await showMainMenu(bot, chatId, userId, query.from.first_name);
    return;
  }

  // ── Band qilishni tasdiqlash ──────────────────────────────────────────────
  if (data === "booking_confirm") {
    const stateInfo = userStates[userId];
    if (!stateInfo || !stateInfo.name || !stateInfo.phone) return;

    const booking = await saveBooking({
      userId,
      username:  query.from.username  || "",
      firstName: query.from.first_name || "",
      name:      stateInfo.name,
      phone:     stateInfo.phone,
      date:      stateInfo.date   || "",
      time:      stateInfo.time   || "",
      people:    stateInfo.people || "",
      language:  lang,
    });

    const adminText = t("uz", "adminBookingNotify",
      stateInfo.name, stateInfo.phone,
      stateInfo.date, stateInfo.time, stateInfo.people,
      query.from.username, userId
    );
    bot.sendMessage(ADMIN_ID, adminText, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[
          { text: t("uz", "adminAccept"), callback_data: `accept_${booking._id}` },
          { text: t("uz", "adminReject"), callback_data: `reject_${booking._id}` },
        ]],
      },
    });

    delete userStates[userId];
    bot.editMessageText(t(lang, "bookingSuccess"), {
      chat_id: chatId, message_id: msgId,
      parse_mode: "HTML",
    });
    return;
  }

  // ── Band qilishdan voz kechish ────────────────────────────────────────────
  if (data === "booking_deny") {
    delete userStates[userId];
    bot.editMessageText(t(lang, "bookingCancel"), {
      chat_id: chatId, message_id: msgId,
    });
    await showMainMenu(bot, chatId, userId, query.from.first_name);
    return;
  }

  // ── Admin: Qabul / Rad etish ──────────────────────────────────────────────
  if (data.startsWith("accept_") || data.startsWith("reject_")) {
    if (!isAdmin(userId)) return;
    const isAccept = data.startsWith("accept_");
    const bookingId = isAccept ? data.replace("accept_", "") : data.replace("reject_", "");
    const booking = await updateBookingStatus(bookingId, isAccept ? "accepted" : "rejected");

    if (booking) {
      const userLang = booking.language || "uz";
      const userMsg = isAccept
        ? t(userLang, "bookingAccepted", booking.date, booking.time)
        : t(userLang, "bookingRejected");
      bot.sendMessage(booking.userId, userMsg, { parse_mode: "HTML" });
    }

    bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: msgId });
    bot.sendMessage(chatId,
      isAccept ? t("uz", "adminAccepted") : t("uz", "adminRejected"),
      { parse_mode: "HTML" }
    );
    return;
  }
});

// ─── Matnli xabarlar ─────────────────────────────────────────────────────────
bot.on("message", async (msg) => {
  if (msg.text && msg.text.startsWith("/")) return;

  const userId = msg.from.id;
  const chatId = msg.chat.id;

  // Admin rasm yuborish
  if (isAdmin(userId) && msg.photo) {
    const handled = await handleAdminPhoto(bot, msg, userStates);
    if (handled) return;
  }

  // Admin holatlari (matn)
  if (isAdmin(userId) && msg.text) {
    const handled = await handleAdminState(bot, msg, userStates);
    if (handled) return;
  }

  const stateInfo = userStates[userId];
  if (!stateInfo) return;

  const lang = await getUserLang(userId) || "uz";

  // Bekor qilish matni (reply keyboard dan)
  if (msg.text && msg.text === t(lang, "cancelBtn")) {
    delete userStates[userId];
    bot.sendMessage(chatId, t(lang, "bookingCancel"), {
      reply_markup: removeKeyboard(),
    });
    await showMainMenu(bot, chatId, userId, msg.from.first_name);
    return;
  }

  // Ism kutilmoqda
  if (stateInfo.state === "booking_name") {
    const name = msg.text ? msg.text.trim() : "";
    if (!name) return;
    userStates[userId] = { state: "booking_phone", name };
    bot.sendMessage(chatId, t(lang, "bookingPhone"), {
      parse_mode: "HTML",
      reply_markup: contactKeyboard(lang),
    });
    return;
  }

  // Telefon kutilmoqda — contact yoki matn orqali
  if (stateInfo.state === "booking_phone") {
    let phone = "";

    if (msg.contact) {
      // Telegram contact share orqali
      phone = msg.contact.phone_number || "";
      if (!phone.startsWith("+")) phone = "+" + phone;
    } else if (msg.text) {
      phone = msg.text.trim();
    }

    if (!phone) return;

    userStates[userId] = { ...stateInfo, state: "booking_date", phone };

    // Reply keyboardni olib tashlaymiz va sana tanlatamiz
    bot.sendMessage(chatId, "✅", { reply_markup: removeKeyboard() });
    bot.sendMessage(chatId, t(lang, "bookingDate"), {
      reply_markup: dateKeyboard(lang),
    });
    return;
  }
});

// ─── HTTP server (Render uchun) ──────────────────────────────────────────────
const http = require("http");
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Bot ishlayapti!");
}).listen(PORT, () => {
  console.log(`🌐 HTTP server ${PORT} portda ishga tushdi`);
});

// ─── MongoDB ─────────────────────────────────────────────────────────────────
connectDB().then(() => {
  console.log("✅ Bot tayyor!");
}).catch((err) => {
  console.error("❌ Xato:", err);
});
