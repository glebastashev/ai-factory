import { useEffect, useRef, useState } from 'react';
import { FlowScene, OrbitScene } from './HeroAlternatives';

const variants = {
  flow: {
    Scene: FlowScene,
    description: 'Входящие задачи проходят через ИИ и превращаются в готовые результаты',
    labels: ['Данные поступают', 'ИИ обрабатывает', 'Команда получает результат'],
  },
  orbit: {
    Scene: OrbitScene,
    description: 'ИИ связывает продажи, контент и поддержку в одну систему',
    labels: ['Продажи', 'Контент', 'Поддержка'],
  },
};

export function HeroVariant({ variant }) {
  const host = useRef(null);
  const [visible, setVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const { Scene, description, labels } = variants[variant];
  const running = visible && pageVisible && !reduced;

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReduced(preference.matches);
    const updateVisibility = () => setPageVisible(!document.hidden);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(host.current);
    preference.addEventListener('change', updatePreference);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', updatePreference);
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);

  return <div className="hero-alternative" ref={host} role="group" aria-label={description}>
    <div className="hero-alternative-art" data-running={running} aria-hidden="true"><Scene /></div>
    <div className="hero-alternative-controls" data-running={running}>
      <div className="alternative-stages">{labels.map((label, index) => <span key={label} style={{ '--stage-index': index }}><i aria-hidden="true" />{label}</span>)}</div>
    </div>
  </div>;
}
