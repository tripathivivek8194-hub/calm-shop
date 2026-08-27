import { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Html,
  Stage,
} from '@react-three/drei';
import * as THREE from 'three';

const GEOMETRY_PRESETS = {
  sphereCluster: {
    create: () => {
      const group = new THREE.Group();
      const positions = [
        [0, 0, 0],
        [1.2, 0.3, -0.5],
        [-0.8, 1.1, 0.4],
        [0.5, -1, 0.2],
        [-1.1, -0.4, -0.6],
        [0.9, 0.8, 0.9],
      ];
      positions.forEach((pos, i) => {
        const geometry = new THREE.SphereGeometry(0.65 - i * 0.05, 32, 32);
        const mesh = new THREE.Mesh(geometry);
        mesh.position.set(...pos);
        mesh.scale.setScalar(1 - i * 0.08);
        group.add(mesh);
      });
      return group;
    },
  },
  torusKnot: {
    create: () => {
      const geometry = new THREE.TorusKnotGeometry(1, 0.35, 128, 16, 2, 3);
      return new THREE.Mesh(geometry);
    },
  },
  icosahedron: {
    create: () => {
      const geometry = new THREE.IcosahedronGeometry(1.1, 0);
      return new THREE.Mesh(geometry);
    },
  },
  dodecahedron: {
    create: () => {
      const geometry = new THREE.DodecahedronGeometry(1.1, 0);
      return new THREE.Mesh(geometry);
    },
  },
  octahedron: {
    create: () => {
      const geometry = new THREE.OctahedronGeometry(1.15, 0);
      return new THREE.Mesh(geometry);
    },
  },
  tetrahedron: {
    create: () => {
      const geometry = new THREE.TetrahedronGeometry(1.2, 0);
      return new THREE.Mesh(geometry);
    },
  },
  blob: {
    create: () => {
      const group = new THREE.Group();
      const blobs = [
        { pos: [0, 0, 0], scale: 1 },
        { pos: [1.1, 0.2, -0.3], scale: 0.7 },
        { pos: [-0.8, 1, 0.4], scale: 0.6 },
        { pos: [0.6, -0.9, 0.3], scale: 0.55 },
      ];
      blobs.forEach(({ pos, scale }) => {
        const geometry = new THREE.SphereGeometry(0.8 * scale, 24, 24);
        const mesh = new THREE.Mesh(geometry);
        mesh.position.set(...pos);
        group.add(mesh);
      });
      return group;
    },
  },
  geode: {
    create: () => {
      const group = new THREE.Group();
      const layers = 6;
      for (let i = 0; i < layers; i++) {
        const geometry = new THREE.IcosahedronGeometry(1.3 - i * 0.15, 1);
        const mesh = new THREE.Mesh(geometry);
        mesh.scale.set(1, 0.6, 1);
        mesh.position.y = (i - layers / 2) * 0.15;
        group.add(mesh);
      }
      return group;
    },
  },
};

const MATERIAL_PRESETS = {
  glass: {
    transmission: 0.85,
    thickness: 0.5,
    roughness: 0.05,
    metalness: 0,
    clearcoat: 0.5,
    clearcoatRoughness: 0.1,
    ior: 1.45,
    envMapIntensity: 1.2,
  },
  crystal: {
    transmission: 0.6,
    thickness: 0.4,
    roughness: 0.15,
    metalness: 0,
    clearcoat: 0.8,
    clearcoatRoughness: 0.05,
    ior: 1.52,
    envMapIntensity: 1.3,
  },
  matte: {
    transmission: 0,
    roughness: 0.55,
    metalness: 0,
    clearcoat: 0.1,
    clearcoatRoughness: 0.3,
    envMapIntensity: 0.5,
  },
  wax: {
    transmission: 0.25,
    thickness: 0.3,
    roughness: 0.35,
    metalness: 0,
    clearcoat: 0.4,
    clearcoatRoughness: 0.2,
    ior: 1.4,
    envMapIntensity: 0.8,
  },
  pearl: {
    transmission: 0.1,
    thickness: 0.2,
    roughness: 0.25,
    metalness: 0.1,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1,
    iridescence: 0.4,
    iridescenceIOR: 1.3,
    envMapIntensity: 1,
  },
  translucent: {
    transmission: 0.5,
    thickness: 0.4,
    roughness: 0.2,
    metalness: 0,
    clearcoat: 0.3,
    clearcoatRoughness: 0.15,
    ior: 1.4,
    envMapIntensity: 1,
  },
};

function ProductModel({
  geometryType,
  color,
  secondaryColor,
  material,
  isModal = false,
  exploded = false,
  onModelReady,
}) {
  const groupRef = useRef();
  const meshesRef = useRef([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const model = useMemo(() => {
    const preset = GEOMETRY_PRESETS[geometryType] || GEOMETRY_PRESETS.sphereCluster;
    return preset.create();
  }, [geometryType]);

  useEffect(() => {
    const matPreset = MATERIAL_PRESETS[material] || MATERIAL_PRESETS.matte;
    const primary = new THREE.Color(color);
    const accent = new THREE.Color(secondaryColor);
    const meshes = [];
    let index = 0;

    model.traverse((child) => {
      if (!child.isMesh) return;
      const materialColor = primary.clone().lerp(accent, (index % 4) * 0.18);
      child.material = new THREE.MeshPhysicalMaterial({
        color: materialColor,
        ...matPreset,
        attenuationColor: materialColor,
        attenuationDistance: 1.5,
      });
      child.castShadow = true;
      child.receiveShadow = true;
      meshes.push(child);
      index += 1;
    });

    meshesRef.current = meshes;
    setIsLoaded(true);
    onModelReady?.();

    return () => {
      meshes.forEach((mesh) => {
        mesh.geometry.dispose();
        mesh.material.dispose();
      });
      meshesRef.current = [];
      setIsLoaded(false);
    };
  }, [color, material, model, secondaryColor, onModelReady]);

  // Reusable vectors to avoid GC pressure
  const tempVector = useRef(new THREE.Vector3());
  const tempVector2 = useRef(new THREE.Vector3());
  const centerVector = useRef(new THREE.Vector3(0, 0, 0));

  // Handle explosion animation
  useFrame((state, delta) => {
    if (groupRef.current && !isModal) {
      groupRef.current.rotation.y += delta * 0.15;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;
    }

    // Explosion animation
    if (exploded && meshesRef.current.length > 0) {
      const time = state.clock.getElapsedTime();
      meshesRef.current.forEach((mesh, i) => {
        const delay = i * 0.3;
        const progress = Math.min(1, Math.max(0, (time - delay) * 0.8));
        const ease = 1 - Math.pow(1 - progress, 3);

        // Reuse vectors to avoid allocations
        tempVector.copy(mesh.position).sub(centerVector.current).normalize();
        tempVector2.copy(centerVector.current).add(tempVector.multiplyScalar(1 + ease * 1.5));
        mesh.position.lerp(tempVector2, 0.05);
      });
    } else if (!exploded && meshesRef.current.length > 0) {
      // Return to original positions
      meshesRef.current.forEach((mesh) => {
        const originalPos = mesh.userData.originalPosition;
        if (originalPos) {
          mesh.position.lerp(originalPos, 0.1);
        }
      });
    }
  });

  // Store original positions
  useEffect(() => {
    meshesRef.current.forEach((mesh) => {
      mesh.userData.originalPosition = mesh.position.clone();
    });
  }, [model]);

  return (
    <group ref={groupRef}>
      <primitive object={model} />
    </group>
  );
}

function ProductViewer({
  geometryType = 'sphereCluster',
  color = '#a8d0e6',
  secondaryColor = '#f8c8d8',
  material = 'glass',
  className = '',
  isModal = false,
  showControls = true,
  onModelLoad,
}) {
  const canvasRef = useRef();
  const [exploded, setExploded] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState(material);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showWireframe, setShowWireframe] = useState(false);

  const materials = Object.keys(MATERIAL_PRESETS);

  const handleModelReady = useCallback(() => {
    setIsLoaded(true);
    onModelLoad?.();
  }, [onModelLoad]);

  const toggleExplode = () => setExploded((prev) => !prev);
  const resetView = () => {
    setExploded(false);
    setShowWireframe(false);
  };

  const cycleMaterial = () => {
    const currentIndex = materials.indexOf(currentMaterial);
    const nextIndex = (currentIndex + 1) % materials.length;
    setCurrentMaterial(materials[nextIndex]);
  };

  return (
    <div className={`product-viewer-wrapper ${className}`} style={{ width: '100%', height: '100%' }}>
      <div className="viewer-overlay-controls" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}>
        {/* Loading indicator */}
        {!isLoaded && (
          <div className="viewer-loading-overlay" style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(254, 250, 240, 0.9)', zIndex: 20, pointerEvents: 'none'
          }}>
            <div style={{
              width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--accent)',
              borderRadius: '50%', animation: 'spin 1s linear infinite'
            }} />
          </div>
        )}

        {/* Controls - only show when loaded and not modal or when showControls is true */}
        {(isLoaded || !showControls) && showControls && (
          <>
            {/* Top-left: Geometry label */}
            <div className="viewer-geometry-label" style={{
              position: 'absolute', top: 12, left: 12, zIndex: 15, pointerEvents: 'auto',
              padding: '6px 12px', background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-full)', fontSize: '0.7rem', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center', gap: 6
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: `linear-gradient(135deg, ${color} 0%, ${secondaryColor} 100%)`
              }} />
              {geometryType.replace(/([A-Z])/g, ' $1').trim()}
            </div>

            {/* Top-right: Material indicator */}
            <div className="viewer-material-label" style={{
              position: 'absolute', top: 12, right: 12, zIndex: 15, pointerEvents: 'auto',
              padding: '6px 10px', background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-full)', fontSize: '0.65rem', fontWeight: 500,
              color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6
            }}>
              <span style={{
                width: 10, height: 10, borderRadius: '50%',
                background: `linear-gradient(135deg, ${color} 0%, ${secondaryColor} 100%)`,
                boxShadow: 'inset 0 0 4px rgba(0,0,0,0.1)'
              }} />
              {currentMaterial}
            </div>

            {/* Bottom controls */}
            <div className="viewer-bottom-controls" style={{
              position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
              display: 'flex', gap: 8, zIndex: 15, pointerEvents: 'auto'
            }}>
              <button
                onClick={toggleExplode}
                className={exploded ? 'active' : ''}
                aria-label={exploded ? 'Assemble view' : 'Explode view'}
                aria-pressed={exploded}
                style={{
                  padding: '8px 12px', background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)', fontSize: '0.7rem', fontWeight: 500,
                  color: exploded ? 'var(--accent)' : 'var(--text-secondary)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s',
                  boxShadow: exploded ? '0 0 12px var(--accent-glow)' : 'none'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  {exploded ? (
                    <>
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </>
                  ) : (
                    <>
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                    </>
                  )}
                </svg>
                {exploded ? 'Assemble' : 'Explode'}
              </button>

              <button
                onClick={cycleMaterial}
                aria-label={`Change material (current: ${currentMaterial})`}
                style={{
                  padding: '8px 12px', background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)', fontSize: '0.7rem', fontWeight: 500,
                  color: 'var(--text-secondary)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
                Material
              </button>

              <button
                onClick={resetView}
                aria-label="Reset view"
                style={{
                  padding: '8px 12px', background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)', fontSize: '0.7rem', fontWeight: 500,
                  color: 'var(--text-secondary)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
                Reset
              </button>
            </div>
          </>
        )}
      </div>

      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 0.5, 3.5], fov: 35 }}
        shadows
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        style={{ width: '100%', height: '100%', outline: 'none' }}
        onCreated={({ gl }) => {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }}
      >
        <color attach="background" args={[0, 0, 0, 0]} />
        <fog attach="fog" args={['#fefaf0', 5, 15]} />

        <Environment preset={isModal ? 'city' : 'studio'} background={false} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 4, 2]} intensity={1.7} color="#fff8f0" castShadow />
        <pointLight position={[-3, 1, 2]} intensity={1.1} color={secondaryColor} />
        <ProductModel
          geometryType={geometryType}
          color={color}
          secondaryColor={secondaryColor}
          material={currentMaterial}
          isModal={isModal}
          exploded={exploded}
          onModelReady={handleModelReady}
        />

        <ContactShadows
          opacity={0.15}
          scale={isModal ? 8 : 5}
          blur={isModal ? 2 : 1.5}
          position={[0, -1.5, 0]}
        />

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minZoom={0.8}
          maxZoom={isModal ? 3 : 2}
          minPolarAngle={0.15}
          maxPolarAngle={Math.PI / 2 - 0.1}
          autoRotate={!isModal && !exploded}
          autoRotateSpeed={0.5}
          dampingFactor={0.08}
        />

        <Html
          transform
          position={[0, -1.8, 0]}
          style={{
            pointerEvents: 'none',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.75rem',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          {geometryType}
        </Html>
      </Canvas>
    </div>
  );
}

export { ProductViewer, ProductModel, GEOMETRY_PRESETS, MATERIAL_PRESETS };
