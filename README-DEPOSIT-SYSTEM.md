# 🚀 Система автоматического начисления баланса SogentMev

## 📋 Обзор

Система автоматически мониторит депозиты SOL на указанный кошелек и начисляет токены $SOGENT пользователям в соотношении **1 SOL = 1000 токенов**.

## 🏗️ Архитектура

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Phantom       │    │   Deposit       │    │   Firebase      │
│   Wallet        │───▶│   Monitor       │───▶│   Firestore     │
│   (User)        │    │   (Node.js)     │    │   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   SOL Deposit   │    │   Balance       │    │   User Profile  │
│   Transaction   │    │   Update        │    │   Update        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## ⚙️ Настройка

### 1. Подготовка Firebase

1. **Скачайте Service Account Key:**
   - Перейдите в [Firebase Console](https://console.firebase.google.com/)
   - Выберите проект `post-ad037`
   - Перейдите в **Project Settings** → **Service Accounts**
   - Нажмите **Generate New Private Key**
   - Сохраните файл как `firebase-service-account.json` в корне проекта

2. **Структура Firestore:**
   ```
   users/
   ├── {userId}/
   │   ├── email: string
   │   ├── balance: number (default: 0)
   │   ├── solanaWallet: string
   │   ├── inviteCode: string
   │   └── createdAt: timestamp
   │
   deposits/
   ├── {depositId}/
   │   ├── userId: string
   │   ├── userEmail: string
   │   ├── senderWallet: string
   │   ├── receivingWallet: string
   │   ├── solAmount: number
   │   ├── tokenReward: number
   │   ├── transactionSignature: string
   │   ├── timestamp: timestamp
   │   └── status: string
   │
   system/
   ├── processedSignatures/
   │   ├── signatures: array
   │   └── lastUpdated: timestamp
   │
   └── monitorStatus/
       ├── timestamp: string
       ├── processedSignaturesCount: number
       ├── receivingWallet: string
       └── connection: string
   ```

### 2. Настройка кошелька для приема депозитов

1. **Создайте новый Solana кошелек** для приема депозитов
2. **Обновите адрес в `deposit-monitor.js`:**
   ```javascript
   const receivingWallet = new PublicKey("ВАШ_НОВЫЙ_АДРЕС_КОШЕЛЬКА");
   ```

### 3. Установка зависимостей

```bash
npm install
```

### 4. Запуск монитора

```bash
# Продакшн
npm start

# Разработка (с автоперезагрузкой)
npm run dev
```

## 🔧 Конфигурация

### Переменные окружения (опционально)

Создайте файл `.env`:
```env
# Firebase
FIREBASE_PROJECT_ID=post-ad037

# Solana
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
RECEIVING_WALLET=YOUR_WALLET_ADDRESS

# Мониторинг
CHECK_INTERVAL=15000
STATUS_UPDATE_INTERVAL=300000
```

### Настройка курса обмена

В файле `deposit-monitor.js` измените курс:
```javascript
// Текущий курс: 1 SOL = 1000 токенов
const reward = Math.floor(solReceived * 1000);

// Например, для курса 1 SOL = 500 токенов:
const reward = Math.floor(solReceived * 500);
```

## 📊 Мониторинг и логи

### Логи монитора
```
🚀 Initializing deposit monitor...
📥 Monitoring wallet: YOUR_WALLET_ADDRESS
✅ Deposit monitor initialized successfully
🔄 Deposit monitoring started
🔍 Checking for new deposits...
💰 0.5 SOL received in transaction ABC123...
📤 Sender: SENDER_WALLET_ADDRESS
✅ Added 500 tokens to user user@example.com (userId123)
📊 New balance: 1500 tokens
```

### Статус системы
Монитор автоматически обновляет статус в Firestore:
```javascript
{
  timestamp: "2024-01-15T10:30:00.000Z",
  processedSignaturesCount: 150,
  receivingWallet: "YOUR_WALLET_ADDRESS",
  connection: "active"
}
```

## 🛡️ Безопасность

### Защита от дублирования
- Все обработанные транзакции сохраняются в Firestore
- При перезапуске монитор загружает уже обработанные подписи
- Дублирование транзакций исключено

### Валидация транзакций
- Проверка, что транзакция действительно содержит SOL
- Валидация адреса отправителя
- Проверка существования пользователя в базе

### Логирование
- Все депозиты логируются в коллекцию `deposits`
- Неизвестные отправители помечаются как `unknown_sender`
- Полная история транзакций для аудита

## 🔄 Интеграция с фронтендом

### Обновленный Firebase API
```javascript
// Получить баланс пользователя
const result = await window.firebaseAuth.getUserBalance(userId);

// Обновить адрес кошелька
await window.firebaseAuth.updateSolanaWallet(userId, walletAddress);

// Найти пользователя по кошельку
const user = await window.firebaseAuth.findUserByWallet(walletAddress);
```

### Автоматическое обновление баланса
- Баланс обновляется каждые 30 секунд
- При подключении кошелька баланс загружается автоматически
- Изменения отображаются в реальном времени

## 🚨 Устранение неполадок

### Монитор не запускается
```bash
# Проверьте наличие файла service account
ls firebase-service-account.json

# Проверьте зависимости
npm list @solana/web3.js firebase-admin

# Проверьте логи
npm start 2>&1 | tee monitor.log
```

### Депозиты не обрабатываются
1. Проверьте правильность адреса кошелька
2. Убедитесь, что монитор запущен
3. Проверьте логи на ошибки
4. Убедитесь, что пользователь подключил кошелек

### Баланс не обновляется
1. Проверьте подключение к Firebase
2. Убедитесь, что пользователь аутентифицирован
3. Проверьте консоль браузера на ошибки

## 📈 Масштабирование

### Для высоких нагрузок
1. **Увеличьте интервал проверки:**
   ```javascript
   setInterval(checkForDeposits, 5000); // Каждые 5 секунд
   ```

2. **Добавьте кэширование:**
   ```javascript
   const userCache = new Map();
   ```

3. **Используйте Cloud Functions:**
   - Разверните монитор как Cloud Function
   - Настройте триггеры по расписанию

### Мониторинг производительности
```javascript
// Добавьте метрики
const startTime = Date.now();
await checkForDeposits();
const duration = Date.now() - startTime;
console.log(`Check completed in ${duration}ms`);
```

## 🔮 Будущие улучшения

- [ ] Поддержка других токенов (USDC, USDT)
- [ ] Веб-интерфейс для администрирования
- [ ] Уведомления о депозитах
- [ ] Аналитика и отчеты
- [ ] Многоуровневая система наград
- [ ] Интеграция с Telegram ботом

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи монитора
2. Убедитесь в правильности конфигурации
3. Проверьте статус Firebase и Solana RPC
4. Обратитесь к документации Solana Web3.js

---

**Версия:** 1.0.0  
**Последнее обновление:** 2024-01-15  
**Автор:** SogentMev Team 