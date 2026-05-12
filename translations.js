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
    bookingDate: "📅 Qaysi kuni kelasiz? Sanani tanlang:",
    bookingTime: "🕐 Qaysi vaqtda kelasiz? Vaqtni tanlang:",
    bookingPeople: "👥 Nechi kishi kelasiz?",
    bookingConfirm: (name, phone, date, time, people) =>
      `✅ <b>Ma'lumotlaringiz:</b>\n\n👤 Ism: ${name}\n📞 Telefon: ${phone}\n📅 Sana: ${date}\n🕐 Vaqt: ${time}\n👥 Kishilar: ${people}\n\nYuborilsinmi?`,
    bookingSuccess: "✅ So'rovingiz yuborildi! Admin tasdiqlagach xabar beramiz.",
    bookingAccepted: (date, time) => `✅ <b>Band qilinishingiz tasdiqlandi!</b>\n\n📅 ${date} kuni 🕐 ${time} da kutamiz!\n\n🏊 Basseyn Sattar Aji`,
    bookingRejected: "❌ <b>Afsuski, so'rovingiz rad etildi.</b>\n\nIltimos, boshqa vaqt tanlang yoki biz bilan bog'laning.",
    bookingCancel: "❌ Bekor qilindi.",
    confirmYes: "✅ Ha, yuborish",
    confirmNo: "❌ Bekor qilish",

    // Admin xabari
    adminBookingNotify: (name, phone, date, time, people, username, userId) =>
      `🔔 <b>Yangi band qilish!</b>\n\n👤 Ism: ${name}\n📞 Telefon: ${phone}\n📅 Sana: ${date}\n🕐 Vaqt: ${time}\n👥 Kishilar: ${people}\n🆔 Telegram: @${username || "yo'q"}\n🔢 User ID: ${userId}`,
    adminAccept: "✅ Qabul qilish",
    adminReject: "❌ Rad etish",
    adminAccepted: "✅ Tasdiqlandi! Foydalanuvchiga xabar yuborildi.",
    adminRejected: "❌ Rad etildi! Foydalanuvchiga xabar yuborildi.",

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
    bookingDate: "📅 В какой день придёте? Выберите дату:",
    bookingTime: "🕐 В какое время придёте? Выберите время:",
    bookingPeople: "👥 Сколько человек придёт?",
    bookingConfirm: (name, phone, date, time, people) =>
      `✅ <b>Ваши данные:</b>\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n📅 Дата: ${date}\n🕐 Время: ${time}\n👥 Количество: ${people}\n\nОтправить?`,
    bookingSuccess: "✅ Заявка отправлена! Уведомим вас после подтверждения.",
    bookingAccepted: (date, time) => `✅ <b>Ваше бронирование подтверждено!</b>\n\n📅 Ждём вас ${date} в 🕐 ${time}!\n\n🏊 Басейн Саттар Ажи`,
    bookingRejected: "❌ <b>К сожалению, ваша заявка отклонена.</b>\n\nПожалуйста, выберите другое время или свяжитесь с нами.",
    bookingCancel: "❌ Отменено.",
    confirmYes: "✅ Да, отправить",
    confirmNo: "❌ Отменить",

    adminBookingNotify: (name, phone, date, time, people, username, userId) =>
      `🔔 <b>Новое бронирование!</b>\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n📅 Дата: ${date}\n🕐 Время: ${time}\n👥 Количество: ${people}\n🆔 Telegram: @${username || "нет"}\n🔢 User ID: ${userId}`,
    adminAccept: "✅ Подтвердить",
    adminReject: "❌ Отклонить",
    adminAccepted: "✅ Подтверждено! Пользователь уведомлён.",
    adminRejected: "❌ Отклонено! Пользователь уведомлён.",

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
    bookingDate: "📅 Кайсы күнү келесиз? Күндү тандаңыз:",
    bookingTime: "🕐 Кайсы убакта келесиз? Убакытты тандаңыз:",
    bookingPeople: "👥 Нече киши келесиз?",
    bookingConfirm: (name, phone, date, time, people) =>
      `✅ <b>Маалыматтарыңыз:</b>\n\n👤 Аты: ${name}\n📞 Телефон: ${phone}\n📅 Күн: ${date}\n🕐 Убакыт: ${time}\n👥 Адамдар: ${people}\n\nЖөнөтүлсүнбү?`,
    bookingSuccess: "✅ Суроо-талабыңыз жөнөтүлдү! Тастыктагандан кийин кабарлайбыз.",
    bookingAccepted: (date, time) => `✅ <b>Броноңуз тастыкталды!</b>\n\n📅 ${date} күнү 🕐 ${time} да күтөбүз!\n\n🏊 Бассейн Саттар Ажи`,
    bookingRejected: "❌ <b>Кечиресиз, суроо-талабыңыз четке кагылды.</b>\n\nБашка убакытты тандаңыз же биз менен байланышыңыз.",
    bookingCancel: "❌ Жокко чыгарылды.",
    confirmYes: "✅ Ооба, жөнөтүү",
    confirmNo: "❌ Жокко чыгаруу",

    adminBookingNotify: (name, phone, date, time, people, username, userId) =>
      `🔔 <b>Жаңы брондоо!</b>\n\n👤 Аты: ${name}\n📞 Телефон: ${phone}\n📅 Күн: ${date}\n🕐 Убакыт: ${time}\n👥 Адамдар: ${people}\n🆔 Telegram: @${username || "жок"}\n🔢 User ID: ${userId}`,
    adminAccept: "✅ Тастыктоо",
    adminReject: "❌ Четке кагуу",
    adminAccepted: "✅ Тастыкталды! Колдонуучуга кабар жөнөтүлдү.",
    adminRejected: "❌ Четке кагылды! Колдонуучуга кабар жөнөтүлдү.",

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
