import React, { useState, useEffect, useRef } from "react";
import Isover3DModel from './Isover3DModel';
// import Chatbot from './Chatbot';

/**
 * IsoverPage-mobile 컴포넌트
 * 
 * 이 컴포넌트는 모바일용 Isover 페이지를 구현합니다.
 * 주요 기능:
 * - 초기 로딩 애니메이션 (VQ 로고)
 * - 흰 화면에서 본 화면으로의 전환 효과
 * - 중앙 이미지 애니메이션
 * - 스크롤 방식 페이지 네비게이션
 * - 네비게이션 및 툴바 기능
 */
function IsoverPageMobile({ onBack = null }) {
  // 상태 관리 변수들
  const [showIntro, setShowIntro] = useState(true); // 인트로 화면 표시 여부
  const [logoOpacity, setLogoOpacity] = useState(0); // 로고 투명도
  const [whiteScreenVisible, setWhiteScreenVisible] = useState(true); // 흰 화면 표시 여부
  const [mainScreenVisible, setMainScreenVisible] = useState(false); // 본 화면 표시 여부
  const [imageScale, setImageScale] = useState(1.2); // 중앙 이미지 스케일 (120%에서 시작)
  const [imageOpacity, setImageOpacity] = useState(0); // 중앙 이미지 투명도

  // 3D 모델 뷰어 상태 관리 (표지 페이지에서만 표시)
  const [show3DModel, setShow3DModel] = useState(true);
  
  // 3D 모델 모달 상태 관리
  const [is3DModalOpen, setIs3DModalOpen] = useState(false);
  
  // front.gif 표시 상태 관리
  const [showFrontGif, setShowFrontGif] = useState(false);
  const [showSvgBackground, setShowSvgBackground] = useState(false);

  // 3페이지 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  
  // 3페이지 이미지 모달 상태 관리
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageType, setSelectedImageType] = useState(null); // '3-4-1', '3-4-2', '3-6-1'
  
  // 추가 4개 영역 모달 상태 관리
  const [isAdditionalModalOpen, setIsAdditionalModalOpen] = useState(false);
  const [selectedAdditionalArea, setSelectedAdditionalArea] = useState(null);
  
  // 4페이지 모달 상태 관리
  const [isPage4ModalOpen, setIsPage4ModalOpen] = useState(false);
  const [selectedPage4Area, setSelectedPage4Area] = useState(null);
  
  // 4페이지 영역 2번 전용 모달 상태 관리 (테스트용)
  const [isPage4Area2ModalOpen, setIsPage4Area2ModalOpen] = useState(false);
  
  // 5페이지 모달 상태 관리
  const [isPage5ModalOpen, setIsPage5ModalOpen] = useState(false);
  
  // 5페이지 3D 모델 모달 상태 관리
  const [isPage53DModalOpen, setIsPage53DModalOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState(1); // 선택된 파트 (1-4)
  const [currentPartModel, setCurrentPartModel] = useState(null); // 현재 표시할 파트 모델
  const [isPage53DModelLoading, setIsPage53DModelLoading] = useState(false); // 5페이지 3D 모델 로딩 상태
  const [modalKey, setModalKey] = useState(0); // 모달 새로고침을 위한 키
  
  // 5페이지 외장재 모달 상태 관리
  const [isPage5ExteriorModalOpen, setIsPage5ExteriorModalOpen] = useState(false);
  const [selectedExteriorType, setSelectedExteriorType] = useState(null); // 선택된 외장재 타입 (3-6)
  
  // 6페이지 모달 상태 관리
  const [isPage6ModalOpen, setIsPage6ModalOpen] = useState(false);
  const [selectedPage6Area, setSelectedPage6Area] = useState(null);
  
  // 추가 영역 이미지 모달 상태 관리 (돋보기 없이 단순 이미지 표시)
  const [isAdditionalImageModalOpen, setIsAdditionalImageModalOpen] = useState(false);
  const [selectedAdditionalImageType, setSelectedAdditionalImageType] = useState(null);
  
  // 7페이지 영상 상태 관리
  const [playingVideo, setPlayingVideo] = useState(null);
  const [showVideo, setShowVideo] = useState(false);

  // ref 변수들
  const animationRef = useRef(null);

  /**
   * 중앙 이미지 애니메이션 시작 함수
   */
  const startImageAnimation = () => {
    // 배경 이미지는 즉시 표시
    setImageScale(1);
    setImageOpacity(1);
  };



  /**
   * 반응형 이미지 크기 계산 함수
   * @param {number} baseSize - 기본 크기
   * @returns {number} 조정된 크기
   */
  const getResponsiveImageSize = (baseSize) => {
    const isLargeScreen = window.innerWidth >= 1024;
    return isLargeScreen ? baseSize : baseSize * 0.8;
  };



  // Isover 페이지별 이미지 데이터 (7페이지)
  const pageImages = [
    {
      id: 0,
      name: "표지",
      backgroundImage: "/IsoverFile/IsoverPage/page_1_Front.svg",
      overlays: []
    },
    {
      id: 1,
      name: "페이지 1",
      backgroundImage: "/IsoverFile/IsoverPage/page_2.svg",
      overlays: []
    },
    {
      id: 2,
      name: "페이지 2", 
      backgroundImage: "/IsoverFile/IsoverPage/page_3.svg",
      overlays: []
    },
    {
      id: 3,
      name: "페이지 3",
      backgroundImage: "/IsoverFile/IsoverPage/page_4.svg",
      overlays: []
    },
    {
      id: 4,
      name: "페이지 4",
      backgroundImage: "/IsoverFile/IsoverPage/page_5.svg",
      overlays: []
    },
    {
      id: 5,
      name: "페이지 5",
      backgroundImage: "/IsoverFile/IsoverPage/page_6.svg",
      overlays: []
    },
    {
      id: 6,
      name: "페이지 6",
      backgroundImage: "/IsoverFile/IsoverPage/page_7.svg",
      overlays: []
    }
  ];


  // front.gif 4초 후 자동 비활성화, 3.5초에 SVG 배경 활성화
  useEffect(() => {
    if (showFrontGif) {
      // 3.5초에 SVG 배경 활성화
      const svgTimer = setTimeout(() => {
        setShowSvgBackground(true);
      }, 3000);

      // 4초에 gif 비활성화
      const gifTimer = setTimeout(() => {
        setShowFrontGif(false);
      }, 3000);

      return () => {
        clearTimeout(svgTimer);
        clearTimeout(gifTimer);
      };
    }
  }, [showFrontGif]);

  // 2단계: 흰 화면이 위로 사라지는 전환
  const startTransition = React.useCallback(() => {
    console.log('2단계 애니메이션 시작');
    setWhiteScreenVisible(false);
    
    // 전환 완료 후 본 화면 표시
    setTimeout(() => {
      setMainScreenVisible(true);
      startImageAnimation();
      // 인트로 완료 후 1초 뒤에 GIF 시작
      setTimeout(() => {
        setShowFrontGif(true);
      }, 1000);
    }, 500);
  }, []);

  // 로고 애니메이션 완료 후 화면 전환
  useEffect(() => {
    if (logoOpacity === 1) {
      // 로고 애니메이션이 완료되면 0.5초 후 2단계 시작
      setTimeout(() => {
        startTransition();
      }, 500);
    }
  }, [logoOpacity, startTransition]);

  /**
   * 컴포넌트 마운트 시 애니메이션 시퀀스 실행
   */
  useEffect(() => {
    // 로고 애니메이션 시작
    const logoAnimation = () => {
      const startTime = performance.now();
      const duration = 1000; // 1초

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // ease-out 효과 적용
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setLogoOpacity(easeOut);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    };

    // 로고 애니메이션 시작
    setTimeout(() => {
      logoAnimation();
    }, 500);

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  /**
   * 표지 페이지 애니메이션 시작 함수
   */
  const startCoverPageAnimation = () => {
    // 애니메이션 상태 초기화
    resetAnimationStates();
  };

  /**
   * 애니메이션 상태 초기화 함수
   */
  const resetAnimationStates = () => {
    // 기존 애니메이션 정리
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };







  /**
   * 홈 버튼 클릭 핸들러 - IsoverPage 재시작 또는 뒤로 가기
   */
  const handleHomeClick = () => {
    // onBack이 있으면 뒤로 가기, 없으면 IsoverPage 재시작
    if (onBack) {
      onBack();
      return;
    }

    // 상태 초기화
    setShowIntro(true);
    setLogoOpacity(0);
    setWhiteScreenVisible(true);
    setMainScreenVisible(false);
    setImageScale(1.2);
    setImageOpacity(0);

    // 로고 애니메이션 재시작
    setTimeout(() => {
      const logoAnimation = () => {
        const startTime = performance.now();
        const duration = 1000;

        const animate = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          const easeOut = 1 - Math.pow(1 - progress, 3);
          setLogoOpacity(easeOut);

          if (progress < 1) {
            animationRef.current = requestAnimationFrame(animate);
          }
        };

        animationRef.current = requestAnimationFrame(animate);
      };

      // 로고 애니메이션 시작
      logoAnimation();
    }, 500);
  };


  /**
   * 프린터 버튼 클릭 핸들러 - PDF를 열고 프린트
   */
  const handlePrintClick = () => {
    const pdfUrl = "/IsoverFile/func-pdf/무용접파사드시스템 카다로그.pdf";
    const pdfWindow = window.open(pdfUrl, "_blank");
    if (pdfWindow) {
      pdfWindow.onload = () => {
        pdfWindow.print();
      };
    }
  };

  /**
   * PDF 다운로드 버튼 클릭 핸들러
   */
  const handleDownloadClick = () => {
    const link = document.createElement("a");
    link.href = "/IsoverFile/func-pdf/무용접파사드시스템 카다로그.pdf";
    link.download = "무용접파사드시스템 카다로그.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * 공유 버튼 클릭 핸들러
   */
  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Isover',
        text: 'Isover에 대해 확인해보세요!',
        url: window.location.href,
      }).then(() => {
        // Web Share API 성공 후에도 클립보드에 복사
        navigator.clipboard.writeText(window.location.href).then(() => {
          console.log('Isover 링크가 클립보드에 복사되었습니다!');
        }).catch(() => {
          console.log('클립보드 복사에 실패했습니다.');
        });
      }).catch(() => {
        // Web Share API 실패 시 클립보드에 복사
        navigator.clipboard.writeText(window.location.href).then(() => {
          alert('Isover 링크가 클립보드에 복사되었습니다!');
        }).catch(() => {
          alert('클립보드 복사에 실패했습니다.');
        });
      });
    } else {
      // Web Share API를 지원하지 않는 경우 클립보드에 복사
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Isover 링크가 클립보드에 복사되었습니다!');
      }).catch(() => {
        alert('클립보드 복사에 실패했습니다.');
      });
    }
  };

  /**
   * 목차 버튼 클릭 핸들러
   */
  const handleTocClick = () => {
    const targetPage = document.querySelector('[data-page-index="1"]');
    if (targetPage) {
      targetPage.scrollIntoView({ behavior: 'smooth' });
    }
  };

  /**
   * 3D 모델 뷰어 토글 핸들러 (표지 페이지에서만 작동)
   */
  const handle3DModelToggle = () => {
    setShow3DModel(!show3DModel);
  };

  /**
   * 영역별 클릭 핸들러들
   */
  const handleArea1Click = () => {
    // 1번 영역: 3번 페이지로 스크롤
    const targetPage = document.querySelector('[data-page-index="2"]');
    if (targetPage) {
      targetPage.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleArea2Click = () => {
    // 2번 영역: 4번 페이지로 스크롤 (1페이지 건너뛰기)
    const targetPage = document.querySelector('[data-page-index="3"]');
    if (targetPage) {
      targetPage.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleArea3Click = () => {
    // 3번 영역: 5번 페이지로 스크롤 (1페이지 건너뛰기)
    const targetPage = document.querySelector('[data-page-index="4"]');
    if (targetPage) {
      targetPage.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleArea4Click = () => {
    // 4번 영역: 6번 페이지로 스크롤 (2페이지 건너뛰기)
    const targetPage = document.querySelector('[data-page-index="5"]');
    if (targetPage) {
      targetPage.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleArea5Click = () => {
    // 5번 영역: 유튜브 링크 새 탭에서 열기
    window.open('https://www.youtube.com/@%EC%83%9D%EA%B3%A0%EB%B1%85%EC%9D%B4%EC%86%8C%EB%B0%94%EC%BD%94%EB%A6%AC%EC%95%84/videos', '_blank');
  };

  /**
   * 3페이지 영역 클릭 핸들러
   */
  const handle3PageAreaClick = (areaNumber) => {
    if (areaNumber === 1) {
      // 첫번째 영역: 5페이지로 바로 이동
      const targetPage = document.querySelector('[data-page-index="4"]');
      if (targetPage) {
        targetPage.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (areaNumber <= 6) {
      // 기존 6개 영역 (2-6번)
      setSelectedArea(areaNumber);
      setIsModalOpen(true);
    } else {
      // 추가 4개 영역 (7-10번)
      setSelectedAdditionalArea(areaNumber);
      setIsAdditionalModalOpen(true);
    }
  };

  /**
   * 5페이지로 이동하는 핸들러
   */
  const handleGoToPage5 = () => {
    console.log('🚀 handleGoToPage5 호출됨 - 5페이지로 이동 시작');
    // 모달 닫기
    closeModal();
    console.log('🚀 모달 닫기 완료');
    // 5페이지로 스크롤 이동 (페이지 인덱스는 0부터 시작하므로 4)
    const targetPage = document.querySelector('[data-page-index="4"]');
    if (targetPage) {
      console.log('🚀 5페이지 요소 찾음, 스크롤 이동 시작');
      targetPage.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.log('🚀 5페이지 요소를 찾을 수 없음');
    }
  };

  /**
   * 모달 닫기 핸들러
   */
  const closeModal = () => {
    console.log('❌ closeModal 호출됨 - 3페이지 모달 닫기');
    setIsModalOpen(false);
    setSelectedArea(null);
    console.log('❌ 3페이지 모달 상태 초기화 완료');
  };

  /**
   * 추가 모달 닫기 핸들러
   */
  const closeAdditionalModal = () => {
    setIsAdditionalModalOpen(false);
    setSelectedAdditionalArea(null);
  };

  /**
   * 이미지 모달 열기 핸들러
   */
  const openImageModal = (imageType) => {
    console.log('🖼️ openImageModal 호출됨:', imageType);
    setSelectedImageType(imageType);
    setIsImageModalOpen(true);
    console.log('🖼️ 이미지 모달 상태 설정 완료:', imageType);
  };

  // 추가 영역 이미지 모달 열기/닫기 (돋보기 컨트롤 없이)
  const openAdditionalImageModal = (imageType) => {
    setSelectedAdditionalImageType(imageType);
    setIsAdditionalImageModalOpen(true);
  };
  const closeAdditionalImageModal = () => {
    setIsAdditionalImageModalOpen(false);
    setSelectedAdditionalImageType(null);
  };

  /**
   * 이미지 모달 닫기 핸들러
   */
  const closeImageModal = () => {
    console.log('🖼️ closeImageModal 호출됨 - 이미지 모달 닫기');
    setIsImageModalOpen(false);
    setSelectedImageType(null);
    console.log('🖼️ 이미지 모달 상태 초기화 완료');
  };

  /**
   * 4페이지 영역 클릭 핸들러
   */
  const handlePage4AreaClick = (areaNumber) => {
    setSelectedPage4Area(areaNumber);
    setIsPage4ModalOpen(true);
  };

  /**
   * 4페이지 모달 닫기 핸들러
   */
  const closePage4Modal = () => {
    setIsPage4ModalOpen(false);
    setSelectedPage4Area(null);
  };

  /**
   * 4페이지 영역 2번 전용 모달 열기 핸들러 (테스트용)
   */
  const handlePage4Area2Click = () => {
    setIsPage4Area2ModalOpen(true);
  };

  /**
   * 4페이지 영역 2번 전용 모달 닫기 핸들러 (테스트용)
   */
  const closePage4Area2Modal = () => {
    setIsPage4Area2ModalOpen(false);
  };

  /**
   * 파트별 모델 경로 반환 함수
   */
  const getModelPathByPart = (partNumber) => {
    switch (partNumber) {
      case 1:
        return "/IsoverFile/3dmodel/1_System_Fiber_SET_test.glb"; // 파이버시멘트보드
      case 2:
        return "/IsoverFile/3dmodel/2_System_Alu-Complex_SET_test.glb"; // AL 복합판넬
      case 3:
        return "/IsoverFile/3dmodel/3_System_Alu-Sheet_SET_test.glb"; // AL 시트판넬
      case 4:
        return "/IsoverFile/3dmodel/4_System_Three_SET_test.glb"; // 조적판넬
      default:
        return "/IsoverFile/3dmodel/system_with_panel_test.glb";
    }
  };

  /**
   * 파트별 이름 반환 함수
   */
  const getPartName = (partNumber) => {
    switch (partNumber) {
      case 1:
        return "파이버시멘트보드";
      case 2:
        return "AL 복합판넬";
      case 3:
        return "AL 시트판넬";
      case 4:
        return "조적판넬";
      default:
        return "전체 시스템";
    }
  };

  /**
   * 파트별 모델 스케일 반환 함수
   */
  const getModelScaleByPart = (partNumber) => {
    switch (partNumber) {
      case 1:
        return 0.5; // 1_System_Fiber_SET
      case 2:
        return 0.5; // 2_System_Alu-Complex_SET
      case 3:
        return 0.5; // 3_System_Alu-Sheet_SET
      case 4:
        return 0.5; // 4_System_Three_SET
      default:
        return 0.3; // 기본 모델
    }
  };

  /**
   * 외장재 타입별 이름 반환 함수
   */
  const getExteriorTypeName = (typeNumber) => {
    switch (typeNumber) {
      case 3:
        return "파이버시멘트보드";
      case 4:
        return "AL 복합판넬";
      case 5:
        return "AL 시트판넬";
      case 6:
        return "조적판넬";
      default:
        return "외장재";
    }
  };

  /**
   * 외장재 타입별 모델 경로 반환 함수
   */
  const getExteriorModelPath = (typeNumber) => {
    switch (typeNumber) {
      case 3:
        return "/IsoverFile/3dmodel/1_System_Fiber_SET_test.glb"; // 파이버시멘트보드
      case 4:
        return "/IsoverFile/3dmodel/2_System_Alu-Complex_SET_test.glb"; // AL 복합판넬
      case 5:
        return "/IsoverFile/3dmodel/3_System_Alu-Sheet_SET_test.glb"; // AL 시트판넬
      case 6:
        return "/IsoverFile/3dmodel/4_System_Three_SET_test.glb"; // 조적판넬
      default:
        return "/IsoverFile/3dmodel/system_with_panel_test.glb";
    }
  };

  /**
   * 5페이지 영역 클릭 핸들러
   */
  const handlePage5AreaClick = (areaNumber) => {
    if (areaNumber === 1) {
      // 첫 번째 영역 - 3D 모델 모달 열기
      setCurrentPartModel(null);
      setSelectedPart(1);
      setIsPage53DModelLoading(true); // 로딩 상태 시작
      setModalKey(prev => prev + 1); // 모달 새로고침을 위한 키 증가
      setIsPage53DModalOpen(true);
    } else if (areaNumber === 2) {
      // 두 번째 영역만 모달 열기
      setIsPage5ModalOpen(true);
    } else if (areaNumber >= 3 && areaNumber <= 6) {
      // 외장재 영역들 (3-6번) - 외장재 모달 열기
      setSelectedExteriorType(areaNumber);
      setIsPage5ExteriorModalOpen(true);
    }
  };

  /**
   * 5페이지 3D 모델 파트 클릭 핸들러
   */
  const handlePage5PartClick = (partNumber) => {
    console.log(`Part ${partNumber} clicked`);
    setSelectedPart(partNumber);
    setIsPage53DModelLoading(true); // 파트 변경 시 로딩 상태 시작
    
    // 파트별 모델 경로 설정
    const partModelPath = getModelPathByPart(partNumber);
    setCurrentPartModel(partModelPath);
    
    // 모달 새로고침을 위한 키 증가
    setModalKey(prev => prev + 1);
  };

  /**
   * 5페이지 모달 닫기 핸들러
   */
  const closePage5Modal = () => {
    setIsPage5ModalOpen(false);
  };

  /**
   * 5페이지 외장재 모달 닫기 핸들러
   */
  const closePage5ExteriorModal = () => {
    setIsPage5ExteriorModalOpen(false);
    setSelectedExteriorType(null);
  };

  /**
   * 6페이지 영역 클릭 핸들러
   */
  const handlePage6AreaClick = (areaNumber) => {
    setSelectedPage6Area(areaNumber);
    setIsPage6ModalOpen(true);
  };

  /**
   * 6페이지 모달 닫기 핸들러
   */
  const closePage6Modal = () => {
    setIsPage6ModalOpen(false);
    setSelectedPage6Area(null);
  };

  /**
   * 7페이지 영역 클릭 핸들러
   */
  const handlePage7AreaClick = (areaNumber) => {
    if (areaNumber === 2) {
      // 왼쪽 로고 영역: Isover 링크
      window.open('https://www.isover.co.kr/', '_blank');
    } else if (areaNumber === 3) {
      // 오른쪽 로고 영역: Yoochang 링크
      window.open('http://www.yoochang.com/', '_blank');
    }
  };

  /**
   * 영상 닫기 핸들러
   */
  const closeVideo = () => {
    setShowVideo(false);
  };

  return (
    <div className="w-full h-screen overflow-hidden relative">
      {/* 인트로 화면 (흰 화면 + 로고) */}
      {showIntro && (
        <div 
          className={`fixed inset-0 bg-white z-50 transition-transform duration-500 ease-out ${
            whiteScreenVisible ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          {/* Isover 로고 */}
          <div className="w-full h-full flex flex-col items-center justify-center">
            <img 
              src="/IsoverFile/Interacive/Isover_Logo.svg"
              alt="Isover Logo"
              className="max-w-full max-h-full object-contain mb-4"
              style={{ opacity: logoOpacity }}
            />
            <img 
              src="/IsoverFile/Interacive/Yoochang_Logo.svg"
              alt="Yoochang Logo"
              className="max-w-full max-h-full object-contain"
              style={{ opacity: logoOpacity }}
            />
            
          </div>
        </div>
      )}

      {/* 본 화면 */}
      {mainScreenVisible && (
        <div className="w-full h-full relative bg-white flex flex-col">
          {/* 스크롤 컨테이너 - Book.jsx 방식 적용 */}
          <div className="flex-1 overflow-y-auto pb-20">
            {/* 페이지들을 세로로 배치 */}
            <div className="w-full space-y-0">
              {pageImages.map((page, index) => (
                <div
                  key={page.id}
                  className="relative overflow-hidden bg-white"
                  data-page-index={index}
                  style={{ 
                    width: '100%', 
                    height: 'auto',
                    minHeight: 'auto',
                    aspectRatio: 'auto'
                  }}
                >
                  <div 
                    className="w-full h-full flex flex-col justify-center items-center p-4 text-center relative"
                  >
                    {/* 모든 페이지 배경 이미지 */}
                    <img
                      src={page.backgroundImage}
                      alt={page.name}
                      className="w-full h-full object-cover"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />

                    {/* 표지 페이지 특별 처리 */}
                    {index === 0 && (
                      <>
                        {/* front.gif 전체 사이즈 배치 */}
                        {showFrontGif && (
                          <div className="absolute inset-0 w-full h-full">
                            <img
                              src="/IsoverFile/IsoverPage/front.gif"
                              alt="Front Animation"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* 표지 페이지 3D 모델 영역 - SVG 배경이 활성화된 후에만 표시 */}
                        {showSvgBackground && (
                          <div 
                            className="absolute transition-all duration-300 rounded-lg"
                            style={{
                              position: 'absolute',
                              bottom: '17%',
                              left: '22%',
                              width: '55%',
                              height: '48%'
                            }}
                            title="파이버시멘트보드 3D 모델"
                          >
                            {/* 파이버시멘트보드 3D 모델 배치 */}
                            <div className="absolute inset-0">
                              <Isover3DModel 
                                isVisible={true} 
                                opacity={1}
                                scale={0.3}
                                position={{ x: 0, y: 0 }}
                                animationDelay={500}
                                modelPath="/IsoverFile/3dmodel/1_System_Fiber_SET_test.glb"
                                isModal={false}
                                cameraPosition={[8, 2, 30]}
                                cameraFov={15}
                                customScale={0.8}
                                showWireframe={false}
                              />
                            </div>
                          </div>
                        )}
                        
                      </>
                    )}

                    {/* 2번째 페이지 클릭 영역들 */}
                    {index === 1 && (
                      <>
                        {/* 5개의 div 영역을 absolute로 배치 */}
                        <div 
                          className={`absolute cursor-pointer transition-all duration-300 rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || showVideo) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            top: '24%',
                            left: '9%',
                            width: '40%',
                            height: '25%'
                          }}
                          onClick={handleArea1Click}
                          title="3번 페이지로 이동"
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer transition-all duration-300 rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || showVideo) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            top: '24%',
                            right: '9%',
                            width: '40%',
                            height: '25%'
                          }}
                          onClick={handleArea2Click}
                          title="4번 페이지로 이동"
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer transition-all duration-300 rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || showVideo) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            bottom: '24%',
                            left: '9%',
                            width: '40%',
                            height: '25%'
                          }}
                          onClick={handleArea3Click}
                          title="5번 페이지로 이동"
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer transition-all duration-300 rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || showVideo) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            bottom: '24%',
                            right: '9%',
                            width: '40%',
                            height: '25%'
                          }}
                          onClick={handleArea4Click}
                          title="6번 페이지로 이동"
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer transition-all duration-300 rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || showVideo) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            bottom: '6%',
                            left: '30%',
                            width: '40%',
                            height: '8%'
                          }}
                          onClick={handleArea5Click}
                          title="유튜브 채널 열기"
                        >
                        </div>
                      </>
                    )}

                    {/* 3번째 페이지 클릭 영역들 */}
                    {index === 2 && (
                      <>
                        {/* 3페이지 상단 신규 영역 */}
                        <div 
                          className={`absolute cursor-pointer transition-all duration-300 rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || showVideo) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            top: '12%',
                            left: '5%',
                            width: '90%',
                            height: '6%'
                          }}
                          onClick={() => openImageModal('top_3-1')}
                        >
                        </div>
                        
                        {/* 3페이지 영역 6개 배치 */}
                        <div 
                          className={`absolute cursor-pointer transition-all duration-300 rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || showVideo) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            top: '26.5%',
                            left: '9%',
                            width: '35%',
                            height: '2.5%'
                          }}
                          onClick={() => handle3PageAreaClick(1)}
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer transition-all duration-300 rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || showVideo) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            top: '29.5%',
                            left: '9%',
                            width: '35%',
                            height: '2.5%'
                          }}
                          onClick={() => handle3PageAreaClick(2)}
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer transition-all duration-300 rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || showVideo) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            top: '32.5%',
                            left: '9%',
                            width: '35%',
                            height: '2.5%'
                          }}
                          onClick={() => handle3PageAreaClick(3)}
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer transition-all duration-300 rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || showVideo) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            top: '35.7%',
                            left: '9%',
                            width: '35%',
                            height: '2.5%'
                          }}
                          onClick={() => handle3PageAreaClick(4)}
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer transition-all duration-300 rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || showVideo) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            top: '38.7%',
                            left: '9%',
                            width: '35%',
                            height: '2.5%'
                          }}
                          onClick={() => handle3PageAreaClick(5)}
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer transition-all duration-300 rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || showVideo) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            top: '42%',
                            left: '9%',
                            width: '35%',
                            height: '2.5%'
                          }}
                          onClick={() => handle3PageAreaClick(6)}
                        >
                        </div>
                        
                        {/* 추가 4개 영역 */}
                        <div 
                          className={`absolute cursor-pointer transition-all duration-300 rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || showVideo) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            bottom: '46%',
                            right: '6%',
                            width: '27%',
                            height: '16.5%'
                          }}
                          onClick={() => handle3PageAreaClick(7)}
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer transition-all duration-300 rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || showVideo) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            bottom: '33%',
                            right: '6%',
                            width: '27%',
                            height: '12.5%'
                          }}
                          onClick={() => handle3PageAreaClick(8)}
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer transition-all duration-300 rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || showVideo) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            bottom: '20%',
                            right: '6%',
                            width: '27%',
                            height: '13%'
                          }}
                          onClick={() => handle3PageAreaClick(9)}
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer transition-all duration-300 rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || showVideo) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            bottom: '7%',
                            right: '6%',
                            width: '27%',
                            height: '13.5%'
                          }}
                          onClick={() => handle3PageAreaClick(10)}
                        >
                        </div>
                        
                        {/* 왼쪽 아래 3D 모델 영역 */}
                        <div 
                          className="absolute cursor-pointer hover:bg-blue-500/10 transition-all duration-300 rounded-lg"
                          style={{
                            position: 'absolute',
                            bottom: '20%',
                            left: '6%',
                            width: '58%',
                            height: '21%'
                          }}
                          onClick={() => setIs3DModalOpen(true)}
                          title="3D 모델 확대 보기"
                        >
                          {/* 호버 시 표시될 오버레이 */}
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100">
                            <div className="text-white text-sm font-medium bg-blue-600/80 px-3 py-1 rounded-full">
                              3D 모델 확대 보기
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* 4번째 페이지 클릭 영역들 */}
                    {index === 3 && (
                      <>
                        {/* 4페이지 영역 4개 배치 */}
                        <div 
                          className={`absolute cursor-pointer transition-all duration-300 rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || showVideo) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            top: '10%',
                            left: '5%',
                            width: '89%',
                            height: '19%'
                          }}
                          onClick={() => handlePage4AreaClick(1)}
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer transition-all duration-300 rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || showVideo) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            top: '31%',
                            left: '5%',
                            width: '89%',
                            height: '19%'
                          }}
                          onClick={() => handlePage4AreaClick(2)}
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer transition-all duration-300 rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || showVideo) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            bottom: '29%',
                            left: '5%',
                            width: '89%',
                            height: '19%'
                          }}
                          onClick={() => handlePage4AreaClick(3)}
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer transition-all duration-300 rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || showVideo) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            bottom: '7%',
                            left: '5%',
                            width: '89%',
                            height: '20%'
                          }}
                          onClick={() => handlePage4AreaClick(4)}
                        >
                        </div>
                      </>
                    )}

                    {/* 5번째 페이지 클릭 영역들 */}
                    {index === 4 && (
                      <>
                        {/* 5페이지 영역 2개 배치 */}
                        <div 
                          className={`absolute cursor-pointer transition-all duration-300 rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || showVideo) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            top: '25.5%',
                            left: '23%',
                            width: '70.5%',
                            height: '26%'
                          }}
                          onClick={() => handlePage5AreaClick(1)}
                          title="3D 모델 확대 보기"
                        >
                        </div>
                        
                        <div 
                          className={`absolute cursor-pointer transition-all duration-300 rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || showVideo) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            bottom: '12%',
                            left: '5%',
                            width: '90%',
                            height: '31%'
                          }}
                          onClick={() => handlePage5AreaClick(2)}
                        >
                        </div>

                        {/* 4가지 외장재 텍스트 영역들 */}
                        {/* 파이버시멘트보드 */}
                        <div 
                          className={`absolute cursor-pointer transition-all duration-300 ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || showVideo) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            top: '22%',
                            left: '7%',
                            width: '21%',
                            height: '2.5%'
                          }}
                          onClick={() => handlePage5AreaClick(3)}
                          title="파이버시멘트보드 상세 정보"
                        >
                        </div>
                        
                        {/* AL 복합판넬 */}
                        <div 
                          className={`absolute cursor-pointer transition-all duration-300 ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || showVideo) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            top: '32%',
                            left: '7%',
                            width: '12%',
                            height: '2.5%'
                          }}
                          onClick={() => handlePage5AreaClick(4)}
                          title="AL 복합판넬 상세 정보"
                        >
                        </div>
                        
                        {/* AL 시트판넬 */}
                        <div 
                          className={`absolute cursor-pointer transition-all duration-300 ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || showVideo) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            top: '37%',
                            left: '7%',
                            width: '12%',
                            height: '2.5%'
                          }}
                          onClick={() => handlePage5AreaClick(5)}
                          title="AL 시트판넬 상세 정보"
                        >
                        </div>
                        
                        {/* 조적판넬 */}
                        <div 
                          className={`absolute cursor-pointer transition-all duration-300 ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || showVideo) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            top: '44%',
                            left: '7%',
                            width: '15%',
                            height: '2.5%'
                          }}
                          onClick={() => handlePage5AreaClick(6)}
                          title="조적판넬 상세 정보"
                        >
                        </div>
                      </>
                    )}

                    {/* 6번째 페이지 클릭 영역들 */}
                    {index === 5 && (
                      <>
                        {/* 6페이지 영역 6개 배치 */}
                        <div 
                          className="absolute cursor-pointer transition-all duration-300 rounded-lg"
                          style={{
                            position: 'absolute',
                            top: '19%',
                            left: '11.3%',
                            width: '34.3%',
                            height: '17.1%'
                          }}
                          onClick={() => handlePage6AreaClick(1)}
                        >
                        </div>
                        
                        <div 
                          className="absolute cursor-pointer transition-all duration-300 rounded-lg"
                          style={{
                            position: 'absolute',
                            top: '19%',
                            right: '9.5%',
                            width: '34.3%',
                            height: '17.1%'
                          }}
                          onClick={() => handlePage6AreaClick(2)}
                        >
                        </div>
                        
                        <div 
                          className="absolute cursor-pointer transition-all duration-300 rounded-lg"
                          style={{
                            position: 'absolute',
                            top: '42%',
                            left: '11.3%',
                            width: '36%',
                            height: '17.1%'
                          }}
                          onClick={() => handlePage6AreaClick(3)}
                        >
                        </div>
                        
                        <div 
                          className="absolute cursor-pointer transition-all duration-300 rounded-lg"
                          style={{
                            position: 'absolute',
                            top: '42%',
                            right: '9.5%',
                            width: '34.5%',
                            height: '17.1%'
                          }}
                          onClick={() => handlePage6AreaClick(4)}
                        >
                        </div>
                        
                        <div 
                          className="absolute cursor-pointer transition-all duration-300 rounded-lg"
                          style={{
                            position: 'absolute',
                            bottom: '17%',
                            left: '11.3%',
                            width: '34.5%',
                            height: '17.1%'
                          }}
                          onClick={() => handlePage6AreaClick(5)}
                        >
                        </div>
                        
                        <div 
                          className="absolute cursor-pointer transition-all duration-300 rounded-lg"
                          style={{
                            position: 'absolute',
                            bottom: '17%',
                            right: '9.5%',
                            width: '34.5%',
                            height: '17.1%'
                          }}
                          onClick={() => handlePage6AreaClick(6)}
                        >
                        </div>
                        
                        {/* 6페이지 마지막 영역 (유튜브 링크) */}
                        <div 
                          className={`absolute cursor-pointer transition-all duration-300 rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || showVideo) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            bottom: '6%',
                            left: '32%',
                            width: '36%',
                            height: '4%'
                          }}
                          onClick={() => window.open('https://www.youtube.com/@%EC%83%9D%EA%B3%A0%EB%B1%85%EC%9D%B4%EC%86%8C%EB%B0%94%EC%BD%94%EB%A6%AC%EC%95%84/videos', '_blank')}
                          title="유튜브 채널 열기"
                        >
                        </div>
                      </>
                    )}

                    {/* 7번째 페이지 클릭 영역들 */}
                    {index === 6 && (
                      <>
                        {/* 7페이지 영역 3개 배치 */}
                        {/* 1. 큰 영역 (중앙) - 영상 배치용 */}
                        <div 
                          className="absolute cursor-pointer transition-all duration-300 hover:scale-103 rounded-lg"
                          style={{
                            position: 'absolute',
                            top: '16%',
                            left: '15%',
                            width: '70%',
                            height: '41%',
                            clipPath: 'polygon(0 25%, 100% 0%, 100% 75%, 0% 100%)'
                          }}
                          onClick={() => {
                            // 이미지 클릭 시 모달에서 영상 실행
                            setShowVideo(true);
                          }}
                        >
                          {/* 이미지 표시 */}
                          <div 
                            className="absolute inset-0 rounded-lg"
                            style={{
                              clipPath: 'polygon(0 25%, 100% 0%, 100% 75%, 0% 100%)'
                            }}
                          >
                            <img
                              src="/IsoverFile/Interacive/video/액션캡 영상 이미지.png"
                              alt="액션캠 영상 이미지"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        </div>
                        
                        {/* 2. 하단 왼쪽 영역 */}
                        <div 
                          className={`absolute cursor-pointer transition-all duration-300 rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || showVideo) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            bottom: '4.2%',
                            left: '5.5%',
                            width: '24%',
                            height: '22%'
                          }}
                          onClick={() => handlePage7AreaClick(2)}
                        >
                        </div>
                        
                        {/* 3. 하단 오른쪽 영역 */}
                        <div 
                          className={`absolute cursor-pointer transition-all duration-300 rounded-lg ${(isModalOpen || isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || showVideo) ? 'pointer-events-none' : ''}`}
                          style={{
                            position: 'absolute',
                            bottom: '9.2%',
                            right: '6.5%',
                            width: '28%',
                            height: '13%'
                          }}
                          onClick={() => handlePage7AreaClick(3)}
                        >
                        </div>
                      </>
                    )}

                    {/* 페이지 그림자 효과 */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent pointer-events-none"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 하단 기능 탭 - 가로 배치 */}
          <div className="absolute bottom-0 left-0 right-0 z-40 bg-gray-800 p-3">
            <div className="flex justify-center items-center gap-4">
              {/* 홈(Isover) 버튼 */}
              <button
                onClick={() => window.location.href = '/Isover'}
                className="w-10 h-10 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
                title="홈(Isover)"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </button>

              {/* 프린터 버튼 */}
              <button
                onClick={handlePrintClick}
                className="w-10 h-10 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
                title="프린트"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
              </button>

              {/* PDF 다운로드 버튼 */}
              <button
                onClick={handleDownloadClick}
                className="w-10 h-10 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
                title="PDF 다운로드"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>

              {/* 목차 버튼 */}
              <button
                onClick={handleTocClick}
                className="w-10 h-10 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
                title="목차"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>

              {/* 공유 버튼 */}
              <button
                onClick={handleShareClick}
                className="w-10 h-10 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
                title="공유"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* 3페이지 모달 */}
      {isModalOpen && selectedArea && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            console.log('🎭 3페이지 모달 배경 클릭됨');
            console.log('🎭 이벤트 타겟:', e.target);
            console.log('🎭 이벤트 currentTarget:', e.currentTarget);
            console.log('🎭 타겟과 currentTarget이 같은가?', e.target === e.currentTarget);
            // 배경 클릭 시에만 모달 닫기 (모달 내용 클릭 시에는 닫지 않음)
            if (e.target === e.currentTarget) {
              console.log('🎭 배경 클릭으로 인한 모달 닫기');
              closeModal();
            } else {
              console.log('🎭 모달 내용 클릭 - 모달 닫지 않음');
            }
          }}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-6xl max-h-[90vh] overflow-auto relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold z-10 transition-colors duration-300"
            >
              ×
            </button>

            {/* 이미지 표시 */}
            <div className="flex items-center justify-center relative">
              <img
                src={`/IsoverFile/Popup/${selectedArea}.png`}
                alt={`영역 ${selectedArea}`}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  // PNG가 없으면 JPG 시도
                  if (e.target.src.includes('.png')) {
                    e.target.src = `/IsoverFile/Popup/${selectedArea}.jpg`;
                  } else {
                    // 이미지 로드 실패 시 메시지 표시
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }
                }}
              />
              
              {/* 4번째 영역에 추가 영역 배치 */}
              {selectedArea === 4 && (
                <div 
                  className={`absolute cursor-pointer rounded-lg z-10`}
                  style={{
                    top: '32%',
                    left: '14.5%',
                    width: '24%',
                    height: '64%',
                    zIndex: 10
                  }}
                  onClick={(e) => {
                    console.log('🎯 4번째 영역 클릭됨 - 이벤트 전파 방지');
                    e.stopPropagation(); // 이벤트 전파 방지
                    console.log('🎯 4번째 영역 - openImageModal 호출');
                    openImageModal('3-4-1');
                  }}
                  title="3-4-1, 3-4-2 이미지 보기"
                >
                </div>
              )}
              
              {/* 6번째 영역에 추가 영역 배치 */}
              {selectedArea === 6 && (
                <div 
                  className={`absolute cursor-pointer rounded-lg z-10`}
                  style={{
                    bottom: '12%',
                    left: '12%',
                    width: '22%',
                    height: '55%',
                    zIndex: 10
                  }}
                  onClick={(e) => {
                    console.log('🎯 6번째 영역 클릭됨 - 이벤트 전파 방지');
                    e.stopPropagation(); // 이벤트 전파 방지
                    console.log('🎯 6번째 영역 - openImageModal 호출');
                    openImageModal('3-6-1');
                  }}
                  title="3-6-1 이미지 보기"
                >
                </div>
              )}

              {/* 3번째 영역일 때 블랙페이싱 3D 모델 영역 추가 */}
              {selectedArea === 3 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    {/* 블랙페이싱 3D 모델 영역 */}
                    <div 
                      className="absolute"
                      style={{
                        top: '31%',
                        right: '6%',
                        width: '30%',
                        height: '16%'
                      }}
                    >
                      <Isover3DModel 
                        isVisible={true} 
                        opacity={1}
                        scale={1}
                        position={{ x: 0, y: 0 }}
                        animationDelay={500}
                        modelPath="/IsoverFile/3dmodel/BlackFacing_test.glb"
                        isModal={true}
                        cameraPosition={[4, 4, 8]}
                        cameraFov={5}
                        customScale={0.7}
                        rotateSpeed={1.0}
                        showWireframe={false}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* 5페이지로 이동하는 클릭 영역 - 첫 번째 영역에서만 표시 */}
              {selectedArea === 1 && (
                <div
                  className={`absolute cursor-pointer transition-all duration-300 hover:scale-105 hover:border-2 hover:border-[#FEDB66] rounded-lg ${(isAdditionalModalOpen || isPage4ModalOpen || isPage4Area2ModalOpen || isPage5ModalOpen || isPage53DModalOpen || isPage6ModalOpen || is3DModalOpen || isImageModalOpen || isPage5ExteriorModalOpen || showVideo) ? 'pointer-events-none' : ''}`}
                  style={{
                    top: '49%',
                    left: '7%',
                    width: '34%',
                    height: '26%',
                    zIndex: 1
                  }}
                  onClick={(e) => {
                    console.log('🚀 5페이지로 이동하는 영역 클릭됨 (1번 영역)');
                    console.log('🚀 이벤트 타겟:', e.target);
                    console.log('🚀 이벤트 currentTarget:', e.currentTarget);
                    handleGoToPage5();
                  }}
                  title="5페이지로 이동"
                >
                </div>
              )}
              
              <div
                className="hidden text-gray-500 text-center"
                style={{ display: 'none' }}
              >
                <p>이미지를 불러올 수 없습니다.</p>
                <p className="text-sm">경로: /IsoverFile/Popup/{selectedArea}.jpg 또는 .png</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 추가 4개 영역 모달 */}
      {isAdditionalModalOpen && selectedAdditionalArea && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            // 배경 클릭 시에만 모달 닫기 (모달 내용 클릭 시에는 닫지 않음)
            if (e.target === e.currentTarget) {
              closeAdditionalModal();
            }
          }}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-6xl max-h-[90vh] overflow-auto relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={closeAdditionalModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold z-10 transition-colors duration-300"
            >
              ×
            </button>

            {/* 이미지와 3D 모델 표시 */}
            <div className="relative flex items-center justify-center">
              <img
                src={`/IsoverFile/Popup/pae_3-${selectedAdditionalArea - 6}.png`}
                alt={`영역 ${selectedAdditionalArea}`}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  // 이미지 로드 실패 시 메시지 표시
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              
              {/* 3D 모델 영역 - 각 영역마다 다른 모델 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  {selectedAdditionalArea === 7 && (
                    <div className="absolute top-[8%] left-[5%] w-[25%] h-[80%]">
                      <Isover3DModel 
                        isVisible={true} 
                        opacity={1}
                        scale={1}
                        position={{ x: 0, y: 0 }}
                        animationDelay={500}
                        modelPath="/IsoverFile/3dmodel/L-Bar.glb"
                        isModal={true}
                        cameraPosition={[8, 14, 14]}
                        cameraFov={20}
                        customScale={1}
                      />
                    </div>
                  )}
                  
                  {selectedAdditionalArea === 8 && (
                    <div className="absolute top-[8%] left-[5%] w-[25%] h-[80%]">
                    <Isover3DModel 
                      isVisible={true} 
                      opacity={1}
                      scale={1}
                      position={{ x: 0, y: 0 }}
                      animationDelay={500}
                      modelPath="/IsoverFile/3dmodel/L-AnkerBracket.glb"
                      isModal={true}
                      cameraPosition={[4, 3, 8]}
                      cameraFov={30}
                      customScale={0.3}
                    />
                  </div>
                  )}
                  
                  {selectedAdditionalArea === 9 && (
                    <div className="absolute top-[8%] left-[5%] w-[25%] h-[80%]">
                    <Isover3DModel 
                      isVisible={true} 
                      opacity={1}
                      scale={1}
                      position={{ x: 0, y: 0 }}
                      animationDelay={500}
                      modelPath="/IsoverFile/3dmodel/L-HBar.glb"
                      isModal={true}
                      cameraPosition={[-10, 10, 20]}
                      cameraFov={40}
                      customScale={0.3}
                    />
                  </div>
                  )}
                  
                  {selectedAdditionalArea === 10 && (
                    <div className="absolute top-[8%] left-[5%] w-[25%] h-[80%]">
                    <Isover3DModel 
                      isVisible={true} 
                      opacity={1}
                      scale={1}
                      position={{ x: 0, y: 0 }}
                      animationDelay={500}
                      modelPath="/IsoverFile/3dmodel/L-Holder.glb"
                      isModal={true}
                      cameraPosition={[1, 2, 2]}
                      cameraFov={30}
                      customScale={0.3}
                    />
                  </div>
                  )}

                  {/* 오른쪽 추가 영역 (7~10 공통) - 투명 클릭 영역 */}
                  {(selectedAdditionalArea >= 7 && selectedAdditionalArea <= 10) && (
                    <div 
                      className="absolute"
                      style={{ top: '18%', right: '5%', width: '19%', height: '60%' }}
                      onClick={() => openAdditionalImageModal(`pae_3-${selectedAdditionalArea - 6}`)}
                    >
                    </div>
                  )}
                </div>
              </div>
              
              <div
                className="hidden text-gray-500 text-center"
                style={{ display: 'none' }}
              >
                <p>이미지를 불러올 수 없습니다.</p>
                <p className="text-sm">경로: /IsoverFile/Popup/pae_3-{selectedAdditionalArea - 6}.png</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4페이지 모달 */}
      {isPage4ModalOpen && selectedPage4Area && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            // 배경 클릭 시에만 모달 닫기 (모달 내용 클릭 시에는 닫지 않음)
            if (e.target === e.currentTarget) {
              closePage4Modal();
            }
          }}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-5xl max-h-[95vh] overflow-auto relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={closePage4Modal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold z-10 transition-colors duration-300"
            >
              ×
            </button>

            {/* 이미지와 3D 모델 표시 */}
            <div className="relative flex items-center justify-center">
              <img
                src={`/IsoverFile/Popup/4-${selectedPage4Area}.png`}
                alt={`영역 ${selectedPage4Area}`}
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  // 이미지 로드 실패 시 메시지 표시
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              
              
              <div
                className="hidden text-gray-500 text-center"
                style={{ display: 'none' }}
              >
                <p>이미지를 불러올 수 없습니다.</p>
                <p className="text-sm">경로: /IsoverFile/Popup/4-{selectedPage4Area}.png</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4페이지 영역 2번 전용 모달 (테스트용) */}
      {isPage4Area2ModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            // 배경 클릭 시에만 모달 닫기 (모달 내용 클릭 시에는 닫지 않음)
            if (e.target === e.currentTarget) {
              closePage4Area2Modal();
            }
          }}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-5xl max-h-[95vh] overflow-auto relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={closePage4Area2Modal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold z-10 transition-colors duration-300"
            >
              ×
            </button>

            {/* 이미지와 3D 모델 표시 */}
            <div className="relative flex items-center justify-center">
              <img
                src="/IsoverFile/Popup/4-2.png"
                alt="영역 2 (테스트용)"
                className="max-w-full min-h-[40vh] max-h-[75vh] object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  // 이미지 로드 실패 시 메시지 표시
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              
              
              <div
                className="hidden text-gray-500 text-center"
                style={{ display: 'none' }}
              >
                <p>이미지를 불러올 수 없습니다.</p>
                <p className="text-sm">경로: /IsoverFile/Popup/4-2.png</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5페이지 모달 */}
      {isPage5ModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            // 배경 클릭 시에만 모달 닫기 (모달 내용 클릭 시에는 닫지 않음)
            if (e.target === e.currentTarget) {
              closePage5Modal();
            }
          }}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-6xl max-h-[90vh] overflow-auto relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={closePage5Modal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold z-10 transition-colors duration-300"
            >
              ×
            </button>

            {/* 이미지 표시 */}
            <div className="flex items-center justify-center">
              <img
                src="/IsoverFile/Popup/5-2.png"
                alt="5페이지 2번째 영역"
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  // 이미지 로드 실패 시 메시지 표시
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div
                className="hidden text-gray-500 text-center"
                style={{ display: 'none' }}
              >
                <p>이미지를 불러올 수 없습니다.</p>
                <p className="text-sm">경로: /IsoverFile/Popup/5-2.png</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5페이지 3D 모델 모달창 */}
      {isPage53DModalOpen && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={(e) => {
            // 배경 클릭 시에만 모달 닫기 (모달 내용 클릭 시에는 닫지 않음)
            if (e.target === e.currentTarget) {
              setIsPage53DModalOpen(false);
              setCurrentPartModel(null);
              setSelectedPart(1);
              setIsPage53DModelLoading(false);
            }
          }}
        >
          <div 
            className={`relative w-[90vw] h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden ${currentPartModel ? 'p-0' : ''}`}
            onClick={(e) => e.stopPropagation()}
            key={`3d-modal-${modalKey}-${selectedPart}`} // 모달 새로고침을 위한 키 (파트 변경 포함)
          >
            {/* 모달 헤더 - 전체 시스템일 때만 표시 */}
            {!currentPartModel && (
              <div className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-200 p-4">
                <div className="flex justify-center items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    5페이지 3D 모델 뷰어 - 전체 시스템
                  </h3>
                </div>
              </div>
            )}
            
            {/* 3D 모델 컨테이너 - 제목과 하단 컨트롤 영역 제외 */}
            <div className={`w-full relative ${!currentPartModel ? 'h-full pt-16 pb-20' : 'h-full pb-16'}`}>
              
              {/* 배경 이미지 - 파트 선택 시에만 표시 */}
              {currentPartModel && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={`/IsoverFile/Popup/pae_5-${selectedPart}.png`}
                    alt={`5페이지 배경 이미지 ${selectedPart}`}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      // PNG가 없으면 기본 이미지 사용
                      e.target.src = "/IsoverFile/Popup/5-2.png";
                    }}
                  />
                </div>
              )}
              
              {/* 파트 선택 안내 텍스트 */}
              {!currentPartModel && (
                <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 bg-white/90 backdrop-blur-sm rounded-lg px-6 py-3 shadow-lg border border-gray-200">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-800 mb-1">🎯 파트를 선택해보세요!</p>
                    <p className="text-sm text-gray-600">마우스로 회전하여 각 파트를 확인하고 클릭해보세요</p>
                  </div>
                </div>
              )}
              
              {/* 3D 모델 - 배경 이미지 위에 표시 */}
              <div className={`z-10 w-full h-full ${currentPartModel ? 'absolute inset-0' : 'relative'}`}>
                <Isover3DModel 
                  isVisible={true} 
                  opacity={0.9}
                  scale={0.7}
                  position={{ x: 0, y: 0 }}
                  animationDelay={0}
                  modelPath={currentPartModel || "/IsoverFile/3dmodel/system_with_panel_test.glb"}
                  isModal={true}
                  cameraPosition={currentPartModel ? [3, -2, 8] : [0, 0, 14]} // 파트 모델링과 system_with_panel 분리
                  cameraFov={currentPartModel ? 30 : 40}
                  customScale={currentPartModel ? getModelScaleByPart(selectedPart) : 0.8}
                  rotateSpeed={1.0}
                  showWireframe={!currentPartModel} // 파트 모델이 선택되면 박스 숨김
                  onPartClick={handlePage5PartClick}
                  onModelLoad={() => setIsPage53DModelLoading(false)} // 모델 로딩 완료 시 로딩 상태 해제
                />
              </div>
            </div>
            
            {/* 모달 하단 컨트롤 */}
            <div className="absolute bottom-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm border-t border-gray-200 p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">마우스로 회전, 휠로 확대/축소 가능</p>
                {currentPartModel && (
                  <p className="text-sm text-blue-600 mb-2">선택된 파트: {getPartName(selectedPart)}</p>
                )}
                <div className="flex justify-center space-x-4">
                  {currentPartModel && (
                    <button
                      onClick={() => {
                        setCurrentPartModel(null);
                        setSelectedPart(1);
                        setIsPage53DModelLoading(false);
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      전체 모델로 돌아가기
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsPage53DModalOpen(false);
                      setCurrentPartModel(null);
                      setSelectedPart(1);
                      setIsPage53DModelLoading(false);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6페이지 모달 */}
      {isPage6ModalOpen && selectedPage6Area && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            // 배경 클릭 시에만 모달 닫기 (모달 내용 클릭 시에는 닫지 않음)
            if (e.target === e.currentTarget) {
              closePage6Modal();
            }
          }}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-6xl max-h-[90vh] overflow-auto relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={closePage6Modal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold z-10 transition-colors duration-300"
            >
              ×
            </button>

            {/* GIF 표시 */}
            <div className="flex items-center justify-center">
              <img
                src={`/IsoverFile/Interacive/gif-file/${
                  selectedPage6Area === 1 ? 'L-Bracket-고정-1114.gif' :
                  selectedPage6Area === 2 ? '단열재-끼우기_1114.gif' :
                  selectedPage6Area === 3 ? '화스너-고정-Trim_1114.gif' :
                  selectedPage6Area === 4 ? '수직-L-Bar-고정_1114.gif' :
                  selectedPage6Area === 5 ? '수평-Bar-고정-Trim_1114.gif' :
                  selectedPage6Area === 6 ? '마감재-부착-Trim_1114.gif' :
                  'L-Bracket-고정-1114.gif'
                }`}
                alt={`영역 ${selectedPage6Area} GIF`}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  // GIF 로드 실패 시 메시지 표시
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div
                className="hidden text-gray-500 text-center"
                style={{ display: 'none' }}
              >
                <p>GIF를 불러올 수 없습니다.</p>
                <p className="text-sm">영역 {selectedPage6Area}의 GIF 파일을 찾을 수 없습니다.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7페이지 영상 모달 */}
      {showVideo && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            // 배경 클릭 시에만 모달 닫기 (모달 내용 클릭 시에는 닫지 않음)
            if (e.target === e.currentTarget) {
              setShowVideo(false);
            }
          }}
        >
          <div
            className="bg-black rounded-2xl p-4 max-w-4xl max-h-[90vh] overflow-auto relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-3xl font-bold z-10 transition-colors duration-300"
            >
              ×
            </button>

            {/* 영상 표시 */}
            <div className="flex items-center justify-center">
              <video
                className="w-full h-full object-contain rounded-lg"
                controls
                autoPlay
                onEnded={() => setShowVideo(false)}
              >
                <source src="/IsoverFile/Interacive/video/Isover_목업시공 액션캠.mp4" type="video/mp4" />
                영상을 재생할 수 없습니다.
              </video>
            </div>
          </div>
        </div>
      )}

      {/* 3페이지 이미지 모달창 */}
      {isImageModalOpen && selectedImageType && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            // 배경 클릭 시에만 모달 닫기 (모달 내용 클릭 시에는 닫지 않음)
            if (e.target === e.currentTarget) {
              closeImageModal();
            }
          }}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-7xl max-h-[95vh] overflow-auto relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold z-10 transition-colors duration-300"
            >
              ×
            </button>

            {/* 이미지 표시 */}
            <div className="flex items-center justify-center">
              {selectedImageType === '3-4-1' ? (
                // 3-4-1 타입일 때 두 이미지를 나란히 표시
                <div className="flex max-w-full max-h-[85vh]">
                  <img
                    src="/IsoverFile/Popup/3-4-2-Korean.jpg"
                    alt="3-4-2 Korean 이미지"
                    className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-lg"
                    onError={(e) => {
                        // 이미지 로드 실패 시 메시지 표시
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                    }}
                  />
                </div>
              ) : (
                // 다른 타입일 때는 단일 이미지 표시
                <img
                  src={`/IsoverFile/Popup/${selectedImageType}.jpg`}
                  alt={`${selectedImageType} 이미지`}
                  className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-lg"
                  onError={(e) => {
                    // JPG가 없으면 PNG 시도
                    if (e.target.src.includes('.jpg')) {
                      e.target.src = `/IsoverFile/Popup/${selectedImageType}.png`;
                    } else {
                      // 이미지 로드 실패 시 메시지 표시
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }
                  }}
                />
              )}
              <div
                className="hidden text-gray-500 text-center"
                style={{ display: 'none' }}
              >
                <p>이미지를 불러올 수 없습니다.</p>
                <p className="text-sm">경로: /IsoverFile/Popup/{selectedImageType}.jpg 또는 .png</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 추가 영역 이미지 모달창 (돋보기/줌 컨트롤 없이 단순 표시) */}
      {isAdditionalImageModalOpen && selectedAdditionalImageType && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeAdditionalImageModal();
          }}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-7xl max-h-[95vh] overflow-auto relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={closeAdditionalImageModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold z-10 transition-colors duration-300"
            >
              ×
            </button>

            {/* 이미지 표시 */}
            <div className="flex items-center justify-center">
              <img
                src={`/IsoverFile/Popup/${selectedAdditionalImageType}_img.png`}
                alt={`${selectedAdditionalImageType} 이미지`}
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  // PNG가 없으면 JPG 시도
                  if (e.target.src.endsWith('.png')) {
                    e.target.src = `/IsoverFile/Popup/${selectedAdditionalImageType}_img.jpg`;
                  } else {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }
                }}
              />
              <div
                className="hidden text-gray-500 text-center"
                style={{ display: 'none' }}
              >
                <p>이미지를 불러올 수 없습니다.</p>
                <p className="text-sm">경로: /IsoverFile/Popup/{selectedAdditionalImageType}_img.(png|jpg)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5페이지 외장재 모달창 */}
      {isPage5ExteriorModalOpen && selectedExteriorType && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={(e) => {
            // 배경 클릭 시에만 모달 닫기 (모달 내용 클릭 시에는 닫지 않음)
            if (e.target === e.currentTarget) {
              closePage5ExteriorModal();
            }
          }}
        >
          <div 
            className="relative w-[90vw] h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 3D 모델 컨테이너 - 제목과 하단 컨트롤 영역 제외 */}
            <div className="w-full h-full pb-16 relative">
              
              {/* 배경 이미지 - 외장재 타입에 따라 표시 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={`/IsoverFile/Popup/pae_5-${selectedExteriorType - 2}.png`}
                  alt={`외장재 타입 ${selectedExteriorType} 배경 이미지`}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    // PNG가 없으면 기본 이미지 사용
                    e.target.src = "/IsoverFile/Popup/5-2.png";
                  }}
                />
              </div>
              
              {/* 3D 모델 - 배경 이미지 위에 표시 */}
              <div className="absolute inset-0 z-10 w-full h-full">
                <Isover3DModel 
                  isVisible={true} 
                  opacity={0.9}
                  scale={0.7}
                  position={{ x: 0, y: 0 }}
                  animationDelay={0}
                  modelPath={getExteriorModelPath(selectedExteriorType)}
                  isModal={true}
                  cameraPosition={[3, -2, 8]}
                  cameraFov={50}
                  customScale={0.8}
                  rotateSpeed={1.0}
                  showWireframe={false}
                />
              </div>
            </div>
            
            {/* 모달 하단 컨트롤 */}
            <div className="absolute bottom-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm border-t border-gray-200 p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">마우스로 회전, 휠로 확대/축소 가능</p>
                <p className="text-sm text-blue-600 mb-2">외장재 타입: {getExteriorTypeName(selectedExteriorType)}</p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={closePage5ExteriorModal}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3D 모델 모달창 */}
      {is3DModalOpen && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={(e) => {
            // 배경 클릭 시에만 모달 닫기 (모달 내용 클릭 시에는 닫지 않음)
            if (e.target === e.currentTarget) {
              setIs3DModalOpen(false);
            }
          }}
        >
          <div className="relative w-[90vw] h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden">
            {/* 모달 헤더 */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-200 p-4">
              <div className="flex justify-center items-center">
                <h3 className="text-lg font-semibold text-gray-800">3D 모델 뷰어</h3>
              </div>
            </div>
            
            {/* 3D 모델 컨테이너 - 제목과 하단 컨트롤 영역 제외 */}
            <div className="w-full h-full pt-16 pb-20">
              <Isover3DModel 
                isVisible={true} 
                opacity={1}
                scale={0.7}
                position={{ x: 0, y: 0 }}
                animationDelay={0}
                modelPath="/IsoverFile/3dmodel/system_without_panel_test.glb"
                isModal={true}
                cameraPosition={[0, 0, 14]}
                cameraFov={50}
                customScale={0.8}
                rotateSpeed={1.0}
              />
            </div>
            
            {/* 모달 하단 컨트롤 */}
            <div className="absolute bottom-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm border-t border-gray-200 p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">마우스로 회전, 휠로 확대/축소 가능</p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setIs3DModalOpen(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dialogflow 챗봇 플로팅 버튼 */}
    {/*  <Chatbot /> */}
    </div>
  );
}

export default IsoverPageMobile;
