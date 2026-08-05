import { useEffect, useRef, type RefObject } from 'react';
import * as THREE from 'three';

/**
 * Renders a Three.js helix ladder inside a canvas element.
 * The ladder rotates and the camera moves based on scroll progress.
 * Returns a setter function for scroll progress [0..1].
 */
export function useLadder(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  containerRef: RefObject<HTMLDivElement | null>
): { setProgress: (p: number) => void } {
  const progressRef = useRef(0);
  const frameRef = useRef(0);

  const setProgress = (p: number) => {
    progressRef.current = p;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const W = () => container.clientWidth;
    const H = () => container.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W(), H());
    renderer.setClearColor(0x08080f, 1);

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const cam = new THREE.PerspectiveCamera(50, W() / H(), 0.1, 200);
    // Camera positioned at center (x = 0)
    cam.position.set(0, 0, 14);

    // Lights - Pure white/gray lights for a beautiful monochrome aesthetic
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));
    const dLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dLight.position.set(5, 5, 5);
    scene.add(dLight);
    const dLight2 = new THREE.DirectionalLight(0xcccccc, 0.8);
    dLight2.position.set(-5, -3, 2);
    scene.add(dLight2);

    // Helix parameters
    const STEPS = 40;
    const RADIUS = 1.8;
    const HEIGHT = 28;
    const TURNS = 2.5;

    const ladderGroup = new THREE.Group();
    // Shift the ladder group significantly to the right (x = 4.2)
    ladderGroup.position.set(4.2, 0, 0);
    scene.add(ladderGroup);

    // Two helical rails
    const rail1pts: THREE.Vector3[] = [];
    const rail2pts: THREE.Vector3[] = [];
    for (let i = 0; i <= STEPS * 4; i++) {
      const t = i / (STEPS * 4);
      const angle = t * Math.PI * 2 * TURNS;
      const y = (t - 0.5) * HEIGHT;
      rail1pts.push(new THREE.Vector3(Math.cos(angle) * RADIUS, y, Math.sin(angle) * RADIUS));
      rail2pts.push(new THREE.Vector3(Math.cos(angle + Math.PI) * RADIUS, y, Math.sin(angle + Math.PI) * RADIUS));
    }

    // Gray rail material
    const railMat = new THREE.LineBasicMaterial({ color: 0x444444, linewidth: 2 });
    ladderGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(rail1pts), railMat));
    ladderGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(rail2pts), railMat));

    // Rungs
    const rungGeo = new THREE.CylinderGeometry(0.04, 0.04, RADIUS * 2, 8);
    for (let i = 0; i < STEPS; i++) {
      const t = i / STEPS;
      const angle = t * Math.PI * 2 * TURNS;
      const y = (t - 0.5) * HEIGHT;
      const rungMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.6, roughness: 0.3 });
      const rung = new THREE.Mesh(rungGeo, rungMat);
      rung.position.set(0, y, 0);
      rung.rotation.z = Math.PI / 2;
      rung.rotation.y = angle;
      ladderGroup.add(rung);
    }

    // Monochrome nodes at rail intersections (dim white/gray)
    const nodeGeo = new THREE.SphereGeometry(0.12, 12, 12);
    for (let i = 0; i < STEPS; i++) {
      const t = i / STEPS;
      const angle = t * Math.PI * 2 * TURNS;
      const y = (t - 0.5) * HEIGHT;
      [0, Math.PI].forEach((offset) => {
        const a = angle + offset;
        const nodeMat = new THREE.MeshStandardMaterial({
          color: 0x888888,
          emissive: 0x444444,
          emissiveIntensity: 0.6,
          metalness: 0.4,
          roughness: 0.2,
        });
        const n = new THREE.Mesh(nodeGeo, nodeMat);
        n.position.set(Math.cos(a) * RADIUS, y, Math.sin(a) * RADIUS);
        ladderGroup.add(n);
      });
    }

    // Central spine (subtle gray)
    const spineGeo = new THREE.CylinderGeometry(0.015, 0.015, HEIGHT, 8);
    const spineMat = new THREE.MeshStandardMaterial({ color: 0x555555, emissive: 0x222222, emissiveIntensity: 0.3 });
    ladderGroup.add(new THREE.Mesh(spineGeo, spineMat));

    // Stars
    const starCount = 3000;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPos[i] = (Math.random() - 0.5) * 120;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.04, transparent: true, opacity: 0.3 });
    scene.add(new THREE.Points(starGeo, starMat));

    // Animation state (smooth interpolation)
    let smoothP = 0;
    let camY = 0;
    let ladderRot = 0;
    let time = 0;

    function animate() {
      frameRef.current = requestAnimationFrame(animate);
      time += 0.01;

      const targetP = progressRef.current;
      smoothP += (targetP - smoothP) * 0.08;

      const targetCamY = smoothP * HEIGHT * 0.6 - HEIGHT * 0.3;
      camY += (targetCamY - camY) * 0.06;

      const targetLadderRot = smoothP * Math.PI * 4;
      ladderRot += (targetLadderRot - ladderRot) * 0.06;

      // Camera - looking towards the center (x = 0)
      cam.position.y = camY;
      cam.position.x = Math.sin(time * 0.3) * 0.3;
      cam.lookAt(0, camY, 0);

      // Ladder rotation = scroll + idle spin
      ladderGroup.rotation.y = ladderRot + time * 0.06;

      // Highlight rungs near scroll position in clean white glow
      const centerIdx = Math.floor(smoothP * STEPS);
      ladderGroup.children.forEach((child) => {
        if (
          child instanceof THREE.Mesh &&
          child.geometry === rungGeo
        ) {
          const rungY = child.position.y;
          const rungT = (rungY / HEIGHT) + 0.5;
          const rungIdx = Math.round(rungT * STEPS);
          const dist = Math.abs(rungIdx - centerIdx);
          const glow = Math.max(0, 1 - dist * 0.4);
          const mat = child.material as THREE.MeshStandardMaterial;
          mat.color.setHex(glow > 0.3 ? 0xffffff : 0x222222);
          mat.emissive = mat.emissive || new THREE.Color();
          mat.emissive.setHex(glow > 0.3 ? 0x888888 : 0x000000);
          mat.emissiveIntensity = glow * 0.8;
        }
      });

      renderer.render(scene, cam);
    }
    animate();

    // Resize
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

      ladderGroup.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.Points) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      starGeo.dispose();
      starMat.dispose();
      railMat.dispose();
      rungGeo.dispose();
      nodeGeo.dispose();
      spineGeo.dispose();
      spineMat.dispose();
      renderer.dispose();
    };
  }, [canvasRef, containerRef]);

  return { setProgress };
}
