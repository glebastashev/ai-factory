import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './animation-lab.css';

const base = import.meta.env.BASE_URL;
const home = `${base}index.html`;

function Icon({ name, size = 20, ...props }) {
  const paths = {
    arrow: <><path d="M4 12h16M14 6l6 6-6 6" /></>,
    back: <><path d="M20 12H4m6 6-6-6 6-6" /></>,
    replay: <><path d="M4 9a8 8 0 1 1 .5 7M4 3v6h6" /></>,
    check: <path d="m5 12 5 5L20 7" />,
    doc: <><path d="M6 3h8l4 4v14H6zM14 3v5h4M9 12h6M9 16h6" /></>,
    chat: <><path d="M20 15a3 3 0 0 1-3 3H9l-5 3V6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3Z" /><path d="M8 8h8M8 12h5" /></>,
    spark: <path d="m12 2 2.8 7.2L22 12l-7.2 2.8L12 22l-2.8-7.2L2 12l7.2-2.8Z" />,
    grid: <><rect x="3" y="3" width="6" height="6" rx="1" /><rect x="15" y="3" width="6" height="6" rx="1" /><rect x="3" y="15" width="6" height="6" rx="1" /><rect x="15" y="15" width="6" height="6" rx="1" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] || paths.spark}</svg>;
}

function FlowScene() {
  const lines = ['M95 112C204 112 150 234 284 234', 'M72 240H284', 'M107 365C204 365 150 234 284 234', 'M322 234C422 234 390 132 504 132', 'M322 234C416 234 390 334 516 334'];
  return <div className="lab-art flow-scene">
    <div className="flow-grid" />
    <svg className="scene-svg" viewBox="0 0 600 470" aria-hidden="true"><defs><linearGradient id="flow-line"><stop stopColor="#d2dfef" /><stop offset=".45" stopColor="#0454ff" /><stop offset="1" stopColor="#d8ec8e" /></linearGradient></defs>{lines.map((d, i) => <g key={d}><path d={d} fill="none" stroke="#d5e0f1" strokeWidth="1.3" /><path className="flow-trace" d={d} fill="none" stroke="url(#flow-line)" strokeWidth="3" pathLength="100" style={{ animationDelay: `${i * -.8}s` }} /></g>)}</svg>
    <div className="flow-input input-one"><Icon name="chat" /><span>Заявка</span><i /></div>
    <div className="flow-input input-two"><Icon name="doc" /><span>Документ</span><i /></div>
    <div className="flow-input input-three"><Icon name="grid" /><span>Данные</span><i /></div>
    <div className="flow-core"><div className="core-outline" /><div className="core-face"><span>ai</span><div className="core-pins"><i /><i /><i /><i /><i /></div></div><span className="core-caption">Разбираем задачу</span></div>
    <div className="flow-output output-one"><span className="output-check"><Icon name="check" size={18} /></span><div><small>Продажи</small><strong>Заявка в CRM</strong></div></div>
    <div className="flow-output output-two"><span className="output-check"><Icon name="check" size={18} /></span><div><small>Команда</small><strong>Готовый ответ</strong></div></div>
    <span className="art-coordinate coordinate-one">ВХОДЯЩИЕ</span><span className="art-coordinate coordinate-two">РЕЗУЛЬТАТ</span>
    <div className="flow-signal"><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /></div>
  </div>;
}

function FactoryScene() {
  return <div className="lab-art factory-scene">
    <div className="factory-halo" />
    <div className="factory-perspective">
      <div className="factory-floor"><div className="factory-track"><i /><i /><i /><i /><i /><i /><i /><i /></div></div>
      <div className="factory-path" />
      {[0, 1, 2].map(i => <div className={`factory-parcel parcel-${i}`} key={i} style={{ '--parcel-delay': `${i * -4}s` }}><div className="parcel-paper"><Icon name="doc" size={25} /><span /><span /></div><div className="parcel-done"><Icon name="check" size={30} /></div></div>)}
      <div className="factory-machine"><div className="machine-side" /><div className="machine-top"><span>ai-factory</span><i /></div><div className="machine-front"><div className="machine-brand">ai</div><span>В РАБОТЕ</span><div className="machine-meter"><i /><i /><i /><i /><i /><i /><i /></div><div className="machine-door"><b /><b /><b /></div></div></div>
      <div className="factory-scan" />
    </div>
    <div className="factory-input-label"><span className="small-point" />Рутинная задача</div><div className="factory-output-label"><span className="small-point" />Готово к проверке</div>
    <div className="factory-run"><span className="run-light" /><span>Задачи проходят по очереди</span><span className="factory-ticks">▮▮▮▮▮</span></div>
  </div>;
}

function OrbitScene() {
  return <div className="lab-art orbit-scene">
    <div className="orbit-glow" />
    <svg className="orbit-rings" viewBox="0 0 600 470" aria-hidden="true">
      <defs><linearGradient id="orbit-metal"><stop stopColor="#adc3ec" stopOpacity=".1" /><stop offset=".38" stopColor="#5679ff" /><stop offset=".7" stopColor="#a9c2ff" /><stop offset="1" stopColor="#c6d7f1" stopOpacity=".2" /></linearGradient></defs>
      <ellipse cx="300" cy="235" rx="230" ry="112" fill="none" stroke="url(#orbit-metal)" transform="rotate(-28 300 235)" />
      <ellipse cx="300" cy="235" rx="205" ry="125" fill="none" stroke="url(#orbit-metal)" transform="rotate(39 300 235)" />
      <ellipse cx="300" cy="235" rx="102" ry="217" fill="none" stroke="#c6d6ef" />
      <g transform="rotate(-28 300 235)"><ellipse className="orbit-pulse orbit-pulse-one" cx="300" cy="235" rx="230" ry="112" fill="none" stroke="#0552ff" strokeWidth="5" pathLength="100" /></g>
      <g transform="rotate(39 300 235)"><ellipse className="orbit-pulse orbit-pulse-two" cx="300" cy="235" rx="205" ry="125" fill="none" stroke="#a5c955" strokeWidth="6" pathLength="100" /></g>
    </svg>
    <div className="orbit-core"><div className="sphere-sheen" /><span className="sphere-logo">ai</span><span className="sphere-caption">Работаем вместе</span><div className="sphere-rim" /></div>
    <div className="orbit-satellite satellite-sales"><span className="satellite-icon"><Icon name="chat" size={21} /></span><span>Продажи</span><i /></div>
    <div className="orbit-satellite satellite-content"><span className="satellite-icon"><Icon name="doc" size={21} /></span><span>Контент</span><i /></div>
    <div className="orbit-satellite satellite-team"><span className="satellite-icon"><Icon name="grid" size={21} /></span><span>Поддержка</span><i /></div>
    <span className="orbit-dot dot-one" /><span className="orbit-dot dot-two" /><span className="orbit-dot dot-three" />
    <div className="orbit-caption"><span />Одна система для задач команды</div>
  </div>;
}

// A fixed matrix keeps the preview deterministic across reloads and screen sizes.
const letterPixels = ['001110001100','011011001100','110001100000','110001101100','111111101100','110001101100','110001101100'];
const checkPixels = ['000000000010','000000000110','000000001100','010000011000','011000110000','001101100000','000111000000'];
function MatrixScene() {
  return <div className="lab-art matrix-scene">
    <div className="matrix-board"><div className="matrix-board-top"><span className="run-light" /><span>ai-factory / сборка решения</span><span>01 → 03</span></div><div className="matrix-pixels">{letterPixels.flatMap((row, y) => [...row].map((v, x) => <i key={`${x}-${y}`} className={`${v === '1' ? 'pixel-letter ' : ''}${checkPixels[y][x] === '1' ? 'pixel-check' : ''}`} style={{ '--scatter-x': `${((x * 37 + y * 19) % 95) - 47}px`, '--scatter-y': `${((y * 31 + x * 11) % 77) - 38}px`, '--pixel-phase': `${(x + y) * 38}ms` }} />))}</div><div className="matrix-readout"><div className="readout-stage stage-input"><span>01 / Получаем задачу</span><strong>Из разрозненных данных</strong></div><div className="readout-stage stage-process"><span>02 / Собираем решение</span><strong>В работающий процесс</strong></div><div className="readout-stage stage-result"><span>03 / Проверяем результат</span><strong>Можно передать команде</strong></div></div><div className="matrix-timeline"><i /><i /><i /></div></div>
    <div className="matrix-float matrix-float-top"><Icon name="doc" size={18} /><span>Данные получены</span></div><div className="matrix-float matrix-float-bottom"><Icon name="check" size={19} /><span>Решение собрано</span></div>
  </div>;
}

const options = [
  { id: 'flow', name: 'Поток задач', tag: 'Предлагаю начать с этого', description: 'Заявки и документы сходятся в ИИ-модуле. Импульс проходит через систему, на выходе появляются готовые ответы.', emphasis: 'Показывает, что именно делает агентство.', scene: FlowScene, steps: ['Данные поступают', 'ИИ обрабатывает', 'Команда получает результат'] },
  { id: 'factory', name: 'ИИ-конвейер', tag: 'Буквально ai-factory', description: 'Задачи заезжают в объёмный модуль и выходят с отметкой готовности. Одна непрерывная производственная линия.', emphasis: 'Связывает название агентства с процессом работы.', scene: FactoryScene, steps: ['Принимаем задачу', 'Запускаем обработку', 'Передаём на проверку'] },
  { id: 'orbit', name: 'Центр притяжения', tag: 'Акцент на образе', description: 'Световые импульсы движутся по орбитам вокруг объёмного ядра. Продажи, контент и поддержка связаны в одну систему.', emphasis: 'Даёт первому экрану выразительный объём.', scene: OrbitScene, steps: ['Продажи', 'Контент', 'Поддержка'] },
  { id: 'matrix', name: 'Из данных в действие', tag: 'Графика и типографика', description: 'Разрозненные точки собираются в знак ai, затем превращаются в подтверждение выполненной задачи. Цикл повторяется плавно.', emphasis: 'Ставит в центр переход от задачи к результату.', scene: MatrixScene, steps: ['Собираем данные', 'Строим решение', 'Проверяем результат'] },
];

function AnimationLab() {
  const [selected, setSelected] = useState(() => {
    const current = new URLSearchParams(window.location.search).get('variant');
    return Math.max(0, options.findIndex(item => item.id === current));
  });
  const [replay, setReplay] = useState(0);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [visible, setVisible] = useState(true);
  const preview = useRef(null);
  const option = options[selected];
  const Scene = option.scene;
  const stopped = reduced || !visible;

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(media.matches);
    media.addEventListener('change', onChange);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting && !document.hidden), { threshold: .08 });
    observer.observe(preview.current);
    const onVisibility = () => {
      const bounds = preview.current.getBoundingClientRect();
      setVisible(!document.hidden && bounds.bottom > 0 && bounds.top < window.innerHeight);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => { media.removeEventListener('change', onChange); observer.disconnect(); document.removeEventListener('visibilitychange', onVisibility); };
  }, []);

  function select(index) {
    setSelected(index);
    const url = new URL(window.location.href);
    url.searchParams.set('variant', options[index].id);
    window.history.replaceState(null, '', url);
  }

  return <>
    <header className="lab-header lab-shell"><a className="lab-brand" href={home}><img src={`${base}assets/brand-icon.png`} alt="" /><span><b>ai</b>-factory</span></a><a className="lab-back" href={home}><Icon name="back" size={16} /><span>Вернуться на сайт</span></a></header>
    <main className="lab-shell">
      <section className="lab-intro"><div><p className="lab-eyebrow">Выбираем движение для первого экрана</p><h1>Четыре способа<br />показать работу ИИ.</h1></div><p>Переключайте варианты и смотрите, как каждый выглядит рядом с текстом сайта.</p></section>
      <div className="lab-options" aria-label="Варианты анимации">{options.map((item, index) => <button className={`lab-option ${selected === index ? 'is-selected' : ''}`} type="button" key={item.id} aria-pressed={selected === index} onClick={() => select(index)}><span className="option-number">0{index + 1}</span><span>{item.name}</span><span className="option-dot" /></button>)}</div>
      <section className={`lab-preview ${stopped ? 'is-paused' : ''} ${reduced ? 'is-reduced' : ''}`} ref={preview} aria-label={`Первый экран: ${option.name}`}>
        <div className="preview-top"><span><i />ПРЕДПРОСМОТР ПЕРВОГО ЭКРАНА</span><span>ДЕМО · 0{selected + 1} / 04</span></div>
        <div className="preview-hero"><div className="preview-copy"><span className="preview-tag">Прикладной ИИ для бизнеса</span><p className="preview-eyebrow">ИИ-агентство Макса Люшера</p><h2>Больше времени.<br />Больше прибыли.</h2><p className="preview-description">Внедряем ИИ в продажи, поддержку и контент. Считаем, какие расходы сократятся и когда окупится запуск.</p><div className="preview-actions"><a className="lab-button lab-button-primary" href={`${home}#brief`}>Обсудить задачу<Icon name="arrow" size={17} /></a><a className="lab-button lab-button-outline" href={`${home}#products`}>Готовые продукты</a></div></div><div className="preview-art"><div key={`${option.id}-${replay}`} className="scene-mount"><Scene /><div className="scene-stages" aria-hidden="true">{option.steps.map((step, index) => <span key={step} style={{ '--stage-index': index }}><i />{step}</span>)}</div></div></div></div>
        <div className="preview-bottom"><div><span className="preview-variant-number">0{selected + 1}</span><div><strong>{option.name}</strong><span>{option.tag}</span></div></div><div className="playback-controls"><button type="button" disabled={reduced} onClick={() => { setReplay(replay + 1); }} aria-label="Повторить анимацию с начала"><Icon name="replay" size={18} /><span>Повторить</span></button></div></div>
      </section>
      <section className="lab-note" aria-live="polite"><p>{option.description}</p><div><span className="note-mark">↗</span><p>{option.emphasis}</p></div></section>
      {reduced && <p className="reduced-note">В настройках устройства включено уменьшение движения. Варианты показаны без анимации.</p>}
    </main>
    <footer className="lab-footer lab-shell"><span>ai-factory · Направления анимации</span><span>На главной странице сохраняется текущий вариант.</span></footer>
  </>;
}

createRoot(document.getElementById('animation-root')).render(<AnimationLab />);
