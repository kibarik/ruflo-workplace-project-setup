# Serena MCP Integration Design

**Date:** 2026-04-14
**Status:** Draft
**Author:** Claude (ruvnet/claude-flow)
**Type:** Integration Design

---

## Executive Summary

Интеграция [Serena MCP](https://github.com/oraios/serena) в RuFlo V3 для семантического поиска кода и паттернов. **Ключевая цель:** Обогащение контекста задач для повышения качества исполнения за одну сессию.

**Подход:** Serena как дополнительный слой обогащения, не замена существующей системы. Graceful degradation при ошибках, все опционально.

**Сложность:** Средняя (3-5 дней на MVP)
**Риск:** Низкий (легко отключить, есть фоллбэки)

---

## 1. Архитектура

### 1.1 Общий принцип

```
Существующая система (не меняем):
  Hooks → Routing → AgentDB → Skills → Execution

Новый слой (добавляем):
                    ↓
            Serena (обогащение)
                    ↓
         Улучшенные результаты
```

### 1.2 Диаграмма компонентов

```
┌─────────────────────────────────────────────────────────────┐
│  User Prompt                                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  UserPromptSubmit Hook                                      │
│  - Существующий routing (сохранен)                           │
│  - Новое: Serena pattern check                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
        ┌───────────────────┴───────────────────┐
        ↓                                       ↓
┌───────────────┐                     ┌─────────────────┐
│ Существующий   │                     │  Serena Helper   │
│ Workflow       │                     │  (новый skill)   │
│ - AgentDB      │                     │  - onboarding   │
│ - Hooks        │                     │  - pattern find │
│ - Skills       │                     │  - memories     │
└───────────────┘                     └─────────────────┘
        └───────────────────┬───────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Execution                                                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Post-Task Hook                                             │
│  - Существующие действия (сохранены)                        │
│  - Новое: Сохранить паттерны (опционально)                   │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 Ключевые решения

1. **Параллельное выполнение** — Serena не блокирует существующие процессы
2. **Опциональность** — каждая новая проверка отключаема
3. **Безопасное обновление** — изменения изолированы, легко откатить
4. **Graceful degradation** — ошибки Serena не ломают систему

---

## 2. Компоненты

### 2.1 Новый Skill: Serena Helper

**Расположение:** `.claude/skills/serena-helper/SKILL.md`

**Назначение:** Безопасный интерфейс для Serena MCP

**Функции:**
- Проверка onboarding статуса
- Предложение onboarding если нужно
- Поиск паттернов в коде
- Сохранение успешных паттернов

**Триггеры:** Автоматически при `pre-task`, вручную через `/skills`

**Создание:**
```bash
mkdir -p .claude/skills/serena-helper
# Создать SKILL.md с инструкциями
```

### 2.2 Изменения в Hook Handler

**Файл:** `.claude/helpers/hook-handler.cjs`

**Добавить функции:**
```javascript
async function checkSerenaOnboarding(context) {
  // Проверяет: есть ли Serena onboarding данные
  // Возвращает: { hasOnboarding: bool, timestamp: date }
}

async function suggestSerenaOnboarding(context) {
  // Предлагает: "Хотите проиндексировать проект?"
  // Если да → запускает mcp__serena__onboarding
}

async function getSerenaPatterns(context) {
  // Получает паттерны из кэша или Serena
  // Возвращает: { symbols: [], patterns: [] }
}
```

**Интеграция:** Вызов в `pre-task` hook (опционально)

### 2.3 Serena Detector

**Файл:** `.claude/helpers/serena-detector.cjs` (новый)

**Назначение:** Определяет когда Serena полезна

**Функции:**
```javascript
function detectSourceFiles(projectPath) {
  // Возвращает true если есть .ts/.js/.py файлы
}

function checkOnboardingFreshness(projectPath) {
  // Проверяет: устарел ли onboarding (>7 дней)
}

function estimateTaskComplexity(task) {
  // Оценивает сложность задачи (0-1)
}
```

### 2.4 Конфигурация

**Добавить в `.claude/settings.json`:**
```json
{
  "claudeFlow": {
    "serena": {
      "enabled": true,              // Глобальный выключатель
      "autoOnboarding": "ask",      // "ask" | "auto" | "off"
      "patternStorage": true,       // Сохранять паттерны
      "maxMemories": 100,           // Лимит памяти
      "staleDays": 7,               // Устаревание (дни)
      "minComplexity": 0.3,         // Мин. сложность задачи
      "cacheTTL": 3600              // Время кэша (сек)
    }
  }
}
```

---

## 3. Потоки Данных

### 3.1 Onboarding Flow (индексация)

```
SessionStart или pre-task
        ↓
Проверить: есть ли onboarding timestamp?
        ↓
   ┌────┴────┐
   ↓         ↓
Есть        Нет
   ↓         ↓
Проверить:  Предложить:
устарел?   onboarding
(>7 дней)
   ↓
┌────┴────┐
↓         ↓
Свежий    Устарел
   ↓           ↓
Использовать  Предложить:
             переиндексацию
```

**Критерии устаревания:**
- `git rev-parse HEAD` изменился
- Timestamp > 7 дней
- Количество файлов изменилось

**Хранилище статуса:**
```json
// ~/.claude/projects/{project-id}/memory/serena-status.json
{
  "lastOnboarding": "2026-04-14T10:00:00Z",
  "lastIndexCommit": "abc123",
  "patternsStored": 15
}
```

### 3.2 Pattern Discovery Flow (поиск)

```
pre-task
        ↓
Проверить: сложность > 30%? Есть код?
        ↓
   ┌────┴────┐
   ↓         ↓
Да         Нет
   ↓         ↓
Проверить   Пропустить
кэш
   ↓
┌────┴────┐
↓         ↓
Кэш есть  Кэша нет
   ↓           ↓
Использовать  Serena find_symbol
из кэша         ↓
           Сохранить в кэш
           (на 1 час)
```

**Фильтрация задач:**
```javascript
function shouldUseSerena(task) {
  if (task.complexity < 0.3) return false;  // Простые
  if (!hasSourceFiles()) return false;       // Без кода
  return true;                               // Использовать
}
```

**Кэш:**
```json
// ~/.claude/cache/serena-cache.json
{
  "auth-2026-04-14-10": {
    "symbols": ["src/auth/login.ts"],
    "timestamp": "2026-04-14T10:00:00Z",
    "expires": "2026-04-14T11:00:00Z"
  }
}
```

### 3.3 Pattern Storage Flow (сохранение)

```
post-task
        ↓
Задача успешна?
        ↓
   ┌────┴────┐
   ↓         ↓
Да         Нет
   ↓
Явный запрос? ИЛИ auto-save (quality > 0.9)
        ↓
   ┌────┴────┐
   ↓         ↓
Да         Нет
   ↓           ↓
Сохранить   Пропустить
```

**Критерии auto-save:**
- `quality > 0.9`
- `userApproval: true`
- `isNovelPattern(): true`

**Сохранение:**
```javascript
mcp__serena__write_memory(
  key: "pattern-auth-jwt",
  value: "...",
  topic: "patterns/",
  ttl: 30 дней
)
```

### 3.4 Error Handling Flow

```
Любой этап Serena
        ↓
   ┌────┴────┐
   ↓         ↓
Успех    Ошибка
   ↓         ↓
Продолжить  Логировать
               ↓
          Уведомление (once)
               ↓
          Фоллбэк (Grep/Glob)
```

**Принцип:** Ошибки Serena не блокируют выполнение

---

## 4. Обработка Ошибок

### 4.1 Graceful Degradation

```
Уровень 1: Serena работает полностью
        ↓ (ошибка > 5%)
Уровень 2: Serena + фоллбэки
        ↓ (ошибка > 20%)
Уровень 3: Serena отключена
        ↓
Только стандартные методы
```

### 4.2 Timeout Handling

```javascript
async function safeSerenaCall(operation) {
  const timeout = 5000; // 5 секунд

  try {
    return await Promise.race([
      operation(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), timeout)
      )
    ]);
  } catch (error) {
    if (error.message === 'Timeout') {
      logError('Serena timeout');
      return null; // Не блокировать
    }
    throw error;
  }
}
```

### 4.3 Мониторинг

```json
// ~/.claude/projects/{id}/memory/serena-status.json
{
  "state": "healthy",  // healthy | degraded | unavailable
  "lastCheck": "2026-04-14T10:00:00Z",
  "stats": {
    "successfulCalls": 145,
    "failedCalls": 3,
    "fallbackRate": 0.02  // 2% ошибок
  }
}
```

**Alert:** Если `fallbackRate > 10%` → показать предупреждение

---

## 5. Тестирование

### 5.1 Unit тесты

**Файл:** `test/unit/serena-detector.test.ts`

```typescript
test.describe('Serena Detector', () => {
  test('should detect TypeScript project', async () => {
    const hasCode = detectSourceFiles('/project-with-ts');
    expect(hasCode).toBe(true);
  });

  test('should skip docs-only project', async () => {
    const hasCode = detectSourceFiles('/project-with-md-only');
    expect(hasCode).toBe(false);
  });
});
```

### 5.2 Integration тесты

**Файл:** `test/integration/serena-hooks.test.ts`

```typescript
test.describe('Serena Hooks', () => {
  test('pre-task should check onboarding', async ({ page }) => {
    const result = await invokePreTaskHook({
      task: { complexity: 0.5 }
    });
    expect(result.serenaChecked).toBe(true);
  });
});
```

### 5.3 E2E тесты

**Файл:** `tests/features/serena-integration.spec.ts`

```typescript
test.describe('Serena Integration', () => {
  test('should onboard and use results', async ({ page }) => {
    await page.goto('/project/new');
    await page.fill('[data-testid="task-input"]', 'Add auth');
    await page.click('[data-testid="submit"]');

    await expect(page.locator('[data-testid="onboarding-prompt"]'))
      .toBeVisible();

    await page.click('[data-testid="accept-onboarding"]');

    await expect(page.locator('[data-status="onboarding-complete"]'))
      .toBeVisible();
  });

  test('should fallback when Serena unavailable', async ({ page }) => {
    await stopSerenaMCP();

    await page.goto('/project/test');
    await completeTask();

    await expect(page.locator('[data-testid="serena-warning"]'))
      .toBeVisible();

    await expect(page.locator('[data-status="complete"]'))
      .toBeVisible();
  });
});
```

### 5.4 Покрытие

| Сценарий | Тип | Статус |
|----------|-----|--------|
| Onboarding | E2E | 📝 |
| Устаревание | Integration | 📝 |
| Timeout | Unit | 📝 |
| Кэш | Integration | 📝 |
| Pattern save | E2E | 📝 |
| Fallback | E2E | 📝 |

---

## 6. Документация

### 6.1 Структура

```
docs/
├── serena-integration/
│   ├── README.md              # Обзор
│   ├── architecture.md        # Детали
│   ├── configuration.md       # Настройки
│   └── troubleshooting.md     # Проблемы
```

### 6.2 README.md

**Содержимое:**
- Что такое Serena Integration
- Ключевые возможности
- Быстрый старт
- Когда полезна
- Отключение
- Дальнейшее чтение

### 6.3 configuration.md

**Содержимое:**
- Все настройки `settings.json`
- Описание каждой опции
- Примеры конфигурации
- Переменные окружения

### 6.4 troubleshooting.md

**Содержимое:**
- Serena не запускается
- Onboarding не работает
- Медленная работа
- Ложные срабатывания
- Устаревшие результаты
- Логи и диагностика

---

## 7. План Внедрения

### 7.1 Этапы

```
Этап 1: Базовая интеграция (1-2 дня)
├── Создать serena-helper skill
├── Изменить hook-handler.cjs
├── Создать serena-detector.cjs
└── Базовое тестирование

Этап 2: Оптимизация (1 день)
├── Кэширование
├── Фильтрация задач
└── Нагрузочное тестирование

Этап 3: Документация (0.5 дня)
└── Написать 4 файла документации

Этап 4: Тестирование (1 день)
├── Unit тесты
├── Integration тесты
├── E2E тесты
└── Bugfix

Этап 5: Деплой (постоянно)
├── Мониторинг
├── Улучшения
└── Feedback
```

### 7.2 Приоритеты

| Задача | Приоритет | Сложность | Время |
|--------|-----------|-----------|-------|
| Serena Helper Skill | P0 | Низкая | 2ч |
| Hook изменения | P0 | Средняя | 4ч |
| Detector | P1 | Низкая | 2ч |
| Кэширование | P1 | Средняя | 3ч |
| Тесты | P1 | Средняя | 4ч |
| Документация | P2 | Низкая | 2h |

**Рекомендация:** Начать с P0, MVP быстро, затем итерации.

### 7.3 Риски

| Риск | Вероятность | Влияние | Митигация |
|------|------------|---------|-----------|
| Serena MCP нестабилен | Средняя | Высокое | Graceful degradation |
| Проблемы производительностью | Низкая | Среднее | Кэш, фильтрация |
| Onboarding сложности | Низкая | Низкое | Явное управление |

### 7.4 Критерии успеха

**MVP:**
- ✅ Serena Helper работает
- ✅ Onboarding выполняется
- ✅ Pattern discovery функционален
- ✅ Ошибки не ломают систему
- ✅ Базовая документация

**Полная версия:**
- ✅ Кэширование
- ✅ Полное покрытие тестами
- ✅ Детальная документация
- ✅ Метрики и мониторинг
- ✅ Оптимизированная производительность

### 7.5 Обратная совместимость

**Что НЕ меняем:**
- ✅ Существующие hooks
- ✅ AgentDB память
- ✅ Все навыки
- ✅ Конфигурация обратно совместима

**Что добавляем:**
- ✅ Новый skill
- ✅ Новые функции в hooks (опционально)
- ✅ Новая секция в settings.json (опционально)

**Отключение:**
```json
{
  "claudeFlow": {
    "serena": {
      "enabled": false
    }
  }
}
```

---

## 8. Метрики и Мониторинг

### 8.1 Ключевые метрики

| Метрика | Значение |
|---------|----------|
| Время onboarding | 10-30с |
| Время find_symbol | 100-500ms |
| Время кэша | 10-50ms |
| Частота переиндексации | Каждые 7 дней |
| Размер кэша | ~1-5 MB |
| Успешность вызовов | >95% |

### 8.2 Мониторинг

```bash
# Проверить статус
cat ~/.claude/projects/*/memory/serena-status.json

# Статистика кэша
cat ~/.claude/cache/serena-cache.json | jq '.stats'

# Логи ошибок
tail -n 20 ~/.claude/logs/serena-errors.log
```

---

## 9. Следующие Шаги

1. ✅ Дизайн утвержден
2. **Следующий:** Создать план реализации (writing-plans skill)
3. **Затем:** Реализация MVP (Этап 1)
4. **Далее:** Тестирование на этом проекте
5. **Итерации:** Улучшения по feedback
6. **Финал:** Документация и публикация

---

## Приложение А: Примеры Использования

### A.1 Рефакторинг

```
Пользователь: "Рефакторить функцию auth()"
↓
Serena: find_referencing_symbols("auth")
↓
Результат: 15 использований в 8 файлах
↓
Контекст обогащен: список файлов для изменения
```

### A.2 Новая функция

```
Пользователь: "Добавить JWT аутентификацию"
↓
Serena: find_symbol("auth", "jwt")
↓
Результат: Найдено 2 существующих JWT реализации
↓
Контекст: примеры кода, паттерны
```

### A.3 Исследование

```
Пользователь: "Как работает middleware?"
↓
Serena: get_symbols_overview("src/middleware/")
↓
Результат: Дерево всех middleware классов
↓
Контекст: Структура, связи
```

---

## Приложение Б: API Reference

### Б.1 Serena MCP Tools

```javascript
// Onboarding
await mcp__serena__onboarding()

// Поиск символов
await mcp__serena__find_symbol({
  name_path_pattern: "Auth*",
  include_body: false,
  depth: 1
})

// Поиск ссылок
await mcp__serena__find_referencing_symbols({
  name_path: "Auth/login",
  relative_path: "src/auth.ts"
})

// Сохранить память
await mcp__serena__write_memory({
  memory_name: "pattern-auth",
  content: "..."
})

// Прочитать память
await mcp__serena__read_memory({
  memory_name: "pattern-auth"
})
```

### Б.2 Helper Functions

```javascript
// Detector
const hasCode = detectSourceFiles(projectPath);
const isStale = checkOnboardingFreshness(projectPath);
const complexity = estimateTaskComplexity(task);

// Cache
const cached = getCacheKey(taskType);
await setCache(key, value, ttl);

// Safety
const result = await safeSerenaCall(operation);
```

---

**Конец документа**

---

*Этот дизайн документ готов к реализации. После финального утверждения будет создан детальный план реализации.*
