const translations = {
  uz: {
    chooseLanguage: "🌐 Assalomu alaykum!\n\nIltimos, tilni tanlang:",

    welcome: (name) =>
      `👋 Salom, <b>${name}</b>!\n\n` +
      `🏊‍♂️ <b>Basseyn Sattar Aji</b> ga xush kelibsiz!\n\n` +
      `Qurilmalarning barchasi yangi va zamonaviy.\n` +
      `Kattalar va bolalar uchun.\n\n` +
      `📌 Quyidan kerakli bo'limni tanlang:`,

    menu: {
      prices:   "💰 Narxlar",
      hours:    "🕒 Ish vaqti",
      address:  "📍 Manzil",
      booking:  "🏊 Joy band qilish",
      photos:   "📸 Rasmlar",
      contact:  "📞 Bog'lanish",
      settings: "⚙️ Sozlamalar",
      back:     "🔙 Orqaga",
    },

    settingsTitle: "⚙️ <b>Sozlamalar</b>\n\nKerakli bo'limni tanlang:",
    settingsLang:  "🌐 Tilni o'zgartirish",
    currentLang:   "✅ Hozirgi til: O'zbek 🇺🇿",
    langChanged:   "✅ Til muvaffaqiyatli o'zgartirildi!",

    pricesTitle: "💰 <b>Narxlar</b>\n━━━━━━━━━━━━━━━━",
    noPrices:    "⚠️ Narxlar hali kiritilmagan.\n\nIltimos, keyinroq tekshiring.",

    hoursTitle: "🕒 <b>Ish vaqti</b>\n━━━━━━━━━━━━━━━━",
    noHours:    "⚠️ Ish vaqti hali kiritilmagan.\n\nIltimos, keyinroq tekshiring.",

    addressTitle: "📍 <b>Manzil</b>\n━━━━━━━━━━━━━━━━",
    mapsLink:     "🗺 Google Maps da ko'rish",
    noAddress:    "⚠️ Manzil hali kiritilmagan.\n\nIltimos, keyinroq tekshiring.",

    contactTitle: "📞 <b>Bog'lanish</b>\n━━━━━━━━━━━━━━━━",
    noContact:    "⚠️ Telefon raqam hali kiritilmagan.\n\nIltimos, keyinroq tekshiring.",

    noPhotos:      "📸 Hozircha rasmlar yuklanmagan.\n\nIltimos, keyinroq tekshiring.",
    photosCaption: "📸 <b>Basseyn Sattar Aji</b>",

    bookingStart:    "👤 <b>Joy band qilish</b>\n━━━━━━━━━━━━━━━━\n\nIsmingizni kiriting:",
    bookingPhone:    "📱 Telefon raqamingizni ulashing:\n\n<i>Pastdagi tugmani bosing yoki raqamingizni yozing</i>",
    bookingPhoneBtn: "📱 Raqamni ulashish",
    bookingDate:     "📅 <b>Qaysi kuni kelasiz?</b>\n\nKunni tanlang:",
    bookingTime:     "🕐 <b>Qaysi vaqtda kelasiz?</b>\n\nVaqtni tanlang:",
    bookingPeople:   "👥 <b>Necha kishi kelasiz?</b>\n\nSonni tanlang:",
    bookingConfirm:  (name, phone, date, time, people) =>
      `✅ <b>Ma'lumotlaringizni tekshiring:</b>\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `👤 Ism: <b>${name}</b>\n` +
      `📞 Telefon: <b>${phone}</b>\n` +
      `📅 Sana: <b>${date}</b>\n` +
      `🕐 Vaqt: <b>${time}</b>\n` +
      `👥 Kishilar: <b>${people}</b>\n` +
      `━━━━━━━━━━━━━━━━\n\n` +
      `Yuborilsinmi?`,
    bookingSuccess:  "✅ <b>So'rovingiz yuborildi!</b>\n\nAdmin tasdiqlagach, sizga xabar beramiz.\n\n⏳ Odatda 30 daqiqa ichida javob beramiz.",
    bookingAccepted: (date, time) =>
      `🎉 <b>Tabriklaymiz! Bronlovingiz tasdiqlandi!</b>\n\n` +
      `📅 Sana: <b>${date}</b>\n` +
      `🕐 Vaqt: <b>${time}</b>\n\n` +
      `🏊‍♂️ Basseyn Sattar Aji da ko'rishamiz!\n\n` +
      `❓ Savollar bo'lsa — bizga murojaat qiling.`,
    bookingRejected: "😔 <b>Afsuski, so'rovingiz rad etildi.</b>\n\nBoshqa vaqt tanlang yoki biz bilan bog'laning.\n\n📞 Aloqa uchun «Bog'lanish» bo'limiga o'ting.",
    bookingCancel:   "❌ Bekor qilindi.",
    confirmYes:      "✅ Ha, yuborish",
    confirmNo:       "❌ Bekor qilish",
    cancelBtn:       "❌ Bekor qilish",

    adminBookingNotify: (name, phone, date, time, people, username, userId) =>
      `🔔 <b>YANGI BRONLOV!</b>\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `👤 Ism: <b>${name}</b>\n` +
      `📞 Telefon: <b>${phone}</b>\n` +
      `📅 Sana: <b>${date}</b>\n` +
      `🕐 Vaqt: <b>${time}</b>\n` +
      `👥 Kishilar: <b>${people}</b>\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `🆔 @${username || "yo'q"} | ID: ${userId}`,
    adminAccept:   "✅ Qabul qilish",
    adminReject:   "❌ Rad etish",
    adminAccepted: "✅ Tasdiqlandi! Foydalanuvchiga xabar yuborildi.",
    adminRejected: "❌ Rad etildi! Foydalanuvchiga xabar yuborildi.",

    error:  "⚠️ Xatolik yuz berdi. Qaytadan urinib ko'ring.",
    cancel: "❌ Bekor qilish",
  },

  ru: {
    chooseLanguage: "🌐 Assalomu alaykum!\n\nПожалуйста, выберите язык:",

    welcome: (name) =>
      `👋 Привет, <b>${name}</b>!\n\n` +
      `🏊‍♂️ Добро пожаловать в <b>Бассейн Саттар Ажи</b>!\n\n` +
      `Всё оборудование новое и современное.\n` +
      `Для взрослых и детей.\n\n` +
      `📌 Выберите нужный раздел:`,

    menu: {
      prices:   "💰 Цены",
      hours:    "🕒 Часы работы",
      address:  "📍 Адрес",
      booking:  "🏊 Забронировать место",
      photos:   "📸 Фотографии",
      contact:  "📞 Контакты",
      settings: "⚙️ Настройки",
      back:     "🔙 Назад",
    },

    settingsTitle: "⚙️ <b>Настройки</b>\n\nВыберите раздел:",
    settingsLang:  "🌐 Изменить язык",
    currentLang:   "✅ Текущий язык: Русский 🇷🇺",
    langChanged:   "✅ Язык успешно изменён!",

    pricesTitle: "💰 <b>Цены</b>\n━━━━━━━━━━━━━━━━",
    noPrices:    "⚠️ Цены ещё не добавлены.\n\nПожалуйста, проверьте позже.",

    hoursTitle: "🕒 <b>Часы работы</b>\n━━━━━━━━━━━━━━━━",
    noHours:    "⚠️ Часы работы ещё не добавлены.\n\nПожалуйста, проверьте позже.",

    addressTitle: "📍 <b>Адрес</b>\n━━━━━━━━━━━━━━━━",
    mapsLink:     "🗺 Открыть в Google Maps",
    noAddress:    "⚠️ Адрес ещё не добавлен.\n\nПожалуйста, проверьте позже.",

    contactTitle: "📞 <b>Контакты</b>\n━━━━━━━━━━━━━━━━",
    noContact:    "⚠️ Номер телефона ещё не добавлен.\n\nПожалуйста, проверьте позже.",

    noPhotos:      "📸 Фотографии ещё не загружены.\n\nПожалуйста, проверьте позже.",
    photosCaption: "📸 <b>Бассейн Саттар Ажи</b>",

    bookingStart:    "👤 <b>Бронирование места</b>\n━━━━━━━━━━━━━━━━\n\nВведите ваше имя:",
    bookingPhone:    "📱 Поделитесь вашим номером телефона:\n\n<i>Нажмите кнопку ниже или введите номер вручную</i>",
    bookingPhoneBtn: "📱 Поделиться номером",
    bookingDate:     "📅 <b>Когда вы придёте?</b>\n\nВыберите день:",
    bookingTime:     "🕐 <b>В какое время придёте?</b>\n\nВыберите время:",
    bookingPeople:   "👥 <b>Сколько человек придёт?</b>\n\nВыберите количество:",
    bookingConfirm:  (name, phone, date, time, people) =>
      `✅ <b>Проверьте ваши данные:</b>\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `👤 Имя: <b>${name}</b>\n` +
      `📞 Телефон: <b>${phone}</b>\n` +
      `📅 Дата: <b>${date}</b>\n` +
      `🕐 Время: <b>${time}</b>\n` +
      `👥 Количество: <b>${people}</b>\n` +
      `━━━━━━━━━━━━━━━━\n\n` +
      `Отправить?`,
    bookingSuccess:  "✅ <b>Заявка отправлена!</b>\n\nУведомим вас после подтверждения.\n\n⏳ Обычно отвечаем в течение 30 минут.",
    bookingAccepted: (date, time) =>
      `🎉 <b>Поздравляем! Ваше бронирование подтверждено!</b>\n\n` +
      `📅 Дата: <b>${date}</b>\n` +
      `🕐 Время: <b>${time}</b>\n\n` +
      `🏊‍♂️ Ждём вас в Бассейне Саттар Ажи!\n\n` +
      `❓ Если есть вопросы — свяжитесь с нами.`,
    bookingRejected: "😔 <b>К сожалению, ваша заявка отклонена.</b>\n\nВыберите другое время или свяжитесь с нами.\n\n📞 Перейдите в раздел «Контакты».",
    bookingCancel:   "❌ Отменено.",
    confirmYes:      "✅ Да, отправить",
    confirmNo:       "❌ Отменить",
    cancelBtn:       "❌ Отменить",

    adminBookingNotify: (name, phone, date, time, people, username, userId) =>
      `🔔 <b>НОВОЕ БРОНИРОВАНИЕ!</b>\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `👤 Имя: <b>${name}</b>\n` +
      `📞 Телефон: <b>${phone}</b>\n` +
      `📅 Дата: <b>${date}</b>\n` +
      `🕐 Время: <b>${time}</b>\n` +
      `👥 Количество: <b>${people}</b>\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `🆔 @${username || "нет"} | ID: ${userId}`,
    adminAccept:   "✅ Подтвердить",
    adminReject:   "❌ Отклонить",
    adminAccepted: "✅ Подтверждено! Пользователь уведомлён.",
    adminRejected: "❌ Отклонено! Пользователь уведомлён.",

    error:  "⚠️ Произошла ошибка. Попробуйте ещё раз.",
    cancel: "❌ Отменить",
  },

  ky: {
    chooseLanguage: "🌐 Assalomu alaykum!\n\nТилди тандаңыз:",

    welcome: (name) =>
      `👋 Салам, <b>${name}</b>!\n\n` +
      `🏊‍♂️ <b>Бассейн Саттар Ажи</b> га кош келиңиз!\n\n` +
      `Бардык жабдыктар жаңы жана заманбап.\n` +
      `Чоңдор жана балдар үчүн.\n\n` +
      `📌 Керектүү бөлүмдү тандаңыз:`,

    menu: {
      prices:   "💰 Баалар",
      hours:    "🕒 Иш убактысы",
      address:  "📍 Дарек",
      booking:  "🏊 Орун брондоо",
      photos:   "📸 Сүрөттөр",
      contact:  "📞 Байланыш",
      settings: "⚙️ Жөндөөлөр",
      back:     "🔙 Артка",
    },

    settingsTitle: "⚙️ <b>Жөндөөлөр</b>\n\nБөлүмдү тандаңыз:",
    settingsLang:  "🌐 Тилди өзгөртүү",
    currentLang:   "✅ Учурдагы тил: Кыргызча 🇰🇬",
    langChanged:   "✅ Тил ийгиликтүү өзгөртүлдү!",

    pricesTitle: "💰 <b>Баалар</b>\n━━━━━━━━━━━━━━━━",
    noPrices:    "⚠️ Баалар азырынча киргизилген эмес.\n\nКийинчерээк текшериңиз.",

    hoursTitle: "🕒 <b>Иш убактысы</b>\n━━━━━━━━━━━━━━━━",
    noHours:    "⚠️ Иш убактысы азырынча киргизилген эмес.\n\nКийинчерээк текшериңиз.",

    addressTitle: "📍 <b>Дарек</b>\n━━━━━━━━━━━━━━━━",
    mapsLink:     "🗺 Google Maps та көрүү",
    noAddress:    "⚠️ Дарек азырынча киргизилген эмес.\n\nКийинчерээк текшериңиз.",

    contactTitle: "📞 <b>Байланыш</b>\n━━━━━━━━━━━━━━━━",
    noContact:    "⚠️ Телефон номери азырынча киргизилген эмес.\n\nКийинчерээк текшериңиз.",

    noPhotos:      "📸 Сүрөттөр азырынча жүктөлгөн эмес.\n\nКийинчерээк текшериңиз.",
    photosCaption: "📸 <b>Бассейн Саттар Ажи</b>",

    bookingStart:    "👤 <b>Орун брондоо</b>\n━━━━━━━━━━━━━━━━\n\nАтыңызды жазыңыз:",
    bookingPhone:    "📱 Телефон номериңизди бөлүшүңүз:\n\n<i>Төмөндөгү баскычты басыңыз же номерди жазыңыз</i>",
    bookingPhoneBtn: "📱 Номерди бөлүшүү",
    bookingDate:     "📅 <b>Кайсы күнү келесиз?</b>\n\nКүндү тандаңыз:",
    bookingTime:     "🕐 <b>Кайсы убакта келесиз?</b>\n\nУбакытты тандаңыз:",
    bookingPeople:   "👥 <b>Нече киши келесиз?</b>\n\nСанды тандаңыз:",
    bookingConfirm:  (name, phone, date, time, people) =>
      `✅ <b>Маалыматтарыңызды текшериңиз:</b>\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `👤 Аты: <b>${name}</b>\n` +
      `📞 Телефон: <b>${phone}</b>\n` +
      `📅 Күн: <b>${date}</b>\n` +
      `🕐 Убакыт: <b>${time}</b>\n` +
      `👥 Адамдар: <b>${people}</b>\n` +
      `━━━━━━━━━━━━━━━━\n\n` +
      `Жөнөтүлсүнбү?`,
    bookingSuccess:  "✅ <b>Суроо-талабыңыз жөнөтүлдү!</b>\n\nТастыктагандан кийин кабарлайбыз.\n\n⏳ Адатта 30 мүнөт ичинде жооп беребиз.",
    bookingAccepted: (date, time) =>
      `🎉 <b>Куттуктайбыз! Броноңуз тастыкталды!</b>\n\n` +
      `📅 Күн: <b>${date}</b>\n` +
      `🕐 Убакыт: <b>${time}</b>\n\n` +
      `🏊‍♂️ Бассейн Саттар Ажи да күтөбүз!\n\n` +
      `❓ Суроолор болсо — биз менен байланышыңыз.`,
    bookingRejected: "😔 <b>Кечиресиз, суроо-талабыңыз четке кагылды.</b>\n\nБашка убакытты тандаңыз же биз менен байланышыңыз.\n\n📞 «Байланыш» бөлүмүнө өтүңүз.",
    bookingCancel:   "❌ Жокко чыгарылды.",
    confirmYes:      "✅ Ооба, жөнөтүү",
    confirmNo:       "❌ Жокко чыгаруу",
    cancelBtn:       "❌ Жокко чыгаруу",

    adminBookingNotify: (name, phone, date, time, people, username, userId) =>
      `🔔 <b>ЖАҢЫ БРОНДОО!</b>\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `👤 Аты: <b>${name}</b>\n` +
      `📞 Телефон: <b>${phone}</b>\n` +
      `📅 Күн: <b>${date}</b>\n` +
      `🕐 Убакыт: <b>${time}</b>\n` +
      `👥 Адамдар: <b>${people}</b>\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `🆔 @${username || "жок"} | ID: ${userId}`,
    adminAccept:   "✅ Тастыктоо",
    adminReject:   "❌ Четке кагуу",
    adminAccepted: "✅ Тастыкталды! Колдонуучуга кабар жөнөтүлдү.",
    adminRejected: "❌ Четке кагылды! Колдонуучуга кабар жөнөтүлдү.",

    error:  "⚠️ Ката кетти. Кайра аракет кылыңыз.",
    cancel: "❌ Жокко чыгаруу",
  },
};

function t(lang, key, ...args) {
  const langData = translations[lang] || translations["uz"];
  const value = langData[key];
  if (typeof value === "function") return value(...args);
  return value !== undefined ? value : (translations["uz"][key] || key);
}

module.exports = { translations, t };
