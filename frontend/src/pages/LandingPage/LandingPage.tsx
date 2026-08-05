import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGlobe } from './useGlobe';
import './LandingPage.css';

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

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
    <div className="landing-root" style={{ height: '100vh', overflow: 'hidden' }}>
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
        <span>{coords}</span>
      </div>
    </div>
  );
}

