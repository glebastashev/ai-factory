import React from 'react';
import { CheckCircle } from '@phosphor-icons/react';
import './delivery-sections.css';

const launchSteps = [
  {
    title: 'Разобраться в процессе',
    description: 'Посмотрим на объём задач и расходы. Зафиксируем текущие показатели, целевой эффект в рублях и бюджет проверки.',
    output: 'Карта процесса и экономика',
  },
  {
    title: 'Собрать рабочий прототип',
    description: 'Выберем один сценарий и соберём его на примерах ваших данных. Покажем весь путь от запроса до результата.',
    output: 'Прототип',
  },
  {
    title: 'Проверить с вашей командой',
    description: 'Пройдём обычные и сложные ситуации. Сравним стоимость обработки, маржу и качество с исходными показателями.',
    output: 'Протокол проверки',
  },
  {
    title: 'Запустить и развивать',
    description: 'Подключим системы и подготовим инструкции. Будем отслеживать расходы на ИИ, фактический эффект и срок возврата вложений.',
    output: 'План запуска',
  },
];

const handoverItems = [
  {
    title: 'Настроенный сценарий',
    description: 'Рабочая последовательность действий с подключениями и правилами, которые согласовали на старте.',
  },
  {
    title: 'База знаний и источники',
    description: 'Материалы, на которые опирается решение, и порядок их обновления.',
  },
  {
    title: 'Инструкция и разбор с сотрудниками',
    description: 'Покажем, как пользоваться решением, проверять результат и действовать при ошибке.',
  },
  {
    title: 'План сопровождения',
    description: 'Зафиксируем, кто следит за работой, как сообщать о проблемах и согласовывать изменения.',
  },
];

const qualityChecks = [
  {
    title: 'Ответы и источники',
    description: 'Сверим ответы с документами компании. Проверим ссылки на источники и поведение, когда нужных сведений нет.',
    question: 'На чём основан ответ?',
  },
  {
    title: 'Действия по правилам',
    description: 'Проверим, какие данные попадают в заявку, когда запускается действие и где нужно подтверждение сотрудника.',
    question: 'Что решение может делать само?',
  },
  {
    title: 'Передача вопроса человеку',
    description: 'Разберём сложные и спорные запросы. Убедимся, что сотрудник получает вопрос, историю диалога и собранные данные.',
    question: 'Когда подключается сотрудник?',
  },
  {
    title: 'Экономика и качество',
    description: 'На пилоте сравним стоимость одной задачи и долю ошибок до внедрения и после. Учтём оплату ИИ, сопровождения и ручной проверки.',
    question: 'Сколько стоит результат?',
  },
];

export function LaunchProcess() {
  return (
    <section id="process" className="launch-section" aria-labelledby="launch-title">
      <div className="launch-container">
        <header className="launch-heading">
          <div className="launch-heading-copy">
            <p className="launch-eyebrow">Как будем работать</p>
            <h2 id="launch-title" className="launch-title">От первой задачи до запуска</h2>
          </div>
          <p className="launch-intro">Начнём с одного сценария. На каждом этапе будет результат, который можно посмотреть и обсудить.</p>
        </header>
        <ol className="launch-steps" role="list">
          {launchSteps.map((step, index) => (
            <li className="launch-step" key={step.title}>
              <span className="launch-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="launch-step-title">{step.title}</h3>
              <p className="launch-step-description">{step.description}</p>
              <div className="launch-output">
                <span className="launch-output-label">На выходе</span>
                <span className="launch-output-name">{step.output}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function DeliverySection() {
  return (
    <section id="handover" className="delivery-section" aria-labelledby="delivery-title">
      <div className="delivery-container">
        <header className="delivery-heading">
          <p className="delivery-eyebrow">Что передадим команде</p>
          <h2 id="delivery-title" className="delivery-title">Решение остаётся в работе у команды</h2>
          <p className="delivery-intro">Подготовим всё, что понадобится сотрудникам для ежедневной работы. Состав передачи согласуем под вашу задачу.</p>
        </header>
        <ul className="delivery-checklist" role="list">
          {handoverItems.map((item) => (
            <li className="delivery-item" key={item.title}>
              <CheckCircle className="delivery-check" size={29} weight="regular" aria-hidden="true" />
              <div className="delivery-item-copy">
                <h3 className="delivery-item-title">{item.title}</h3>
                <p className="delivery-item-description">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function QualitySection() {
  return (
    <section id="quality" className="quality-section" aria-labelledby="quality-title">
      <div className="quality-container">
        <header className="quality-heading">
          <div className="quality-heading-copy">
            <p className="quality-eyebrow">Проверка перед запуском</p>
            <h2 id="quality-title" className="quality-title">До запуска проверим то, что важно вам</h2>
          </div>
          <p className="quality-intro">Заранее договоримся о критериях. Проверим их на ваших примерах и зафиксируем, что готово к запуску, а что требует доработки.</p>
        </header>
        <ul className="quality-checks" role="list">
          {qualityChecks.map((check) => (
            <li className="quality-check" key={check.title}>
              <p className="quality-question">{check.question}</p>
              <h3 className="quality-check-title">{check.title}</h3>
              <p className="quality-check-description">{check.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
