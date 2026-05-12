const { getSettings, updateSetting, getAllBookings, addPhoto, clearPhotos } = require("./database");

const ADMIN_ID = Number(process.env.ADMIN_ID);

function isAdmin(userId) {
  return userId === ADMIN_ID;
}

// ─── Admin panel klaviaturasi ───────────────────────────────────────────────
function adminMenuKeyboard() {
  return {
    inline_keyboard: [
      [{ text: "💰 Narxlarni o'zgartirish",      callback_data: "admin_prices" }],
      [{ text: "🕒 Ish vaqtini o'zgartirish",     callback_data: "admin_hours" }],
      [{ text: "📍 Manzilni o'zgartirish",         callback_data: "admin_address" }],
      [{ text: "📞 Telefon raqamni o'zgartirish",  callback_data: "admin_phone" }],
      [{ text: "📸 Rasm qo'shish",                 callback_data: "admin_add_photo" }],
      [{ text: "🗑 Barcha rasmlarni o'chirish",    callback_data: "admin_clear_photos" }],
      [{ text: "📋 Band qilinganlar ro'yxati",     callback_data: "admin_bookings" }],
      [{ text: "🏠 Bosh sahifaga",                 callback_data: "admin_home" }],
    ],
  };
}

// ─── /admin buyrug'i ────────────────────────────────────────────────────────
async function handleAdminCommand(bot, msg) {
  const userId = msg.from.id;

  if (!isAdmin(userId)) {
    return bot.sendMessage(msg.chat.id, "⛔ Sizda admin huquqi yo'q.");
  }

  const settings = await getSettings();
  const photoCount = settings.photos ? settings.photos.length : 0;

  const text =
    `🔧 <b>Admin Panel — Basseyn Sattar Aji</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `💰 Narxlar: ${settings.prices ? "✅ kiritilgan" : "❌ kiritilmagan"}\n` +
    `🕒 Ish vaqti: ${settings.workingHours ? "✅ kiritilgan" : "❌ kiritilmagan"}\n` +
    `📍 Manzil: ${settings.address ? "✅ kiritilgan" : "❌ kiritilmagan"}\n` +
    `📞 Telefon: ${settings.phone ? "✅ kiritilgan" : "❌ kiritilmagan"}\n` +
    `📸 Rasmlar: ${photoCount > 0 ? `✅ ${photoCount} ta` : "❌ yo'q"}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `Quyidagi bo'limlardan birini tanlang:`;

  bot.sendMessage(msg.chat.id, text, {
    parse_mode: "HTML",
    reply_markup: adminMenuKeyboard(),
  });
}

// ─── Admin callback'larini qayta ishlash ────────────────────────────────────
async function handleAdminCallback(bot, query, userStates, showMainMenu) {
  const userId = query.from.id;
  const chatId = query.message.chat.id;
  const msgId = query.message.message_id;
  const data = query.data;

  if (!isAdmin(userId)) return;

  bot.answerCallbackQuery(query.id);

  // Bosh sahifaga qaytish
  if (data === "admin_home") {
    if (typeof showMainMenu === "function") {
      showMainMenu(bot, query);
    }
    return;
  }

  // Band qilinganlar ro'yxati
  if (data === "admin_bookings") {
    const bookings = await getAllBookings();

    if (bookings.length === 0) {
      return bot.sendMessage(chatId,
        "📋 <b>Band qilinganlar ro'yxati</b>\n\n" +
        "Hozircha band qilinganlar yo'q.",
        {
          parse_mode: "HTML",
          reply_markup: { inline_keyboard: [[{ text: "🔙 Admin panelga", callback_data: "open_admin" }]] },
        }
      );
    }

    let text = `📋 <b>Band qilinganlar ro'yxati</b> (${bookings.length} ta)\n━━━━━━━━━━━━━━━━━━━━\n\n`;
    bookings.forEach((b, i) => {
      const statusIcon = b.status === "accepted" ? "✅" : b.status === "rejected" ? "❌" : "⏳";
      const date = new Date(b.createdAt).toLocaleDateString("uz-UZ");
      text +=
        `${i + 1}. ${statusIcon} <b>${b.name}</b>\n` +
        `   📞 ${b.phone}\n` +
        `   📅 ${b.date || "—"} 🕐 ${b.time || "—"} 👥 ${b.people || "—"}\n` +
        `   🆔 @${b.username || "yo'q"} | ${date}\n\n`;

      // Telegram 4096 belgi chegarasi
      if (text.length > 3500) {
        text += `... va boshqalar`;
        return;
      }
    });

    return bot.sendMessage(chatId, text, {
      parse_mode: "HTML",
      reply_markup: { inline_keyboard: [[{ text: "🔙 Admin panelga", callback_data: "open_admin" }]] },
    });
  }

  // Rasmlarni o'chirish
  if (data === "admin_clear_photos") {
    await clearPhotos();
    return bot.sendMessage(chatId,
      "🗑 <b>Barcha rasmlar o'chirildi!</b>",
      { parse_mode: "HTML", reply_markup: adminMenuKeyboard() }
    );
  }

  // Rasm qo'shish
  if (data === "admin_add_photo") {
    userStates[userId] = { state: "admin_waiting_photo" };
    return bot.sendMessage(chatId,
      "📸 <b>Rasm yuborish rejimi</b>\n\n" +
      "• Bir yoki bir nechta rasm yuboring\n" +
      "• Har bir rasm avtomatik saqlanadi\n" +
      "• Tugatish uchun /admin yozing",
      { parse_mode: "HTML" }
    );
  }

  // O'zgartirish tugmalari
  const stateMap = {
    admin_prices:  { state: "admin_waiting_prices",  prompt: "💰 <b>Narxlarni o'zgartirish</b>\n\nYangi narxlarni kiriting:" },
    admin_hours:   { state: "admin_waiting_hours",   prompt: "🕒 <b>Ish vaqtini o'zgartirish</b>\n\nYangi ish vaqtini kiriting:" },
    admin_address: { state: "admin_waiting_address", prompt: "📍 <b>Manzilni o'zgartirish</b>\n\nYangi manzilni kiriting:" },
    admin_phone:   { state: "admin_waiting_phone",   prompt: "📞 <b>Telefon raqamni o'zgartirish</b>\n\nYangi telefon raqamni kiriting:" },
  };

  const matched = stateMap[data];
  if (matched) {
    userStates[userId] = { state: matched.state };
    bot.sendMessage(chatId, matched.prompt, { parse_mode: "HTML" });
  }
}

// ─── Admin rasm yuborishni qayta ishlash ────────────────────────────────────
async function handleAdminPhoto(bot, msg, userStates) {
  const userId = msg.from.id;
  const chatId = msg.chat.id;
  const stateInfo = userStates[userId];

  if (!stateInfo || stateInfo.state !== "admin_waiting_photo") return false;
  if (!msg.photo) return false;

  const fileId = msg.photo[msg.photo.length - 1].file_id;
  await addPhoto(fileId);
  bot.sendMessage(chatId,
    "✅ Rasm saqlandi!\n\nYana rasm yuboring yoki /admin yozing."
  );
  return true;
}

// ─── Admin holatlarida kelgan xabarlarni qayta ishlash ──────────────────────
async function handleAdminState(bot, msg, userStates) {
  const userId = msg.from.id;
  const chatId = msg.chat.id;
  const text = msg.text;
  const stateInfo = userStates[userId];

  if (!stateInfo) return false;

  switch (stateInfo.state) {
    case "admin_waiting_prices":
      await updateSetting("prices", text);
      delete userStates[userId];
      bot.sendMessage(chatId, "✅ <b>Narxlar yangilandi!</b>", { parse_mode: "HTML", reply_markup: adminMenuKeyboard() });
      return true;

    case "admin_waiting_hours":
      await updateSetting("workingHours", text);
      delete userStates[userId];
      bot.sendMessage(chatId, "✅ <b>Ish vaqti yangilandi!</b>", { parse_mode: "HTML", reply_markup: adminMenuKeyboard() });
      return true;

    case "admin_waiting_address":
      userStates[userId] = { state: "admin_waiting_maps", address: text };
      bot.sendMessage(chatId,
        `📌 <b>Google Maps linkini kiriting:</b>\n\n` +
        `<b>🇺🇿</b> Google Maps → Basseynni toping → "Ulashish" → "Havolani nusxalash"\n\n` +
        `<b>🇷🇺</b> Google Maps → Найдите бассейн → "Поделиться" → "Копировать ссылку"\n\n` +
        `<b>🇰🇬</b> Google Maps → Бассейнди табыңыз → "Бөлүшүү" → "Шилтемени көчүрүү"\n\n` +
        `Link yo'q bo'lsa — <b>yo'q</b> deb yozing`,
        { parse_mode: "HTML" }
      );
      return true;

    case "admin_waiting_maps":
      await updateSetting("address", stateInfo.address);
      if (text.toLowerCase() !== "yo'q" && text.toLowerCase() !== "йок") {
        await updateSetting("mapsLink", text);
      }
      delete userStates[userId];
      bot.sendMessage(chatId, "✅ <b>Manzil yangilandi!</b>", { parse_mode: "HTML", reply_markup: adminMenuKeyboard() });
      return true;

    case "admin_waiting_phone":
      await updateSetting("phone", text);
      delete userStates[userId];
      bot.sendMessage(chatId, "✅ <b>Telefon raqam yangilandi!</b>", { parse_mode: "HTML", reply_markup: adminMenuKeyboard() });
      return true;

    default:
      return false;
  }
}

module.exports = {
  isAdmin,
  handleAdminCommand,
  handleAdminCallback,
  handleAdminPhoto,
  handleAdminState,
};
