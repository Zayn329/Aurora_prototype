import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Move } from 'lucide-react';

export default function HeroGlobe() {
  const mountRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 480;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 0.2, 11.0);

    // 2. WebGL Renderer with alpha transparency
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 3. Lighting setup for clean polar aesthetic
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 2.2);
    sunLight.position.set(12, 12, 16);
    scene.add(sunLight);

    const polarRimLight = new THREE.DirectionalLight(0xbae6fd, 1.2);
    polarRimLight.position.set(-15, -10, -10);
    scene.add(polarRimLight);

    // 4. Globe Group
    const globeGroup = new THREE.Group();
    // Angle tilted towards Antarctica & Indian Ocean route corridor
    globeGroup.rotation.x = 0.45;
    globeGroup.rotation.y = -0.5;
    scene.add(globeGroup);

    // 5. Earth Sphere (calibrated compact size)
    const radius = 2.05;
    const sphereGeometry = new THREE.SphereGeometry(radius, 64, 64);

    const earthMaterial = new THREE.MeshStandardMaterial({
      // Keep the hero globe self-contained when no external earth texture is bundled.
      color: 0x7dd3fc,
      roughness: 0.5,
      metalness: 0.05,
      bumpScale: 0.03
    });

    const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
    globeGroup.add(earthMesh);

    // 6. Atmospheric Glow Shell
    const atmoGeometry = new THREE.SphereGeometry(radius * 1.018, 48, 48);
    const atmoMaterial = new THREE.MeshBasicMaterial({
      color: 0x7dd3fc,
      transparent: true,
      opacity: 0.28,
      side: THREE.BackSide
    });
    const atmoMesh = new THREE.Mesh(atmoGeometry, atmoMaterial);
    globeGroup.add(atmoMesh);

    // 7. Thin Orbital Dial Coordinate Rings
    const ringGeometry = new THREE.RingGeometry(radius * 1.24, radius * 1.244, 128);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });

    const ringMesh1 = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh1.rotation.x = Math.PI / 2.3;
    globeGroup.add(ringMesh1);

    const ringMesh2 = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh2.rotation.x = Math.PI / 1.7;
    ringMesh2.rotation.y = 0.4;
    globeGroup.add(ringMesh2);

    // Helper: Convert Lat/Lon to Vector3 coordinates on globe
    function latLngToVector3(lat, lon, r = radius) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      );
    }

    // 8. Key Expedition Waypoints & Pulsing Markers
    const waypoints = [
      { id: "bharati", name: "Bharati Station", lat: -69.4042, lon: 76.1872, color: 0x4f46e5, primary: true },
      { id: "maitri", name: "Maitri Station", lat: -70.7667, lon: 11.7333, color: 0x0284c7 },
      { id: "capetown", name: "Cape Town Gateway", lat: -33.9249, lon: 18.4241, color: 0x7c3aed },
      { id: "amery", name: "Amery Shelf Base", lat: -69.7500, lon: 71.5000, color: 0x059669 },
      { id: "goa", name: "NCPOR Headquarters", lat: 15.3857, lon: 73.8340, color: 0xd97706 },
      { id: "perth", name: "Perth Gateway", lat: -31.9505, lon: 115.8605, color: 0x475569 }
    ];

    const markerGroup = new THREE.Group();
    globeGroup.add(markerGroup);

    const ringsList = [];
    const waypointPositions = {};

    waypoints.forEach((wp) => {
      const pos = latLngToVector3(wp.lat, wp.lon, radius * 1.008);
      waypointPositions[wp.id] = pos;

      // Center Dot
      const dotGeo = new THREE.SphereGeometry(wp.primary ? 0.055 : 0.038, 16, 16);
      const dotMat = new THREE.MeshBasicMaterial({ color: wp.color });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.copy(pos);
      markerGroup.add(dot);

      // Pulsing Ring
      const circleGeo = new THREE.RingGeometry(0.07, 0.105, 32);
      const circleMat = new THREE.MeshBasicMaterial({
        color: wp.color,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(circleGeo, circleMat);
      ring.position.copy(pos);
      ring.lookAt(new THREE.Vector3(0, 0, 0));
      markerGroup.add(ring);

      ringsList.push({ mesh: ring });
    });

    // 9. Curved Expedition Great Circle Arcs
    const routes = [
      { from: "goa", to: "capetown", color: 0x818cf8, altitude: 0.7 },
      { from: "capetown", to: "bharati", color: 0x38bdf8, altitude: 0.8 },
      { from: "bharati", to: "amery", color: 0x34d399, altitude: 0.3 },
      { from: "bharati", to: "maitri", color: 0xa855f7, altitude: 0.5 },
      { from: "bharati", to: "perth", color: 0x94a3b8, altitude: 0.6 }
    ];

    const routesGroup = new THREE.Group();
    globeGroup.add(routesGroup);

    routes.forEach((route) => {
      const p1 = waypointPositions[route.from];
      const p2 = waypointPositions[route.to];
      if (!p1 || !p2) return;

      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const distance = p1.distanceTo(p2);
      mid.normalize().multiplyScalar(radius + Math.min(distance * 0.28, route.altitude || 0.5));

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(40);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      const material = new THREE.LineBasicMaterial({
        color: route.color,
        transparent: true,
        opacity: 0.8,
        linewidth: 2
      });

      const line = new THREE.Line(geometry, material);
      routesGroup.add(line);
    });

    // 10. EASY & FLUID DRAGGING (High Responsiveness & Natural Inertia)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let velocity = { x: 0, y: 0 };

    const domElement = renderer.domElement;

    const onMouseDown = (e) => {
      isDragging = true;
      setIsInteracting(true);
      velocity = { x: 0, y: 0 };
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      // Higher sensitivity for effortless spin
      globeGroup.rotation.y += deltaX * 0.007;
      globeGroup.rotation.x += deltaY * 0.007;
      // Clamp vertical tilt
      globeGroup.rotation.x = Math.max(-1.25, Math.min(1.25, globeGroup.rotation.x));

      velocity = { x: deltaX * 0.005, y: deltaY * 0.005 };
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
      setIsInteracting(false);
    };

    // Touch Support for Mobile / Tablets
    let touchStartX = 0;
    let touchStartY = 0;

    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        setIsInteracting(true);
        velocity = { x: 0, y: 0 };
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        previousMousePosition = { x: touchStartX, y: touchStartY };
      }
    };

    const onTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const curX = e.touches[0].clientX;
      const curY = e.touches[0].clientY;
      const deltaX = curX - previousMousePosition.x;
      const deltaY = curY - previousMousePosition.y;

      // If predominantly horizontal, prevent default scroll so globe spins smoothly
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (e.cancelable) e.preventDefault();
      }

      globeGroup.rotation.y += deltaX * 0.007;
      globeGroup.rotation.x += deltaY * 0.007;
      globeGroup.rotation.x = Math.max(-1.25, Math.min(1.25, globeGroup.rotation.x));

      velocity = { x: deltaX * 0.005, y: deltaY * 0.005 };
      previousMousePosition = { x: curX, y: curY };
    };

    const onTouchEnd = () => {
      isDragging = false;
      setIsInteracting(false);
    };

    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    domElement.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);

    // 11. Animation Loop with Continuous Rotation & Inertial Coasting
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Continuous rotation + coasting
      if (!isDragging) {
        globeGroup.rotation.y += 0.0022 + velocity.x;
        globeGroup.rotation.x += velocity.y;

        // Smooth damping
        velocity.x *= 0.95;
        velocity.y *= 0.95;
      }

      // Pulse rings
      ringsList.forEach((r, idx) => {
        const pulse = 1 + 0.3 * Math.sin(elapsedTime * 3 + idx * 0.9);
        r.mesh.scale.set(pulse, pulse, pulse);
        r.mesh.material.opacity = 0.5 + 0.4 * Math.sin(elapsedTime * 3 + idx * 0.9);
      });

      renderer.render(scene, camera);
    };

    animate();

    // 12. Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || 800;
      const newHeight = container.clientHeight || 480;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', handleResize);

      if (container && domElement) {
        container.removeChild(domElement);
      }
      renderer.dispose();
      sphereGeometry.dispose();
      earthMaterial.dispose();
      atmoGeometry.dispose();
      atmoMaterial.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* 3D WebGL Canvas Container */}
      <div 
        ref={mountRef} 
        className={`w-full h-full cursor-grab ${isInteracting ? 'cursor-grabbing' : ''} touch-none`}
      />

      {/* Floating subtle gesture hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none flex items-center space-x-2 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-sky-200/60 shadow-sm text-xs text-slate-600 font-mono transition-opacity duration-300">
        <Move className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
        <span>Drag anywhere to easily rotate · Continuous 3D spin</span>
      </div>
    </div>
  );
}
