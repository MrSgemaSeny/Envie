import { useEffect, useRef, useState, type RefObject } from 'react';
import * as THREE from 'three';

interface GlobeState {
  coords: string;
}

export function useGlobe(canvasRef: RefObject<HTMLCanvasElement | null>): GlobeState {
  const [coords, setCoords] = useState('51.5074\u00b0N / 0.0000\u00b0E');
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = () => window.innerWidth;
    const H = () => window.innerHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W(), H());
    renderer.setClearColor(0x000000, 1);

    // Scene
    const scene = new THREE.Scene();

    // Camera -- offset right so globe sits on the right half
    const cam = new THREE.PerspectiveCamera(38, W() / H(), 0.1, 100);
    cam.position.set(1.8, 0, 3.2);
    cam.lookAt(1.8, 0, 0);

    // Globe group
    const RADIUS = 1;
    const globeGroup = new THREE.Group();
    globeGroup.position.set(1.8, 0, 0);
    scene.add(globeGroup);

    // Materials
    const wireMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.18 });
    const wireMatBright = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.45 });

    // Latitude rings (every 10 degrees)
    const LAT_LINES = 18;
    for (let i = 0; i <= LAT_LINES; i++) {
      const lat = -90 + (180 / LAT_LINES) * i;
      const phi = (90 - lat) * Math.PI / 180;
      const r = RADIUS * Math.sin(phi);
      const y = RADIUS * Math.cos(phi);
      const pts: THREE.Vector3[] = [];
      const SEG = 64;
      for (let j = 0; j <= SEG; j++) {
        const theta = (j / SEG) * Math.PI * 2;
        pts.push(new THREE.Vector3(r * Math.cos(theta), y, r * Math.sin(theta)));
      }
      const mat = lat === 0 ? wireMatBright : wireMat;
      globeGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
    }

    // Longitude meridians (every 15 degrees)
    const LON_LINES = 24;
    for (let i = 0; i < LON_LINES; i++) {
      const lon = (360 / LON_LINES) * i;
      const theta = lon * Math.PI / 180;
      const pts: THREE.Vector3[] = [];
      const SEG = 64;
      for (let j = 0; j <= SEG; j++) {
        const phi = (j / SEG) * Math.PI;
        pts.push(new THREE.Vector3(
          RADIUS * Math.sin(phi) * Math.cos(theta),
          RADIUS * Math.cos(phi),
          RADIUS * Math.sin(phi) * Math.sin(theta)
        ));
      }
      const mat = (i === 0 || i === LON_LINES / 2) ? wireMatBright : wireMat;
      globeGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
    }

    // Inner black sphere to hide back-facing lines
    const innerGeo = new THREE.SphereGeometry(RADIUS * 0.995, 64, 64);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
    globeGroup.add(new THREE.Mesh(innerGeo, innerMat));

    // Stars
    const starCount = 800;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPos[i] = (Math.random() - 0.5) * 60;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.04, transparent: true, opacity: 0.25 });
    scene.add(new THREE.Points(starGeo, starMat));

    // Animation
    let rotY = 0;
    const SPEED = 0.0015;

    function animate() {
      frameRef.current = requestAnimationFrame(animate);
      rotY += SPEED;
      globeGroup.rotation.y = rotY;

      // Update coordinates
      const lon = ((rotY * 180 / Math.PI) % 360 + 360) % 360;
      const displayLon = lon > 180 ? lon - 360 : lon;
      const lonDir = displayLon >= 0 ? 'E' : 'W';
      setCoords(`51.5074\u00b0N / ${Math.abs(displayLon).toFixed(4)}\u00b0${lonDir}`);

      renderer.render(scene, cam);
    }
    animate();

    // Resize handler
    function onResize() {
      renderer.setSize(W(), H());
      cam.aspect = W() / H();
      cam.updateProjectionMatrix();
    }
    window.addEventListener('resize', onResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frameRef.current);

      // Dispose all geometries and materials
      globeGroup.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.Points) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      starGeo.dispose();
      starMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      wireMat.dispose();
      wireMatBright.dispose();
      renderer.dispose();
    };
  }, [canvasRef]);

  return { coords };
}
