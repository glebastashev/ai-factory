import { assetUrl } from './asset-url';
import React from 'react';
import { ArrowRight, CheckCircle } from '@phosphor-icons/react';
import './case-studies.css';

const formatRubles = (value) => `${new Intl.NumberFormat('ru-RU').format(value)} ₽`;

export const caseStudies = [
  {
    id: 'auto-parts',
    category: 'Продажи · автозапчасти',
    title: 'ИИ-менеджер помогает довести подбор до заказа',
    image: 'editorial-sales-case.png',
    imageAlt: 'Иллюстрация диалога и подготовленной заявки в CRM',
    imageKind: 'interface',
    metric: '150 000 ₽',
    monthlyEffect: 150000,
    effectLabel: 'дополнительный маржинальный доход после расходов на ИИ',
    task: 'Менеджеры вручную уточняют VIN, проверяют каталоги и возвращаются к клиенту с вариантами.',
    scenario: 'VIN или запрос → подбор по каталогу и остаткам → подтверждение → заказ в CRM.',
    summary: 'Помощник собирает параметры, предлагает доступные варианты и передаёт менеджеру подготовленный заказ.',
    context: 'В модельном магазине автозапчастей часть обращений теряется между запросом и подбором. Клиенту нужно уточнить совместимость, цену и наличие, а менеджеру приходится собирать эти данные из нескольких источников.',
    implementation: [
      'Собирать VIN, модификацию автомобиля и запрос клиента в диалоге.',
      'Сверять параметры с каталогом, прайсом и актуальными остатками; предлагать подходящие варианты.',
      'После подтверждения клиента создавать заказ в CRM с выбранными позициями и историей переписки.',
    ],
    humanReview: 'Специалист проверяет неоднозначную совместимость, замены и нестандартные условия. Окончательные действия по оплате и заказу идут по согласованным правилам.',
    measurableResult: 'Считать дополнительные оплаченные заказы относительно сопоставимого периода и маржинальный доход с каждого. В этой модели предполагаем 20 дополнительных заказов в месяц.',
    assumptions: [
      { label: 'Дополнительные оплаченные заказы', value: '20 в месяц', note: 'Условный прирост к исходному уровню при сопоставимом потоке обращений.' },
      { label: 'Маржинальный доход с заказа', value: '9 000 ₽', note: 'После закупки, доставки и других переменных расходов по заказу.' },
      { label: 'Дополнительный маржинальный доход', value: '180 000 ₽', note: '20 заказов × 9 000 ₽.' },
      { label: 'ИИ и сопровождение', value: '−30 000 ₽', note: 'Условный ежемесячный бюджет модели, включая сервисы и поддержку.' },
    ],
    formula: '20 × 9 000 ₽ − 30 000 ₽ = 150 000 ₽/мес.',
    shortFormula: '20 заказов × 9 000 ₽ маржи − 30 000 ₽ расходов',
    effectCondition: 'Эффект появляется, если дополнительные заказы действительно оплачены. Число обращений само по себе в доход не засчитывается.',
    launchCost: 450000,
    paybackMonths: 3,
    launchScope: 'В примере бюджет запуска включает подключение каталога и CRM, сценарий диалога, проверку подбора и передачу команде.',
    interest: 'ИИ-менеджер',
    brief: 'Хочу рассчитать ИИ-менеджера для автозапчастей: запрос или VIN, подбор по каталогу и остаткам, передача заказа в CRM. Нужно проверить экономику на наших заявках и марже.',
  },
  {
    id: 'tourism-editorial',
    category: 'Контент · туризм',
    title: 'ИИ-редакция собирает материалы для отраслевого медиа',
    image: 'editorial-content-case.png',
    imageAlt: 'Иллюстрация подготовки контента из исходного материала',
    imageKind: 'interface',
    metric: '50 000 ₽',
    monthlyEffect: 50000,
    effectLabel: 'сокращение расходов на подготовку контента',
    task: 'Редакция оплачивает подрядчикам сбор новостей, поиск первоисточников и подготовку черновиков.',
    scenario: 'Источники → удаление дублей → отбор тем → черновики со ссылками → редактор.',
    summary: 'Помощник собирает отраслевые материалы и готовит черновики. Редактор проверяет факты и решает, что публиковать.',
    context: 'Условное туристическое медиа ежедневно разбирает несколько источников. Одну новость перепечатывают разные площадки, редактор тратит время на поиск оригинала и первичную подготовку текста.',
    implementation: [
      'Собирать материалы из согласованных отраслевых источников и объединять повторяющиеся новости.',
      'Сортировать темы по редакционным правилам и готовить краткую выжимку со ссылками на оригиналы.',
      'Собирать черновики публикаций в очереди редактора и фиксировать его правки.',
    ],
    humanReview: 'Редактор проверяет даты, цитаты и факты по первоисточнику, оценивает значимость новости и утверждает публикацию.',
    measurableResult: 'Сравнивать расходы на один и тот же объём одобренных материалов. Отдельно отслеживать долю черновиков, которые редактор возвращает на доработку.',
    assumptions: [
      { label: 'Подрядчики до внедрения', value: '100 000 ₽', note: 'Фактически оплачиваемый ежемесячный сбор и подготовка материалов.' },
      { label: 'Редактура после внедрения', value: '−35 000 ₽', note: 'Оставшиеся расходы на проверку и доработку сопоставимого объёма.' },
      { label: 'ИИ и сопровождение', value: '−15 000 ₽', note: 'Условный ежемесячный бюджет сервисов и поддержки.' },
    ],
    formula: '100 000 ₽ − 35 000 ₽ − 15 000 ₽ = 50 000 ₽/мес.',
    shortFormula: '100 000 ₽ до − 35 000 ₽ редактура − 15 000 ₽ ИИ',
    effectCondition: 'Денежная экономия возникает при снижении оплачиваемых расходов на подрядчиков. Объём публикаций и требования редакции в сравнении сохраняются.',
    launchCost: 150000,
    paybackMonths: 3,
    launchScope: 'В примере запуск включает настройку источников, правил отбора, форматов черновиков и очереди проверки редактором.',
    interest: 'Контент-фабрика',
    brief: 'Хочу рассчитать ИИ-редакцию: сбор отраслевых материалов, поиск первоисточников, удаление дублей и черновики для редактора. Нужно сравнить расходы до и после на нашем объёме.',
  },
  {
    id: 'documents-1c',
    category: 'Документы · 1С',
    title: 'Из скана в карточку 1С с проверкой перед записью',
    image: 'editorial-docs.png',
    imageAlt: 'Иллюстрация упорядоченных документов',
    imageKind: 'documents',
    metric: '45 000 ₽',
    monthlyEffect: 45000,
    effectLabel: 'сокращение расходов на обработку документов',
    task: 'Подрядчик переносит реквизиты из PDF и сканов в 1С, вручную проверяя повторные документы.',
    scenario: 'PDF или скан → распознавание → проверка реквизитов и дублей → карточка 1С.',
    summary: 'Система извлекает данные и готовит запись в 1С. Документы с расхождениями попадают на проверку оператору.',
    context: 'В модельной производственной компании документы приходят в разных форматах. Перенос полей и поиск дублей оплачиваются внешнему оператору, а расхождения требуют повторной проверки.',
    implementation: [
      'Распознавать текст PDF и сканов, извлекать согласованные поля документа.',
      'Проверять обязательные реквизиты и искать дубли по заранее заданным признакам.',
      'Создавать или обновлять карточку в 1С после проверки; направлять исключения оператору.',
    ],
    humanReview: 'Оператор разбирает нечитаемые документы, расхождения реквизитов и возможные дубли. Правила автоматической записи согласуются отдельно для каждого типа документа.',
    measurableResult: 'Считать оплачиваемые расходы на обработку при сопоставимом объёме. Контролировать ошибки в полях, долю ручной проверки и повторные записи.',
    assumptions: [
      { label: 'Обработка на аутсорсе до внедрения', value: '90 000 ₽', note: 'Фактически оплачиваемая обработка заданного месячного объёма.' },
      { label: 'Оператор после внедрения', value: '−25 000 ₽', note: 'Оставшиеся расходы на исключения и проверку результатов.' },
      { label: 'ИИ и сопровождение', value: '−20 000 ₽', note: 'Условный ежемесячный бюджет распознавания, сервисов и поддержки.' },
    ],
    formula: '90 000 ₽ − 25 000 ₽ − 20 000 ₽ = 45 000 ₽/мес.',
    shortFormula: '90 000 ₽ до − 25 000 ₽ проверка − 20 000 ₽ ИИ',
    effectCondition: 'В модели уменьшается счёт за обработку документов на аутсорсе. Высвобожденное время штатных сотрудников отдельно в денежный эффект не включено.',
    launchCost: 180000,
    paybackMonths: 4,
    launchScope: 'В примере запуск включает шаблоны извлечения, подключение 1С, правила поиска дублей и маршрут ручной проверки.',
    interest: 'Решение под мою задачу',
    brief: 'Хочу рассчитать обработку PDF и сканов с передачей в 1С: распознавание полей, проверка реквизитов, поиск дублей и работа оператора с исключениями.',
  },
  {
    id: 'bitrix-support',
    category: 'Поддержка · Bitrix24',
    title: 'Помощник отвечает по базе и подключает оператора',
    image: 'editorial-manager.png',
    imageAlt: 'Иллюстрация диалога с помощником',
    imageKind: 'support',
    metric: '40 000 ₽',
    monthlyEffect: 40000,
    effectLabel: 'сокращение расходов на внешние смены поддержки',
    task: 'Команда оплачивает внешние смены, в которых много повторяющихся вопросов по услугам и статусам.',
    scenario: 'Вопрос → база знаний и статус в CRM → ответ → сложный запрос оператору.',
    summary: 'Помощник отвечает на типовые вопросы и передаёт сложные обращения человеку вместе с контекстом.',
    context: 'Модельная сервисная компания ведёт обращения в Bitrix24. Операторы внешней поддержки повторно ищут ответы в базе знаний и проверяют сведения по клиенту.',
    implementation: [
      'Подключить утверждённую базу знаний и разрешённые для сценария данные Bitrix24.',
      'Готовить ответы на типовые вопросы с учётом статуса услуги и доступных сведений.',
      'Обновлять карточку обращения и передавать сложный вопрос оператору по согласованному маршруту.',
    ],
    humanReview: 'Оператор принимает спорные запросы, исключения и обращения, для которых нет подтверждённого ответа. Команда проверяет качество ответов на выборке диалогов.',
    measurableResult: 'Сравнивать фактически оплаченные внешние смены при том же покрытии поддержки. Проверять повторные обращения, корректность ответов и передачу оператору.',
    assumptions: [
      { label: 'Внешние смены до внедрения', value: '100 000 ₽', note: 'Фактические расходы на оплачиваемую внешнюю поддержку в месяц.' },
      { label: 'Внешние смены после внедрения', value: '−40 000 ₽', note: 'Оставшиеся расходы при сопоставимом объёме и покрытии поддержки.' },
      { label: 'ИИ и сопровождение', value: '−20 000 ₽', note: 'Условный ежемесячный бюджет сервисов и поддержки решения.' },
    ],
    formula: '100 000 ₽ − 40 000 ₽ − 20 000 ₽ = 40 000 ₽/мес.',
    shortFormula: '100 000 ₽ до − 40 000 ₽ смены − 20 000 ₽ ИИ',
    effectCondition: 'Экономия появляется при фактическом сокращении расходов на внешние смены. Требования к доступности поддержки и качеству ответов остаются сопоставимыми.',
    launchCost: 160000,
    paybackMonths: 4,
    launchScope: 'В примере запуск включает подготовку базы, подключение Bitrix24, правила ответов и передачу обращений операторам.',
    interest: 'ИИ-помощник',
    brief: 'Хочу рассчитать ИИ-поддержку в Bitrix24: ответы по базе знаний, учёт статуса услуги и передача сложных обращений оператору. Нужно оценить расходы на внешние смены.',
  },
];

export function CaseStudies({ onOpen }) {
  return (
    <section id="projects" className="case-studies" aria-labelledby="case-studies-title">
      <div className="case-container">
        <header className="case-heading">
          <div className="case-heading-copy">
            <p className="case-eyebrow">Модельные кейсы</p>
            <h2 id="case-studies-title" className="case-section-title">Сценарии с расчётом экономики</h2>
          </div>
          <p className="case-intro">Четыре задачи, которые можно передать ИИ. Для каждой считаем месячный эффект и окупаемость.</p>
        </header>
        <div className="case-grid">
          {caseStudies.map((project, index) => (
            <article className={`case-card case-card-${project.imageKind}`} key={project.id}>
              <div className="case-card-topline">
                <span className="case-category">{project.category}</span>
                <span className="case-model-tag">Модель {String(index + 1).padStart(2, '0')}</span>
              </div>
              <div className="case-card-art">
                <img src={assetUrl(project.image)} alt="" loading="lazy" />
              </div>
              <div className="case-card-copy">
                <p className="case-metric-label">Эффект по модели</p>
                <p className="case-metric"><strong>{project.metric}</strong><span>в месяц</span></p>
                <p className="case-effect-label">{project.effectLabel}</p>
                <h3 className="case-card-title">{project.title}</h3>
                <dl className="case-card-summary">
                  <div><dt>Задача</dt><dd>{project.task}</dd></div>
                  <div><dt>Сценарий</dt><dd>{project.scenario}</dd></div>
                </dl>
                <div className="case-card-bottom">
                  <p className="case-card-formula">{project.shortFormula}</p>
                  <button className="case-open-button" type="button" onClick={() => onOpen(project.id)} aria-label={`Смотреть расчёт: ${project.title}`}>
                    Смотреть расчёт <ArrowRight size={21} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="case-section-note">Условия расчёта, расходы на запуск и окупаемость указаны внутри каждого кейса.</p>
      </div>
    </section>
  );
}

export function CaseStudyDetail({ project, onChoose }) {
  if (!project) return null;

  return (
    <article className="case-detail">
      <p className="case-detail-eyebrow">Модельный кейс · {project.category}</p>
      <h2 id="dialog-title" className="case-detail-title">{project.title}</h2>
      <p className="case-detail-intro">{project.summary}</p>
      <div className="case-detail-model-note"><CheckCircle size={22} aria-hidden="true" /><p>Модельный пример: суммы заданы для расчёта и требуют проверки на данных вашего бизнеса.</p></div>
      <img className={`case-detail-art case-detail-art-${project.imageKind}`} src={assetUrl(project.image)} alt={project.imageAlt} />

      <section className="case-detail-section" aria-labelledby={`${project.id}-task`}>
        <h3 id={`${project.id}-task`}>Задача</h3>
        <p>{project.context}</p>
      </section>
      <section className="case-detail-section" aria-labelledby={`${project.id}-solution`}>
        <h3 id={`${project.id}-solution`}>Что внедряем</h3>
        <ol className="case-implementation">
          {project.implementation.map((step) => <li key={step}>{step}</li>)}
        </ol>
      </section>
      <section className="case-detail-section" aria-labelledby={`${project.id}-human`}>
        <h3 id={`${project.id}-human`}>Что проверяет человек</h3>
        <p>{project.humanReview}</p>
      </section>
      <section className="case-detail-section" aria-labelledby={`${project.id}-measurement`}>
        <h3 id={`${project.id}-measurement`}>Как измерять результат</h3>
        <p>{project.measurableResult}</p>
      </section>

      <section className="case-economics" aria-labelledby={`${project.id}-economics`}>
        <header className="case-economics-header">
          <p className="case-detail-eyebrow">Прозрачный расчёт</p>
          <h3 id={`${project.id}-economics`}>Экономика на заданных вводных</h3>
        </header>
        <table className="case-assumptions">
          <caption>Допущения для расчёта за один месяц</caption>
          <thead><tr><th scope="col">Вводная</th><th scope="col">Значение</th></tr></thead>
          <tbody>
            {project.assumptions.map((row) => (
              <tr key={row.label}><th scope="row">{row.label}<span>{row.note}</span></th><td>{row.value}</td></tr>
            ))}
          </tbody>
        </table>
        <div className="case-calculation">
          <p className="case-calculation-formula">{project.formula}</p>
          <p className="case-calculation-result"><strong>{project.metric}</strong><span>месячный эффект после текущих затрат</span></p>
        </div>
        <p className="case-effect-condition">{project.effectCondition}</p>
        <p className="case-calculation-note">Эффект до налогов при заданном объёме. Окупаемость с выхода на этот объём.</p>
      </section>

      <section className="case-detail-section" aria-labelledby={`${project.id}-launch`}>
        <h3 id={`${project.id}-launch`}>Запуск и окупаемость в модели</h3>
        <dl className="case-payback">
          <div><dt>Условный бюджет запуска</dt><dd>{formatRubles(project.launchCost)}</dd></div>
          <div><dt>Простая окупаемость</dt><dd>{project.paybackMonths} мес.</dd></div>
        </dl>
        <p className="case-payback-formula">{formatRubles(project.launchCost)} ÷ {formatRubles(project.monthlyEffect)}/мес. = {project.paybackMonths} мес.</p>
        <p>{project.launchScope}</p>
        <p className="case-payback-note">Окупаемость считается с выхода на расчётный режим. Стоимость запуска здесь служит допущением для примера; смету проекта согласуем после разбора задачи.</p>
      </section>

      <button className="case-choose-button" type="button" onClick={() => onChoose({ interest: project.interest, task: project.brief })}>
        Рассчитать на моих данных <ArrowRight size={21} aria-hidden="true" />
      </button>
    </article>
  );
}
