import React, { useId } from 'react';
import './hero-alternatives-art.css';

// Render inside .hero-alternative-art; the parent owns layout and playback state.
function Icon({ name, size = 20, ...props }) {
  const paths = {
    arrow: <><path d="M4 12h16M14 6l6 6-6 6" /></>,
    back: <><path d="M20 12H4m6 6-6-6 6-6" /></>,
    pause: <><path d="M9 5v14M15 5v14" strokeWidth="3" /></>,
    play: <path d="m8 4 12 8-12 8Z" fill="currentColor" stroke="none" />,
    replay: <><path d="M4 9a8 8 0 1 1 .5 7M4 3v6h6" /></>,
    check: <path d="m5 12 5 5L20 7" />,
    doc: <><path d="M6 3h8l4 4v14H6zM14 3v5h4M9 12h6M9 16h6" /></>,
    chat: <><path d="M20 15a3 3 0 0 1-3 3H9l-5 3V6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3Z" /><path d="M8 8h8M8 12h5" /></>,
    spark: <path d="m12 2 2.8 7.2L22 12l-7.2 2.8L12 22l-2.8-7.2L2 12l7.2-2.8Z" />,
    grid: <><rect x="3" y="3" width="6" height="6" rx="1" /><rect x="15" y="3" width="6" height="6" rx="1" /><rect x="3" y="15" width="6" height="6" rx="1" /><rect x="15" y="15" width="6" height="6" rx="1" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] || paths.spark}</svg>;
}

export function FlowScene() {
  const gradientId = `hero-flow-${useId().replace(/:/g, "")}`;
  const lines = ['M95 112C204 112 150 234 284 234', 'M72 240H284', 'M107 365C204 365 150 234 284 234', 'M322 234C422 234 390 132 504 132', 'M322 234C416 234 390 334 516 334'];
  return <div className="lab-art flow-scene">
    <div className="flow-grid" />
    <svg className="scene-svg" viewBox="0 0 600 470" aria-hidden="true"><defs><linearGradient id={gradientId}><stop stopColor="#d2dfef" /><stop offset=".45" stopColor="#0454ff" /><stop offset="1" stopColor="#d8ec8e" /></linearGradient></defs>{lines.map((d, i) => <g key={d}><path d={d} fill="none" stroke="#d5e0f1" strokeWidth="1.3" /><path className="flow-trace" d={d} fill="none" stroke={`url(#${gradientId})`} strokeWidth="3" pathLength="100" style={{ animationDelay: `${i * -.8}s` }} /></g>)}</svg>
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

export function OrbitScene() {
  const gradientId = `hero-orbit-${useId().replace(/:/g, "")}`;
  return <div className="lab-art orbit-scene">
    <div className="orbit-glow" />
    <svg className="orbit-rings" viewBox="0 0 600 470" aria-hidden="true">
      <defs><linearGradient id={gradientId}><stop stopColor="#adc3ec" stopOpacity=".1" /><stop offset=".38" stopColor="#5679ff" /><stop offset=".7" stopColor="#a9c2ff" /><stop offset="1" stopColor="#c6d7f1" stopOpacity=".2" /></linearGradient></defs>
      <ellipse cx="300" cy="235" rx="230" ry="112" fill="none" stroke={`url(#${gradientId})`} transform="rotate(-28 300 235)" />
      <ellipse cx="300" cy="235" rx="205" ry="125" fill="none" stroke={`url(#${gradientId})`} transform="rotate(39 300 235)" />
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
