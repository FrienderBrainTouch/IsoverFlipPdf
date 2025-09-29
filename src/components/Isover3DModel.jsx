import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

/**
 * 3D 모델 컴포넌트
 * GLB 파일을 로드하고 회전 애니메이션을 적용합니다.
 */
function IsoverModel({ modelPath }) {
  const { scene } = useGLTF(modelPath);
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // 자동 회전 애니메이션 비활성화
  // useFrame((state, delta) => {
  //   if (meshRef.current) {
  //     meshRef.current.rotation.y += delta * 0.5;
  //   }
  // });

  // 3D 모델의 중심을 계산하여 위치 조정
  React.useEffect(() => {
    if (scene && meshRef.current) {
      // 바운딩 박스 계산
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      
      // 중심을 원점으로 이동
      scene.position.set(-center.x, -center.y, -center.z);
      
      // 스케일 조정 (적절한 크기로)
      const size = box.getSize(new THREE.Vector3());
      const maxSize = Math.max(size.x, size.y, size.z);
      const scale = 2 / maxSize; // 적절한 크기로 조정
      scene.scale.setScalar(scale);
    }
  }, [scene]);

  return (
    <primitive
      ref={meshRef}
      object={scene}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    />
  );
}

/**
 * 평행사변형 3D 모델 뷰어 컴포넌트
 * 표지 페이지에 absolute로 배치되어 3D 모델을 표시합니다.
 */
function Isover3DModel({ 
  isVisible = true, 
  opacity = 1, 
  scale = 1, 
  position = { x: 0, y: 0 },
  animationDelay = 0,
  modelPath = "/IsoverFile/3dmodel/Untitled.glb",
  isModal = false
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [animationOpacity, setAnimationOpacity] = useState(0);
  const [animationScale, setAnimationScale] = useState(0.8);
  const [animationPosition, setAnimationPosition] = useState({ x: 0, y: 0 });

  // 로딩 완료 핸들러
  const handleLoad = () => {
    setIsLoading(false);
  };

  // 에러 핸들러
  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  // 애니메이션 효과
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setAnimationOpacity(opacity);
        setAnimationScale(scale);
        setAnimationPosition(position);
      }, animationDelay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, opacity, scale, position, animationDelay]);

  if (!isVisible) return null;

  return (
    <div 
      className={`absolute z-10 ${isModal ? 'w-full h-full top-0 left-0' : ' '}`}
      style={{
        width: isModal ? '100%' : '90%',
        height: isModal ? '100%' : '64%',
        top: isModal ? '0%' : '27%',
        left: isModal ? '0%' : '2%'
      }}
    >
      {/* clip-path를 사용한 평행사변형 컨테이너 (모달이 아닐 때만) */}
      <div 
        className="relative w-full h-full"
        style={{
          clipPath: isModal ? 'none' : 'polygon(0 25%, 100% 0%, 100% 75%, 0% 100%)',
          // transform: 'perspective(1000px) rotateX(0deg) rotateY(-20deg) rotateZ(2deg)',
          // transformStyle: 'preserve-3d',
          // transformOrigin: 'center center'
        }}
      >
        {/* 3D 모델 캔버스 - clip-path 영역 내에서 중앙 배치 */}
        <div 
          className="absolute inset-0 rounded-lg overflow-hidden"
          style={{
            left: '0%',
            width: '100%',
            top: '0%',
            height: '100%'
          }}
        >
          {isLoading && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 mx-auto mb-2"></div>
                <p className="text-sm text-blue-600 font-medium">3D 모델 로딩 중...</p>
              </div>
            </div>
          )}
          
          {hasError && (
            <div className="w-full h-full bg-red-50 flex items-center justify-center">
              <div className="text-center">
                <p className="text-red-600 mb-2 font-medium">3D 모델 로딩 실패</p>
                <button 
                  onClick={() => {
                    setHasError(false);
                    setIsLoading(true);
                  }}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  다시 시도
                </button>
              </div>
            </div>
          )}

          {!hasError && (
            <Canvas
              camera={{ position: [0, 0, 5], fov: 50 }}
              onCreated={handleLoad}
              onError={handleError}
              style={{ width: '100%', height: '100%' }}
            >
              <Suspense fallback={null}>
                {/* 조명 설정 - HDRI 대신 기본 조명 사용 */}
                <ambientLight intensity={0.4} />
                <directionalLight position={[10, 10, 5]} intensity={1.2} />
                <directionalLight position={[-10, -10, 5]} intensity={0.8} />
                <pointLight position={[0, 10, 0]} intensity={0.6} />
                
                {/* 3D 모델 */}
                <IsoverModel modelPath={modelPath} />
                
                {/* 환경 설정 - HDRI 로딩 오류 방지를 위해 제거 */}
                {/* <Environment preset="studio" /> */}
                
                {/* 오빗 컨트롤 - 모델링 중심(0,0,0) 기준 회전 */}
                <OrbitControls
                  enablePan={false}
                  enableZoom={true}
                  enableRotate={true}
                  autoRotate={false}
                  maxPolarAngle={Math.PI}
                  minPolarAngle={0}
                  target={[0, 0, 0]}
                  enableDamping={true}
                  dampingFactor={0.05}
                  minDistance={2}
                  maxDistance={10}
                />
              </Suspense>
            </Canvas>
          )}
        </div>
      </div>
    </div>
  );
}

export default Isover3DModel;
