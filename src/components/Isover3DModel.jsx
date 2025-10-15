import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, useProgress, Html } from '@react-three/drei';
import * as THREE from 'three';

// Draco 압축 모델 지원: CDN에서 자동 로드
useGLTF.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

// 전역 로딩 매니저 디버그 훅
THREE.DefaultLoadingManager.onStart = (url, loaded, total) => {
  // eslint-disable-next-line no-console
  console.log('[Loader] Start:', { url, loaded, total });
};
THREE.DefaultLoadingManager.onProgress = (url, loaded, total) => {
  // eslint-disable-next-line no-console
  console.log('[Loader] Progress:', { url, loaded, total });
};
THREE.DefaultLoadingManager.onLoad = () => {
  // eslint-disable-next-line no-console
  console.log('[Loader] All resources loaded');
};
THREE.DefaultLoadingManager.onError = (url) => {
  // eslint-disable-next-line no-console
  console.error('[Loader] Error:', { url });
};


/**
 * 하이라이트 기능이 있는 투명 박스 컴포넌트
 * 클릭 영역을 제공하고 하이라이트 효과를 표시합니다.
 */
function HighlightBox({ position, size, color = 0x00ff00, opacity = 0, onHover, onClick, isActive = false }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const currentOpacity = isHovered ? 0.3 : (isActive ? 0.2 : opacity);
  const highlightColor = isHovered ? color : (isActive ? color : color);
  
  return (
    <mesh 
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setIsHovered(true);
        onHover && onHover(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setIsHovered(false);
        onHover && onHover(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick();
      }}
    >
      <boxGeometry args={size} />
      <meshBasicMaterial 
        color={highlightColor}
        transparent={true} 
        opacity={currentOpacity}
        side={2} // DoubleSide로 설정하여 양면 모두 렌더링
      />
    </mesh>
  );
}

/**
 * 4개의 파트 박스를 배치하는 컴포넌트
 */
function PartBoxes({ modelPath, customScale = null, onPartClick }) {
  const { scene } = useGLTF(modelPath);
  const [modelData, setModelData] = useState(null);
  const [hoveredBox, setHoveredBox] = useState(null);
  const [activeBox, setActiveBox] = useState(0); // 현재 활성화된 박스 인덱스

  React.useEffect(() => {
    if (scene) {
      // 모델의 바운딩 박스 계산
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      // console.log('PartBoxes - Model size:', size);
      // console.log('PartBoxes - Model center:', center);
      
      // 모델 데이터 설정
      setModelData({
        size: [size.x, size.y, size.z],
        center: [center.x, center.y, center.z]
      });
    }
  }, [scene]);

  // 박스 활성화 애니메이션
  React.useEffect(() => {
    if (!modelData) return;

    const interval = setInterval(() => {
      setActiveBox(prev => (prev + 1) % 4); // 0, 1, 2, 3 순환
    }, 2000); // 2초마다 변경

    return () => clearInterval(interval);
  }, [modelData]);

  if (!modelData) return null;

  // 각 박스별 개별 크기 정의 (모델 크기 기준)
  const boxSizes = [
    // 1번 박스 (파이버시멘트보드) - 다른 크기
    [modelData.size[0] * 1.2, modelData.size[1] * 3.5, modelData.size[2] * 5.0],
    // 2번 박스 (AL 복합판넬) - 기본 크기
    [modelData.size[0] * 0.6, modelData.size[1] * 3.5, modelData.size[2] * 5.0],
    // 3번 박스 (AL 시트판넬) - 기본 크기
    [modelData.size[0] * 0.6, modelData.size[1] * 3.5, modelData.size[2] * 5.0],
    // 4번 박스 (조적판넬) - 기본 크기
    [modelData.size[0] * 0.6, modelData.size[1] * 3.5, modelData.size[2] * 5.0]
  ];

  // 4개의 박스 위치 (각 패널에 배치 - 2번째 패널 제외)
  // 이미지 분석: 1번(왼쪽), 3번(중앙), 4번(오른쪽), 5번(가장 오른쪽) 패널에 배치
  const boxPositions = [
    [-modelData.size[0] * 1.1, modelData.size[1] * 0.15, modelData.size[2] * 0.15], // 1번 패널 (왼쪽) - 파이버시멘트보드
    [modelData.size[0] * 0.3, modelData.size[1] * 0.2, modelData.size[2] * 0.15], // 3번 패널 (중앙) - AL 복합판넬
    [modelData.size[0] * 0.3 + modelData.size[0] * 0.55, modelData.size[1] * 0.2, modelData.size[2] * 0.15], // 4번 패널 (오른쪽) - AL 시트판넬
    [modelData.size[0] * 0.3 + modelData.size[0] * 1.1, modelData.size[1] * 0.2, modelData.size[2] * 0.15] // 5번 패널 (가장 오른쪽) - 조적판넬
  ];

  const boxColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00]; // 빨강, 녹색, 파랑, 노랑

  return (
    <group scale={customScale || 1}>
      {boxPositions.map((position, index) => (
        <HighlightBox
          key={index}
          position={position}
          size={boxSizes[index]}
          color={boxColors[index]}
          opacity={0} // 기본적으로 완전 투명
          isActive={activeBox === index} // 현재 활성화된 박스
          onHover={(isHovered) => {
            setHoveredBox(isHovered ? index : null);
          }}
          onClick={() => {
            console.log(`Part ${index + 1} clicked`);
            onPartClick && onPartClick(index + 1);
          }}
        />
      ))}
    </group>
  );
}

/**
 * 전역 로딩 컴포넌트
 * React Three Fiber의 전역 로딩 상태를 표시합니다.
 */
function GlobalLoader() {
  const { active, progress, errors, item, loaded, total } = useProgress();

  if (!active) return null;

  return (
    <Html center>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
          <div className="text-center">
            {/* 로딩 아이콘 */}
            <div className="mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            </div>
            
            {/* 프로그레스바 */}
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-4 mb-3 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-500 ease-out shadow-sm relative overflow-hidden"
                  style={{ width: `${progress}%` }}
                >
                  {/* 프로그레스바 내부 애니메이션 효과 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                </div>
              </div>
              <p className="text-lg font-semibold text-gray-800">
                {Math.round(progress)}% 로딩 중...
              </p>
              {total > 0 && (
                <p className="text-sm text-gray-500">
                  {loaded} / {total} 파일
                </p>
              )}
            </div>
            
            {/* 현재 로딩 중인 파일 */}
            {item && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 font-medium">현재 로딩 중:</p>
                <p className="text-xs text-gray-500 truncate max-w-xs mx-auto">
                  {item}
                </p>
              </div>
            )}
            
            {/* 에러 표시 */}
            {errors.length > 0 && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 font-medium">로딩 오류:</p>
                <p className="text-xs text-red-500">
                  {errors[0]}
                </p>
              </div>
            )}
            
            {/* 로딩 메시지 */}
            <p className="text-sm text-gray-600">
              3D 모델을 준비하고 있습니다...
            </p>
          </div>
        </div>
      </div>
    </Html>
  );
}

/**
 * 3D 모델 컴포넌트
 * GLB 파일을 로드하고 회전 애니메이션을 적용합니다.
 */
function IsoverModel({ modelPath, customScale = null, showWireframe = false, onPartClick = null }) {
  const { scene } = useGLTF(modelPath);
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // 자동 회전 애니메이션 비활성화
  // useFrame((state, delta) => {
  //   if (meshRef.current) {
  //     meshRef.current.rotation.y += delta * 0.5;
  //   }
  // });

  // 3D 모델의 중심을 계산하여 위치 조정 (한 번만 실행)
  React.useEffect(() => {
    if (scene && meshRef.current && !isInitialized) {
      // 바운딩 박스 계산
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      
      // 중심을 원점으로 이동
      scene.position.set(-center.x, -center.y, -center.z);
      
      // 스케일 조정 (커스텀 스케일이 있으면 사용, 없으면 자동 계산)
      if (customScale !== null) {
        scene.scale.setScalar(customScale);
      } else {
        const size = box.getSize(new THREE.Vector3());
        const maxSize = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxSize; // 적절한 크기로 조정
        scene.scale.setScalar(scale);
      }
      
      setIsInitialized(true);
    }
  }, [scene, customScale, isInitialized]);

  return (
    <group>
      <primitive
        ref={meshRef}
        object={scene}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      />
      {showWireframe && (
        <PartBoxes 
          modelPath={modelPath} 
          customScale={customScale} 
          onPartClick={onPartClick}
        />
      )}
    </group>
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
  isModal = false,
  cameraPosition = [0, 0, 8],
  cameraFov = 35,
  customScale = null,
  rotateSpeed = 1.0,
  showWireframe = false,
  onPartClick = null
}) {
  const [animationOpacity, setAnimationOpacity] = useState(0);
  const [animationScale, setAnimationScale] = useState(0.8);
  const [animationPosition, setAnimationPosition] = useState({ x: 0, y: 0 });

  // 에러 상태만 관리 (전역 로딩은 GlobalLoader에서 처리)
  const [hasError, setHasError] = useState(false);

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
          {/* 전역 로딩이 처리하므로 개별 로딩 UI 제거 */}
          
          {hasError && (
            <div className="w-full h-full bg-red-50 flex items-center justify-center">
              <div className="text-center">
                <p className="text-red-600 mb-2 font-medium">3D 모델 로딩 실패</p>
                <p className="text-xs text-gray-500 mb-3">
                  {errors.length > 0 && errors[0]}
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  페이지 새로고침
                </button>
              </div>
            </div>
          )}

          {!hasError && (
            <Canvas
              camera={{ position: cameraPosition, fov: cameraFov }}
              onCreated={(state) => {
                // eslint-disable-next-line no-console
                console.log('[Canvas] Created', state);
                setHasError(false);
              }}
              onError={(error) => {
                // eslint-disable-next-line no-console
                console.error('[Canvas] Error', error);
                setHasError(true);
              }}
              style={{ paddingTop: '5%', width: '100%', height: '90%' }}
            >
              <Suspense fallback={null}>
                {/* 전역 로딩 컴포넌트 */}
                <GlobalLoader />
                
                {/* 조명 설정 - HDRI 대신 기본 조명 사용 */}
                <ambientLight intensity={0.4} />
                <directionalLight position={[10, 10, 5]} intensity={1.2} />
                <directionalLight position={[-10, -10, 5]} intensity={0.8} />
                <pointLight position={[0, 10, 0]} intensity={0.6} />
                
                {/* 3D 모델 */}
                <IsoverModel modelPath={modelPath} customScale={customScale} showWireframe={showWireframe} onPartClick={onPartClick} />
                
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
                  minDistance={4}
                  maxDistance={15}
                  rotateSpeed={rotateSpeed}
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
