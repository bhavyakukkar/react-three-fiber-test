import * as THREE from 'three';
import { createRoot } from 'react-dom/client';
import React, { useRef, useState } from 'react';
import { Canvas, useFrame, ThreeElements, useThree } from '@react-three/fiber';

type NewPosition = {
  x: number | null,
  y: number | null,
  z: number | null,
}

function MoveCamera(props: { newPosition: NewPosition }) {
  const { newPosition } = props;
  const camera = useThree((state) => state.camera);
  const set = useThree((state) => state.set);

  set({
    camera: camera
      .translateX((newPosition.x ?? camera.position.x) - camera.position.x)
      .translateY((newPosition.y ?? camera.position.y) - camera.position.y)
      .translateZ((newPosition.z ?? camera.position.z) - camera.position.z)
  });

  return (<></>);
}

function Scene() {
  const [posZ, setPosZ] = useState(5);

  return (<Canvas
    camera={{
      fov: 45,
      near: 1,
      far: 1000,
      position: [0, 0, posZ],
    }}
    onWheel={(event) => {
      if (event.deltaY < 0)
        setPosZ(z => z + 1);
      else
        setPosZ(z => z - 1);
    }}
  >
    <MoveCamera newPosition={{ x: null, y: null, z: posZ }} />
    <ambientLight intensity={Math.PI / 2} />
    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
    <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
    <Box position={[-1.2, 0, 0]} />
    <Box position={[1.2, 0, 0]} />
  </Canvas>);
}

function Box(props: ThreeElements['mesh']) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  useFrame((_, delta) => (meshRef.current.rotation.x += delta));
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={(_) => setActive(!active)}
      onPointerOver={(_) => setHover(true)}
      onPointerOut={(_) => setHover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : '#2f74c0'} />
    </mesh>
  );
}

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  root && createRoot(root).render(<Scene />);
});

// document.addEventListener('scroll', )

console.log("hey");
