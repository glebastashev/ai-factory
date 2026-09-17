import React, { useId, useRef, useState } from 'react';
import { ArrowRight, ChatCircleDots, Check, Database, FileText, Headset } from '@phosphor-icons/react';
import './task-explorer.css';

const scenarios = [
  {
    id: 'sales',
    label: 'Продажи',
    icon: ChatCircleDots,
    problem: 'Каждую заявку приходится собирать по частям',
    actions: [
      'Уточнять, что нужно клиенту и как с ним связаться.',
      'Искать детали запроса в переписке.',
      'Переносить ответы в карточку клиента.'
    ],
    interest: 'ИИ-менеджер',
    solution: 'Подготовим заявку к разговору с менеджером',
    description: 'Помощник уточняет запрос, собирает контакты и передаёт историю диалога в вашу систему учёта клиентов.',
    result: 'Менеджер открывает заявку с контекстом и понимает, о чём говорить с клиентом дальше.',
    task: 'Хотим поручить ИИ обработку входящих заявок: уточнять запрос, собирать контакты и передавать заявку с историей диалога менеджеру.'
  },
  {
    id: 'support',
    label: 'Поддержка',
    icon: Headset,
    problem: 'Команда снова отвечает на знакомые вопросы',
    actions: [
      'Объяснять условия, доставку и порядок работы.',
      'Находить нужный ответ в инструкциях.',
      'Передавать коллеге сложный вопрос вместе с перепиской.'
    ],
    interest: 'ИИ-помощник',
    solution: 'Соберём помощника по вашим материалам',
    description: 'Он находит ответ в базе знаний и показывает источник. Вопросы, для которых нужен специалист, передаёт вашей команде.',
    result: 'Клиент получает ответ на типовой вопрос. Специалист подключается к обращению с историей разговора.',
    task: 'Нужен ИИ-помощник для поддержки: отвечать на типовые вопросы по нашим материалам и передавать сложные обращения специалисту.'
  },
  {
    id: 'content',
    label: 'Контент',
    icon: FileText,
    problem: 'Экспертиза остаётся в записях и заметках',
    actions: [
      'Переслушивать интервью и выписывать главные мысли.',
      'Готовить из одного материала тексты для разных площадок.',
      'Собирать черновики и передавать их редактору.'
    ],
    interest: 'Контент-фабрика',
    solution: 'Превратим исходный материал в черновики',
    description: 'Контент-фабрика разбирает запись, выделяет идеи и готовит посты, письма и сценарии в нужных форматах.',
    result: 'Редактор получает материалы для проверки фактов, правок и подготовки к публикации.',
    task: 'Хотим собирать из интервью, записей и заметок черновики постов, писем и сценариев для дальнейшей проверки редактором.'
  },
  {
    id: 'operations',
    label: 'Внутренние процессы',
    icon: Database,
    problem: 'За нужной инструкцией идут к коллеге',
    actions: [
      'Искать регламенты в папках и рабочих чатах.',
      'Уточнять у коллег порядок согласования.',
      'Отвечать на повторяющиеся вопросы новых сотрудников.'
    ],
    interest: 'ИИ-помощник',
    solution: 'Поможем находить ответы внутри компании',
    description: 'Подключим помощника к согласованным документам. Сотрудник задаёт вопрос обычными словами и получает ответ со ссылкой на источник.',
    result: 'У сотрудника есть нужная инструкция и документ, по которому можно проверить ответ.',
    task: 'Нужен внутренний ИИ-помощник: находить ответы в регламентах и инструкциях компании и показывать ссылки на исходные документы.'
  }
];

export function TaskExplorer({ onChoose }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef([]);
  const instanceId = useId();
  const headingId = `task-heading-${instanceId}`;
  const tabId = scenario => `task-tab-${instanceId}-${scenario.id}`;
  const panelId = scenario => `task-panel-${instanceId}-${scenario.id}`;

  function handleTabKeyDown(event, index) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;

    let nextIndex;
    switch (event.key) {
      case 'ArrowRight':
        nextIndex = (index + 1) % scenarios.length;
        break;
      case 'ArrowLeft':
        nextIndex = (index - 1 + scenarios.length) % scenarios.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = scenarios.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    setActiveIndex(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <section id="tasks" className="task-section" aria-labelledby={headingId}>
      <div className="task-container">
        <header className="task-heading">
          <div className="task-heading-copy">
            <p className="task-eyebrow">Что можно поручить ИИ</p>
            <h2 id={headingId} className="task-title">Найдите задачу вашей команды</h2>
          </div>
          <p className="task-intro">Выберите направление. Покажем, какую часть работы можно передать помощнику и что получит команда.</p>
        </header>

        <div className="task-tabs" role="tablist" aria-label="Направления работы команды" aria-orientation="horizontal">
          {scenarios.map((scenario, index) => (
            <button
              key={scenario.id}
              ref={node => { tabRefs.current[index] = node; }}
              type="button"
              role="tab"
              id={tabId(scenario)}
              className="task-tab"
              aria-selected={activeIndex === index}
              aria-controls={panelId(scenario)}
              tabIndex={activeIndex === index ? 0 : -1}
              onClick={() => setActiveIndex(index)}
              onKeyDown={event => handleTabKeyDown(event, index)}
            >
              {scenario.label}
            </button>
          ))}
        </div>

        {scenarios.map((scenario, index) => {
          const ScenarioIcon = scenario.icon;
          return (
            <div
              key={scenario.id}
              id={panelId(scenario)}
              className="task-panel"
              role="tabpanel"
              aria-labelledby={tabId(scenario)}
              hidden={activeIndex !== index}
              tabIndex={0}
            >
              <div className="task-problem">
                <div className="task-card-top">
                  <span className="task-label">Знакомая ситуация</span>
                  <ScenarioIcon size={32} weight="regular" aria-hidden="true" />
                </div>
                <h3 className="task-card-title">{scenario.problem}</h3>
                <p className="task-list-label">Сейчас команде приходится:</p>
                <ul className="task-actions">
                  {scenario.actions.map(action => <li key={action}>{action}</li>)}
                </ul>
              </div>

              <div className="task-solution">
                <div className="task-card-top">
                  <span className="task-label">Как можем помочь</span>
                  <span className="task-product">{scenario.interest}</span>
                </div>
                <h3 className="task-card-title">{scenario.solution}</h3>
                <p className="task-description">{scenario.description}</p>
                <div className="task-result">
                  <Check size={23} weight="bold" aria-hidden="true" />
                  <div>
                    <h4 className="task-result-title">Что получает команда</h4>
                    <p>{scenario.result}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="task-cta"
                  onClick={() => onChoose?.({ interest: scenario.interest, task: scenario.task })}
                  aria-label={`Обсудить этот сценарий: ${scenario.label.toLowerCase()}`}
                >
                  <span>Обсудить этот сценарий</span>
                  <ArrowRight size={21} aria-hidden="true" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default TaskExplorer;
