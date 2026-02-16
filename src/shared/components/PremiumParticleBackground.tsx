import { useEffect, useRef } from "react";
import * as THREE from "three";

interface PremiumParticleBackgroundProps {
  intensity?: number;
  className?: string;
  particleSize?: number;
  spread?: number;
}

const DEFAULT_CLASS_NAME = "absolute inset-0 z-0 opacity-60 pointer-events-none rounded-[2.5rem]";

const createParticleTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;

  const context = canvas.getContext("2d");
  if (!context) {
    return new THREE.Texture();
  }

  const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, "rgba(255, 240, 200, 1)");
  gradient.addColorStop(0.4, "rgba(229, 192, 123, 0.8)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 32, 32);

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return texture;
};

const PremiumParticleBackground = ({
  intensity = 1,
  className = DEFAULT_CLASS_NAME,
  particleSize = 0.5,
  spread = 60,
}: PremiumParticleBackgroundProps) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mountNode = mountRef.current;
    if (!mountNode) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const resize = () => {
      const width = Math.max(1, mountNode.clientWidth);
      const height = Math.max(1, mountNode.clientHeight);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    resize();
    mountNode.replaceChildren(renderer.domElement);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = Math.max(120, Math.round(800 * intensity));
    const positions = new Float32Array(particlesCount * 3);

    for (let index = 0; index < positions.length; index += 1) {
      positions[index] = (Math.random() - 0.5) * spread;
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const texture = createParticleTexture();
    const particlesMaterial = new THREE.PointsMaterial({
      size: Math.max(0.2, particleSize),
      map: texture,
      transparent: true,
      color: 0xffd700,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.8,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    let animationFrameId = 0;
    const animate = () => {
      animationFrameId = window.requestAnimationFrame(animate);
      particlesMesh.rotation.y += 0.001;
      particlesMesh.rotation.x += 0.0005;
      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationFrameId);
      scene.remove(particlesMesh);
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      texture.dispose();
      renderer.dispose();
      mountNode.replaceChildren();
    };
  }, [intensity, particleSize, spread]);

  return <div ref={mountRef} className={className} />;
};

export default PremiumParticleBackground;
