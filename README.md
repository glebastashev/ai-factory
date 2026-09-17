# ai-factory

Три фронтенд-прототипа сайта ИИ-агентства Макса Люшера для сравнения дизайна первого экрана.

## Версии

1. [Карточки процесса](https://glebastashev.github.io/ai-factory/)
2. [Поток задач](https://glebastashev.github.io/ai-factory/version-2.html)
3. [ИИ-ядро и орбиты](https://glebastashev.github.io/ai-factory/version-3.html)

[Страница сравнения анимаций](https://glebastashev.github.io/ai-factory/animations.html).

Во всех версиях общие блоки, калькулятор эффекта в рублях, модельные кейсы и локальное сохранение брифа. Данные формы не отправляются на сервер.

## Разработка

React + Vite. Node.js 22.

```sh
npm ci
npm run dev
npm test
npm run build
```

Сборка находится в `dist/client`. GitHub Pages публикует папку `docs` из ветки `main`. Перед отправкой изменений выполните `npm run build:pages` и добавьте обновлённую папку `docs` в коммит.

Параметр `SITE_BASE_PATH` задаёт путь размещения сайта; для GitHub Pages команда `build:pages` использует `/ai-factory/`. По умолчанию используется `/`.
