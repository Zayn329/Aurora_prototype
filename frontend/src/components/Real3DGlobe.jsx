import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Realistic Expedition Stations & Nodes
export const EXPEDITION_WAYPOINTS = [
  { 
    id: "bharati", 
    name: "Bharati Research Station", 
    region: "Larsemann Hills, East Antarctica",
    lat: -69.4042, 
    lon: 76.1872, 
    isPrimary: true,
    color: 0x6366f1, // Indigo
    status: "Operational · 46 Personnel",
    activeIncidents: 0
  },
  { 
    id: "maitri", 
    name: "Maitri Research Station", 
    region: "Schirmacher Oasis",
    lat: -70.7667, 
    lon: 11.7333, 
    isPrimary: false,
    color: 0x3b82f6, // Blue
    status: "Active Research",
    activeIncidents: 0
  },
  { 
    id: "inland_traverse", 
    name: "Survey Zone A / Inland Base", 
    region: "East Antarctic Ice Sheet",
    lat: -73.5000, 
    lon: 74.0000, 
    isPrimary: false,
    color: 0xef4444, // Red Hazard
    status: "Route R-03 Hold · Wind 47 km/h",
    activeIncidents: 1
  },
  { 
    id: "amery_shelf", 
    name: "Amery Ice Shelf Camp", 
    region: "Prydz Bay Sector",
    lat: -69.7500, 
    lon: 71.5000, 
    isPrimary: false,
    color: 0x10b981, // Emerald
    status: "Survey Expedition Active",
    activeIncidents: 0
  },
  { 
    id: "coastal_port", 
    name: "Prydz Bay Vessel Rendezvous", 
    region: "Coastal Anchorage",
    lat: -68.5000, 
    lon: 75.0000, 
    isPrimary: false,
    color: 0x06b6d4, // Cyan
    status: "MV Vasiliy Golovnin Dispatched",
    activeIncidents: 0
  },
  { 
    id: "cape_town", 
    name: "Cape Town Gateway Port", 
    region: "South Africa Logistics Hub",
    lat: -33.9249, 
    lon: 18.4241, 
    isPrimary: false,
    color: 0x8b5cf6, // Purple
    status: "Logistics Staging Ground",
    activeIncidents: 0
  },
  { 
    id: "ncpor_goa", 
    name: "NCPOR Headquarters", 
    region: "Goa, India",
    lat: 15.3857, 
    lon: 73.8340, 
    isPrimary: false,
    color: 0xf59e0b, // Amber
    status: "Polar Command Center",
    activeIncidents: 0
  },
  { 
    id: "perth_gateway", 
    name: "Perth Naval Support", 
    region: "Western Australia",
    lat: -31.9505, 
    lon: 115.8605, 
    isPrimary: false,
    color: 0x64748b, // Slate
    status: "Telemetry & Weather Relay",
    activeIncidents: 0
  }
];

// Connected Great Circle Routes
const EXPEDITION_ROUTES = [
  { from: "ncpor_goa", to: "cape_town", color: 0x818cf8, altitude: 0.8 },
  { from: "cape_town", to: "coastal_port", color: 0x38bdf8, altitude: 0.9 },
  { from: "coastal_port", to: "bharati", color: 0x6366f1, altitude: 0.2 },
  { from: "bharati", to: "amery_shelf", color: 0x34d399, altitude: 0.3 },
  { from: "bharati", to: "inland_traverse", color: 0xf43f5e, dashed: true, altitude: 0.4 }, // Disrupted R-03
  { from: "bharati", to: "maitri", color: 0xa855f7, altitude: 0.6 },
  { from: "bharati", to: "perth_gateway", color: 0x94a3b8, altitude: 0.7 }
];

export default function Real3DGlobe({ 
  onSelectStation, 
  selectedStationId,
  isAutoRotating = true,
  rotationSpeed = 1,
  zoomScale = 1
}) {
  const mountRef = useRef(null);
  const globeGroupRef = useRef(null);
  const cameraRef = useRef(null);
  const autoRotateRef = useRef(isAutoRotating);
  const rotationSpeedRef = useRef(rotationSpeed);

  useEffect(() => {
    autoRotateRef.current = isAutoRotating;
  }, [isAutoRotating]);

  useEffect(() => {
    rotationSpeedRef.current = rotationSpeed;
  }, [rotationSpeed]);

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.z = 12 / zoomScale;
    }
  }, [zoomScale]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 1.0, 12 / zoomScale);
    cameraRef.current = camera;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 2.4);
    sunLight.position.set(15, 12, 18);
    scene.add(sunLight);

    const southFillLight = new THREE.DirectionalLight(0xc7d2fe, 1.2);
    southFillLight.position.set(0, -15, 10);
    scene.add(southFillLight);

    const backRimLight = new THREE.DirectionalLight(0x93c5fd, 0.7);
    backRimLight.position.set(-18, -6, -12);
    scene.add(backRimLight);

    // 4. Globe Group (Continuous Rotation & User Dragging)
    const globeGroup = new THREE.Group();
    // Tilt to prominently display Antarctica & Southern Indian Ocean
    globeGroup.rotation.x = 0.55;
    globeGroup.rotation.y = -0.6;
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    // 5. Earth Sphere with High-Res Texture
    const radius = 4.0;
    const sphereGeometry = new THREE.SphereGeometry(radius, 64, 64);

    const textureLoader = new THREE.TextureLoader();
    const earthMap = textureLoader.load(
      '/textures/earth_map.jpg',
      () => {
        renderer.render(scene, camera);
      },
      undefined,
      (err) => console.warn('Earth texture load warning:', err)
    );
    earthMap.colorSpace = THREE.SRGBColorSpace;

    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthMap,
      roughness: 0.55,
      metalness: 0.05,
      bumpScale: 0.04
    });

    const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
    globeGroup.add(earthMesh);

    // 6. Subtle Atmosphere Glow Shell
    const atmoGeometry = new THREE.SphereGeometry(radius * 1.02, 48, 48);
    const atmoMaterial = new THREE.MeshBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.22,
      side: THREE.BackSide
    });
    const atmoMesh = new THREE.Mesh(atmoGeometry, atmoMaterial);
    globeGroup.add(atmoMesh);

    // 7. Thin Orbital Coordinate Dial Rings
    const ringGeometry = new THREE.RingGeometry(radius * 1.22, radius * 1.225, 128);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide
    });

    const ringMesh1 = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh1.rotation.x = Math.PI / 2.3;
    globeGroup.add(ringMesh1);

    const ringMesh2 = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh2.rotation.x = Math.PI / 1.7;
    ringMesh2.rotation.y = 0.35;
    globeGroup.add(ringMesh2);

    // Helper: Convert Lat/Lon to Vector3 coordinates on the globe
    function latLngToVector3(lat, lon, r = radius) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      );
    }

    // 8. Station Markers & Pulsing Waypoints
    const markerGroup = new THREE.Group();
    globeGroup.add(markerGroup);

    const ringsList = [];
    const interactiveMeshes = [];
    const waypointPositions = {};

    EXPEDITION_WAYPOINTS.forEach((wp) => {
      const pos = latLngToVector3(wp.lat, wp.lon, radius * 1.008);
      waypointPositions[wp.id] = pos;

      // Inner Dot
      const dotGeo = new THREE.SphereGeometry(wp.isPrimary ? 0.09 : 0.06, 16, 16);
      const dotMat = new THREE.MeshBasicMaterial({ color: wp.color });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.copy(pos);
      dot.userData = { waypoint: wp };
      markerGroup.add(dot);
      interactiveMeshes.push(dot);

      // Outer Pulsing Ring
      const circleGeo = new THREE.RingGeometry(0.12, 0.17, 32);
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

      ringsList.push({ mesh: ring, baseScale: 1.0, isPrimary: wp.isPrimary });
    });

    // 9. 3D Curved Great Circle Arcs (Spline Routes)
    const routesGroup = new THREE.Group();
    globeGroup.add(routesGroup);

    EXPEDITION_ROUTES.forEach((route) => {
      const p1 = waypointPositions[route.from];
      const p2 = waypointPositions[route.to];
      if (!p1 || !p2) return;

      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const distance = p1.distanceTo(p2);
      // Elevate arc above globe curvature
      mid.normalize().multiplyScalar(radius + Math.min(distance * 0.28, route.altitude || 0.6));

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(45);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      const material = new THREE.LineBasicMaterial({
        color: route.color,
        transparent: true,
        opacity: route.dashed ? 0.95 : 0.75,
        linewidth: route.dashed ? 3 : 2
      });

      const line = new THREE.Line(geometry, material);
      routesGroup.add(line);
    });

    // 10. Interactive Dragging & Click Selection
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let dragVelocity = { x: 0, y: 0 };
    let dragDistance = 0;

    const onMouseDown = (e) => {
      if (e.target.closest('.interactive-control-overlay')) return;
      isDragging = true;
      dragDistance = 0;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;
      dragDistance += Math.abs(deltaX) + Math.abs(deltaY);

      globeGroup.rotation.y += deltaX * 0.005;
      globeGroup.rotation.x += deltaY * 0.005;
      // Clamp vertical tilt to prevent flipping
      globeGroup.rotation.x = Math.max(-1.3, Math.min(1.3, globeGroup.rotation.x));

      dragVelocity = { x: deltaX * 0.003, y: deltaY * 0.003 };
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = (e) => {
      isDragging = false;

      // Click detection if barely moved
      if (dragDistance < 6 && onSelectStation) {
        const rect = renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(interactiveMeshes);

        if (intersects.length > 0) {
          const wp = intersects[0].object.userData.waypoint;
          if (wp) {
            onSelectStation(wp);
          }
        }
      }
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch Support
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        dragDistance = 0;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;
      globeGroup.rotation.y += deltaX * 0.005;
      globeGroup.rotation.x += deltaY * 0.005;
      dragVelocity = { x: deltaX * 0.003, y: deltaY * 0.003 };
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = () => { isDragging = false; };

    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    // 11. Animation Loop: CONTINUOUS SMOOTH ROTATION
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // FULL CONTINUOUS ROTATION
      if (!isDragging) {
        if (autoRotateRef.current) {
          globeGroup.rotation.y += 0.0022 * rotationSpeedRef.current + dragVelocity.x;
        } else {
          globeGroup.rotation.y += dragVelocity.x;
        }
        globeGroup.rotation.x += dragVelocity.y;

        // Damping inertial velocity
        dragVelocity.x *= 0.93;
        dragVelocity.y *= 0.93;
      }

      // Animate pulsing rings on waypoints
      ringsList.forEach((r, idx) => {
        const pulse = 1 + 0.35 * Math.sin(elapsedTime * 3.2 + idx * 0.8);
        r.mesh.scale.set(pulse, pulse, pulse);
        r.mesh.material.opacity = 0.5 + 0.45 * Math.sin(elapsedTime * 3.2 + idx * 0.8);
      });

      renderer.render(scene, camera);
    };

    animate();

    // 12. Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      sphereGeometry.dispose();
      earthMaterial.dispose();
      atmoGeometry.dispose();
      atmoMaterial.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing select-none"
      style={{ zIndex: 0 }}
    />
  );
}
