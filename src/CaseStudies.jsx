import { assetUrl } from './asset-url';
import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle } from '@phosphor-icons/react';
import './case-studies.css';

const formatRubles = (value) => `${new Intl.NumberFormat('ru-RU').format(value)} ₽`;

export const caseStudies = [
  {
    id: 'b2b-sales',
    category: 'Продажи · B2B-дистрибуция',
    title: 'Из заявки в готовое КП',
    cardSummary: 'ИИ разбирает запрос, подбирает позиции по прайсу и готовит предложение в CRM.',
    scale: '600 запросов в месяц',
    image: 'cases/bitrix-estimate.webp',
    imageAlt: 'Карточка коммерческого предложения в Битрикс24, пример из официальной документации',
    imageKind: 'crm',
    imageSystem: 'Битрикс24 · коммерческое предложение',
    imageSource: 'https://helpdesk.bitrix24.ru/open/23285208/',
    metric: '780 000 ₽',
    monthlyEffect: 780000,
    effectLabel: 'дополнительная маржа в модели',
    calculation: { type: 'sales', volume: 600, baseConversion: 0.20, targetConversion: 0.30, margin: 15000, runningCost: 120000 },
    summary: 'Помощник превращает письмо или Excel-заявку в черновик коммерческого предложения: находит товары, проверяет остатки и готовит сделку в CRM.',
    context: 'Сценарий для дистрибьютора с 600 входящими запросами в месяц. В одном запросе могут быть десятки позиций. Пока менеджер собирает цены и уточняет наличие, часть клиентов заказывает у другого поставщика.',
    implementation: [
      'Разбирать письма и вложения, выделять позиции, количество и требования к поставке.',
      'Сопоставлять запрос с актуальным каталогом, прайсом и остатками. Неоднозначные совпадения отправлять менеджеру.',
      'Собирать черновик КП в CRM, назначать задачу менеджеру и сохранять историю согласования.',
    ],
    humanReview: 'Менеджер подтверждает аналоги, скидки и сроки поставки перед отправкой КП. Цены и наличие берутся из учётной системы; при отсутствии данных система запрашивает уточнение.',
    measurableResult: 'На пилоте сравниваем долю оплаченных заказов при сопоставимом составе запросов, скорость подготовки КП и маржу после возвратов. Рост конверсии с 20% до 30% здесь является проверяемой гипотезой.',
    assumptions: [
      { label: 'Входящие запросы', value: '600 / мес.', note: 'Одинаковый объём и сопоставимое качество заявок до и после.' },
      { label: 'Конверсия в оплаченный заказ', value: '20% → 30%', note: 'Условный рост на 10 процентных пунктов: со 120 до 180 заказов.' },
      { label: 'Маржа одного заказа', value: '15 000 ₽', note: 'После закупки, доставки и переменных расходов.' },
      { label: 'ИИ, интеграции и сопровождение', value: '−120 000 ₽', note: 'Условные текущие расходы за один месяц.' },
    ],
    formula: '600 × (30% − 20%) × 15 000 ₽ − 120 000 ₽ = 780 000 ₽/мес.',
    effectCondition: 'Если конверсия останется 20%, дополнительной маржи не будет, а текущие расходы составят 120 000 ₽/мес. При этих вводных для покрытия текущих расходов нужны 8 дополнительных оплаченных заказов.',
    launchCost: 1560000,
    paybackMonths: 2,
    launchScope: 'Пример бюджета на разбор заявок, сопоставление каталога, интеграции с почтой и CRM, тестирование и обучение команды.',
    interest: 'ИИ-менеджер',
    brief: 'Хочу автоматизировать B2B-заявки: письмо или Excel, подбор по каталогу и остаткам, подготовка КП в CRM. Нужно проверить эффект на нашей конверсии и марже.',
  },
  {
    id: 'documents-1c',
    category: 'Операции · первичные документы',
    title: 'Тысячи документов в 1С',
    cardSummary: 'Распознавание УПД и счетов, сверка реквизитов и очередь исключений для бухгалтера.',
    scale: '18 000 документов в месяц',
    image: 'cases/1c-recognition.webp',
    imageAlt: 'Проверка распознанного УПД в 1С, пример из официальной документации',
    imageKind: 'documents',
    imageSystem: '1С · проверка распознанного документа',
    imageSource: 'https://its.1c.ru/db/content/recognition/src/инструкция%20по%20работе%20с%201с_рпд.htm',
    metric: '504 000 ₽',
    monthlyEffect: 504000,
    effectLabel: 'снижение расходов в модели',
    calculation: { type: 'cost', volume: 18000, beforeUnitCost: 45, manualVolume: 18000, afterUnitCost: 12, runningCost: 90000 },
    summary: 'Поток документов из почты и папок попадает в распознавание. Система сопоставляет реквизиты и номенклатуру, готовит записи в 1С и выделяет спорные документы для проверки.',
    context: 'Сценарий для сети или дистрибьютора с 18 000 первичных документов в месяц. В модели внешний оператор получает оплату за ввод и проверку каждого документа. После автоматизации меняется состав работ и стоимость обработки единицы.',
    implementation: [
      'Собирать PDF, сканы и фотографии из согласованных каналов в единую очередь.',
      'Распознавать поля, сопоставлять контрагентов и позиции, проверять обязательные реквизиты и возможные дубли.',
      'Готовить документы в 1С; расхождения передавать бухгалтеру вместе с исходным сканом и подсветкой полей.',
    ],
    humanReview: 'Бухгалтер проверяет спорные реквизиты, новые позиции и расхождения сумм. Правила проведения документов и права доступа согласуются до запуска.',
    measurableResult: 'Сравниваем фактическую стоимость обработки одного документа при одинаковом качестве. Отдельно контролируем долю возвратов на исправление, пропуски дублей и ошибки в реквизитах.',
    assumptions: [
      { label: 'Объём документов', value: '18 000 / мес.', note: 'Сопоставимый состав и качество файлов в обоих периодах.' },
      { label: 'Ввод и проверка до запуска', value: '45 ₽ / док.', note: '18 000 × 45 ₽ = 810 000 ₽/мес. оплачиваемому оператору.' },
      { label: 'Проверка после запуска', value: '12 ₽ / док.', note: '18 000 × 12 ₽ = 216 000 ₽/мес. за контроль и исправления.' },
      { label: 'Распознавание и сопровождение', value: '−90 000 ₽', note: 'Условные текущие расходы за один месяц.' },
    ],
    formula: '18 000 × (45 ₽ − 12 ₽) − 90 000 ₽ = 504 000 ₽/мес.',
    effectCondition: 'Денежный эффект появится, если действительно уменьшится оплата обработки. Высвобождённое время сотрудников при прежнем фонде оплаты труда учитываем отдельно. Тарифы 45 ₽ и 12 ₽ являются вводными модели.',
    launchCost: 1260000,
    paybackMonths: 2.5,
    launchScope: 'Пример бюджета на подключение каналов, настройку распознавания и справочников, интеграцию с 1С и проверку качества на выборке.',
    interest: 'Решение под мою задачу',
    brief: 'Хочу автоматизировать поток первички в 1С: распознавание, сверка реквизитов, поиск дублей и проверка исключений. Нужно рассчитать затраты на нашем объёме документов.',
  },
  {
    id: 'commerce-support',
    category: 'Поддержка · интернет-магазин',
    title: 'Поддержка с доступом к заказам',
    cardSummary: 'ИИ проверяет статус заказа и отвечает по базе знаний. Спорные вопросы принимает оператор.',
    scale: '18 000 обращений в месяц',
    image: 'cases/chatwoot-inbox.webp',
    imageAlt: 'Диалог оператора в Chatwoot, демонстрационный экран из руководства продукта',
    imageKind: 'support',
    imageSystem: 'Chatwoot · рабочее место оператора',
    imageSource: 'https://www.chatwoot.com/hc/user-guide/articles/1677229173-lesson-1-your-first-chatwoot-conversation',
    metric: '570 000 ₽',
    monthlyEffect: 570000,
    effectLabel: 'снижение расходов в модели',
    calculation: { type: 'cost', volume: 18000, beforeUnitCost: 70, manualVolume: 9000, afterUnitCost: 70, runningCost: 60000 },
    summary: 'Помощник отвечает на вопросы о доставке, оплате и статусе заказа. В спорных случаях передаёт оператору переписку, сведения о заказе и уже выполненные проверки.',
    context: 'Сценарий для интернет-магазина с 18 000 обращениями в месяц и внешней поддержкой с оплатой за обращение. В модели половина запросов полностью решается помощником, вторая половина остаётся у операторов.',
    implementation: [
      'Подключать согласованные каналы общения, базу знаний и разрешённые данные по заказам.',
      'Проверять статус заказа после идентификации клиента и отвечать в рамках утверждённых правил.',
      'Передавать спорные запросы оператору, сохранять историю и отслеживать повторные обращения.',
    ],
    humanReview: 'Оператор решает вопросы возвратов, компенсаций и исключений. При отсутствии подтверждённого ответа помощник передаёт обращение человеку.',
    measurableResult: 'На пилоте проверяем долю обращений, решённых без оператора и повторного обращения по той же теме. Сопоставляем фактические счета подрядчика, качество ответов и удовлетворённость клиентов.',
    assumptions: [
      { label: 'Обращения до запуска', value: '18 000 / мес.', note: 'При тарифе 70 ₽ затраты составляют 1 260 000 ₽/мес.' },
      { label: 'Решено помощником', value: '50%', note: 'Гипотеза пилота: 9 000 обращений без последующей ручной обработки.' },
      { label: 'Обращения оператору', value: '9 000 / мес.', note: '9 000 × 70 ₽ = 630 000 ₽/мес. при прежнем тарифе.' },
      { label: 'ИИ и сопровождение', value: '−60 000 ₽', note: 'Условные текущие расходы за один месяц.' },
    ],
    formula: '18 000 × 70 ₽ − 9 000 × 70 ₽ − 60 000 ₽ = 570 000 ₽/мес.',
    effectCondition: 'Расчёт применим к оплате за обращение. При фиксированной стоимости смен снижение нагрузки может не уменьшить счёт подрядчика. Повторные обращения и ручные доработки включаем в расходы.',
    launchCost: 1140000,
    paybackMonths: 2,
    launchScope: 'Пример бюджета на подготовку базы знаний, подключение заказов и каналов, настройку передачи оператору и проверку диалогов.',
    interest: 'ИИ-помощник',
    brief: 'Хочу ИИ-поддержку интернет-магазина с доступом к статусам заказов и передачей оператору. Нужно проверить долю решённых обращений и экономику на нашем тарифе поддержки.',
  },
];

export function CaseStudies({ onOpen, projects = caseStudies }) {
  const expanded = projects.length > 3;
  const track = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const updateEdges = () => {
    const el = track.current;
    if (el) setEdges({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  };
  useEffect(() => {
    const observer = new ResizeObserver(updateEdges);
    if (track.current) observer.observe(track.current);
    return () => observer.disconnect();
  }, []);
  const move = (direction) => {
    const el = track.current;
    const step = el?.firstElementChild?.getBoundingClientRect().width || 300;
    el?.scrollBy({ left: direction * (step + 20), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  return (
    <section id="projects" className={`case-studies${expanded ? ' case-studies--expanded' : ''}`} aria-labelledby="case-studies-title">
      <div className="case-container">
        <header className="case-heading">
          <div className="case-heading-copy">
            <p className="case-eyebrow">Сценарии внедрения</p>
            <h2 id="case-studies-title" className="case-section-title">ИИ в работе бизнеса</h2>
          </div>
          <p className="case-intro">{expanded ? 'Пять задач для ИИ в бизнесе.' : 'Три процесса с расчётом экономики.'} <br/>Откройте кейс, чтобы увидеть детали.</p>
        </header>
        <div className="case-grid" ref={track} onScroll={updateEdges} aria-label="Кейсы внедрения">
          {projects.map((project, index) => (
            <article className={`case-card case-card-${project.imageKind}`} key={project.id}>
              <div className="case-card-topline">
                <span className="case-category">{project.category}</span>
                <span className="case-number">0{index + 1}</span>
              </div>
              <figure className="case-card-art">
                <img src={assetUrl(project.image)} alt={project.imageAlt} loading="lazy" width="1280" height="760" />
                <figcaption>{project.imageSystem}</figcaption>
              </figure>
              <div className="case-card-copy">
                <h3 className="case-card-title">{project.title}</h3>
                <p className="case-card-description">{project.cardSummary}</p>
                <div className="case-card-outcome">
                  <p className="case-metric"><strong>{project.metric}</strong><span>{project.period ?? '/ мес.'}</span></p>
                  <p className="case-effect-label">{project.effectLabel}</p>
                  <p className="case-scale">{project.scale}</p>
                </div>
                <button className="case-open-button" type="button" onClick={() => onOpen(project.id)} aria-label={`Подробнее: ${project.title}`} aria-haspopup="dialog">
                  Разобрать кейс <span><ArrowUpRight size={19} aria-hidden="true" /></span>
                </button>
              </div>
            </article>
          ))}
        </div>
        <div className="case-section-bottom">
          <p className="case-section-note">{expanded ? 'Проекты, услуги и сценарии внедрения. Состав работ и условия внутри карточек.' : 'Расчётные примеры. Эффект зависит от объёма и исходных показателей бизнеса.'}{expanded && <span className="case-browse-hint">Все 5 кейсов доступны по стрелкам или свайпу.</span>}</p>
          <div className="case-carousel-controls" aria-label="Листать кейсы">
            <button type="button" onClick={() => move(-1)} disabled={edges.start} aria-label="Предыдущий кейс"><ArrowLeft size={20}/></button>
            <button type="button" onClick={() => move(1)} disabled={edges.end} aria-label="Следующий кейс"><ArrowRight size={20}/></button>
          </div>
        </div>
      </div>
    </section>
  );
}

function PricedCaseDetail({ project, onChoose }) {
  return <article className="case-detail">
    <p className="case-detail-eyebrow">{project.caseLabel} · {project.category}</p>
    <h2 id="dialog-title" className="case-detail-title">{project.title}</h2>
    <p className="case-detail-intro">{project.summary}</p>
    <figure className="case-interface-figure">
      <a href={project.projectUrl || assetUrl(project.image)} target="_blank" rel="noreferrer" aria-label={project.projectUrl ? 'Открыть сайт Yardestate' : 'Открыть скриншот в полном размере'}>
        <img className="case-detail-art" src={assetUrl(project.image)} alt={project.imageAlt}/>
      </a>
      <figcaption>{project.projectUrl
        ? <>Скриншот сайта <a href={project.projectUrl} target="_blank" rel="noreferrer">Yardestate.ru</a>.</>
        : <>{project.imageSystem}. Пример рабочего инструмента из <a href={project.imageSource} target="_blank" rel="noreferrer">документации продукта</a>.</>}
      </figcaption>
    </figure>
    {project.projectUrl && <a className="case-project-link" href={project.projectUrl} target="_blank" rel="noreferrer">Посмотреть сайт Yardestate <ArrowUpRight size={18} aria-hidden="true"/></a>}
    <section className="case-economics case-price" aria-labelledby={`${project.id}-price`}>
      <p className="case-detail-eyebrow">{project.pricing.label}</p>
      <h3 id={`${project.id}-price`}>{project.pricing.title}</h3>
      <p className="case-calculation-result"><strong>{formatRubles(project.pricing.amount)}</strong><span>{project.period}</span></p>
      <p className="case-calculation-note">{project.pricing.note}</p>
    </section>
    {project.detailSections.map((section, index) => <section className="case-detail-section" key={section.title} aria-labelledby={`${project.id}-section-${index}`}>
      <h3 id={`${project.id}-section-${index}`}>{section.title}</h3>
      {section.text && <p>{section.text}</p>}
      {section.items && <ul className="case-implementation">{section.items.map(item => <li key={item}>{item}</li>)}</ul>}
      {section.links && <ul className="case-model-sources case-project-pages">{section.links.map(link => <li key={link.url}><a href={link.url} target="_blank" rel="noreferrer">{link.title} <ArrowUpRight size={14} aria-hidden="true"/></a></li>)}</ul>}
    </section>)}
    <button className="case-choose-button" type="button" onClick={() => onChoose({ interest: project.interest, task: project.brief })}>{project.cta} <ArrowRight size={21} aria-hidden="true"/></button>
  </article>;
}

export function CaseStudyDetail({ project, onChoose }) {
  if (!project) return null;
  if (project.pricing) return <PricedCaseDetail project={project} onChoose={onChoose}/>;

  return (
    <article className="case-detail">
      <p className="case-detail-eyebrow">{project.caseLabel || 'Модельный кейс'} · {project.category}</p>
      <h2 id="dialog-title" className="case-detail-title">{project.title}</h2>
      <p className="case-detail-intro">{project.summary}</p>
      <div className="case-detail-model-note"><CheckCircle size={22} aria-hidden="true" /><p>{project.modelNote || 'Модельный пример: суммы заданы для расчёта и требуют проверки на данных вашего бизнеса.'}</p></div>
      <figure className="case-interface-figure">
        <a href={assetUrl(project.image)} target="_blank" rel="noreferrer" aria-label="Открыть скриншот в полном размере">
          <img className="case-detail-art" src={assetUrl(project.image)} alt={project.imageAlt} />
        </a>
        <figcaption>{project.imageSystem}. Пример интерфейса из <a href={project.imageSource} target="_blank" rel="noreferrer">документации продукта</a>. {project.imageNote || 'Скриншот иллюстрирует систему, расчёт выполнен отдельно.'}</figcaption>
      </figure>

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

      {project.economicsPlan ? <section className="case-economics" aria-labelledby={`${project.id}-economics`}>
        <header className="case-economics-header">
          <p className="case-detail-eyebrow">Проверка на пилоте</p>
          <h3 id={`${project.id}-economics`}>Как посчитаем эффект в рублях</h3>
        </header>
        <table className="case-assumptions">
          <caption>Данные, которые нужны для расчёта</caption>
          <thead><tr><th scope="col">Показатель</th><th scope="col">Источник</th></tr></thead>
          <tbody>{project.economicsPlan.rows.map(row => <tr key={row.label}><th scope="row">{row.label}<span>{row.note}</span></th><td>{row.value}</td></tr>)}</tbody>
        </table>
        <div className="case-calculation"><p className="case-calculation-formula">{project.economicsPlan.formula}</p></div>
        <p className="case-effect-condition">{project.economicsPlan.condition}</p>
      </section> : <section className="case-economics" aria-labelledby={`${project.id}-economics`}>
        <header className="case-economics-header">
          <p className="case-detail-eyebrow">Прозрачный расчёт</p>
          <h3 id={`${project.id}-economics`}>Экономика на заданных вводных</h3>
        </header>
        <table className="case-assumptions">
          <caption>{project.calculationPeriod || 'Допущения для расчёта за один месяц'}</caption>
          <thead><tr><th scope="col">Вводная</th><th scope="col">Значение</th></tr></thead>
          <tbody>
            {project.assumptions.map((row) => (
              <tr key={row.label}><th scope="row">{row.label}<span>{row.note}</span></th><td>{row.value}</td></tr>
            ))}
          </tbody>
        </table>
        <div className="case-calculation">
          <p className="case-calculation-formula">{project.formula}</p>
          <p className="case-calculation-result"><strong>{project.metric}</strong><span>{project.resultLabel || 'месячный эффект после текущих затрат'}</span></p>
        </div>
        <p className="case-effect-condition">{project.effectCondition}</p>
        <p className="case-calculation-note">{project.calculationNote || 'Эффект до налогов при заданном объёме. Окупаемость с выхода на этот объём.'}</p>
      </section>}

      {project.review ? <>
        <section className="case-detail-section case-model-review" aria-labelledby={`${project.id}-review`}>
          <h3 id={`${project.id}-review`}>{project.review.title}</h3>
          <p>{project.review.verdict}</p>
          {project.review.scenarios && <dl className="case-sensitivity">
            {project.review.scenarios.map(row => <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}
          </dl>}
          {project.review.sources && <ul className="case-model-sources">{project.review.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title} <ArrowUpRight size={14} aria-hidden="true"/></a></li>)}</ul>}
        </section>
        <section className="case-detail-section" aria-labelledby={`${project.id}-pilot`}>
          <h3 id={`${project.id}-pilot`}>С чего начнём проверку</h3>
          <p>{project.review.verification}</p>
        </section>
      </> : <section className="case-detail-section" aria-labelledby={`${project.id}-launch`}>
        <h3 id={`${project.id}-launch`}>Запуск и окупаемость в модели</h3>
        <dl className="case-payback">
          <div><dt>Условный бюджет запуска</dt><dd>{formatRubles(project.launchCost)}</dd></div>
          <div><dt>Простая окупаемость</dt><dd>{String(project.paybackMonths).replace('.', ',')} мес.</dd></div>
        </dl>
        <p className="case-payback-formula">{formatRubles(project.launchCost)} ÷ {formatRubles(project.monthlyEffect)}/мес. = {String(project.paybackMonths).replace('.', ',')} мес.</p>
        <p>{project.launchScope}</p>
        <p className="case-payback-note">Окупаемость считается с выхода на расчётный режим. Стоимость запуска здесь служит допущением для примера; смету проекта согласуем после разбора задачи.</p>
      </section>}

      <button className="case-choose-button" type="button" onClick={() => onChoose({ interest: project.interest, task: project.brief })}>
        Рассчитать на моих данных <ArrowRight size={21} aria-hidden="true" />
      </button>
    </article>
  );
}
