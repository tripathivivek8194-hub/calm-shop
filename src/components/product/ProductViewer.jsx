import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Html,
  Center,
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
}) {
  const groupRef = useRef();
  const materialRef = useRef();
  const { camera, gl } = useThree();

  const geometry = useMemo(() => {
    const preset = GEOMETRY_PRESETS[geometryType] || GEOMETRY_PRESETS.sphereCluster;
    return preset.create();
  }, [geometryType]);

  const matProps = useMemo(() => {
    const baseColor = new THREE.Color(color);
    const matPreset = MATERIAL_PRESETS[material] || MATERIAL_PRESETS.matte;
    return {
      color: baseColor,
      ...matPreset,
    };
  }, [color, material]);

  useEffect(() => {
    if (materialRef.current) {
      Object.assign(materialRef.current, matProps);
      materialRef.current.needsUpdate = true;
    }
  }, [matProps]);

  useFrame((state, delta) => {
    if (groupRef.current && !isModal) {
      groupRef.current.rotation.y += delta * 0.15;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;
    }
  });

  const positions = geometryType === 'geode'
    ? [[0, 0.1, 0], [0, -0.1, 0], [0, 0.2, 0]]
    : [[0, 0, 0]];

  return (
    <group ref={groupRef}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos} castShadow receiveShadow>
          <geometry>
            {geometry.isGroup ? (
              <group>
                {geometry.children.map((child, idx) => (
                  <primitive key={idx} object={child.geometry} />
                ))}
              </group>
            ) : geometry}
          </geometry>
          <meshPhysicalMaterial
            ref={materialRef}
            {...matProps}
            key={`mat-${color}-${material}`}
          />
        </mesh>
      ))}
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
}) {
  const canvasRef = useRef();

  return (
    <div className={`product-viewer-wrapper ${className}`} style={{ width: '100%', height: '100%' }}>
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 0.5, 3.5], fov: 35 }}
        shadows
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        style={{ width: '100%', height: '100%', outline: 'none' }}
      >
        <color attach="background" args={[0, 0, 0, 0]} />
        <fog attach="fog" args={['#fefaf0', 5, 15]} />

        <Environment
          preset="studio"
          background={false}
          environment={isModal ? <Environment preset="city" /> : undefined}
        >
          {(envMap) => (
            <>
              <prime key="env" object={envMap} />
              <ProductModel
                geometryType={geometryType}
                color={color}
                secondaryColor={secondaryColor}
                material={material}
                isModal={isModal}
              />
            </>
          )}
        </Environment>

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
          autoRotate={!isModal}
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