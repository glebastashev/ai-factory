import { useEffect, useRef, useState } from 'react';
import { FlowScene, OrbitScene } from './HeroAlternatives';

const variants = {
  flow: {
    Scene: FlowScene,
    description: 'Входящие задачи проходят через ИИ и превращаются в готовые результаты',
  },
  orbit: {
    Scene: OrbitScene,
    description: 'ИИ связывает продажи, контент и поддержку в одну систему',
  },
};

export function HeroVariant({ variant }) {
  const host = useRef(null);
  const [visible, setVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const { Scene, description } = variants[variant];
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
  </div>;
}
