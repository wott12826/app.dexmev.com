# Firebase Setup Guide

## 🔧 Настройка правил безопасности Firebase

### Проблема
Ошибка "Missing or insufficient permissions" возникает из-за неправильных правил безопасности в Firebase Firestore.

### Решение

#### 1. Откройте Firebase Console
1. Перейдите на https://console.firebase.google.com/
2. Выберите ваш проект `post-ad037`
3. В левом меню выберите **Firestore Database**
4. Перейдите на вкладку **Rules**

#### 2. Обновите правила безопасности
Замените существующие правила на следующие:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to registrationCodes collection
    match /registrationCodes/{document} {
      allow read, write: if true;
    }
    
    // Allow read/write access to users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read, write: if true; // Temporary for development
    }
    
    // Default rule - deny all
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

#### 3. Нажмите "Publish"
После обновления правил нажмите кнопку **Publish** для применения изменений.

### Альтернативные решения

#### Вариант 1: Простой генератор (рекомендуется для тестирования)
Используйте `generate-codes-simple.html` - он работает локально без Firebase:
- Генерирует коды в браузере
- Экспортирует в файлы
- Не требует настройки Firebase

#### Вариант 2: Временные правила (только для разработки)
Если нужно быстро протестировать, используйте временные правила:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ Внимание:** Эти правила разрешают доступ всем пользователям. Используйте только для разработки!

### Проверка работы

1. После обновления правил подождите 1-2 минуты
2. Откройте `generate-codes-firebase.html`
3. Попробуйте сгенерировать коды
4. Если ошибки исчезли - правила работают правильно

### Безопасность в продакшене

Для продакшена рекомендуется использовать более строгие правила:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to registration codes for validation
    match /registrationCodes/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // User can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Файлы для использования

- `generate-codes-simple.html` - Локальный генератор (без Firebase)
- `generate-codes-firebase.html` - Полный генератор с Firebase
- `firestore.rules` - Правила безопасности
- `FIREBASE_SETUP.md` - Это руководство 