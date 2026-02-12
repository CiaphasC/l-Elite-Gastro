import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Fingerprint, Lock, UtensilsCrossed } from "lucide-react";
import * as THREE from "three";

interface LandingPageProps {
  onEnter: () => void;
}

const LANDING_PARTICLES_COUNT = 2500;

class GoldDustField {
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  private readonly renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  private readonly geometry = new THREE.BufferGeometry();
  private readonly material: THREE.PointsMaterial;
  private readonly mesh: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>;
  private readonly mouse = { x: 0, y: 0 };
  private animationFrameId: number | null = null;
  private readonly resizeHandler = () => this.resize();
  private readonly mouseMoveHandler = (event: MouseEvent) => {
    this.mouse.x = event.clientX / window.innerWidth - 0.5;
    this.mouse.y = event.clientY / window.innerHeight - 0.5;
  };

  constructor(private readonly mountNode: HTMLDivElement) {
    this.scene.fog = new THREE.FogExp2(0x050505, 0.0015);
    this.camera.position.z = 30;

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.resize();
    this.mountNode.replaceChildren(this.renderer.domElement);

    const positions = new Float32Array(LANDING_PARTICLES_COUNT * 3);
    for (let index = 0; index < positions.length; index += 1) {
      positions[index] = (Math.random() - 0.5) * 150;
    }

    this.geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    this.material = new THREE.PointsMaterial({
      size: 0.35,
      map: this.createParticleTexture(),
      transparent: true,
      color: 0xffd700,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.9,
    });
    this.mesh = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.mesh);

    window.addEventListener("resize", this.resizeHandler);
    document.addEventListener("mousemove", this.mouseMoveHandler);

    this.animate();
  }

  private createParticleTexture(): THREE.Texture {
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
  }

  private animate = (): void => {
    this.animationFrameId = window.requestAnimationFrame(this.animate);

    this.mesh.rotation.y += 0.0002;
    this.mesh.rotation.x += 0.0001;

    const time = Date.now() * 0.00005;
    this.camera.position.x += (this.mouse.x * 5 - this.camera.position.x) * 0.03;
    this.camera.position.y += (-this.mouse.y * 5 - this.camera.position.y) * 0.03;
    this.camera.position.z = 30 + Math.sin(time * 5) * 2;

    this.camera.lookAt(this.scene.position);
    this.renderer.render(this.scene, this.camera);
  };

  private resize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  dispose(): void {
    if (this.animationFrameId !== null) {
      window.cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    window.removeEventListener("resize", this.resizeHandler);
    document.removeEventListener("mousemove", this.mouseMoveHandler);

    this.scene.remove(this.mesh);
    this.geometry.dispose();

    const texture = this.material.map;
    if (texture) {
      texture.dispose();
    }

    this.material.dispose();
    this.renderer.dispose();
    this.mountNode.replaceChildren();
  }
}

const LandingPage = ({ onEnter }: LandingPageProps) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const transitionRunningRef = useRef(false);
  const fieldRef = useRef<GoldDustField | null>(null);

  useEffect(() => {
    if (!mountRef.current) {
      return;
    }

    // We encapsulate Three.js lifecycle in a dedicated class to keep React render pure.
    fieldRef.current = new GoldDustField(mountRef.current);
    return () => {
      fieldRef.current?.dispose();
      fieldRef.current = null;
    };
  }, []);

  const handleEnter = () => {
    if (transitionRunningRef.current) {
      return;
    }

    transitionRunningRef.current = true;

    const timeline = gsap.timeline({
      onComplete: () => {
        transitionRunningRef.current = false;
        onEnter();
      },
    });

    if (contentRef.current) {
      timeline.to(contentRef.current, {
        opacity: 0,
        y: -40,
        filter: "blur(20px)",
        duration: 1.2,
        ease: "power3.inOut",
      });
    }

    if (mountRef.current) {
      timeline.to(
        mountRef.current,
        {
          opacity: 0,
          duration: 1.5,
          ease: "power2.inOut",
        },
        contentRef.current ? "<0.2" : 0
      );
    }

    if (!contentRef.current && !mountRef.current) {
      window.setTimeout(() => {
        transitionRunningRef.current = false;
        onEnter();
      }, 800);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#050505]"
    >
      <div
        ref={mountRef}
        className="absolute inset-0 z-0 transition-opacity duration-1000"
      />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-[#050505]/20 to-[#050505]" />

      <div
        ref={contentRef}
        className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6"
      >
        <div className="group relative mb-16 cursor-default">
          <div className="absolute inset-0 rounded-full bg-[#E5C07B] opacity-10 blur-[90px]" />
          <div className="relative flex h-32 w-32 items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-[#E5C07B]/30 animate-pulse-glow" />
            <div className="absolute inset-2 rounded-full border border-[#E5C07B]/10" />
            <UtensilsCrossed
              className="text-[#E5C07B] drop-shadow-[0_0_20px_rgba(229,192,123,0.5)]"
              size={48}
              strokeWidth={1}
            />
          </div>
        </div>

        <div className="mb-24 text-center">
          <h1 className="mb-6 font-serif text-5xl font-light tracking-[0.05em] text-white drop-shadow-lg sm:text-6xl">
            L'Élite
          </h1>
          <div className="flex items-center justify-center gap-6">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#E5C07B]/50" />
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#E5C07B] opacity-90 sm:tracking-[0.6em]">
              Gastro Suite
            </p>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#E5C07B]/50" />
          </div>
        </div>

        <button
          type="button"
          onClick={handleEnter}
          className="group relative cursor-pointer bg-transparent px-16 py-5 transition-all hover:scale-105 active:scale-95"
        >
          <div className="absolute inset-0 rounded-full border border-[#E5C07B]/30 transition-colors duration-700 group-hover:border-[#E5C07B]/60" />
          <div className="absolute inset-0 rounded-full bg-[#E5C07B]/5 opacity-0 blur-sm transition-opacity duration-700 group-hover:opacity-100" />
          <div className="relative flex items-center gap-4 text-[#E5C07B]">
            <Fingerprint size={18} />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Acceder</span>
          </div>
        </button>

        <div className="absolute bottom-12 flex gap-8 text-[9px] font-medium uppercase tracking-widest text-zinc-600 sm:gap-12">
          <span className="flex items-center gap-2">
            <Lock size={8} /> Secure Access
          </span>
          <span>v2.2 Platinum</span>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
