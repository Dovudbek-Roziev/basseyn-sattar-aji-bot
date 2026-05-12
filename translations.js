// Barcha matnlar 3 tilda: O'zbek (uz), Rus (ru), Qirg'iz (ky)

const translations = {
  uz: {
    // Til tanlash
    chooseLanguage: "🌐 Tilni tanlang / Выберите язык / Тилди тандаңыз:",

    // Xush kelibsiz
    welcome: (name) =>
      `👋 Salom, ${name}!\n\n🏊 <b>Basseyn Sattar Aji</b> ga xush kelibsiz!\n\nQuyidagi menyudan kerakli bo'limni tanlang:`,

    // Asosiy menyu tugmalari
    menu: {
      prices: "💰 Narxlar",
      hours: "🕒 Ish vaqti",
      address: "📍 Manzil",
      booking: "🏊 Joy band qilish",
      photos: "📸 Rasmlar",
      contact: "📞 Bog'lanish",
      settings: "⚙️ Sozlamalar",
      back: "🔙 Orqaga",
    },

    // Sozlamalar
    settingsTitle: "⚙️ <b>Sozlamalar</b>\n\nQuyidagi bo'limni tanlang:",
    settingsLang: "🌐 Tilni o'zgartirish",
    currentLang: "✅ Hozirgi til: O'zbek 🇺🇿",
    langChanged: "✅ Til o'zgartirildi!",

    // Narxlar
    pricesTitle: "💰 <b>Narxlar:</b>",
    noPrices: "Narxlar hali kiritilmagan.",

    // Ish vaqti
    hoursTitle: "🕒 <b>Ish vaqti:</b>",
    noHours: "Ish vaqti hali kiritilmagan.",

    // Manzil
    addressTitle: "📍 <b>Manzil:</b>",
    mapsLink: "🗺 Google Maps da ko'rish",
    noAddress: "Manzil hali kiritilmagan.",

    // Bog'lanish
    contactTitle: "📞 <b>Bog'lanish:</b>",
    noContact: "Telefon raqam hali kiritilmagan.",

    // Joy band qilish
    bookingStart: "🏊 Joy band qilish uchun ismingizni kiriting:",
    bookingPhone: "📞 Telefon raqamingizni kiriting:",
    bookingConfirm: (name, phone) =>
      `✅ <b>Ma'lumotlaringiz:</b>\n\n👤 Ism: ${name}\n📞 Telefon: ${phone}\n\nYuborilsinmi?`,
    bookingSuccess:
      "✅ So'rovingiz qabul qilindi! Tez orada siz bilan bog'lanamiz.",
    bookingCancel: "❌ Bekor qilindi.",
    confirmYes: "✅ Ha, yuborish",
    confirmNo: "❌ Bekor qilish",

    // Admin xabari (joy band qilinganda)
    adminBookingNotify: (name, phone, username, userId) =>
      `🔔 <b>Yangi band qilish!</b>\n\n👤 Ism: ${name}\n📞 Telefon: ${phone}\n🆔 Telegram: @${username || "yo'q"}\n🔢 User ID: ${userId}`,

    // Xato xabar
    error: "Xatolik yuz berdi. Qaytadan urinib ko'ring.",
    cancel: "❌ Bekor qilish",
  },

  ru: {
    chooseLanguage: "🌐 Tilni tanlang / Выберите язык / Тилди тандаңыз:",

    welcome: (name) =>
      `👋 Привет, ${name}!\n\n🏊 Добро пожаловать в <b>Басейн Саттар Ажи</b>!\n\nВыберите нужный раздел из меню:`,

    menu: {
      prices: "💰 Цены",
      hours: "🕒 Часы работы",
      address: "📍 Адрес",
      booking: "🏊 Забронировать место",
      photos: "📸 Фотографии",
      contact: "📞 Контакты",
      settings: "⚙️ Настройки",
      back: "🔙 Назад",
    },

    settingsTitle: "⚙️ <b>Настройки</b>\n\nВыберите раздел:",
    settingsLang: "🌐 Изменить язык",
    currentLang: "✅ Текущий язык: Русский 🇷🇺",
    langChanged: "✅ Язык изменён!",

    pricesTitle: "💰 <b>Цены:</b>",
    noPrices: "Цены ещё не добавлены.",

    hoursTitle: "🕒 <b>Часы работы:</b>",
    noHours: "Часы работы ещё не добавлены.",

    addressTitle: "📍 <b>Адрес:</b>",
    mapsLink: "🗺 Открыть в Google Maps",
    noAddress: "Адрес ещё не добавлен.",

    contactTitle: "📞 <b>Контакты:</b>",
    noContact: "Номер телефона ещё не добавлен.",

    bookingStart: "🏊 Для бронирования введите ваше имя:",
    bookingPhone: "📞 Введите ваш номер телефона:",
    bookingConfirm: (name, phone) =>
      `✅ <b>Ваши данные:</b>\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n\nОтправить?`,
    bookingSuccess:
      "✅ Ваша заявка принята! Мы свяжемся с вами в ближайшее время.",
    bookingCancel: "❌ Отменено.",
    confirmYes: "✅ Да, отправить",
    confirmNo: "❌ Отменить",

    adminBookingNotify: (name, phone, username, userId) =>
      `🔔 <b>Новое бронирование!</b>\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n🆔 Telegram: @${username || "нет"}\n🔢 User ID: ${userId}`,

    error: "Произошла ошибка. Попробуйте ещё раз.",
    cancel: "❌ Отменить",
  },

  ky: {
    chooseLanguage: "🌐 Tilni tanlang / Выберите язык / Тилди тандаңыз:",

    welcome: (name) =>
      `👋 Салам, ${name}!\n\n🏊 <b>Бассейн Саттар Ажи</b> га кош келиңиз!\n\nТөмөндөгү менюдан керектүү бөлүмдү тандаңыз:`,

    menu: {
      prices: "💰 Баалар",
      hours: "🕒 Иш убактысы",
      address: "📍 Дарек",
      booking: "🏊 Орун брондоо",
      photos: "📸 Сүрөттөр",
      contact: "📞 Байланыш",
      settings: "⚙️ Жөндөөлөр",
      back: "🔙 Артка",
    },

    settingsTitle: "⚙️ <b>Жөндөөлөр</b>\n\nБөлүмдү тандаңыз:",
    settingsLang: "🌐 Тилди өзгөртүү",
    currentLang: "✅ Учурдагы тил: Кыргызча 🇰🇬",
    langChanged: "✅ Тил өзгөртүлдү!",

    pricesTitle: "💰 <b>Баалар:</b>",
    noPrices: "Баалар азырынча киргизилген эмес.",

    hoursTitle: "🕒 <b>Иш убактысы:</b>",
    noHours: "Иш убактысы азырынча киргизилген эмес.",

    addressTitle: "📍 <b>Дарек:</b>",
    mapsLink: "🗺 Google Maps та көрүү",
    noAddress: "Дарек азырынча киргизилген эмес.",

    contactTitle: "📞 <b>Байланыш:</b>",
    noContact: "Телефон номери азырынча киргизилген эмес.",

    bookingStart: "🏊 Орун брондоо үчүн атыңызды жазыңыз:",
    bookingPhone: "📞 Телефон номериңизди жазыңыз:",
    bookingConfirm: (name, phone) =>
      `✅ <b>Маалыматтарыңыз:</b>\n\n👤 Аты: ${name}\n📞 Телефон: ${phone}\n\nЖөнөтүлсүнбү?`,
    bookingSuccess:
      "✅ Суроо-талабыңыз кабыл алынды! Жакында биз сиз менен байланышабыз.",
    bookingCancel: "❌ Жокко чыгарылды.",
    confirmYes: "✅ Ооба, жөнөтүү",
    confirmNo: "❌ Жокко чыгаруу",

    adminBookingNotify: (name, phone, username, userId) =>
      `🔔 <b>Жаңы брондоо!</b>\n\n👤 Аты: ${name}\n📞 Телефон: ${phone}\n🆔 Telegram: @${username || "жок"}\n🔢 User ID: ${userId}`,

    error: "Ката кетти. Кайра аракет кылыңыз.",
    cancel: "❌ Жокко чыгаруу",
  },
};

// Foydalanuvchi tilini olish yordamchi funksiyasi
function t(lang, key, ...args) {
  const langData = translations[lang] || translations["uz"];
  const value = langData[key];
  if (typeof value === "function") return value(...args);
  return value || translations["uz"][key] || key;
}

module.exports = { translations, t };
