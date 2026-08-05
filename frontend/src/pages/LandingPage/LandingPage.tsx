import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGlobe } from './useGlobe';
import './LandingPage.css';

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

const FEATURES = [
  {
    num: '01',
    title: 'Notes',
    desc: 'Capture thoughts instantly. Tag, pin, attach media. Everything searchable, nothing lost.',
    points: ['Rich text with file attachments', 'Pin important notes to the top', 'Tag-based organization'],
  },
  {
    num: '02',
    title: 'Board',
    desc: 'Visual task management. Subtasks, inline editing. Move fast without ceremonies.',
    points: ['Inline subtask checkboxes', 'Create and edit without leaving the board', 'Zero-friction task capture'],
  },
  {
    num: '03',
    title: 'Ideas',
    desc: 'Validate ideas before you build. Structure the problem, the solution, the audience.',
    points: ['Structured idea canvas', 'Status tracking: Raw, Exploring, Accepted, Rejected', 'From thought to validated concept'],
  },
  {
    num: '04',
    title: 'Templates',
    desc: 'System-level markdown templates. Your personal playbooks, editable in place.',
    points: ['Markdown with live preview', 'Edit and save inline', 'Build your own operating system'],
  },
];

export function LandingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { coords } = useGlobe(canvasRef);
  const [time, setTime] = useState('00:00:00');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      setTime(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
      setDateStr(
        now.toLocaleDateString('en-GB', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      );
    }
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing-root">
      {/* Three.js Canvas */}
      <div className="landing-canvas-wrap">
        <canvas ref={canvasRef} />
      </div>

      {/* Overlays */}
      <div className="landing-scanlines" />
      <div className="landing-vignette" />

      {/* Brand */}
      <div className="landing-brand">ENVIE</div>

      {/* Hero Section */}
      <div className="landing-layout">
        <div className="landing-left">
          <div className="landing-eyebrow">Personal Headquarters</div>
          <div className="landing-clock">
            <div className="landing-time">{time}</div>
            <div className="landing-clock-date">{dateStr}</div>
          </div>
          <div className="landing-divider" />
          <h1 className="landing-h1">
            Everything<br />you think,<br /><em>in one place.</em>
          </h1>
          <p className="landing-sub">
            Notes. Ideas. Plans. A board that moves when you do. No team rituals. No distractions.
          </p>
          <Link to="/dashboard" className="landing-cta">
            Get started <span className="landing-cta-arrow">{'\u2192'}</span>
          </Link>
        </div>
        <div>{/* right: globe lives in canvas behind */}</div>
      </div>

      {/* Status Bar */}
      <div className="landing-status">
        <span>v1.0.0 — local</span>
        <div className="landing-scroll-hint">
          <div className="landing-scroll-line" />
          <span>scroll</span>
        </div>
        <span>{coords}</span>
      </div>

      {/* Scroll Sections */}
      <div className="landing-sections">
        {FEATURES.map((f) => (
          <section key={f.num} className="landing-section">
            <div className="landing-section-inner">
              <span className="landing-section-num">{f.num}</span>
              <h2 className="landing-section-title">{f.title}</h2>
              <p className="landing-section-desc">{f.desc}</p>
              <ul className="landing-section-points">
                {f.points.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          </section>
        ))}

        {/* Final CTA section */}
        <section className="landing-section landing-section-final">
          <div className="landing-section-inner" style={{ textAlign: 'center' }}>
            <h2 className="landing-section-title" style={{ marginBottom: '16px' }}>Ready?</h2>
            <p className="landing-section-desc" style={{ marginBottom: '40px', maxWidth: '360px', marginLeft: 'auto', marginRight: 'auto' }}>
              Your second brain is waiting.
            </p>
            <Link to="/dashboard" className="landing-cta">
              Open Envie <span className="landing-cta-arrow">{'\u2192'}</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
