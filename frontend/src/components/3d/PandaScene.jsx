import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

const SCALE = 0.45;
const withScale = (value) => value * SCALE;

const NaturalEnvironment = () => {
  const groundMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#a0d77a',
    roughness: 0.8,
    metalness: 0.05
  }), []);

  const soilMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#7f5f45',
    roughness: 0.9,
    metalness: 0.02
  }), []);

  const bambooMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#8bd684',
    roughness: 0.45,
    metalness: 0.05,
    emissive: '#1f5c2c',
    emissiveIntensity: 0.1
  }), []);

  const leafMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1f7a54',
    roughness: 0.35,
    metalness: 0.05
  }), []);

  const rockMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#6b6b6b',
    roughness: 0.7,
    metalness: 0.1
  }), []);

  const bambooClusters = useMemo(() => {
    const clusters = [];
    const positions = [
      { x: -withScale(3.2), z: -withScale(1.8) },
      { x: withScale(3.5), z: -withScale(2.4) },
      { x: -withScale(2.8), z: withScale(2.1) },
      { x: withScale(2.9), z: withScale(1.7) }
    ];

    positions.forEach((pos, index) => {
      const stalks = [];
      const count = 3 + (index % 2);
      for (let i = 0; i < count; i++) {
        stalks.push({
          offsetX: (Math.random() - 0.5) * withScale(0.7),
          rotation: (Math.random() - 0.5) * 0.25,
          height: withScale(2.4 + Math.random() * 0.6)
        });
      }
      clusters.push({ ...pos, stalks });
    });
    return clusters;
  }, []);

  const rocks = useMemo(() => Array.from({ length: 5 }, (_, idx) => ({
    position: [
      withScale((Math.random() - 0.5) * 4.2),
      withScale(-1.18),
      withScale((Math.random() - 0.2) * 3.4)
    ],
    scale: withScale(0.6 + Math.random() * 0.3),
    rotation: Math.random() * Math.PI
  })), []);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, withScale(-1.18), 0]} receiveShadow>
        <circleGeometry args={[withScale(6), 64]} />
        <primitive object={soilMaterial} attach="material" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, withScale(-1.17), 0]} receiveShadow>
        <circleGeometry args={[withScale(4.8), 64]} />
        <primitive object={groundMaterial} attach="material" />
      </mesh>

      {bambooClusters.map((cluster, idx) => (
        <group key={`bamboo-${idx}`} position={[cluster.x, withScale(-1.0), cluster.z]}>
          {cluster.stalks.map((stalk, stalkIdx) => (
            <group key={`stalk-${idx}-${stalkIdx}`} position={[stalk.offsetX, 0, 0]} rotation={[0, 0, stalk.rotation]}>
              <mesh castShadow receiveShadow>
                <cylinderGeometry args={[withScale(0.08), withScale(0.1), stalk.height, 12]} />
                <primitive object={bambooMaterial} attach="material" />
              </mesh>
              <mesh position={[0, stalk.height / 2 - withScale(0.2), 0]} rotation={[0, 0, 0]}>
                <sphereGeometry args={[withScale(0.12), 12, 12]} />
                <primitive object={bambooMaterial} attach="material" />
              </mesh>
              <mesh position={[0, stalk.height / 2 - withScale(0.25), 0]} rotation={[Math.PI / 2.4, 0, 0]}>
                <coneGeometry args={[withScale(0.36), withScale(0.5), 10]} />
                <primitive object={leafMaterial} attach="material" />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {rocks.map((rock, idx) => (
        <mesh key={`rock-${idx}`} position={rock.position} rotation={[0, rock.rotation, 0]} scale={rock.scale} castShadow receiveShadow>
          <icosahedronGeometry args={[1, 1]} />
          <primitive object={rockMaterial} attach="material" />
        </mesh>
      ))}
    </group>
  );
};

const Panda = ({ action = 'idle' }) => {
  const root = useRef();
  const torso = useRef();
  const head = useRef();
  const leftEar = useRef();
  const rightEar = useRef();
  const leftArm = useRef();
  const rightArm = useRef();
  const leftPaw = useRef();
  const rightPaw = useRef();
  const leftLeg = useRef();
  const rightLeg = useRef();
  const leftFoot = useRef();
  const rightFoot = useRef();
  const tail = useRef();
  const bamboo = useRef();
  const leftEye = useRef();
  const rightEye = useRef();
  const leftPupil = useRef();
  const rightPupil = useRef();

  const blinkState = useRef({ value: 1, closing: false, timer: 0, next: 2 + Math.random() * 3 });
  const pointer = useRef({ x: 0, y: 0 });

  const whiteFur = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.42,
    sheen: 0.7,
    sheenRoughness: 0.35,
    clearcoat: 0.2,
    clearcoatRoughness: 0.35
  }), []);

  const blackFur = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: 0x1a1a1a,
    roughness: 0.48,
    metalness: 0.08,
    sheen: 0.35
  }), []);

  const pawPadMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x2f4f4f, roughness: 0.6, metalness: 0.1 }), []);
  const bambooMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: 0x7ec380,
    roughness: 0.5,
    metalness: 0.05,
    emissive: '#20421f',
    emissiveIntensity: 0.12
  }), []);
  const eyeWhiteMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.18, metalness: 0.3 }), []);
  const pupilMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: 0x000000,
    roughness: 0.35,
    metalness: 0.1,
    emissive: '#050505',
    emissiveIntensity: 0.55
  }), []);
  const noseMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.28, metalness: 0.2 }), []);
  const innerEarMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xffb6c1, roughness: 0.5, metalness: 0.05, emissive: '#4d2633', emissiveIntensity: 0.08 }), []);

  const leftEyeBase = useMemo(() => ({ x: withScale(-0.4), y: withScale(3.52), z: withScale(1.25) }), []);
  const rightEyeBase = useMemo(() => ({ x: withScale(0.4), y: withScale(3.52), z: withScale(1.25) }), []);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const rootGroup = root.current;
    if (!rootGroup) return;

    pointer.current.x = THREE.MathUtils.lerp(pointer.current.x, state.pointer.x, 0.08);
    pointer.current.y = THREE.MathUtils.lerp(pointer.current.y, state.pointer.y, 0.08);

    const breathing = Math.sin(time * 1.4) * withScale(0.08);
    rootGroup.position.y = THREE.MathUtils.lerp(rootGroup.position.y, breathing, 0.1);

    if (head.current) {
      head.current.rotation.x = THREE.MathUtils.lerp(head.current.rotation.x, breathing * 0.35, 0.12);
      head.current.rotation.y = THREE.MathUtils.lerp(head.current.rotation.y, pointer.current.x * 0.1, 0.1);
      head.current.rotation.z = THREE.MathUtils.lerp(head.current.rotation.z, pointer.current.x * -0.05, 0.1);
    }

    if (leftEar.current && rightEar.current) {
      const earTilt = Math.sin(time * 2.2) * 0.12;
      leftEar.current.rotation.z = THREE.MathUtils.lerp(leftEar.current.rotation.z, 0.55 - earTilt, 0.15);
      rightEar.current.rotation.z = THREE.MathUtils.lerp(rightEar.current.rotation.z, -0.55 + earTilt, 0.15);
    }

    if (leftPupil.current && rightPupil.current) {
      const eyeFollowX = pointer.current.x * withScale(0.14);
      const eyeFollowY = pointer.current.y * withScale(0.09);
      leftPupil.current.position.set(leftEyeBase.x + eyeFollowX, leftEyeBase.y + eyeFollowY, leftEyeBase.z + eyeFollowY * 0.5);
      rightPupil.current.position.set(rightEyeBase.x + eyeFollowX, rightEyeBase.y + eyeFollowY, rightEyeBase.z + eyeFollowY * 0.5);
    }

    handleBlink(leftEye, rightEye, blinkState, delta);

    const pose = getPoseForAction(action, time);
    applyPose(leftArm, pose.leftArm, delta);
    applyPose(rightArm, pose.rightArm, delta);
    applyPose(leftPaw, pose.leftPaw, delta);
    applyPose(rightPaw, pose.rightPaw, delta);
    applyPose(leftLeg, pose.leftLeg, delta);
    applyPose(rightLeg, pose.rightLeg, delta);
    applyPose(leftFoot, pose.leftFoot, delta);
    applyPose(rightFoot, pose.rightFoot, delta);
    applyPose(head, pose.head, delta);
    applyPose(torso, pose.body, delta);
    applyPose(tail, pose.tail, delta);

    handleRootTransform(rootGroup, action, time, delta);

    if (bamboo.current) {
      bamboo.current.visible = action === 'eat';
      if (action === 'eat') {
        bamboo.current.rotation.z = THREE.MathUtils.lerp(bamboo.current.rotation.z, -0.35 + Math.sin(time * 2.4) * 0.12, 0.18);
        bamboo.current.position.y = THREE.MathUtils.lerp(bamboo.current.position.y, -withScale(0.35) + Math.sin(time * 2.5) * withScale(0.06), 0.18);
      }
    }
  });

  return (
    <group ref={root} position={[0, withScale(0.1), 0]}>
      <mesh ref={torso} castShadow receiveShadow position={[0, withScale(1.2), 0]}>
        <sphereGeometry args={[withScale(1.8), 64, 64]} />
        <primitive object={whiteFur} attach="material" />
      </mesh>
      <mesh position={[0, withScale(1.1), withScale(1.1)]} rotation={[Math.PI / 2, 0, 0]} scale={[withScale(1.0), withScale(1.3), 1]}>
        <circleGeometry args={[withScale(1.1), 48]} />
        <meshStandardMaterial color="#f3f6fb" roughness={0.25} metalness={0} />
      </mesh>

      <group ref={head} position={[0, withScale(3.2), 0]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[withScale(1.4), 64, 64]} />
          <primitive object={whiteFur} attach="material" />
        </mesh>

        <mesh position={[withScale(-0.5), withScale(0.2), withScale(0.9)]} scale={[1.2, 1.4, 0.8]}>
          <sphereGeometry args={[withScale(0.5), 48, 48]} />
          <primitive object={blackFur} attach="material" />
        </mesh>
        <mesh position={[withScale(0.5), withScale(0.2), withScale(0.9)]} scale={[1.2, 1.4, 0.8]}>
          <sphereGeometry args={[withScale(0.5), 48, 48]} />
          <primitive object={blackFur} attach="material" />
        </mesh>

        <group ref={leftEye} position={[withScale(-0.4), withScale(3.5 - 3.2), withScale(1.15)]}>
          <mesh>
            <sphereGeometry args={[withScale(0.18), 32, 32]} />
            <primitive object={eyeWhiteMaterial} attach="material" />
          </mesh>
          <mesh ref={leftPupil} position={[0, withScale(0.02), withScale(0.12)]}>
            <sphereGeometry args={[withScale(0.08), 24, 24]} />
            <primitive object={pupilMaterial} attach="material" />
          </mesh>
        </group>

        <group ref={rightEye} position={[withScale(0.4), withScale(3.5 - 3.2), withScale(1.15)]}>
          <mesh>
            <sphereGeometry args={[withScale(0.18), 32, 32]} />
            <primitive object={eyeWhiteMaterial} attach="material" />
          </mesh>
          <mesh ref={rightPupil} position={[0, withScale(0.02), withScale(0.12)]}>
            <sphereGeometry args={[withScale(0.08), 24, 24]} />
            <primitive object={pupilMaterial} attach="material" />
          </mesh>
        </group>

        <mesh position={[0, withScale(-0.4), withScale(1.15)]} scale={[1.0, 0.75, 1]}>
          <sphereGeometry args={[withScale(0.16), 32, 32]} />
          <primitive object={noseMaterial} attach="material" />
        </mesh>
        <mesh position={[0, withScale(-0.62), withScale(0.95)]} rotation={[Math.PI / 2.2, 0, 0]}>
          <ringGeometry args={[withScale(0.18), withScale(0.28), 32]} />
          <meshStandardMaterial color="#2b313d" roughness={0.3} metalness={0.05} />
        </mesh>

        <group position={[withScale(-0.95), withScale(0.8), withScale(-0.1)]}>
          <mesh ref={leftEar} castShadow receiveShadow>
            <sphereGeometry args={[withScale(0.6), 48, 48]} />
            <primitive object={blackFur} attach="material" />
          </mesh>
          <mesh position={[0, withScale(-0.05), withScale(0.08)]} scale={[0.6, 0.6, 0.45]}>
            <sphereGeometry args={[withScale(0.4), 32, 32]} />
            <primitive object={innerEarMaterial} attach="material" />
          </mesh>
        </group>
        <group position={[withScale(0.95), withScale(0.8), withScale(-0.1)]}>
          <mesh ref={rightEar} castShadow receiveShadow>
            <sphereGeometry args={[withScale(0.6), 48, 48]} />
            <primitive object={blackFur} attach="material" />
          </mesh>
          <mesh position={[0, withScale(-0.05), withScale(0.08)]} scale={[0.6, 0.6, 0.45]}>
            <sphereGeometry args={[withScale(0.4), 32, 32]} />
            <primitive object={innerEarMaterial} attach="material" />
          </mesh>
        </group>
      </group>

      <group ref={leftArm} position={[withScale(-1.4), withScale(1.8), 0]} rotation={[0, 0, 0]}>
        <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[withScale(0.35), withScale(0.45), withScale(1.4), 32]} />
          <primitive object={blackFur} attach="material" />
        </mesh>
        <group ref={leftPaw} position={[0, -withScale(0.9), 0]}>
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[withScale(0.5), 32, 32]} />
            <primitive object={blackFur} attach="material" />
          </mesh>
          <mesh position={[0, -withScale(0.18), withScale(0.2)]}>
            <sphereGeometry args={[withScale(0.18), 16, 16]} />
            <primitive object={pawPadMaterial} attach="material" />
          </mesh>
        </group>
      </group>

      <group ref={rightArm} position={[withScale(1.4), withScale(1.8), 0]} rotation={[0, 0, 0]}>
        <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[withScale(0.35), withScale(0.45), withScale(1.4), 32]} />
          <primitive object={blackFur} attach="material" />
        </mesh>
        <group ref={rightPaw} position={[0, -withScale(0.9), 0]}>
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[withScale(0.5), 32, 32]} />
            <primitive object={blackFur} attach="material" />
          </mesh>
          <mesh position={[0, -withScale(0.18), withScale(0.2)]}>
            <sphereGeometry args={[withScale(0.18), 16, 16]} />
            <primitive object={pawPadMaterial} attach="material" />
          </mesh>
        </group>

        <group ref={bamboo} position={[0, -withScale(0.45), withScale(0.2)]} rotation={[0, 0, -0.2]} visible={false}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[withScale(0.1), withScale(0.11), withScale(1.0), 16]} />
            <primitive object={bambooMaterial} attach="material" />
          </mesh>
          <mesh position={[0, withScale(0.52), 0]}>
            <cylinderGeometry args={[withScale(0.12), withScale(0.12), withScale(0.16), 12]} />
            <primitive object={bambooMaterial} attach="material" />
          </mesh>
        </group>
      </group>

      <group ref={leftLeg} position={[withScale(-0.7), withScale(-0.1), 0]} rotation={[0.3, 0, 0]}>
        <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[withScale(0.4), withScale(0.5), withScale(1.2), 32]} />
          <primitive object={blackFur} attach="material" />
        </mesh>
        <group ref={leftFoot} position={[0, -withScale(0.8), withScale(0.18)]}>
          <mesh castShadow receiveShadow scale={[1, 0.72, 1.35]}>
            <sphereGeometry args={[withScale(0.6), 32, 32]} />
            <primitive object={blackFur} attach="material" />
          </mesh>
          <mesh position={[0, -withScale(0.18), withScale(0.32)]}>
            <sphereGeometry args={[withScale(0.2), 16, 16]} />
            <primitive object={pawPadMaterial} attach="material" />
          </mesh>
        </group>
      </group>

      <group ref={rightLeg} position={[withScale(0.7), withScale(-0.1), 0]} rotation={[0.3, 0, 0]}>
        <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[withScale(0.4), withScale(0.5), withScale(1.2), 32]} />
          <primitive object={blackFur} attach="material" />
        </mesh>
        <group ref={rightFoot} position={[0, -withScale(0.8), withScale(0.18)]}>
          <mesh castShadow receiveShadow scale={[1, 0.72, 1.35]}>
            <sphereGeometry args={[withScale(0.6), 32, 32]} />
            <primitive object={blackFur} attach="material" />
          </mesh>
          <mesh position={[0, -withScale(0.18), withScale(0.32)]}>
            <sphereGeometry args={[withScale(0.2), 16, 16]} />
            <primitive object={pawPadMaterial} attach="material" />
          </mesh>
        </group>
      </group>

      <mesh ref={tail} position={[0, withScale(1.0), -withScale(1.5)]} castShadow receiveShadow>
        <sphereGeometry args={[withScale(0.25), 24, 24]} />
        <primitive object={whiteFur} attach="material" />
      </mesh>
    </group>
  );
};

const getPoseForAction = (action, time) => {
  const idle = {
    leftArm: { rotation: [0.1, 0, -0.2] },
    rightArm: { rotation: [0.1, 0, 0.2] },
    leftPaw: { rotation: [0, 0, 0] },
    rightPaw: { rotation: [0, 0, 0] },
    leftLeg: { rotation: [0.4, 0, 0] },
    rightLeg: { rotation: [0.4, 0, 0] },
    leftFoot: { rotation: [0, 0, 0] },
    rightFoot: { rotation: [0, 0, 0] },
    head: { rotation: [0, 0, 0] },
    body: { rotation: [0, 0, 0] },
    tail: { rotation: [0, 0, 0.05] }
  };

  switch (action) {
    case 'hi':
      return {
        ...idle,
        rightArm: { rotation: [Math.PI / 3.2 + Math.sin(time * 4.2) * 0.25, 0.35, 0.35] },
        rightPaw: { rotation: [Math.sin(time * 6.5) * 0.5, 0, Math.sin(time * 4.5) * 0.4] },
        head: { rotation: [0.08, Math.sin(time * 3.5) * 0.18, Math.sin(time * 2.5) * 0.12] },
        tail: { rotation: [0.1, 0, Math.sin(time * 3) * 0.25] }
      };
    case 'dance':
      return {
        ...idle,
        leftArm: { rotation: [0.35 + Math.cos(time * 5.2) * 0.4, -0.4, -0.45] },
        rightArm: { rotation: [0.35 + Math.sin(time * 5.2) * 0.4, 0.4, 0.45] },
        leftPaw: { rotation: [Math.sin(time * 6) * 0.4, 0, Math.sin(time * 4.5) * 0.3] },
        rightPaw: { rotation: [Math.cos(time * 6) * 0.4, 0, Math.cos(time * 4.5) * 0.3] },
        leftLeg: { rotation: [0.6 + Math.sin(time * 3.5) * 0.35, 0, Math.sin(time * 3.2) * 0.15] },
        rightLeg: { rotation: [0.6 + Math.cos(time * 3.5) * 0.35, 0, Math.cos(time * 3.2) * 0.15] },
        leftFoot: { rotation: [Math.sin(time * 4.8) * 0.25, 0, 0] },
        rightFoot: { rotation: [Math.cos(time * 4.8) * 0.25, 0, 0] },
        head: { rotation: [0.05, Math.sin(time * 3) * 0.3, Math.sin(time * 2.5) * 0.18] },
        body: { rotation: [0.02, Math.sin(time * 2.4) * 0.25, 0] },
        tail: { rotation: [0.12, 0, Math.sin(time * 5) * 0.35] }
      };
    case 'sit':
      return {
        ...idle,
        leftArm: { rotation: [0.6, 0.15, -0.45] },
        rightArm: { rotation: [0.6, -0.15, 0.45] },
        leftPaw: { rotation: [-0.25, 0, 0] },
        rightPaw: { rotation: [-0.25, 0, 0] },
        leftLeg: { rotation: [1.25, 0.05, 0.05] },
        rightLeg: { rotation: [1.25, -0.05, -0.05] },
        leftFoot: { rotation: [0.4, 0, 0] },
        rightFoot: { rotation: [0.4, 0, 0] },
        head: { rotation: [-0.18, 0.05, 0] },
        body: { rotation: [0.45, 0, 0] },
        tail: { rotation: [-0.35, 0, 0] }
      };
    case 'sleep':
      return {
        ...idle,
        leftArm: { rotation: [0.9, 0, -0.25] },
        rightArm: { rotation: [0.9, 0, 0.25] },
        leftLeg: { rotation: [1.35, 0.12, 0.1] },
        rightLeg: { rotation: [1.35, -0.12, -0.1] },
        head: { rotation: [-0.65, 0.32, 0.25] },
        body: { rotation: [0.5, 0, 0.12] },
        tail: { rotation: [-0.4, 0, 0.12] }
      };
    case 'eat':
      return {
        ...idle,
        rightArm: { rotation: [0.95, 0.45, 0.35] },
        rightPaw: { rotation: [Math.sin(time * 3.5) * 0.25 + 0.45, 0, 0.2] },
        leftArm: { rotation: [0.25, -0.3, -0.3] },
        head: { rotation: [0.25, -0.35, 0] },
        body: { rotation: [0.12, 0, 0.05] },
        tail: { rotation: [0.18, 0, Math.sin(time * 2.4) * 0.18] }
      };
    default:
      return idle;
  }
};

const applyPose = (ref, pose, delta) => {
  if (!ref?.current || !pose) return;

  const factor = 1 - Math.pow(0.06, delta * 60);

  if (pose.rotation) {
    const [rx = ref.current.rotation.x, ry = ref.current.rotation.y, rz = ref.current.rotation.z] = pose.rotation;
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, rx, factor);
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, ry, factor);
    ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, rz, factor);
  }

  if (pose.position) {
    const [px = ref.current.position.x, py = ref.current.position.y, pz = ref.current.position.z] = pose.position;
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, px, factor);
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, py, factor);
    ref.current.position.z = THREE.MathUtils.lerp(ref.current.position.z, pz, factor);
  }
};

const handleRootTransform = (rootGroup, action, time, delta) => {
  const factor = 1 - Math.pow(0.05, delta * 60);

  if (action === 'dance') {
    const targetRotY = Math.sin(time * 2.1) * 0.42;
    const targetPosX = Math.sin(time * 1.6) * withScale(0.4);
    const targetPosZ = Math.cos(time * 1.4) * withScale(0.28);
    rootGroup.rotation.y = THREE.MathUtils.lerp(rootGroup.rotation.y, targetRotY, factor);
    rootGroup.position.x = THREE.MathUtils.lerp(rootGroup.position.x, targetPosX, factor);
    rootGroup.position.z = THREE.MathUtils.lerp(rootGroup.position.z, targetPosZ, factor);
  } else if (action === 'sit' || action === 'sleep') {
    const targetY = action === 'sit' ? -withScale(0.35) : -withScale(0.38);
    rootGroup.rotation.y = THREE.MathUtils.lerp(rootGroup.rotation.y, 0, factor);
    rootGroup.position.x = THREE.MathUtils.lerp(rootGroup.position.x, 0, factor);
    rootGroup.position.z = THREE.MathUtils.lerp(rootGroup.position.z, 0, factor);
    rootGroup.position.y = THREE.MathUtils.lerp(rootGroup.position.y, targetY, factor);
  } else {
    rootGroup.rotation.y = THREE.MathUtils.lerp(rootGroup.rotation.y, 0, factor);
    rootGroup.position.x = THREE.MathUtils.lerp(rootGroup.position.x, 0, factor);
    rootGroup.position.z = THREE.MathUtils.lerp(rootGroup.position.z, 0, factor);
  }
};

const handleBlink = (leftEye, rightEye, blink, delta) => {
  if (!leftEye.current || !rightEye.current) return;

  const state = blink.current;
  state.timer += delta;

  if (!state.closing && state.timer >= state.next) {
    state.closing = true;
    state.timer = 0;
    state.next = 2 + Math.random() * 4;
  }

  if (state.closing) {
    state.value = THREE.MathUtils.lerp(state.value, 0.08, 0.28);
    if (state.value < 0.2) {
      state.closing = false;
    }
  } else {
    state.value = THREE.MathUtils.lerp(state.value, 1, 0.18);
  }

  leftEye.current.scale.y = state.value;
  rightEye.current.scale.y = state.value;
};

const PandaScene = ({ action }) => {
  return (
    <Canvas shadows camera={{ position: [withScale(9), withScale(7), withScale(10)], fov: 38 }} dpr={[1, 1.75]}>
      <hemisphereLight intensity={0.6} groundColor="#8bb47c" color="#f0f8ff" />
      <directionalLight
        position={[withScale(10), withScale(14), withScale(8)]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-normalBias={0.015}
      />
      <directionalLight position={[-withScale(6), withScale(5), -withScale(6)]} intensity={0.45} color={0x90b4ff} />
      <Suspense fallback={(<Html center><div className="flex flex-col items-center text-muted-foreground animate-pulse"><span className="text-sm font-caption">Waking your panda...</span></div></Html>)}>
        <NaturalEnvironment />
        <Panda action={action} />
        <Environment preset="forest" blur={0.6} />
        <ContactShadows
          position={[0, withScale(-1.2), 0]}
          opacity={0.4}
          width={withScale(10)}
          height={withScale(10)}
          blur={2.2}
          far={withScale(6)}
        />
      </Suspense>
      <OrbitControls
        enablePan={false}
        minDistance={withScale(9)}
        maxDistance={withScale(12)}
        enableZoom={false}
        maxPolarAngle={Math.PI / 2.15}
        minPolarAngle={Math.PI / 3.2}
        autoRotate={action === 'idle'}
        autoRotateSpeed={0.4}
      />
    </Canvas>
  );
};

export default PandaScene;
