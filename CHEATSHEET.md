# 🚀 Шпаргалка: Краткая справка

## Быстрые команды

```bash
# Тестирование
npm test              # Запустить все тесты
npm run test:ui       # С UI (удобнее)
npm run test:debug    # Режим отладки

# Claude-Flow
npm run claude:doctor # Исправить проблемы
npm run claude:swarm  # Инициализировать swarm
npm run claude:status # Проверить статус

# Caveman (в Claude Code)
/caveman             # Активировать (default: full)
/caveman lite        # Профессиональный режим
/caveman ultra       # Максимальное сжатие
stop caveman         # Деактивировать

# OpenSpec (в Claude Code)
/openspec-propose        # Предложить изменение
/openspec-apply-change   # Начать реализацию
/openspec-archive-change # Завершить изменение
```

## 🔄 Рабочий процесс (5 шагов)

### 1️⃣ Спецификация
```bash
cp openspec/specs/template.md openspec/specs/my-feature.md
# Отредактируй спецификацию
```

### 2️⃣ Тесты
```bash
# Создай tests/my-feature.spec.ts
# Опиши тесты
```

### 3️⃣ Запуск (упадут)
```bash
npm test
```

### 4️⃣ Реализация
```
# В Claude Code:
Реализуй функцию по спецификации openspec/specs/my-feature.md
Тесты: tests/my-feature.spec.ts
```

### 5️⃣ Проверка
```bash
npm test  # ✓ Все пройдут!
/openspec-archive-change
```

## 💬 Примеры запросов к Claude

### Новая функция
```
Создай страницу профиля пользователя по спецификации openspec/specs/user-profile.md
Тесты в tests/user-profile.spec.ts должны проходить
```

### Исправление бага
```
Почини баг с логином в Safari
Спецификация: openspec/specs/fix-safari-login.md
Воспроизводится: tests/safari-login.spec.ts
Ошибка: click event not firing
```

### Рефакторинг
```
Рефактори модуль аутентификации по openspec/specs/refactor-auth.md
ВАЖНО: Все существующие тесты должны проходить
Никаких изменений в поведении
```

### Добавление тестов
```
Добавь тесты для API endpoint POST /api/users
Спецификация: openspec/specs/users-api.md
Покрой все сценарии: success, validation errors, duplicate email
```

## 📁 Структура файлов

```
openspec/specs/my-feature.md    # Спецификация (требования)
tests/my-feature.spec.ts         # Тесты (критерии приемки)
src/                             # Реализация (создаст Claude)
```

## 🎯 Уровни Caveman

| Команда | Сжатие | Когда использовать |
|---------|--------|-------------------|
| `/caveman lite` | 25-35% | Документация, code review |
| `/caveman` (default) | 50-60% | Ежедневная разработка |
| `/caveman ultra` | 70-75% | Быстрые правки, debug |

## ⚡ Productivity Tips

1. **Всегда начинай со спецификации**
   - Четкие требования = лучшая реализация
   - Тесты = критерии готовности

2. **Используй Caveman для экономии**
   - Долгие сессии: `/caveman`
   - Code review: `/caveman lite`
   - Quick fixes: `/caveman ultra`

3. **Коммити часто**
   - Каждая завершенная фича = коммит
   - Используй `/openspec-archive-change`

4. **Тесты = документация**
   - Названия тестов должны описывать что тестируют
   - Хорошые тесты объясняют поведение системы

5. **Конкретные запросы**
   - ❌ "Создай что-то"
   - ✅ "Создай форму регистрации по openspec/specs/registration.md"

## 🆘 Что делать если...

### Тесты не запускаются
```bash
npx playwright install
npm run test:debug
```

### Claude не понимает
```
Добавь больше деталей:
- Укажи спецификацию
- Укажи тесты
- Опиши ошибку
- Покажи стек-трейс
```

### Caveman мешает
```
stop caveman  # Отключить
/caveman lite  # Более понятный режим
```

### Медленно работает
```bash
npm run claude:doctor  # Перезапустить
/caveman ultra  # Меньше токенов
```

## 📚 Документация

- **Полное руководство**: [WORKFLOW.md](./WORKFLOW.md)
- **Быстрый старт**: [QUICKSTART.md](./QUICKSTART.md)
- **Полная документация**: [README.md](./README.md)
- **Шаблон спецификации**: [openspec/specs/template.md](./openspec/specs/template.md)

## 🎓 Примеры для обучения

1. **Начни с простого**
   ```
   Создай страницу "Hello World" по спецификации openspec/specs/hello-world.md
   ```

2. **Попробуй форму**
   ```
   Создай форму логина по openspec/specs/login-form.md
   Валидация email, пароль, кнопка submit
   ```

3. **API endpoint**
   ```
   Создай GET /api/users по openspec/specs/users-api.md
   Возвращает JSON с пользователями
   ```

---

**Готово! Работай эффективнее 🚀**
