import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './DashboardPage.css';

gsap.registerPlugin(ScrollTrigger);

const SECTIONS = [
  { eyebrow: '01 — Notes', title: 'Лента\n<em>заметок</em>', body: 'Твиттер-стиль лента с тегами, медиа и пином. Быстрый захват мыслей без трения. Хештеги группируют контекст автоматически. Поддерживает загрузку картинок, документов и любых других вложений для ведения полноценного журнала разработки.', side: 'left' },
  { eyebrow: '02 — Board', title: 'Канбан\n<em>доска</em>', body: 'Список задач с подзадачами и чекбоксами. Двигается, когда двигаешься ты. Удобное отслеживание текущих спринтов без лишней бюрократии и сложных настроек Jira.', side: 'right' },
  { eyebrow: '03 — Ideas', title: 'База\n<em>идей</em>', body: 'Структурированное описание ваших будущих стартапов: формулировка проблемы, предлагаемое решение, целевая аудитория и способы монетизация. Метрики ценности и фильтрация статусов помогают сфокусироваться на главном.', side: 'left' },
  { eyebrow: '04 — Templates', title: 'MD\n<em>шаблоны</em>', body: 'Готовые markdown-шаблоны для повторяющихся процессов, чек-листов и промптов для языковых моделей. Встроенный редактор markdown с подсветкой синтаксиса и просмотром отрендеренного контента экономит часы работы.', side: 'right' },
  { eyebrow: '05 — Wallpaper', title: 'Свой\n<em>фон</em>', body: 'Полная кастомизация внешнего вида вашего штаба. Загружайте любые фоновые изображения, анимированные GIF-файлы или закольцованные видеообои объемом до 50 МБ. Переключение в один клик с поддержкой эффекта glassmorphism.', side: 'left' },
  { eyebrow: '06 — Dashboard', title: 'Точка\n<em>входа</em>', body: 'Главный экран с навигацией по всем модулям. Всё в одном окне. Статистика вашей базы знаний всегда перед глазами. Быстрые переходы во все рабочие пространства приложения.', side: 'right' },
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

  // Scroll and Counter Refs
  const factRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Hold-to-blast State
  const [isHolding, setIsHolding] = useState(false);
  const [blastProgress, setBlastProgress] = useState(0);
  const blastedRef = useRef(false);
  const holdingRef = useRef(false);
  const startRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const CIRC = 2 * Math.PI * 22;

  // Preloader & Hero entrance sequence
  useEffect(() => {
    const delay = showPreloader ? 2100 : 100;
    const timer = setTimeout(() => {
      setShowPreloader(false);
      sessionStorage.setItem('dashboard-preloader-shown', 'true');
      setIsNavVisible(true);

      // Hero content animations
      gsap.to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.8, delay: 0.1, ease: 'power3.out' });
      gsap.to('.hero-title', { opacity: 1, y: 0, duration: 1, delay: 0.25, ease: 'power3.out' });
      gsap.to('.hero-sub', { opacity: 1, y: 0, duration: 0.8, delay: 0.5, ease: 'power3.out' });
      gsap.to('.hero-hint', { opacity: 1, duration: 0.8, delay: 0.8, ease: 'power3.out' });
      gsap.to('#hold-indicator', { opacity: 1, duration: 0.8, delay: 1, ease: 'power3.out' });
    }, delay);

    return () => clearTimeout(timer);
  }, [showPreloader]);

  // Nav scroll logic (tracks the scrollable main element)
  useEffect(() => {
    const mainEl = document.querySelector('main');
    const scrollTarget = mainEl || window;
    
    const handleScroll = () => {
      const y = mainEl ? mainEl.scrollTop : window.scrollY;
      const nav = document.getElementById('main-nav');
      if (!nav) return;

      if (y > 80) {
        nav.classList.add('visible');
      } else {
        nav.classList.remove('visible');
      }
    };

    scrollTarget.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollTarget.removeEventListener('scroll', handleScroll);
  }, []);

  // Three.js Hero Canvas: Wireframe Box, core, rings & particle field (as on Kimi page)
  useEffect(() => {
    const canvas = heroCanvasRef.current;
    if (!canvas) return;

    const W = () => canvas.parentElement?.clientWidth || window.innerWidth;
    const H = () => canvas.parentElement?.clientHeight || window.innerHeight;

    // Set alpha to true and clear opacity to 0 to show background wallpapers
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W(), H());
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W() / H(), 0.1, 200);
    camera.position.set(0, 0, 12);

    scene.add(new THREE.AmbientLight(0xffffff, 0.12));
    const d1 = new THREE.DirectionalLight(0xffffff, 0.8);
    d1.position.set(4, 4, 5);
    scene.add(d1);
    const d2 = new THREE.DirectionalLight(0x888888, 0.4);
    d2.position.set(-4, -2, 3);
    scene.add(d2);

    // Particles
    const PARTICLE_COUNT = 2500;
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const vel: { x: number; y: number; z: number }[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
      vel.push({
        x: (Math.random() - 0.5) * 0.003,
        y: (Math.random() - 0.5) * 0.003,
        z: (Math.random() - 0.5) * 0.003,
      });
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.035,
      transparent: true,
      opacity: 0.35,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Wireframe cube
    const cubeGeo = new THREE.BoxGeometry(3.5, 3.5, 3.5, 8, 8, 8);
    const edges = new THREE.EdgesGeometry(cubeGeo);
    const cube = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.4 })
    );
    scene.add(cube);

    // Glowing core
    const coreGeo = new THREE.SphereGeometry(0.7, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      emissive: 0xffffff,
      emissiveIntensity: 0.1,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.85,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // Torus Rings
    const rings: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const rGeo = new THREE.TorusGeometry(1.2 + i * 0.6, 0.008, 8, 64);
      const rMat = new THREE.MeshBasicMaterial({ color: 0x444444, transparent: true, opacity: 0.25 });
      const ring = new THREE.Mesh(rGeo, rMat);
      ring.rotation.x = Math.random() * Math.PI;
      ring.rotation.y = Math.random() * Math.PI;
      rings.push(ring);
      scene.add(ring);
    }

    const onResize = () => {
      renderer.setSize(W(), H());
      camera.aspect = W() / H();
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    let frameId = 0;
    const animateHero = () => {
      frameId = requestAnimationFrame(animateHero);
      const t = performance.now() * 0.001;

      // Particle Drift
      const positions = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        positions[i * 3] += vel[i].x + Math.sin(t + i) * 0.0003;
        positions[i * 3 + 1] += vel[i].y + Math.cos(t + i * 0.7) * 0.0003;
        positions[i * 3 + 2] += vel[i].z;
        if (Math.abs(positions[i * 3]) > 20) positions[i * 3] *= -0.5;
        if (Math.abs(positions[i * 3 + 1]) > 20) positions[i * 3 + 1] *= -0.5;
        if (Math.abs(positions[i * 3 + 2]) > 15) positions[i * 3 + 2] *= -0.5;
      }
      pGeo.attributes.position.needsUpdate = true;

      // Cube Rotation
      cube.rotation.x = t * 0.08;
      cube.rotation.y = t * 0.12;

      // Core scale pulse
      const pulse = 1 + Math.sin(t * 1.5) * 0.08;
      core.scale.set(pulse, pulse, pulse);
      core.rotation.x = t * 0.3;
      core.rotation.y = t * 0.2;
      coreMat.emissiveIntensity = 0.1 + Math.sin(t * 2) * 0.05;

      // Rings
      rings.forEach((r, idx) => {
        r.rotation.x += 0.002 * (idx + 1);
        r.rotation.y += 0.003 * (idx + 1);
      });

      // Camera drift
      camera.position.x = Math.sin(t * 0.2) * 0.5;
      camera.position.y = Math.cos(t * 0.15) * 0.3;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animateHero();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frameId);
      scene.clear();
      renderer.dispose();
      pGeo.dispose();
      pMat.dispose();
      cubeGeo.dispose();
      edges.dispose();
      coreGeo.dispose();
      coreMat.dispose();
    };
  }, []);

  // Three.js Scroll Helix Canvas & scroll synchronization across sections (No nested scrollbars)
  useEffect(() => {
    const canvas = ladderCanvasRef.current;
    if (!canvas) return;

    const mainEl = document.querySelector('main');
    if (!mainEl) return;

    const W = () => canvas.parentElement?.clientWidth || window.innerWidth;
    const H = () => canvas.parentElement?.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W(), H());
    renderer.setClearColor(0x000000, 0); // Transparent to blend with dashboard backgrounds

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(50, W() / H(), 0.1, 200);
    cam.position.set(0, 0, 14);

    scene.add(new THREE.AmbientLight(0xffffff, 0.12));
    const dl1 = new THREE.DirectionalLight(0xffffff, 0.9);
    dl1.position.set(5, 5, 5);
    scene.add(dl1);
    const dl2 = new THREE.DirectionalLight(0x666666, 0.5);
    dl2.position.set(-5, -3, 2);
    scene.add(dl2);

    const STEPS = 40;
    const RADIUS = 2.0;
    const HEIGHT = 30;
    const TURNS = 2.8;
    const ladderGroup = new THREE.Group();
    scene.add(ladderGroup);

    // Rails
    const rail1pts = [];
    const rail2pts = [];
    for (let i = 0; i <= STEPS * 4; i++) {
      const t = i / (STEPS * 4);
      const angle = t * Math.PI * 2 * TURNS;
      const y = (t - 0.5) * HEIGHT;
      rail1pts.push(new THREE.Vector3(Math.cos(angle) * RADIUS, y, Math.sin(angle) * RADIUS));
      rail2pts.push(new THREE.Vector3(Math.cos(angle + Math.PI) * RADIUS, y, Math.sin(angle + Math.PI) * RADIUS));
    }
    const railMat = new THREE.LineBasicMaterial({ color: 0x2a2a2a });
    ladderGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(rail1pts), railMat));
    ladderGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(rail2pts), railMat));

    // Rungs
    const rungMatBase = new THREE.MeshStandardMaterial({ color: 0x151515, metalness: 0.7, roughness: 0.25 });
    const rungGeo = new THREE.CylinderGeometry(0.035, 0.035, RADIUS * 2, 8);
    const rungs: { mesh: THREE.Mesh; idx: number }[] = [];
    for (let i = 0; i < STEPS; i++) {
      const t = i / STEPS;
      const angle = t * Math.PI * 2 * TURNS;
      const y = (t - 0.5) * HEIGHT;
      const rung = new THREE.Mesh(rungGeo, rungMatBase.clone());
      rung.position.set(0, y, 0);
      rung.rotation.z = Math.PI / 2;
      rung.rotation.y = angle;
      ladderGroup.add(rung);
      rungs.push({ mesh: rung, idx: i });
    }

    // Nodes
    const nodeGeo = new THREE.SphereGeometry(0.1, 10, 10);
    const nodeMatBase = new THREE.MeshStandardMaterial({
      color: 0x333333,
      emissive: 0x222222,
      emissiveIntensity: 0.3,
      metalness: 0.3,
      roughness: 0.3,
    });
    for (let i = 0; i < STEPS; i++) {
      const t = i / STEPS;
      const angle = t * Math.PI * 2 * TURNS;
      const y = (t - 0.5) * HEIGHT;
      [-1, 1].forEach(side => {
        const a2 = angle + (side === 1 ? Math.PI : 0);
        const n = new THREE.Mesh(nodeGeo, nodeMatBase.clone());
        n.position.set(Math.cos(a2) * RADIUS, y, Math.sin(a2) * RADIUS);
        ladderGroup.add(n);
      });
    }

    // Central spine
    const spineGeo = new THREE.CylinderGeometry(0.012, 0.012, HEIGHT, 8);
    const spineMat = new THREE.MeshStandardMaterial({ color: 0x444444, emissive: 0x222222, emissiveIntensity: 0.2 });
    ladderGroup.add(new THREE.Mesh(spineGeo, spineMat));

    // Stars background
    const starPos = new Float32Array(2000).map(() => (Math.random() - 0.5) * 100);
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.03, transparent: true, opacity: 0.3 })));

    let scrollP = 0;
    let targetP = 0;
    let camY = 0;
    let targetCamY = 0;
    let ladderRot = 0;
    let targetLadderRot = 0;

    const onScroll = () => {
      const st = mainEl.scrollTop;
      const sh = mainEl.scrollHeight;
      const ch = mainEl.clientHeight;

      // Sizing boundaries: Helix starts active after the Hero section, and finishes before the work/footer gallery.
      const startScroll = ch * 0.8;
      const endScroll = sh - ch * 1.5;

      let p = (st - startScroll) / (endScroll - startScroll);
      p = Math.max(0, Math.min(1, p));

      targetP = p;
      targetLadderRot = p * Math.PI * 5;
      targetCamY = p * HEIGHT * 0.6 - HEIGHT * 0.3;

      // Handle transparent fade visibility
      const container = document.getElementById('ladder-container-fixed');
      if (container) {
        if (st > startScroll - 100 && st < sh - ch * 1.2) {
          container.style.opacity = '1';
        } else {
          container.style.opacity = '0';
        }
      }
    };

    mainEl.addEventListener('scroll', onScroll, { passive: true });

    const highlightRungs = (p: number) => {
      const centerIdx = Math.floor(p * STEPS);
      rungs.forEach(({ mesh, idx }) => {
        const dist = Math.abs(idx - centerIdx);
        const glow = Math.max(0, 1 - dist * 0.35);
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (glow > 0.25) {
          mat.color.setHex(0x555555);
          mat.emissive = new THREE.Color(0x333333);
          mat.emissiveIntensity = glow * 0.5;
        } else {
          mat.color.setHex(0x151515);
          mat.emissive = new THREE.Color(0x000000);
          mat.emissiveIntensity = 0;
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
    const animateLadder = () => {
      frameId = requestAnimationFrame(animateLadder);
      time += 0.008;

      scrollP += (targetP - scrollP) * 0.08;
      camY += (targetCamY - camY) * 0.06;
      ladderRot += (targetLadderRot - ladderRot) * 0.06;

      cam.position.y = camY;
      cam.position.x = Math.sin(time * 0.25) * 0.25;
      cam.lookAt(0, camY, 0);

      ladderGroup.rotation.y = ladderRot + time * 0.04;

      highlightRungs(scrollP);
      renderer.render(scene, cam);
    };
    animateLadder();

    // Trigger initial calculation
    onScroll();

    return () => {
      window.removeEventListener('resize', onResize);
      mainEl.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frameId);
      scene.clear();
      renderer.dispose();
      railMat.dispose();
      rungGeo.dispose();
      nodeGeo.dispose();
      spineGeo.dispose();
      spineMat.dispose();
      starGeo.dispose();
    };
  }, []);

  // IntersectionObserver for facts counting
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
          }, 25);
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

  // GSAP animations for text fading and sliding (fades blocks based on scroll triggers)
  useEffect(() => {
    const triggers: ScrollTrigger[] = [];

    // Fact / about items
    triggers.push(
      ScrollTrigger.create({
        trigger: '#about',
        scroller: document.querySelector('main') || window,
        start: 'top 80%',
        onEnter: () => {
          gsap.from('#about .about-label', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' });
          gsap.from('#about .about-title', { opacity: 0, y: 30, duration: 1, ease: 'power3.out' });
          gsap.from('#about .about-body p', { opacity: 0, y: 20, duration: 0.8, stagger: 0.15, ease: 'power3.out' });
          gsap.from('#about .fact-item', { opacity: 0, y: 30, duration: 0.7, stagger: 0.12, ease: 'power3.out' });
        },
        once: true
      })
    );

    // Feature Blocks
    SECTIONS.forEach((_, i) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: `#tb-${i}`,
          scroller: document.querySelector('main') || window,
          start: 'top 85%',
          onEnter: () => {
            gsap.fromTo(
              `#tb-${i} .feature-text-block`,
              { opacity: 0, x: SECTIONS[i].side === 'left' ? -40 : 40 },
              { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }
            );
          },
          once: true
        })
      );
    });

    // Tech Stack grid
    triggers.push(
      ScrollTrigger.create({
        trigger: '#tech',
        scroller: document.querySelector('main') || window,
        start: 'top 80%',
        onEnter: () => {
          gsap.from('#tech .tech-label', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' });
          gsap.from('#tech .tech-title', { opacity: 0, y: 30, duration: 1, ease: 'power3.out' });
          gsap.from('#tech .tech-card', { opacity: 0, y: 40, duration: 0.7, stagger: 0.1, ease: 'power3.out' });
        },
        once: true
      })
    );

    // Work cards header
    triggers.push(
      ScrollTrigger.create({
        trigger: '#work',
        scroller: document.querySelector('main') || window,
        start: 'top 80%',
        onEnter: () => {
          gsap.from('#work .work-header', { opacity: 0, y: 30, duration: 0.9, ease: 'power3.out' });
          gsap.from('.work-card', { opacity: 0, y: 50, duration: 0.8, stagger: 0.1, ease: 'power3.out' });
        },
        once: true
      })
    );

    return () => {
      triggers.forEach(t => t.kill());
    };
  }, []);

  // Clean CSS Grid layout used for work cards now.

  // Hold-to-blast timer & progress loops
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
      navigate('/notes');
    }, 1500);
  };

  const cardsData = [
    { tag: 'Notes', title: 'Feed', desc: 'Лента заметок с тегами, медиа и пином. Быстрый захват мыслей.', icon: <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /> },
    { tag: 'Board', title: 'Kanban', desc: 'Задачи с подзадачами и чекбоксами. Просто работает.', icon: <><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" /><line x1="3" y1="9" x2="21" y2="9" /></> },
    { tag: 'Ideas', title: 'Ideas Hub', desc: 'Структурированные идеи со статусами и метриками.', icon: <><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" /><path d="M9 18h6M10 22h4" /></> },
    { tag: 'Templates', title: 'MD Templates', desc: 'Готовые markdown-шаблоны для повторяющихся задач.', icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></> },
    { tag: 'Dashboard', title: 'Home', desc: 'Главный экран с навигацией по всем модулям.', icon: <><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></> },
  ];

  return (
    <div className="dashboard-root-container">
      {/* PRELOADER */}
      {showPreloader && (
        <div id="preloader">
          <div id="preloader-text">Envie Loading</div>
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
        <canvas id="hero-canvas" ref={heroCanvasRef}></canvas>
        <div id="hero-content">
          <div className="hero-eyebrow" style={{ opacity: 0, transform: 'translateY(20px)' }}>Локальный штаб для соло-разработчика</div>
          <h1 className="hero-title" style={{ opacity: 0, transform: 'translateY(30px)' }}>
            <span className="line">Personal</span>
            <span className="line"><em>Headquarters.</em></span>
          </h1>
          <p className="hero-sub" style={{ opacity: 0, transform: 'translateY(20px)' }}>Notes · Board · Ideas — всё в одном месте. Без облака. Без авторизации. Без лишнего.</p>
          <div className="hero-hint" style={{ opacity: 0 }}>Scroll to explore</div>
        </div>
        <div id="hold-indicator" style={{ opacity: 0 }}>
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
              <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <circle 
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
          <p>Лента заметок в стиле твиттера, канбан-доска с подзадачами, база идей с AI-генерацией архитектуры, MD-шаблоны и страница обоев — всё это работает из одного окна.</p>
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

      {/* FIXED HELIX SCROLL LADDER BACKGROUND CONTAINER */}
      <div className="ladder-container-fixed" id="ladder-container-fixed">
        <canvas id="ladder-canvas" ref={ladderCanvasRef}></canvas>
      </div>

      {/* LADDER SCROLL ROW MODULES */}
      <section className="features-scroll-wrapper" id="ladder-section">
        {SECTIONS.map((s, i) => (
          <div 
            key={i} 
            className="feature-section-row"
            id={`tb-${i}`}
            style={{
              justifyContent: s.side === 'left' ? 'flex-start' : 'flex-end',
            }}
          >
            <div className="feature-text-block" style={{ opacity: 0 }}>
              <div className="eyebrow">{s.eyebrow}</div>
              <h2 dangerouslySetInnerHTML={{ __html: s.title.replace(/\n/g, '<br>') }} />
              <p>{s.body}</p>
            </div>
          </div>
        ))}
      </section>

      {/* TECH STACK */}
      <section id="tech">
        <div className="tech-label">Технологии</div>
        <h2 className="tech-title">Built with <span>clarity.</span></h2>
        <div className="tech-grid">
          <div className="tech-card">
            <h3>Backend</h3>
            <p>Java 21 + Spring Boot 3. REST API с чёткой структурой, Flyway-миграции, PostgreSQL. Всё предсказуемо и масштабируемо.</p>
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
            <p>React 19 + TypeScript + Vite. FSD-архитектура, TanStack Query для состояния, Tailwind CSS v4 для стилей. Быстро, типизировано, поддерживаемо.</p>
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
            <p>Feature-Sliced Design разделяет код на слои: entities, features, widgets, pages. Каждый модуль изолирован и переиспользуем.</p>
            <div className="stack-list">
              <span className="stack-tag">FSD</span>
              <span className="stack-tag">Modular</span>
              <span className="stack-tag">Clean Code</span>
            </div>
          </div>
          <div className="tech-card">
            <h3>Data</h3>
            <p>Всё локально. Файлы до 50MB через Multipart upload. Zero-knowledge подход — ваши данные принадлежат только вам.</p>
            <div className="stack-list">
              <span className="stack-tag">Local First</span>
              <span className="stack-tag">Zero Cloud</span>
              <span className="stack-tag">50MB Upload</span>
            </div>
          </div>
        </div>
      </section>

      {/* WORK / MARQUEE GALLERY */}
      <section id="work">
        <div className="work-header">
          <h2>Interface <span>Preview</span></h2>
          <p>Пять модулей, один штаб. Каждый экран продуман для скорости и ясности.</p>
        </div>
        <div id="work-gallery">
          <div className="marquee-track">
            {[...cardsData, ...cardsData].map((d, i) => (
              <div 
                key={i} 
                className="work-card"
              >
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
        </div>
      </section>

      {/* FOOTER */}
      <footer id="footer">
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
export default DashboardPage;
