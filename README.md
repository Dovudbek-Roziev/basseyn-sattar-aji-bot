# 🏊 Basseyn Sattar Aji — Telegram Bot

## O'rnatish

### 1. Kutubxonalarni yuklab olish
```bash
npm install
```

### 2. .env faylini to'ldirish
```
BOT_TOKEN=BotFather dan olgan token
ADMIN_ID=Sizning Telegram ID ingiz
MONGO_URI=mongodb://localhost:27017/basseyn
```

### 3. Botni ishga tushirish
```bash
node index.js
```

### Ishlab chiqish uchun (avtomatik qayta ishga tushish)
```bash
npm run dev
```

---

## Buyruqlar

| Buyruq | Tavsif |
|--------|--------|
| `/start` | Botni ishga tushirish |
| `/admin` | Admin panel (faqat admin uchun) |

---

## Admin ID ni qanday bilish

Telegramda [@userinfobot](https://t.me/userinfobot) ga `/start` yuboring.

---

## MongoDB Atlas (bepul bulut)

1. [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas) ga kiring
2. Bepul cluster yarating
3. Connection string oling va MONGO_URI ga qo'ying
