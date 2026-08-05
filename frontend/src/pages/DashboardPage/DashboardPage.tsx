import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './DashboardPage.css';

gsap.registerPlugin(ScrollTrigger);

const SECTIONS = [
  { eyebrow: '01 — Notes', title: 'Лента\nзаметок', body: 'Заметки с тегами, медиа-вложениями и пином наверх. Быстрый захват мыслей без трения.', side: 'left' },
  { eyebrow: '02 — Board', title: 'Канбан\nдоска', body: 'Задачи с подзадачами. Двигается, когда двигаешься ты.', side: 'right' },
  { eyebrow: '03 — Ideas', title: 'База\nидей', body: 'Структурированное описание: проблема, решение, аудитория, монетизация.', side: 'left' },
  { eyebrow: '04 — Templates', title: 'MD\nшаблоны', body: 'Готовые markdown-шаблоны и промпты для повторяющихся задач.', side: 'right' },
  { eyebrow: '05 — Wallpaper', title: 'Свой\nфон', body: 'Загружай обои рабочего пространства, до 50MB. Переключай и удаляй в один клик.', side: 'left' },
  { eyebrow: '06 — Dashboard', title: 'Точка\nвхода', body: 'Главный экран с навигацией по всем модулям. Всё в одном окне.', side: 'right' },
];

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Show preloader only once per session
  const [showPreloader, setShowPreloader] = useState(() => {
    return !sessionStorage.getItem('dashboard-preloader-shown');
  });
  const [isNavVisible, setIsNavVisible] = useState(false);

  // Canvas Refs
  const heroCanvasRef = useRef<HTMLCanvasElement>(null);
  const ladderCanvasRef = useRef<HTMLCanvasElement>(null);

  // Scroll Area Refs
  const ladderScrollRef = useRef<HTMLDivElement>(null);
  const ladderProgressFillRef = useRef<HTMLDivElement>(null);

  // Counter Refs
  const factRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Navigation scroll state
  const lastYRef = useRef(0);

  // Hold-to-blast State
  const [isHolding, setIsHolding] = useState(false);
  const [blastProgress, setBlastProgress] = useState(0);
  const blastedRef = useRef(false);
  const holdingRef = useRef(false);
  const startRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const CIRC = 2 * Math.PI * 22;

  // Preloader and Hero entrance GSAP
  useEffect(() => {
    const delay = showPreloader ? 2100 : 100;
    const timer = setTimeout(() => {
      setShowPreloader(false);
      sessionStorage.setItem('dashboard-preloader-shown', 'true');
      setIsNavVisible(true);

      // Hero animations
      gsap.from('.hero-eyebrow', { opacity: 0, y: 20, duration: 0.8, delay: 0.1, ease: 'power3.out' });
      gsap.from('.hero-title .line', { opacity: 0, y: 40, duration: 1, delay: 0.25, stagger: 0.12, ease: 'power3.out' });
      gsap.from('.hero-sub', { opacity: 0, y: 20, duration: 0.8, delay: 0.55, ease: 'power3.out' });
      gsap.from('.hero-hint', { opacity: 0, duration: 1, delay: 0.9, ease: 'power2.out' });
      gsap.to('#hold-indicator', { opacity: 1, duration: 0.8, delay: 1.1, ease: 'power2.out' });
    }, delay);

    return () => clearTimeout(timer);
  }, [showPreloader]);

  // Nav hide/show on scroll
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const nav = document.getElementById('main-nav');
      if (!nav) return;

      if (y < 80) {
        nav.classList.add('visible');
        return;
      }
      if (y > lastYRef.current + 4) {
        nav.classList.remove('visible');
      } else if (y < lastYRef.current - 4) {
        nav.classList.add('visible');
      }
      lastYRef.current = y;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Three.js Hero Globe Canvas
  useEffect(() => {
    const canvas = heroCanvasRef.current;
    if (!canvas) return;

    const W = () => canvas.parentElement?.clientWidth || window.innerWidth;
    const H = () => canvas.parentElement?.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W(), H());
    renderer.setClearColor(0x0A0A0A, 1);

    const scene = new THREE.Scene();

    const cam = new THREE.PerspectiveCamera(36, W() / H(), 0.1, 100);
    cam.position.set(2.0, 0, 3.0);
    cam.lookAt(2.0, 0, 0);

    // Star points
    const pCount = 900;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) {
      pPos[i] = (Math.random() - 0.5) * 70;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.045, transparent: true, opacity: 0.22 });
    scene.add(new THREE.Points(pGeo, pMat));

    const globeGroup = new THREE.Group();
    globeGroup.position.set(2.0, 0, 0);
    scene.add(globeGroup);

    const R = 1;
    const wireDim = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.13 });
    const wireBright = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.42 });

    // Latitude circles
    for (let i = 0; i <= 18; i++) {
      const lat = -90 + (180 / 18) * i;
      const phi = ((90 - lat) * Math.PI) / 180;
      const r = R * Math.sin(phi);
      const y = R * Math.cos(phi);
      const pts = [];
      for (let j = 0; j <= 72; j++) {
        const t = (j / 72) * Math.PI * 2;
        pts.push(new THREE.Vector3(r * Math.cos(t), y, r * Math.sin(t)));
      }
      globeGroup.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        lat === 0 ? wireBright : wireDim
      ));
    }

    // Longitude circles
    for (let i = 0; i < 24; i++) {
      const theta = (i / 24) * Math.PI * 2;
      const pts = [];
      for (let j = 0; j <= 64; j++) {
        const phi = (j / 64) * Math.PI;
        pts.push(new THREE.Vector3(
          R * Math.sin(phi) * Math.cos(theta),
          R * Math.cos(phi),
          R * Math.sin(phi) * Math.sin(theta)
        ));
      }
      globeGroup.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        i === 0 || i === 12 ? wireBright : wireDim
      ));
    }

    // Occulusion sphere
    globeGroup.add(new THREE.Mesh(
      new THREE.SphereGeometry(R * 0.994, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0x0A0A0A, side: THREE.BackSide })
    ));

    const onResize = () => {
      renderer.setSize(W(), H());
      cam.aspect = W() / H();
      cam.updateProjectionMatrix();
    };

    window.addEventListener('resize', onResize);

    let ry = 0;
    let frameId = 0;
    const tick = () => {
      frameId = requestAnimationFrame(tick);
      ry += 0.0012;
      globeGroup.rotation.y = ry;
      renderer.render(scene, cam);
    };
    tick();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frameId);
      scene.clear();
      renderer.dispose();
      pGeo.dispose();
      pMat.dispose();
      wireDim.dispose();
      wireBright.dispose();
    };
  }, []);

  // Three.js Scroll Ladder Canvas and scroll syncing
  useEffect(() => {
    const canvas = ladderCanvasRef.current;
    const scrollArea = ladderScrollRef.current;
    if (!canvas || !scrollArea) return;

    const W = () => canvas.parentElement?.clientWidth || scrollArea.clientWidth;
    const H = () => canvas.parentElement?.clientHeight || scrollArea.clientHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W(), H());
    renderer.setClearColor(0x0A0A0A, 1);

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(50, W() / H(), 0.1, 200);
    cam.position.set(0, 0, 14);

    scene.add(new THREE.AmbientLight(0xffffff, 0.12));
    const dL = new THREE.DirectionalLight(0xffffff, 0.9);
    dL.position.set(5, 5, 5);
    scene.add(dL);

    const STEPS = 40;
    const RADIUS = 1.8;
    const HEIGHT = 28;
    const TURNS = 2.5;
    const ladderGroup = new THREE.Group();
    scene.add(ladderGroup);

    const rail1pts = [];
    const rail2pts = [];
    for (let i = 0; i <= STEPS * 4; i++) {
      const t = i / (STEPS * 4);
      const angle = t * Math.PI * 2 * TURNS;
      const y = (t - 0.5) * HEIGHT;
      rail1pts.push(new THREE.Vector3(Math.cos(angle) * RADIUS, y, Math.sin(angle) * RADIUS));
      rail2pts.push(new THREE.Vector3(Math.cos(angle + Math.PI) * RADIUS, y, Math.sin(angle + Math.PI) * RADIUS));
    }
    const railMat = new THREE.LineBasicMaterial({ color: 0x333333 });
    ladderGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(rail1pts), railMat));
    ladderGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(rail2pts), railMat));

    const rungGeo = new THREE.CylinderGeometry(0.04, 0.04, RADIUS * 2, 8);
    for (let i = 0; i < STEPS; i++) {
      const t = i / STEPS;
      const angle = t * Math.PI * 2 * TURNS;
      const y = (t - 0.5) * HEIGHT;
      const rung = new THREE.Mesh(
        rungGeo,
        new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.7, roughness: 0.3 })
      );
      rung.position.set(0, y, 0);
      rung.rotation.z = Math.PI / 2;
      rung.rotation.y = angle;
      ladderGroup.add(rung);
    }

    const nodeGeo = new THREE.SphereGeometry(0.12, 12, 12);
    for (let i = 0; i < STEPS; i++) {
      const t = i / STEPS;
      const angle = t * Math.PI * 2 * TURNS;
      const y = (t - 0.5) * HEIGHT;
      [-1, 1].forEach(side => {
        const n = new THREE.Mesh(
          nodeGeo,
          new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xaaaaaa, emissiveIntensity: 0.3, metalness: 0.2, roughness: 0.3 })
        );
        const a2 = angle + (side === 1 ? Math.PI : 0);
        n.position.set(Math.cos(a2) * RADIUS, y, Math.sin(a2) * RADIUS);
        ladderGroup.add(n);
      });
    }

    // Spine
    ladderGroup.add(new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, HEIGHT, 8),
      new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x888888, emissiveIntensity: 0.3 })
    ));

    // Stars background
    const sPos = new Float32Array(1500).map(() => (Math.random() - 0.5) * 120);
    const sGeo = new THREE.BufferGeometry();
    sGeo.setAttribute('position', new THREE.Float32BufferAttribute(sPos, 3));
    const sMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.04, transparent: true, opacity: 0.18 });
    scene.add(new THREE.Points(sGeo, sMat));

    let scrollP = 0;
    let targetP = 0;
    let camY = 0;
    let targetCamY = 0;
    let ladderRot = 0;
    let targetLadderRot = 0;
    let activeSection = -1;

    const onScroll = () => {
      const { scrollTop: st, scrollHeight: sh, clientHeight: ch } = scrollArea;
      targetP = st / (sh - ch);
      targetLadderRot = targetP * Math.PI * 4;
      targetCamY = targetP * HEIGHT * 0.6 - HEIGHT * 0.3;
    };

    scrollArea.addEventListener('scroll', onScroll, { passive: true });

    const secPoints = SECTIONS.map((_, i) => (i + 0.5) / SECTIONS.length);

    const updateTextBlocks = (p: number) => {
      let newActive = -1;
      secPoints.forEach((sp, i) => {
        if (Math.abs(p - sp) < 0.12) newActive = i;
      });

      if (newActive !== activeSection) {
        if (activeSection >= 0) {
          const el = document.getElementById('ltb' + activeSection);
          if (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(-50%)';
          }
        }
        if (newActive >= 0) {
          const el = document.getElementById('ltb' + newActive);
          const s = SECTIONS[newActive];
          if (el) {
            el.style.transition = 'none';
            el.style.opacity = '0';
            el.style.transform = `translateY(-50%) translateX(${s.side === 'left' ? '-30px' : '30px'})`;
            requestAnimationFrame(() => {
              el.style.transition = 'opacity .5s ease, transform .5s ease';
              el.style.opacity = '1';
              el.style.transform = 'translateY(-50%) translateX(0)';
            });
          }
        }
        activeSection = newActive;
      }
    };

    const highlightRungs = (p: number) => {
      const centerIdx = Math.floor(p * STEPS);
      let rIdx = 0;
      ladderGroup.children.forEach(c => {
        const mesh = c as THREE.Mesh;
        if (
          mesh.isMesh &&
          mesh.geometry.type === 'CylinderGeometry' &&
          (mesh.geometry as THREE.CylinderGeometry).parameters &&
          (mesh.geometry as THREE.CylinderGeometry).parameters.radiusTop === 0.04
        ) {
          const dist = Math.abs(rIdx - centerIdx);
          const glow = Math.max(0, 1 - dist * 0.4);
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.color.setHex(glow > 0.3 ? 0xffffff : 0x222222);
          mat.emissive = mat.emissive || new THREE.Color();
          mat.emissive.setHex(glow > 0.3 ? 0xaaaaaa : 0x000000);
          mat.emissiveIntensity = glow * 0.5;
          rIdx++;
        }
      });
    };

    const onResize = () => {
      renderer.setSize(W(), H());
      cam.aspect = W() / H();
      cam.updateProjectionMatrix();
    };

    window.addEventListener('resize', onResize);

    let time = 0;
    let frameId = 0;
    const tick = () => {
      frameId = requestAnimationFrame(tick);
      time += 0.01;
      scrollP += (targetP - scrollP) * 0.08;
      camY += (targetCamY - camY) * 0.06;
      ladderRot += (targetLadderRot - ladderRot) * 0.06;
      cam.position.y = camY;
      cam.position.x = Math.sin(time * 0.3) * 0.3;
      cam.lookAt(0, camY, 0);
      ladderGroup.rotation.y = ladderRot + time * 0.05;
      
      const progressFill = ladderProgressFillRef.current;
      if (progressFill) {
        progressFill.style.height = scrollP * 100 + '%';
      }

      updateTextBlocks(scrollP);
      highlightRungs(scrollP);
      renderer.render(scene, cam);
    };
    tick();

    return () => {
      window.removeEventListener('resize', onResize);
      scrollArea.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frameId);
      scene.clear();
      renderer.dispose();
      sGeo.dispose();
      sMat.dispose();
      railMat.dispose();
      rungGeo.dispose();
      nodeGeo.dispose();
    };
  }, []);

  // IntersectionObserver for counting facts in #about section
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const target = parseInt(el.getAttribute('data-target') || '0');
          let current = 0;
          const inc = target / 60;
          const timer = setInterval(() => {
            current += inc;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = String(Math.floor(current));
          }, 22);
          observer.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );

    factRefs.current.forEach(c => {
      if (c) observer.observe(c);
    });

    return () => observer.disconnect();
  }, []);

  // GSAP ScrollTrigger Animations
  useEffect(() => {
    const triggers = [
      gsap.from('#about .about-label', { scrollTrigger: { trigger: '#about', start: 'top 80%' }, opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }),
      gsap.from('#about .about-title', { scrollTrigger: { trigger: '#about', start: 'top 75%' }, opacity: 0, y: 30, duration: 1, ease: 'power3.out' }),
      gsap.from('#about .about-body p', { scrollTrigger: { trigger: '#about', start: 'top 70%' }, opacity: 0, y: 20, duration: 0.8, stagger: 0.15, ease: 'power3.out' }),
      gsap.from('#about .fact-item', { scrollTrigger: { trigger: '.about-facts', start: 'top 85%' }, opacity: 0, y: 30, duration: 0.7, stagger: 0.12, ease: 'power3.out' }),
      gsap.from('#tech .tech-label', { scrollTrigger: { trigger: '#tech', start: 'top 80%' }, opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }),
      gsap.from('#tech .tech-title', { scrollTrigger: { trigger: '#tech', start: 'top 75%' }, opacity: 0, y: 30, duration: 1, ease: 'power3.out' }),
      gsap.from('#tech .tech-card', { scrollTrigger: { trigger: '.tech-grid', start: 'top 80%' }, opacity: 0, y: 40, duration: 0.7, stagger: 0.1, ease: 'power3.out' }),
      gsap.from('#architecture .tech-label', { scrollTrigger: { trigger: '#architecture', start: 'top 80%' }, opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }),
      gsap.from('#architecture .tech-title', { scrollTrigger: { trigger: '#architecture', start: 'top 75%' }, opacity: 0, y: 30, duration: 1, ease: 'power3.out' }),
      gsap.from('#architecture .arch-mod', { scrollTrigger: { trigger: '.arch-modules', start: 'top 85%' }, opacity: 0, x: -20, duration: 0.6, stagger: 0.08, ease: 'power3.out' }),
      gsap.from('#architecture .arch-fact', { scrollTrigger: { trigger: '.arch-facts', start: 'top 85%' }, opacity: 0, y: 20, duration: 0.7, stagger: 0.12, ease: 'power3.out' }),
      gsap.from('#work .work-header', { scrollTrigger: { trigger: '#work', start: 'top 80%' }, opacity: 0, y: 30, duration: 0.9, ease: 'power3.out' }),
      gsap.from('.work-card', { scrollTrigger: { trigger: '#work-gallery', start: 'top 80%' }, opacity: 0, y: 50, duration: 0.8, stagger: 0.1, ease: 'power3.out' }),
      gsap.from('#footer .footer-cta', { scrollTrigger: { trigger: '#footer', start: 'top 80%' }, opacity: 0, y: 30, duration: 1, ease: 'power3.out' }),
    ];

    return () => {
      triggers.forEach(t => t.scrollTrigger?.kill());
    };
  }, []);

  // Hold-to-blast Handlers
  const startHold = () => {
    if (blastedRef.current) return;
    holdingRef.current = true;
    setIsHolding(true);
    startRef.current = Date.now();

    const update = () => {
      if (!holdingRef.current) return;
      const p = Math.min((Date.now() - startRef.current) / 1200, 1);
      setBlastProgress(p);
      if (p >= 1) {
        holdingRef.current = false;
        setIsHolding(false);
        triggerBlast();
        return;
      }
      rafRef.current = requestAnimationFrame(update);
    };
    rafRef.current = requestAnimationFrame(update);
  };

  const stopHold = () => {
    holdingRef.current = false;
    setIsHolding(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setBlastProgress(0);
  };

  const triggerBlast = () => {
    blastedRef.current = true;
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;inset:0;z-index:9998;pointer-events:none';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles = Array.from({ length: 200 }, () => ({
      x: window.innerWidth / 2,
      y: window.innerHeight * 0.88,
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 1.2) * 16,
      life: 1,
      size: Math.random() * 3 + 1,
      color: Math.random() > 0.5 ? 255 : Math.floor(Math.random() * 180 + 60),
    }));

    let frame = 0;
    const animBlast = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.4;
        p.life -= 0.016;
        if (p.life <= 0) return;
        ctx.globalAlpha = p.life;
        ctx.fillStyle = `rgb(${p.color},${p.color},${p.color})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      frame++;
      if (frame < 120) {
        requestAnimationFrame(animBlast);
      } else {
        canvas.remove();
      }
    };
    animBlast();

    setTimeout(() => {
      blastedRef.current = false;
      setBlastProgress(0);
      navigate('/notes'); // Redirect to Feed on completion!
    }, 1500);
  };

  const cardsData = [
    { tag: 'Notes', title: 'Feed', desc: 'Заметки с тегами, медиа-вложениями и пином.', icon: <path d="M4 4h16v4H4zM4 10h16M4 14h16M4 18h10" /> },
    { tag: 'Board', title: 'Kanban', desc: 'Задачи с подзадачами. Просто работает.', icon: <><rect x="3" y="4" width="6" height="16" rx="1" /><rect x="9.5" y="4" width="6" height="10" rx="1" /><rect x="16" y="4" width="6" height="13" rx="1" /></> },
    { tag: 'Ideas', title: 'Ideas Hub', desc: 'Структурированные идеи со статусами и метриками.', icon: <><circle cx="12" cy="9" r="6" /><path d="M9.5 20h5M10 17h4" /></> },
    { tag: 'Templates', title: 'MD Templates', desc: 'Готовые markdown-шаблоны для повторяющихся задач.', icon: <><path d="M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" /><path d="M14 3v5h5M9 13h6M9 16.5h6" /></> },
    { tag: 'Wallpaper', title: 'Wallpapers', desc: 'Кастомные обои рабочего пространства, до 50MB.', icon: <><rect x="3" y="4" width="18" height="14" rx="1" /><circle cx="8.5" cy="9" r="1.5" /><path d="M3 15l5-5 4 4 3-3 6 6" /></> },
    { tag: 'Dashboard', title: 'Home', desc: 'Главный экран с навигацией по всем модулям.', icon: <><rect x="3" y="3" width="8" height="8" rx="1" /><rect x="13" y="3" width="8" height="5" rx="1" /><rect x="13" y="10" width="8" height="11" rx="1" /><rect x="3" y="13" width="8" height="8" rx="1" /></> },
  ];

  return (
    <div className="landing-root-container">
      {/* PRELOADER */}
      {showPreloader && (
        <div id="preloader">
          <div id="preloader-text">Envie</div>
          <div id="preloader-line"></div>
        </div>
      )}

      {/* NAV */}
      <nav id="main-nav" className={`main-nav ${isNavVisible || !showPreloader ? 'visible' : ''}`}>
        <a className="logo" href="#">Envie<span>.</span></a>
        <div className="nav-links">
          <a href="#about">О проекте</a>
          <a href="#ladder-section">Фичи</a>
          <a href="#tech">Стек</a>
          <a href="#architecture">Архитектура</a>
          <a href="#work">Интерфейс</a>
          <button 
            onClick={() => navigate('/notes')} 
            className="px-3.5 py-1.5 bg-white text-black hover:bg-white/90 rounded-md text-[11px] font-semibold tracking-wider uppercase transition-colors duration-200 cursor-pointer"
            style={{ fontWeight: 600 }}
          >
            К заметкам
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero">
        <div id="globe-wrap">
          <canvas id="hero-canvas" ref={heroCanvasRef}></canvas>
        </div>
        <div id="hero-content">
          <div className="hero-eyebrow">Локальный штаб для соло-разработчика</div>
          <h1 className="hero-title">
            <span className="line">Personal</span>
            <span className="line"><em>Headquarters.</em></span>
          </h1>
          <p className="hero-sub">Notes · Board · Ideas — всё в одном месте.<br />Без облака. Без авторизации. Без лишнего.</p>
          <div className="hero-hint">Scroll to explore</div>
        </div>
        <div id="hold-indicator">
          <div 
            id="hold-ring" 
            className={isHolding ? 'active' : ''}
            onMouseDown={startHold}
            onMouseUp={stopHold}
            onMouseLeave={stopHold}
            onTouchStart={startHold}
            onTouchEnd={stopHold}
          >
            <svg width="52" height="52" viewBox="0 0 52 52">
              <circle id="hold-ring-bg" cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <circle 
                id="hold-ring-progress" 
                cx="26" 
                cy="26" 
                r="22" 
                fill="none" 
                stroke="white" 
                strokeWidth="1"
                strokeDasharray={CIRC} 
                strokeDashoffset={CIRC * (1 - blastProgress)} 
                strokeLinecap="round" 
              />
            </svg>
          </div>
          <div id="hold-text">Hold to blast</div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div className="about-label">О проекте</div>
        <h2 className="about-title">
          Локальное приложение<br />для управления мыслями,<br /><span className="dim">задачами и идеями.</span>
        </h2>
        <div className="about-body">
          <p>Envie создан для соло-разработчиков, которые ценят контроль над своими данными. Все заметки, задачи и идеи хранятся локально — никаких облаков, никакой авторизации, никаких подписок.</p>
          <p>Заметки с тегами, медиа и пином, канбан-доска с подзадачами, база идей со статусами, MD-шаблоны, кастомные обои рабочего пространства и дашборд — всё это работает из одного окна.</p>
        </div>
        <div className="about-facts">
          <div className="fact-item">
            <div className="fact-number" data-target="6" ref={el => { factRefs.current[0] = el; }}>0</div>
            <div className="fact-label">Модулей<br />в одном приложении</div>
          </div>
          <div className="fact-item">
            <div className="fact-number" data-target="50" ref={el => { factRefs.current[1] = el; }}>0</div>
            <div className="fact-label">МБ лимит<br />на загрузку файлов</div>
          </div>
          <div className="fact-item">
            <div className="fact-number" data-target="100" ref={el => { factRefs.current[2] = el; }}>0</div>
            <div className="fact-label">Процентов<br />локальность данных</div>
          </div>
        </div>
      </section>

      {/* LADDER / SPIRAL */}
      <section id="ladder-section">
        <div id="ladder-root" ref={ladderScrollRef}>
          <div id="ladder-scroll-area">
            <div id="ladder-scroll-inner">
              <div id="ladder-sticky">
                <canvas id="ladder-canvas" ref={ladderCanvasRef}></canvas>
                <div id="ladder-progress">
                  <div id="ladder-progress-fill" ref={ladderProgressFillRef}></div>
                </div>
                <div id="ladder-hint">Scroll</div>
                {SECTIONS.map((s, i) => (
                  <div 
                    key={i} 
                    className="ladder-text-block" 
                    id={'ltb' + i} 
                    style={{
                      left: s.side === 'left' ? '48px' : 'auto',
                      right: s.side === 'right' ? '48px' : 'auto',
                      opacity: 0
                    }}
                  >
                    <div className="eyebrow">{s.eyebrow}</div>
                    <h2>
                      {s.title.split('\n')[0]}<br />
                      <em>{s.title.split('\n')[1]}</em>
                    </h2>
                    <p>{s.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TECH */}
      <section id="tech">
        <div className="tech-label">Технологии</div>
        <h2 className="tech-title">Built with <span>clarity.</span></h2>
        <div className="tech-grid">
          <div className="tech-card">
            <h3>Backend</h3>
            <p>Java 21 + Spring Boot 3. REST API с чёткой структурой, Flyway-миграции, PostgreSQL. Всё предсказуемо.</p>
            <div className="stack-list">
              <span className="stack-tag">Java 21</span>
              <span className="stack-tag">Spring Boot 3</span>
              <span className="stack-tag">PostgreSQL</span>
              <span className="stack-tag">Flyway</span>
              <span className="stack-tag">JPA</span>
            </div>
          </div>
          <div className="tech-card">
            <h3>Frontend</h3>
            <p>React 19 + TypeScript + Vite. FSD-архитектура, TanStack Query, Tailwind CSS v4. Быстро, типизировано.</p>
            <div className="stack-list">
              <span className="stack-tag">React 19</span>
              <span className="stack-tag">TypeScript</span>
              <span className="stack-tag">Vite</span>
              <span className="stack-tag">Tailwind v4</span>
              <span className="stack-tag">TanStack Query</span>
            </div>
          </div>
          <div className="tech-card">
            <h3>Architecture</h3>
            <p>Feature-Sliced Design разделяет код на слои: entities, features, widgets, pages. Каждый модуль изолирован.</p>
            <div className="stack-list">
              <span className="stack-tag">FSD</span>
              <span className="stack-tag">Modular</span>
              <span className="stack-tag">Clean Code</span>
            </div>
          </div>
          <div className="tech-card">
            <h3>Data</h3>
            <p>Всё локально. Файлы до 50MB через Multipart upload. Zero-knowledge подход — данные принадлежат только вам.</p>
            <div className="stack-list">
              <span className="stack-tag">Local First</span>
              <span className="stack-tag">Zero Cloud</span>
              <span className="stack-tag">50MB Upload</span>
            </div>
          </div>
        </div>
      </section>

      {/* ARCHITECTURE */}
      <section id="architecture">
        <div className="tech-label">Как устроено</div>
        <h2 className="tech-title">Modular by <span>design.</span></h2>
        <div className="arch-intro">
          <p>Каждый модуль на бэкенде — изолированный пакет: свой контроллер, сервис, репозиторий и сущность. Без общего God-объекта, без скрытых связей между доменами.</p>
        </div>
        <div className="arch-modules">
          <div className="arch-mod"><span className="arch-mod-name">notes</span><span className="arch-chain">controller → service → repository → entity</span></div>
          <div className="arch-mod"><span className="arch-mod-name">board</span><span className="arch-chain">controller → service → repository → entity</span></div>
          <div className="arch-mod"><span className="arch-mod-name">ideas</span><span className="arch-chain">controller → service → repository → entity</span></div>
          <div className="arch-mod"><span className="arch-mod-name">templates</span><span className="arch-chain">controller → service → entity</span></div>
          <div className="arch-mod"><span className="arch-mod-name">wallpaper</span><span className="arch-chain">controller → service → repository → entity</span></div>
        </div>
        <div className="arch-facts">
          <div className="arch-fact"><span className="arch-fact-num">6</span><span className="arch-fact-label">Flyway-миграций,<br />по одной на модуль</span></div>
          <div className="arch-fact"><span className="arch-fact-num">0</span><span className="arch-fact-label">Внешних AI-сервисов —<br />убраны из архитектуры</span></div>
          <div className="arch-fact"><span className="arch-fact-num">1</span><span className="arch-fact-label">Origin в CORS —<br />только localhost</span></div>
        </div>
      </section>

      {/* WORK / FLOATING GALLERY */}
      <section id="work">
        <div className="work-header">
          <h2>Interface <span>Preview</span></h2>
          <p>Шесть модулей, один штаб. Каждый экран продуман для скорости и ясности.</p>
        </div>
        <div id="work-gallery">
          {cardsData.map((d, i) => (
            <div key={i} className="work-card">
              <div className="card-visual">
                <div className="v-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                    {d.icon}
                  </svg>
                </div>
              </div>
              <div className="work-card-info">
                <div className="tag">{d.tag}</div>
                <h3>{d.title}</h3>
                <p>{d.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer id="footer">
        <div id="footer-lines">
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={i} 
              className="footer-line" 
              style={{ top: i * 12 + 4 + 'px' }} 
            />
          ))}
        </div>
        <div className="footer-top">
          <div className="footer-cta">
            Собери свой<br />
            <a href="https://github.com/MrSgemaSeny/Envie" target="_blank" rel="noopener noreferrer">
              штаб на GitHub.
            </a>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4>Проект</h4>
              <a href="#about">О проекте</a>
              <a href="#ladder-section">Фичи</a>
              <a href="#tech">Стек</a>
            </div>
            <div className="footer-col">
              <h4>Модули</h4>
              <a href="#ladder-section">Notes</a>
              <a href="#ladder-section">Board</a>
              <a href="#ladder-section">Ideas</a>
              <a href="#ladder-section">Templates</a>
              <a href="#ladder-section">Wallpaper</a>
            </div>
            <div className="footer-col">
              <h4>GitHub</h4>
              <a href="https://github.com/MrSgemaSeny/Envie" target="_blank" rel="noopener noreferrer">Репозиторий</a>
              <a href="https://github.com/MrSgemaSeny/Envie/issues" target="_blank" rel="noopener noreferrer">Issues</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>Envie — Personal Headquarters</p>
          <p>Built with clarity.</p>
        </div>
      </footer>
    </div>
  );
};
