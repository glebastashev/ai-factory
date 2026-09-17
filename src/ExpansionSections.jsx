import { assetUrl } from './asset-url';
import React, { useEffect, useRef } from 'react';
import { ArrowRight, ArrowUpRight, Check, CaretDown, ChatsCircle, Database, Envelope, Files, Globe, PlugsConnected, MagnifyingGlass, Wrench, ArrowsClockwise, Flask } from '@phosphor-icons/react';
import './expansion-sections.css';

const connections = [
 {icon:ChatsCircle,title:'Мессенджеры',examples:'Telegram и чаты на сайте',text:'Принять вопрос, уточнить детали, передать разговор сотруднику.'},
 {icon:Database,title:'CRM',examples:'Битрикс24, amoCRM',text:'Создать заявку и сохранить контекст общения с клиентом.'},
 {icon:Files,title:'Документы',examples:'Базы знаний, PDF, таблицы',text:'Найти сведения, извлечь данные и собрать ответ с источником.'},
 {icon:Envelope,title:'Почта',examples:'Входящие письма и вложения',text:'Разобрать обращение и подготовить черновик ответа.'},
 {icon:Globe,title:'Сайт',examples:'Формы и личные кабинеты',text:'Связать обращение на сайте с дальнейшей обработкой.'},
 {icon:PlugsConnected,title:'Ваши сервисы',examples:'Подключения через API',text:'Передавать данные между системами по правилам процесса.'}
];
export function IntegrationsSection({onChoose}) {
 return <section id="integrations" className="expand-integrations container"><div className="expand-section-heading"><div><p className="eyebrow">В привычных инструментах</p><h2>ИИ встроится<br/>в вашу работу</h2></div><p>Соберём путь от входящего запроса до результата в системе, которой уже пользуется команда.</p></div><div className="expand-connections">{connections.map(c=>{const Icon=c.icon;return <article key={c.title}><Icon size={35} weight="duotone"/><h3>{c.title}</h3><p className="expand-examples">{c.examples}</p><p>{c.text}</p></article>})}</div><div className="expand-section-bottom"><p>Это примеры подключений. Возможности ваших систем и необходимые доступы уточним до разработки.</p><button className="expand-text-button" onClick={()=>onChoose({interest:'Решение под мою задачу',task:'Хотим связать ИИ с рабочими системами команды. Нужна оценка возможных подключений.'})}>Обсудить интеграции <ArrowUpRight size={22}/></button></div></section>
}
const formats = [
 {icon:MagnifyingGlass,no:'01',name:'Разобраться с задачей',for:'Когда идей много и нужно выбрать, с чего начать.',items:['Разбор текущего процесса','Источники данных и ограничения','Приоритеты и критерии результата'],result:'План первого внедрения',cta:'Начать с разбора',task:'Нужен разбор процессов и план первого внедрения ИИ.'},
 {icon:Wrench,no:'02',name:'Внедрить решение',for:'Когда есть конкретный процесс, который пора автоматизировать.',items:['Прототип на выбранном сценарии','Подключения к рабочим инструментам','Проверка и подготовка к запуску'],result:'Сценарий, готовый к работе',cta:'Обсудить внедрение',task:'Хотим внедрить ИИ в конкретный рабочий процесс. Нужны прототип, интеграции и запуск.'},
 {icon:ArrowsClockwise,no:'03',name:'Развивать после запуска',for:'Когда решение уже работает, а задачи и материалы меняются.',items:['Разбор ошибок и обратной связи','Обновление знаний и сценариев','Новые задачи и улучшения'],result:'План развития и сопровождение',cta:'Обсудить развитие',task:'У нас уже есть ИИ-решение. Нужно обсудить его развитие и сопровождение.'}
];
export function FormatsSection({onChoose}){
 return <section id="formats" className="expand-formats"><div className="container"><div className="expand-section-heading"><div><p className="eyebrow">Как можем работать вместе</p><h2>Подключимся на том<br/>этапе, где вы сейчас</h2></div><p>Начать можно с разбора одной задачи, внедрения или развития существующего решения.</p></div><div className="expand-format-grid">{formats.map((f,i)=>{const Icon=f.icon;return <article className={i===1?'expand-format featured':'expand-format'} key={f.no}><div className="expand-format-top"><span>{f.no}</span><Icon size={34}/></div><h3>{f.name}</h3><p className="expand-format-for">{f.for}</p><ul>{f.items.map(t=><li key={t}><Check size={18}/>{t}</li>)}</ul><div className="expand-format-result"><span>На выходе</span><p>{f.result}</p></div><button onClick={()=>onChoose({interest:'Решение под мою задачу',task:f.task})}>{f.cta}<ArrowRight size={20}/></button></article>})}</div><p className="expand-formats-note">Объём работ, сроки и стоимость определим после знакомства с задачей.</p></div></section>
}
export function ResearchSection({onChoose}){
 const artRef = useRef(null);
 useEffect(() => {
  const art = artRef.current;
  let visible = false;
  const syncMotion = () => { art.dataset.floating = String(visible && !document.hidden); };
  const observer = new IntersectionObserver(([entry]) => {
   visible = entry.isIntersecting;
   syncMotion();
  }, { threshold: 0.05 });
  observer.observe(art);
  document.addEventListener('visibilitychange', syncMotion);
  return () => {
   observer.disconnect();
   document.removeEventListener('visibilitychange', syncMotion);
  };
 }, []);
 return <section id="research" className="expand-research container"><div className="expand-research-art" ref={artRef} data-floating="false"><img src={assetUrl('editorial-hero.png')} alt="Синие и лаймовые стеклянные формы" loading="lazy"/><span><Flask size={19}/> Проверка идеи</span></div><div className="expand-research-copy"><p className="eyebrow">Для нестандартных задач</p><h2>Вашей задачи<br/>нет в каталоге?</h2><p>Опишите, что должно происходить на входе и что вы хотите получить. Проверим подход на небольшом прототипе и обсудим, что потребуется для полноценного запуска.</p><ul><li><span>01</span>Разберём примеры из вашей работы</li><li><span>02</span>Выберем способ проверить гипотезу</li><li><span>03</span>Покажем результат и ограничения</li></ul><button className="button button-lime" onClick={()=>onChoose({interest:'Решение под мою задачу',task:'Хотим проверить нестандартную идею с ИИ и начать с прототипа.'})}>Проверить мою идею <ArrowUpRight size={22}/></button></div></section>
}
const questions = [
 ['Как понять, что внедрение окупится?','Зафиксируем текущие расходы и маржу с продажи, оценим объём задач. Отдельно посчитаем запуск, оплату ИИ, сопровождение и ручную проверку. На пилоте сравним прогноз с фактом за одинаковый период. Высвободившиеся часы считаем денежной экономией только тогда, когда действительно сокращаются выплаты.'],
 ['С чего начать, если мы пока не знаем, где нужен ИИ?','Расскажите, какие задачи регулярно отнимают время: ответы клиентам, перенос данных, поиск документов или подготовка материалов. Выберем один процесс и определим, какой результат проверять первым.'],
 ['Можно ли начать с одной небольшой задачи?','Да. Для первого внедрения можно выделить один сценарий, например подготовку заявки для менеджера или поиск по инструкциям. Так проще проверить результат и решить, что развивать дальше.'],
 ['Подключите решение к нашей CRM и другим сервисам?','Сначала уточним возможности ваших систем и доступные способы подключения. Определим, какие данные получать, куда передавать результат и какие действия разрешены помощнику. После этого предложим схему интеграции.'],
 ['Кто будет проверять ответы и действия ИИ?','На старте согласуем критерии и ответственного сотрудника. В ответах по документам можно показывать источник, а публикации и предложения клиентам оставлять на согласование. Эти правила закладываются в сценарий.'],
 ['Нужно ли сотрудникам разбираться в нейросетях?','Достаточно знать свой процесс и уметь оценить результат. При подготовке к запуску определим, какие инструкции и разборы понадобятся сотрудникам, кто будет поддерживать базу знаний и собирать обратную связь.'],
 ['От чего зависят сроки и стоимость?','От состава задачи, состояния материалов, количества подключаемых систем и требований к проверке. После разбора подготовим состав работ и условия, которые можно обсудить до старта.'],
 ['Что происходит после запуска?','Можно согласовать сопровождение: обновление материалов, разбор ошибок, изменение сценариев и помощь ответственному сотруднику. Объём поддержки определяется под конкретный проект.']
];
export function FaqSection({onChoose}){
 return <section id="faq" className="expand-faq container"><div className="expand-faq-intro"><p className="eyebrow">Перед первым разговором</p><h2>Вопросы,<br/> которые нам<br/> задают</h2><p>Если ваша ситуация отличается, опишите её в брифе.</p><button className="expand-text-button" onClick={()=>onChoose({})}>Задать свой вопрос <ArrowUpRight size={21}/></button></div><div className="expand-faq-list">{questions.map(([q,a],i)=><details key={q} open={i===0?true:undefined}><summary><span>{q}</span><CaretDown size={23}/></summary><p>{a}</p></details>)}</div></section>
}
