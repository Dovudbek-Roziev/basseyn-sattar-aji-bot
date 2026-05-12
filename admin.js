const { getSettings, updateSetting, getAllBookings, addPhoto, clearPhotos } = require("./database");

const ADMIN_ID = Number(process.env.ADMIN_ID);

function isAdmin(userId) {
  return userId === ADMIN_ID;
}

function adminMenuKeyboard() {
  return {
    inline_keyboard: [
      [{ text: "💰 Narxlarni o'zgartirish",     callback_data: "admin_prices"       }],
      [{ text: "🕒 Ish vaqtini o'zgartirish",    callback_data: "admin_hours"        }],
      [{ text: "📍 Manzilni o'zgartirish",        callback_data: "admin_address"      }],
      [{ text: "📞 Telefon raqamni o'zgartirish", callback_data: "admin_phone"        }],
      [{ text: "📸 Rasm qo'shish",                callback_data: "admin_add_photo"    }],
      [{ text: "🗑 Barcha rasmlarni o'chirish",   callback_data: "admin_clear_photos" }],
      [{ text: "📋 Band qilinganlar ro'yxati",    callback_data: "admin_bookings"     }],
      [{ text: "🏠 Bosh sahifaga",                callback_data: "admin_home"         }],
    ],
  };
}

async function handleAdminCommand(bot, msg) {
  const userId = msg.from.id;
  if (!isAdmin(userId)) {
    return bot.sendMessage(msg.chat.id, "⛔ Sizda admin huquqi yo'q.");
  }

  const settings = await getSettings();
  const photoCount = settings.photos ? settings.photos.length : 0;
  const ok = (val) => val ? "✅" : "❌";

  const text =
    `🔧 <b>Admin Panel — Basseyn Sattar Aji</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `💰 Narxlar:    ${ok(settings.prices)} ${settings.prices ? "kiritilgan" : "kiritilmagan"}\n` +
    `🕒 Ish vaqti:  ${ok(settings.workingHours)} ${settings.workingHours ? "kiritilgan" : "kiritilmagan"}\n` +
    `📍 Manzil:     ${ok(settings.address)} ${settings.address ? "kiritilgan" : "kiritilmagan"}\n` +
    `📞 Telefon:    ${ok(settings.phone)} ${settings.phone ? "kiritilgan" : "kiritilmagan"}\n` +
    `📸 Rasmlar:    ${photoCount > 0 ? `✅ ${photoCount} ta` : "❌ yo'q"}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `Bo'limni tanlang:`;

  bot.sendMessage(msg.chat.id, text, {
    parse_mode: "HTML",
    reply_markup: adminMenuKeyboard(),
  });
}

async function handleAdminCallback(bot, query, userStates, showMainMenu) {
  const userId = query.from.id;
  const chatId = query.message.chat.id;
  const data   = query.data;

  if (!isAdmin(userId)) return;
  bot.answerCallbackQuery(query.id);

  if (data === "admin_home") {
    if (typeof showMainMenu === "function") showMainMenu(bot, query);
    return;
  }

  if (data === "admin_bookings") {
    const bookings = await getAllBookings();
    if (bookings.length === 0) {
      return bot.sendMessage(chatId,
        "📋 <b>Band qilinganlar ro'yxati</b>\n\nHozircha band qilinganlar yo'q.",
        {
          parse_mode: "HTML",
          reply_markup: { inline_keyboard: [[{ text: "🔙 Admin panelga", callback_data: "open_admin" }]] },
        }
      );
    }

    let text = `📋 <b>Band qilinganlar</b> — ${bookings.length} ta\n━━━━━━━━━━━━━━━━━━━━\n\n`;
    for (let i = 0; i < bookings.length; i++) {
      const b = bookings[i];
      const icon = b.status === "accepted" ? "✅" : b.status === "rejected" ? "❌" : "⏳";
      const date = new Date(b.createdAt).toLocaleDateString("uz-UZ");
      const entry =
        `${i + 1}. ${icon} <b>${b.name}</b>\n` +
        `   📞 ${b.phone}\n` +
        `   📅 ${b.date || "—"} | 🕐 ${b.time || "—"} | 👥 ${b.people || "—"}\n` +
        `   🆔 @${b.username || "yo'q"} — ${date}\n\n`;

      if ((text + entry).length > 3800) {
        text += `<i>...va boshqalar</i>`;
        break;
      }
      text += entry;
    }

    return bot.sendMessage(chatId, text, {
      parse_mode: "HTML",
      reply_markup: { inline_keyboard: [[{ text: "🔙 Admin panelga", callback_data: "open_admin" }]] },
    });
  }

  if (data === "admin_clear_photos") {
    await clearPhotos();
    return bot.sendMessage(chatId,
      "🗑 <b>Barcha rasmlar o'chirildi!</b>",
      { parse_mode: "HTML", reply_markup: adminMenuKeyboard() }
    );
  }

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

  const stateMap = {
    admin_prices:  {
      state: "admin_waiting_prices",
      prompt: "💰 <b>Yangi narxlarni kiriting:</b>\n\nMisol:\nKattalar — 30 000 so'm\nBolalar — 15 000 so'm",
    },
    admin_hours: {
      state: "admin_waiting_hours",
      prompt: "🕒 <b>Yangi ish vaqtini kiriting:</b>\n\nMisol:\nDushanba–Juma: 08:00 – 20:00\nShanba–Yakshanba: 09:00 – 18:00",
    },
    admin_address: {
      state: "admin_waiting_address",
      prompt: "📍 <b>Yangi manzilni kiriting:</b>",
    },
    admin_phone: {
      state: "admin_waiting_phone",
      prompt: "📞 <b>Yangi telefon raqamni kiriting:</b>\n\nMisol: +998 90 123 45 67",
    },
  };

  const matched = stateMap[data];
  if (matched) {
    userStates[userId] = { state: matched.state };
    bot.sendMessage(chatId, matched.prompt, { parse_mode: "HTML" });
  }
}

async function handleAdminPhoto(bot, msg, userStates) {
  const userId = msg.from.id;
  const chatId = msg.chat.id;
  const stateInfo = userStates[userId];

  if (!stateInfo || stateInfo.state !== "admin_waiting_photo") return false;
  if (!msg.photo) return false;

  const fileId = msg.photo[msg.photo.length - 1].file_id;
  await addPhoto(fileId);
  bot.sendMessage(chatId, "✅ Rasm saqlandi! Yana rasm yuboring yoki /admin yozing.");
  return true;
}

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
        `<b>🇺🇿</b> Google Maps → Basseynni toping → "Ulashish" → "Havolani nusxalash"\n` +
        `<b>🇷🇺</b> Google Maps → Найдите бассейн → "Поделиться" → "Копировать ссылку"\n` +
        `<b>🇰🇬</b> Google Maps → Бассейнди табыңыз → "Бөлүшүү" → "Шилтемени көчүрүү"\n\n` +
        `Link yo'q bo'lsa — <b>yo'q</b> deb yozing`,
        { parse_mode: "HTML" }
      );
      return true;

    case "admin_waiting_maps":
      await updateSetting("address", stateInfo.address);
      if (
        text.toLowerCase() !== "yo'q" &&
        text.toLowerCase() !== "йок" &&
        text.toLowerCase() !== "жок"
      ) {
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
