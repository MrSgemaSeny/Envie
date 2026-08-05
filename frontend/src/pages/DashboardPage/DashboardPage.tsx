import { useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './DashboardPage.css';

interface Section {
  eyebrow: string;
  title: string;
  body: string;
  side: 'left' | 'right';
}

const SECTIONS: Section[] = [
  {
    eyebrow: '01 -- Vision',
    title: 'Built for\none person',
    body: 'Your stack, your rhythm.\nNo team rituals required.',
    side: 'left',
  },
  {
    eyebrow: '02 -- Notes',
    title: 'Capture\neverything',
    body: 'Stream of thought,\ntimestamped and searchable.',
    side: 'right',
  },
  {
    eyebrow: '03 -- Board',
    title: 'Ship\nwithout noise',
    body: 'Boards that move\nwhen you move.',
    side: 'left',
  },
  {
    eyebrow: '04 -- Ideas',
    title: 'Validate\nbefore building',
    body: 'Structure the problem.\nDefine the audience.',
    side: 'right',
  },
  {
    eyebrow: '05 -- You',
    title: 'Your personal\nHQ',
    body: 'One tab.\nEverything inside.',
    side: 'left',
  },
];

export const DashboardPage: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeSectionRef = useRef(-1);

  const setBlockRef = useCallback((el: HTMLDivElement | null, idx: number) => {
    blockRefs.current[idx] = el;
  }, []);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    const progressEl = progressRef.current;
    if (!scrollEl || !progressEl) return;

    const secPoints = SECTIONS.map((_, i) => (i + 0.5) / SECTIONS.length);

    function onScroll() {
      if (!scrollEl || !progressEl) return;
      const { scrollTop, scrollHeight, clientHeight } = scrollEl;
      const p = scrollTop / (scrollHeight - clientHeight);

      // Progress bar
      progressEl.style.height = `${p * 100}%`;

      // Find active section
      let newActive = -1;
      secPoints.forEach((sp, i) => {
        const dist = Math.abs(p - sp);
        if (dist < 0.12) newActive = i;
      });

      if (newActive !== activeSectionRef.current) {
        // Hide old
        if (activeSectionRef.current >= 0) {
          const el = blockRefs.current[activeSectionRef.current];
          if (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(-50%) translateX(0)';
          }
        }
        // Show new
        if (newActive >= 0) {
          const el = blockRefs.current[newActive];
          const s = SECTIONS[newActive];
          if (el) {
            el.style.transition = 'none';
            el.style.opacity = '0';
            el.style.transform = `translateY(-50%) translateX(${s.side === 'left' ? '-30px' : '30px'})`;
            requestAnimationFrame(() => {
              el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
              el.style.opacity = '1';
              el.style.transform = 'translateY(-50%) translateX(0)';
            });
          }
        }
        activeSectionRef.current = newActive;
      }
    }

    scrollEl.addEventListener('scroll', onScroll, { passive: true });
    return () => scrollEl.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="dash-scroll-root">
      <div className="dash-scroll-area" ref={scrollRef}>
        <div className="dash-scroll-inner">
          <div className="dash-sticky">
            {/* Gradient background */}
            <div className="dash-gradient-bg" />

            {/* Text blocks */}
            {SECTIONS.map((s, i) => (
              <div
                key={i}
                ref={(el) => setBlockRef(el, i)}
                className="dash-text-block"
                style={{
                  left: s.side === 'left' ? '48px' : 'auto',
                  right: s.side === 'right' ? '48px' : 'auto',
                  opacity: 0,
                }}
              >
                <div className="dash-text-eyebrow">{s.eyebrow}</div>
                <h2
                  className="dash-text-title"
                  dangerouslySetInnerHTML={{
                    __html: s.title.replace('\n', '<br/>'),
                  }}
                />
                <p
                  className="dash-text-body"
                  dangerouslySetInnerHTML={{
                    __html: s.body.replace('\n', '<br/>'),
                  }}
                />
              </div>
            ))}

            {/* Progress bar */}
            <div className="dash-progress-bar">
              <div className="dash-progress-fill" ref={progressRef} />
            </div>

            {/* Scroll hint */}
            <div className="dash-scroll-hint">scroll</div>

            {/* Final CTA at bottom-center */}
            <div className="dash-bottom-nav">
              <Link to="/notes" className="dash-nav-link">Notes</Link>
              <Link to="/board" className="dash-nav-link">Board</Link>
              <Link to="/ideas" className="dash-nav-link">Ideas</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
