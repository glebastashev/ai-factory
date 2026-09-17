import { useEffect, useRef, useState } from 'react';
import { ArrowDown, Check, ChatCircleDots, Sparkle } from '@phosphor-icons/react';

const STAGE_DURATION = 2400;
const stages = [
  { title: 'Запрос', subtitle: 'Получаем задачу', icon: ChatCircleDots, tone: 'blue' },
  { title: 'Обработка', subtitle: 'ИИ подключается', icon: Sparkle, tone: 'lime' },
  { title: 'Результат', subtitle: 'Готово к работе', icon: Check, tone: 'deep' },
];

export function HeroProcess() {
  const scene = useRef(null);
  const [active, setActive] = useState(0);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const running = !focused && visible && pageVisible && !reducedMotion;

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(preference.matches);
    const updateVisibility = () => setPageVisible(!document.hidden);
    preference.addEventListener('change', updatePreference);
    document.addEventListener('visibilitychange', updateVisibility);
    updateVisibility();
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(scene.current);
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', updatePreference);
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => setActive(stage => (stage + 1) % stages.length), STAGE_DURATION);
    return () => clearTimeout(timer);
  }, [active, running]);

  return <div className="hero-visual hero-process" ref={scene} role="group" aria-label="Работа ИИ: запрос, обработка, результат">
    <div className="process-scene" data-running={running} style={{ '--process-duration': `${STAGE_DURATION}ms` }}>
      <div className="process-ground" aria-hidden="true" />
      {stages.map((stage, index) => {
        const Icon = stage.icon;
        return <div className={`process-card process-card--${stage.tone}`} data-position={(index - active + 3) % 3} key={stage.title} aria-hidden="true">
          <div className="process-card-content">
            <div className="process-card-top"><span>0{index + 1}</span><Icon weight={index === 1 ? 'fill' : 'regular'} /></div>
            <div className={`process-card-graphic process-card-graphic--${index}`}>
              {index === 0 && <><span className="request-bubble"><i /><i /></span><span className="request-arrow"><ArrowDown /></span></>}
              {index === 1 && <><span className="process-node" /><span className="process-core"><Sparkle weight="fill" /></span><span className="process-node" /></>}
              {index === 2 && <><span className="result-check"><Check weight="bold" /></span><span className="result-lines"><i /><i /></span></>}
            </div>
            <div className="process-card-copy"><span>{stage.subtitle}</span><strong>{stage.title}</strong></div>
            <div className="process-card-track"><span key={`${active}-${running}`} /></div>
          </div>
        </div>;
      })}
    </div>
    <div className="process-controls" onFocusCapture={event => { if (event.target.matches(':focus-visible')) setFocused(true); }} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
      <div className="process-steps" aria-label="Этапы процесса">
        {stages.map((stage, index) => <button type="button" key={stage.title} className={active === index ? 'is-active' : ''} aria-label={`Показать этап: ${stage.title}`} aria-pressed={active === index} onClick={() => setActive(index)}><span className="process-step-dot" />{stage.title}</button>)}
      </div>
    </div>
  </div>;
}
