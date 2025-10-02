import React from 'react';
import HTMLFlipBook from 'react-pageflip';
import IsoverPageMobile from './IsoverPage-mobile';
import Isover3DModel from './Isover3DModel';

function IsoverPage({ onBack = null }) {
  // 화면 크기 상태 관리
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 1025);
  
  // 원본 이미지 비율 계산 (2480:3507)
  const originalAspectRatio = 2480 / 3507; // 약 0.707
  
  // 플립북 크기 계산 함수
  const calculateFlipBookSize = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // 화면의 40% 너비를 기준으로 하되, 최소 400px, 최대 600px
    const targetWidth = Math.max(400, Math.min(600, screenWidth * 0.4));
    
    // 원본 비율을 유지하여 높이 계산
    const targetHeight = targetWidth / originalAspectRatio;
    
    // 화면 높이의 80%를 넘지 않도록 제한
    const maxHeight = screenHeight * 0.8;
    if (targetHeight > maxHeight) {
      const adjustedWidth = maxHeight * originalAspectRatio;
      return {
        width: Math.max(350, adjustedWidth),
        height: maxHeight
      };
    }
    
    return {
      width: targetWidth,
      height: targetHeight
    };
  };
  
  const [flipBookSize, setFlipBookSize] = React.useState(calculateFlipBookSize());
  
  // 플립북 참조
  const flipBookRef = React.useRef(null);
  
  // 현재 페이지 상태 관리
  const [currentPage, setCurrentPage] = React.useState(0);
  const [isCoverPage, setIsCoverPage] = React.useState(true);
  
  // 3D 모델 뷰어 상태 관리 (표지 페이지에서만 표시)
  const [show3DModel, setShow3DModel] = React.useState(true);
  
  // 마우스 이벤트 활성화 상태 관리
  const [mouseEventsEnabled, setMouseEventsEnabled] = React.useState(false);
  
  // front.gif 표시 상태 관리
  const [showFrontGif, setShowFrontGif] = React.useState(false);
  const [showSvgBackground, setShowSvgBackground] = React.useState(false);

  // 3페이지 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedArea, setSelectedArea] = React.useState(null);
  
  // 추가 4개 영역 모달 상태 관리
  const [isAdditionalModalOpen, setIsAdditionalModalOpen] = React.useState(false);
  const [selectedAdditionalArea, setSelectedAdditionalArea] = React.useState(null);
  
  // 4페이지 모달 상태 관리
  const [isPage4ModalOpen, setIsPage4ModalOpen] = React.useState(false);
  const [selectedPage4Area, setSelectedPage4Area] = React.useState(null);
  
  // 5페이지 모달 상태 관리
  const [isPage5ModalOpen, setIsPage5ModalOpen] = React.useState(false);
  
  // 6페이지 모달 상태 관리
  const [isPage6ModalOpen, setIsPage6ModalOpen] = React.useState(false);
  const [selectedPage6Area, setSelectedPage6Area] = React.useState(null);
  const [hoveredArea6, setHoveredArea6] = React.useState(null);
  
  // 7페이지 영상 상태 관리
  const [playingVideo, setPlayingVideo] = React.useState(null);
  const [showVideo, setShowVideo] = React.useState(false);

  // 인트로 화면 상태 관리
  const [showIntro, setShowIntro] = React.useState(true);
  const [logoOpacity, setLogoOpacity] = React.useState(0);
  const [whiteScreenVisible, setWhiteScreenVisible] = React.useState(true);
  const [mainScreenVisible, setMainScreenVisible] = React.useState(false);

  // SVG 페이지 데이터
  const pageData = [
    { id: 1, svg: "/IsoverFile/IsoverPage/page_1_Front.svg", isCover: true },
    { id: 2, svg: "/IsoverFile/IsoverPage/page_2.svg" },
    { id: 3, svg: "/IsoverFile/IsoverPage/page_3.svg" },
    { id: 4, svg: "/IsoverFile/IsoverPage/page_4.svg" },
    { id: 5, svg: "/IsoverFile/IsoverPage/page_5.svg" },
    { id: 6, svg: "/IsoverFile/IsoverPage/page_6.svg" },
    { id: 7, svg: "/IsoverFile/IsoverPage/page_7.svg" }
  ];

  // 화면 크기 변경 감지
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1025);
      setFlipBookSize(calculateFlipBookSize());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 인트로 화면 애니메이션 시퀀스
  React.useEffect(() => {
    // 1단계: 로고 애니메이션 (opacity 0 → 100)
    const logoAnimation = () => {
      const startTime = performance.now();
      const duration = 1500; // 1.5초

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // ease-out 효과 적용
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setLogoOpacity(easeOut);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // 로고 애니메이션 완료 후 2초 대기
          setTimeout(() => {
            startTransition();
          }, 2000);
        }
      };

      requestAnimationFrame(animate);
    };

    // 2단계: 흰 화면이 위로 사라지는 전환
    const startTransition = () => {
      setWhiteScreenVisible(false);
      
      // 전환 완료 후 본 화면 표시
      setTimeout(() => {
        setMainScreenVisible(true);
        // 인트로 완료 후 1초 뒤에 GIF 시작
        setTimeout(() => {
          setShowFrontGif(true);
        }, 1000);
      }, 500);
    };

    // 애니메이션 시작
    setTimeout(() => {
      logoAnimation();
    }, 500);
  }, []);

  // front.gif 4초 후 자동 비활성화, 3.5초에 SVG 배경 활성화
  React.useEffect(() => {
    if (showFrontGif) {
      // 3.5초에 SVG 배경 활성화
      const svgTimer = setTimeout(() => {
        setShowSvgBackground(true);
      }, 3500);

      // 4초에 gif 비활성화
      const gifTimer = setTimeout(() => {
        setShowFrontGif(false);
      }, 4000);

      return () => {
        clearTimeout(svgTimer);
        clearTimeout(gifTimer);
      };
    }
  }, [showFrontGif]);

  // 페이지 변경 이벤트 핸들러
  const handlePageFlip = (e) => {
    const newPage = e.data;
    setCurrentPage(newPage);
    
    // 첫 페이지(0) 또는 마지막 페이지(7)인지 확인
    const isFirstPage = newPage === 0;
    const isLastPage = newPage === pageData.length - 1;
    setIsCoverPage(isFirstPage || isLastPage);
    
    // 표지 페이지일 때만 3D 모델 표시
    setShow3DModel(isFirstPage || isLastPage);
    
    // 첫 페이지(표지)로 돌아올 때 front.gif 초기화
    if (isFirstPage) {
      setShowFrontGif(true);
      setShowSvgBackground(false);
    }
  };

  /**
   * 홈 버튼 클릭 핸들러
   */
  const handleHomeClick = () => {
    if (onBack) {
      onBack();
      return;
    }

    // 인트로 화면 재시작
    setShowIntro(true);
    setLogoOpacity(0);
    setWhiteScreenVisible(true);
    setMainScreenVisible(false);

    // 애니메이션 재시작
    setTimeout(() => {
      const logoAnimation = () => {
        const startTime = performance.now();
        const duration = 1500;

        const animate = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          const easeOut = 1 - Math.pow(1 - progress, 3);
          setLogoOpacity(easeOut);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setTimeout(() => {
              setWhiteScreenVisible(false);
              setTimeout(() => {
                setMainScreenVisible(true);
                // 인트로 완료 후 1초 뒤에 GIF 시작
                setTimeout(() => {
                  setShowFrontGif(true);
                }, 1000);
              }, 500);
            }, 2000);
          }
        };

        requestAnimationFrame(animate);
      };

      logoAnimation();
    }, 500);
  };

  /**
   * 프린터 버튼 클릭 핸들러
   */
  const handlePrintClick = () => {
    const pdfUrl = '/IsoverFile/func-pdf/Isover-Catalog.pdf';
    const pdfWindow = window.open(pdfUrl, '_blank');
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
    const link = document.createElement('a');
    link.href = '/IsoverFile/func-pdf/Isover-Catalog.pdf';
    link.download = 'Isover-Catalog.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * 공유 버튼 클릭 핸들러
   */
  const handleShareClick = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Isover',
          text: 'Isover에 대해 확인해보세요!',
          url: window.location.href,
        })
        .catch(() => {
          navigator.clipboard.writeText(window.location.href);
        });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  /**
   * 3D 모델 뷰어 토글 핸들러 (표지 페이지에서만 작동)
   */
  const handle3DModelToggle = () => {
    if (isCoverPage) {
      setShow3DModel(!show3DModel);
    }
  };

  /**
   * 터치 영역 마우스 다운 핸들러
   */
  const handleTouchAreaMouseDown = (direction) => {
    setMouseEventsEnabled(true);
    console.log('useMouseEvents 상태: 활성화됨');
    
    // 즉시 페이지 이동도 실행
    if (direction === 'left') {
      goToPreviousPage();
    } else if (direction === 'right') {
      goToNextPage();
    }
  };

  /**
   * 터치 영역 마우스 업 핸들러
   */
  const handleTouchAreaMouseUp = () => {
    // 약간의 지연 후 비활성화 (제스처 완료 대기)
    setTimeout(() => {
      setMouseEventsEnabled(false);
      console.log('useMouseEvents 상태: 비활성화됨');
    }, 200);
  };

  /**
   * 터치 영역 터치 시작 핸들러
   */
  const handleTouchAreaTouchStart = (direction) => {
    setMouseEventsEnabled(true);
    console.log('useMouseEvents 상태: 활성화됨 (터치)');
    
    // 즉시 페이지 이동도 실행
    if (direction === 'left') {
      goToPreviousPage();
    } else if (direction === 'right') {
      goToNextPage();
    }
  };

  /**
   * 터치 영역 터치 끝 핸들러
   */
  const handleTouchAreaTouchEnd = () => {
    // 약간의 지연 후 비활성화 (제스처 완료 대기)
    setTimeout(() => {
      setMouseEventsEnabled(false);
      console.log('useMouseEvents 상태: 비활성화됨 (터치)');
    }, 200);
  };

  /**
   * 영역별 클릭 핸들러들
   */

  const handleArea2Click = () => {
    // 2번 영역: 4번 페이지로 이동 (1페이지 건너뛰기)
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().turnToPage(3); // 0-based index이므로 3은 4번째 페이지
    }
  };

  const handleArea3Click = () => {
    // 3번 영역: 5번 페이지로 이동 (1페이지 건너뛰기)
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().turnToPage(4); // 0-based index이므로 4는 5번째 페이지
    }
  };

  const handleArea4Click = () => {
    // 4번 영역: 6번 페이지로 이동 (2페이지 건너뛰기)
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().turnToPage(5); // 0-based index이므로 5는 6번째 페이지
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
    if (areaNumber <= 6) {
      // 기존 6개 영역 (1-6번)
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
    // 모달 닫기
    closeModal();
    // 5페이지로 이동 (페이지 인덱스는 0부터 시작하므로 4)
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().turnToPage(4);
    }
  };

  /**
   * 모달 닫기 핸들러
   */
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArea(null);
  };

  /**
   * 추가 모달 닫기 핸들러
   */
  const closeAdditionalModal = () => {
    setIsAdditionalModalOpen(false);
    setSelectedAdditionalArea(null);
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
   * 5페이지 영역 클릭 핸들러
   */
  const handlePage5AreaClick = (areaNumber) => {
    if (areaNumber === 2) {
      // 두 번째 영역만 모달 열기
      setIsPage5ModalOpen(true);
    }
  };

  /**
   * 5페이지 모달 닫기 핸들러
   */
  const closePage5Modal = () => {
    setIsPage5ModalOpen(false);
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
    } else if (areaNumber === 4) {
      // 하단 노란색 영역: Isover 링크
      window.open('https://www.isover.co.kr/', '_blank');
    } else if (areaNumber === 1) {
      // 1번 영역: 영상 토글
      setShowVideo(!showVideo);
    }
  };

  /**
   * 영상 닫기 핸들러
   */
  const closeVideo = () => {
    setShowVideo(false);
  };

  /**
   * 페이지 네비게이션 함수들
   */
  const goToFirstPage = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().turnToPage(0);
    }
  };

  const goToPreviousPage = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipPrev();
    }
  };

  const goToNextPage = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipNext();
    }
  };

  const goToLastPage = () => {
    if (flipBookRef.current) {
      const totalPages = flipBookRef.current.pageFlip().getPageCount();
      flipBookRef.current.pageFlip().turnToPage(totalPages - 1);
    }
  };

  // 모바일 화면인 경우 모바일 컴포넌트 렌더링
  if (isMobile) {
    return <IsoverPageMobile onBack={onBack} />;
  }

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
          <div className="w-full h-full flex items-center justify-center">
            <img 
              src="/IsoverFile/Interacive/Isover_Logo.svg"
              alt="Isover Logo"
              className="max-w-full max-h-full object-contain"
              style={{ opacity: logoOpacity }}
            />
          </div>
        </div>
      )}

      {/* 본 화면 */}
      {mainScreenVisible && (
        <div className="w-full h-screen overflow-hidden bg-white flex">
      {/* 왼쪽 위 Isover 로고 (홈 버튼) */}
      <div className="flex-shrink-0 pt-6">
        <button onClick={handleHomeClick} className="cursor-pointer">
          <img
            src="/IsoverFile/Interacive/Isover_Logo.svg"
            alt="Isover Logo"
            className="h-10 xl:h-14 w-auto"
          />
        </button>
      </div>

      {/* 중앙 플립북 컨테이너 */}
      <div className=" w-full h-full flex items-center justify-center p-4">
        <div className="flex items-center xl:gap-4">
          {/* 왼쪽 네비게이션 버튼들 - 표지 페이지가 아닐 때만 표시 */}
          {!isCoverPage && (
            <div className="flex flex-col items-center gap-2">
               {/* Left 버튼 */}
               <button
                 onClick={goToPreviousPage}
                 className="cursor-pointer hover:scale-110 transition-transform duration-200"
                 style={{ width: '48px', height: '48px', padding: '8px' }}
                 title="이전 페이지"
               >
                 <img
                   src="/IsoverFile/Interacive/arrow_left.svg"
                   alt="이전 페이지"
                   style={{ width: '32px', height: '32px' }}
                 />
               </button>
               {/* First 버튼 */}
               <button
                 onClick={goToFirstPage}
                 className="cursor-pointer hover:scale-110 transition-transform duration-200"
                 style={{ width: '48px', height: '48px', padding: '8px' }}
                 title="첫 페이지"
               >
                 <img
                   src="/IsoverFile/Interacive/arrow_first.svg"
                   alt="첫 페이지"
                   style={{ width: '32px', height: '32px' }}
                 />
               </button>
            </div>
          )}

          {/* 플립북 */}
          <div className="flex items-center justify-center">
            <HTMLFlipBook 
              ref={flipBookRef}
              width={flipBookSize.width} 
              height={flipBookSize.height}
              maxShadowOpacity={0}
              drawShadow={false}
              showCover={true}
              size='fixed'
              disableFlipByClick={true}
              swipeDistance={100}
              flipOnTouch={false}
              useMouseEvents={mouseEventsEnabled}
              usePortrait={false}
              showPageCorners={false}
              onFlip={handlePageFlip}
            >
            {/* 표지 페이지 (첫 번째 페이지) */}
            <div 
              className="page rounded-md shadow-lg overflow-hidden" 
              key={pageData[0].id}
              data-density="hard"
            >
              <div 
                className="page-content w-full h-full bg-cover bg-center bg-no-repeat relative"
                style={{
                  backgroundImage: showSvgBackground ? `url(${pageData[0].svg})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* SVG 배경이 전체 페이지를 덮도록 함 */}
                
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
                
                {/* 표지 페이지에 3D 모델 배치 */}
                <div className="absolute inset-0">
                  <Isover3DModel 
                    isVisible={show3DModel} 
                    opacity={1}
                    scale={1}
                    position={{ x: 0, y: 0 }}
                    animationDelay={1000}
                  />
                </div>

                {/* 오른쪽 터치 영역 (표지는 오른쪽) */}
                <div 
                  className="absolute right-0 top-0 w-2.5 h-full cursor-pointer hover:bg-blue-500/20 transition-colors"
                  onMouseDown={() => handleTouchAreaMouseDown('right')}
                  onMouseUp={handleTouchAreaMouseUp}
                  onTouchStart={() => handleTouchAreaTouchStart('right')}
                  onTouchEnd={handleTouchAreaTouchEnd}
                  title="다음 페이지로 이동"
                />
              </div>
            </div>

            {/* 2번째 페이지 */}
            <div 
              className="page rounded-md shadow-lg overflow-hidden" 
              key={pageData[1].id}
              data-density="hard"
            >
              <div 
                className="page-content w-full h-full bg-cover bg-center bg-no-repeat relative"
                style={{
                  backgroundImage: `url(${pageData[1].svg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* SVG 배경이 전체 페이지를 덮도록 함 */}
                
                {/* 5개의 div 영역을 absolute로 배치 */}
                <div 
                  className="absolute cursor-pointer transition-all duration-300 hover:scale-105 hover:border-2 hover:border-[#FEDB66] rounded-lg"
                  style={{
                    position: 'absolute',
                    top: '26%',
                    left: '7%',
                    width: '40%',
                    height: '22%'
                  }}
                >
                </div>
                
                <div 
                  className="absolute cursor-pointer transition-all duration-300 hover:scale-105 hover:border-2 hover:border-[#FEDB66] rounded-lg"
                  style={{
                    position: 'absolute',
                    top: '26%',
                    right: '9%',
                    width: '40%',
                    height: '22%'
                  }}
                  onClick={handleArea2Click}
                  title="4번 페이지로 이동"
                >
                </div>
                
                <div 
                  className="absolute cursor-pointer transition-all duration-300 hover:scale-105 hover:border-2 hover:border-[#FEDB66] rounded-lg"
                  style={{
                    position: 'absolute',
                    bottom: '26%',
                    left: '8%',
                    width: '40%',
                    height: '22%'
                  }}
                  onClick={handleArea3Click}
                  title="5번 페이지로 이동"
                >
                </div>
                
                <div 
                  className="absolute cursor-pointer transition-all duration-300 hover:scale-105 hover:border-2 hover:border-[#FEDB66] rounded-lg"
                  style={{
                    position: 'absolute',
                    bottom: '26%',
                    right: '9%',
                    width: '40%',
                    height: '22%'
                  }}
                  onClick={handleArea4Click}
                  title="6번 페이지로 이동"
                >
                </div>
                
                <div 
                  className="absolute cursor-pointer transition-all duration-300 hover:scale-105 hover:border-2 hover:border-[#FEDB66] rounded-lg"
                  style={{
                    position: 'absolute',
                    bottom: '5%',
                    left: '30%',
                    width: '40%',
                    height: '8%'
                  }}
                  onClick={handleArea5Click}
                  title="유튜브 채널 열기"
                >
                </div>
                
                {/* 왼쪽 터치 영역 (2페이지는 왼쪽) */}
                <div 
                  className="absolute left-0 top-0 w-2.5 h-full cursor-pointer hover:bg-blue-500/20 transition-colors"
                  onMouseDown={() => handleTouchAreaMouseDown('left')}
                  onMouseUp={handleTouchAreaMouseUp}
                  onTouchStart={() => handleTouchAreaTouchStart('left')}
                  onTouchEnd={handleTouchAreaTouchEnd}
                  title="이전 페이지로 이동"
                />
              </div>
            </div>

            {/* 3번째 페이지 */}
            <div 
              className="page rounded-md shadow-lg overflow-hidden" 
              key={pageData[2].id}
              data-density="hard"
            >
              <div 
                className="page-content w-full h-full bg-cover bg-center bg-no-repeat relative"
                style={{
                  backgroundImage: `url(${pageData[2].svg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* SVG 배경이 전체 페이지를 덮도록 함 */}
                
                {/* 목차로 돌아가기 버튼 */}
                <button
                  onClick={() => {
                    if (flipBookRef.current) {
                      flipBookRef.current.pageFlip().turnToPage(1);
                    }
                  }}
                  className="absolute right-4 px-3 py-2 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 z-10 hover:opacity-100"
                  style={{
                    top: '5%',
                    fontFamily: 'NanumSquareEB, sans-serif',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    backgroundColor: '#625C59',
                    color: 'white',
                    opacity: 0.9
                  }}
                  title="목차로 돌아가기"
                >
                  📋 목차
                </button>
                
                {/* 3페이지 영역 6개 배치 */}
                <div 
                  className="absolute cursor-pointer transition-all duration-300 hover:scale-105 hover:border-2 hover:border-[#FEDB66] rounded-lg"
                  style={{
                    position: 'absolute',
                    top: '25.5%',
                    left: '9%',
                    width: '35%',
                    height: '2.5%'
                  }}
                  onClick={() => handle3PageAreaClick(1)}
                >
                </div>
                
                <div 
                  className="absolute cursor-pointer transition-all duration-300 hover:scale-105 hover:border-2 hover:border-[#FEDB66] rounded-lg"
                  style={{
                    position: 'absolute',
                    top: '28.7%',
                    left: '9%',
                    width: '35%',
                    height: '2.5%'
                  }}
                  onClick={() => handle3PageAreaClick(2)}
                >
                </div>
                
                <div 
                  className="absolute cursor-pointer transition-all duration-300 hover:scale-105 hover:border-2 hover:border-[#FEDB66] rounded-lg"
                  style={{
                    position: 'absolute',
                    top: '32%',
                    left: '9%',
                    width: '35%',
                    height: '2.5%'
                  }}
                  onClick={() => handle3PageAreaClick(3)}
                >
                </div>
                
                <div 
                  className="absolute cursor-pointer transition-all duration-300 hover:scale-105 hover:border-2 hover:border-[#FEDB66] rounded-lg"
                  style={{
                    position: 'absolute',
                    top: '35.1%',
                    left: '9%',
                    width: '35%',
                    height: '2.5%'
                  }}
                  onClick={() => handle3PageAreaClick(4)}
                >
                </div>
                
                <div 
                  className="absolute cursor-pointer transition-all duration-300 hover:scale-105 hover:border-2 hover:border-[#FEDB66] rounded-lg"
                  style={{
                    position: 'absolute',
                    top: '38.3%',
                    left: '9%',
                    width: '35%',
                    height: '2.5%'
                  }}
                  onClick={() => handle3PageAreaClick(5)}
                >
                </div>
                
                <div 
                  className="absolute cursor-pointer transition-all duration-300 hover:scale-105 hover:border-2 hover:border-[#FEDB66] rounded-lg"
                  style={{
                    position: 'absolute',
                    top: '41.5%',
                    left: '9%',
                    width: '35%',
                    height: '2.5%'
                  }}
                  onClick={() => handle3PageAreaClick(6)}
                >
                </div>
                
                {/* 추가 4개 영역 */}
                <div 
                  className="absolute cursor-pointer transition-all duration-300 hover:scale-105 hover:border-2 hover:border-[#FEDB66] rounded-lg"
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
                  className="absolute cursor-pointer transition-all duration-300 hover:scale-105 hover:border-2 hover:border-[#FEDB66] rounded-lg"
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
                  className="absolute cursor-pointer transition-all duration-300 hover:scale-105 hover:border-2 hover:border-[#FEDB66] rounded-lg"
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
                  className="absolute cursor-pointer transition-all duration-300 hover:scale-105 hover:border-2 hover:border-[#FEDB66] rounded-lg"
                  style={{
                    position: 'absolute',
                    bottom: '8%',
                    right: '7%',
                    width: '27%',
                    height: '10.5%'
                  }}
                  onClick={() => handle3PageAreaClick(10)}
                >
                </div>
                
                {/* 오른쪽 터치 영역 (3페이지는 오른쪽) */}
                <div 
                  className="absolute right-0 top-0 w-2.5 h-full cursor-pointer hover:bg-blue-500/20 transition-colors"
                  onMouseDown={() => handleTouchAreaMouseDown('right')}
                  onMouseUp={handleTouchAreaMouseUp}
                  onTouchStart={() => handleTouchAreaTouchStart('right')}
                  onTouchEnd={handleTouchAreaTouchEnd}
                  title="다음 페이지로 이동"
                />
              </div>
            </div>

            {/* 4번째 페이지 */}
            <div 
              className="page rounded-md shadow-lg overflow-hidden" 
              key={pageData[3].id}
              data-density="hard"
            >
              <div 
                className="page-content w-full h-full bg-cover bg-center bg-no-repeat relative"
                style={{
                  backgroundImage: `url(${pageData[3].svg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* SVG 배경이 전체 페이지를 덮도록 함 */}
                
                {/* 목차로 돌아가기 버튼 */}
                <button
                  onClick={() => {
                    if (flipBookRef.current) {
                      flipBookRef.current.pageFlip().turnToPage(1);
                    }
                  }}
                  className="absolute right-4 px-3 py-2 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 z-10 hover:opacity-100"
                  style={{
                    top: '5%',
                    fontFamily: 'NanumSquareEB, sans-serif',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    backgroundColor: '#625C59',
                    color: 'white',
                    opacity: 0.9
                  }}
                  title="목차로 돌아가기"
                >
                  📋 목차
                </button>
                
                {/* 4페이지 영역 4개 배치 */}
                <div 
                  className="absolute cursor-pointer transition-all duration-300 hover:scale-105 hover:border-2 hover:border-[#FEDB66] rounded-lg"
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
                  className="absolute cursor-pointer transition-all duration-300 hover:scale-105 hover:border-2 hover:border-[#FEDB66] rounded-lg"
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
                  className="absolute cursor-pointer transition-all duration-300 hover:scale-105 hover:border-2 hover:border-[#FEDB66] rounded-lg"
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
                  className="absolute cursor-pointer transition-all duration-300 hover:scale-105 hover:border-2 hover:border-[#FEDB66] rounded-lg"
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
                
                {/* 왼쪽 터치 영역 (4페이지는 왼쪽) */}
                <div 
                  className="absolute left-0 top-0 w-2.5 h-full cursor-pointer hover:bg-blue-500/20 transition-colors"
                  onMouseDown={() => handleTouchAreaMouseDown('left')}
                  onMouseUp={handleTouchAreaMouseUp}
                  onTouchStart={() => handleTouchAreaTouchStart('left')}
                  onTouchEnd={handleTouchAreaTouchEnd}
                  title="이전 페이지로 이동"
                />
              </div>
            </div>

            {/* 5번째 페이지 */}
            <div 
              className="page rounded-md shadow-lg overflow-hidden" 
              key={pageData[4].id}
              data-density="hard"
            >
              <div 
                className="page-content w-full h-full bg-cover bg-center bg-no-repeat relative"
                style={{
                  backgroundImage: `url(${pageData[4].svg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* SVG 배경이 전체 페이지를 덮도록 함 */}
                
                {/* 목차로 돌아가기 버튼 */}
                <button
                  onClick={() => {
                    if (flipBookRef.current) {
                      flipBookRef.current.pageFlip().turnToPage(1);
                    }
                  }}
                  className="absolute right-4 px-3 py-2 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 z-10 hover:opacity-100"
                  style={{
                    top: '5%',
                    fontFamily: 'NanumSquareEB, sans-serif',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    backgroundColor: '#625C59',
                    color: 'white',
                    opacity: 0.9
                  }}
                  title="목차로 돌아가기"
                >
                  📋 목차
                </button>
                
                {/* 5페이지 영역 2개 배치 */}
                <div 
                  className="absolute cursor-pointer transition-all duration-300 rounded-lg"
                  style={{
                    position: 'absolute',
                    top: '26%',
                    left: '19%',
                    width: '75%',
                    height: '23%'
                  }}
                  onClick={() => handlePage5AreaClick(1)}
                >
                  {/* 첫 번째 영역에 3D 모델 직접 배치 */}
                  <div className="absolute inset-0">
                    <Isover3DModel 
                      isVisible={true} 
                      opacity={0.9}
                      scale={0.8}
                      position={{ x: 0, y: 0 }}
                      animationDelay={500}
                      modelPath="/IsoverFile/3dmodel/Untitled.glb"
                      isModal={true}
                    />
                  </div>
                </div>
                
                <div 
                  className="absolute cursor-pointer transition-all duration-300 hover:scale-105 hover:border-2 hover:border-[#FEDB66] rounded-lg"
                  style={{
                    position: 'absolute',
                    bottom: '14%',
                    left: '5%',
                    width: '90%',
                    height: '29%'
                  }}
                  onClick={() => handlePage5AreaClick(2)}
                >
                </div>
                
                {/* 오른쪽 터치 영역 (5페이지는 오른쪽) */}
                <div 
                  className="absolute right-0 top-0 w-2.5 h-full cursor-pointer hover:bg-blue-500/20 transition-colors"
                  onMouseDown={() => handleTouchAreaMouseDown('right')}
                  onMouseUp={handleTouchAreaMouseUp}
                  onTouchStart={() => handleTouchAreaTouchStart('right')}
                  onTouchEnd={handleTouchAreaTouchEnd}
                  title="다음 페이지로 이동"
                />
              </div>
            </div>

            {/* 6번째 페이지 */}
            <div 
              className="page rounded-md shadow-lg overflow-hidden" 
              key={pageData[5].id}
              data-density="hard"
            >
              <div 
                className="page-content w-full h-full bg-cover bg-center bg-no-repeat relative"
                style={{
                  backgroundImage: `url(${pageData[5].svg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* SVG 배경이 전체 페이지를 덮도록 함 */}
                
                {/* 목차로 돌아가기 버튼 */}
                <button
                  onClick={() => {
                    if (flipBookRef.current) {
                      flipBookRef.current.pageFlip().turnToPage(1);
                    }
                  }}
                  className="absolute right-4 px-3 py-2 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 z-10 hover:opacity-100"
                  style={{
                    top: '5%',
                    fontFamily: 'NanumSquareEB, sans-serif',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    backgroundColor: '#625C59',
                    color: 'white',
                    opacity: 0.9
                  }}
                  title="목차로 돌아가기"
                >
                  📋 목차
                </button>
                
                {/* 6페이지 영역 6개 배치 */}
                <div 
                  className="absolute cursor-pointer transition-all duration-300 rounded-lg"
                  style={{
                    position: 'absolute',
                    top: '18.3%',
                    left: '11%',
                    width: '35.3%',
                    height: '17.1%'
                  }}
                  onClick={() => handlePage6AreaClick(1)}
                  onMouseEnter={() => setHoveredArea6(1)}
                  onMouseLeave={() => setHoveredArea6(null)}
                >
                  {hoveredArea6 === 1 && (
                    <img
                      src="/IsoverFile/Interacive/gif-file/L-Bracket-고정-1114.gif"
                      alt="L-Bracket 고정"
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    />
                  )}
                </div>
                
                <div 
                  className="absolute cursor-pointer transition-all duration-300 rounded-lg"
                  style={{
                    position: 'absolute',
                    top: '18.3%',
                    right: '9%',
                    width: '35.5%',
                    height: '17.1%'
                  }}
                  onClick={() => handlePage6AreaClick(2)}
                  onMouseEnter={() => setHoveredArea6(2)}
                  onMouseLeave={() => setHoveredArea6(null)}
                >
                  {hoveredArea6 === 2 && (
                    <img
                      src="/IsoverFile/Interacive/gif-file/단열재-끼우기_1114.gif"
                      alt="단열재 끼우기"
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    />
                  )}
                </div>
                
                <div 
                  className="absolute cursor-pointer transition-all duration-300 rounded-lg"
                  style={{
                    position: 'absolute',
                    top: '42.1%',
                    left: '10.3%',
                    width: '35.3%',
                    height: '17.1%'
                  }}
                  onClick={() => handlePage6AreaClick(3)}
                  onMouseEnter={() => setHoveredArea6(3)}
                  onMouseLeave={() => setHoveredArea6(null)}
                >
                  {hoveredArea6 === 3 && (
                    <img
                      src="/IsoverFile/Interacive/gif-file/화스너-고정-Trim_1114.gif"
                      alt="화스너 고정"
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    />
                  )}
                </div>
                
                <div 
                  className="absolute cursor-pointer transition-all duration-300 rounded-lg"
                  style={{
                    position: 'absolute',
                    top: '42.1%',
                    right: '8.8%',
                    width: '36%',
                    height: '17.1%'
                  }}
                  onClick={() => handlePage6AreaClick(4)}
                  onMouseEnter={() => setHoveredArea6(4)}
                  onMouseLeave={() => setHoveredArea6(null)}
                >
                  {hoveredArea6 === 4 && (
                    <img
                      src="/IsoverFile/Interacive/gif-file/수직-L-Bar-고정_1114.gif"
                      alt="수직 L-Bar 고정"
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    />
                  )}
                </div>
                
                <div 
                  className="absolute cursor-pointer transition-all duration-300 rounded-lg"
                  style={{
                    position: 'absolute',
                    bottom: '17%',
                    left: '10.3%',
                    width: '36%',
                    height: '17.1%'
                  }}
                  onClick={() => handlePage6AreaClick(5)}
                  onMouseEnter={() => setHoveredArea6(5)}
                  onMouseLeave={() => setHoveredArea6(null)}
                >
                  {hoveredArea6 === 5 && (
                    <img
                      src="/IsoverFile/Interacive/gif-file/수평-Bar-고정-Trim_1114.gif"
                      alt="수평 Bar 고정"
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    />
                  )}
                </div>
                
                <div 
                  className="absolute cursor-pointer transition-all duration-300 rounded-lg"
                  style={{
                    position: 'absolute',
                    bottom: '17%',
                    right: '8.8%',
                    width: '36%',
                    height: '17.1%'
                  }}
                  onClick={() => handlePage6AreaClick(6)}
                  onMouseEnter={() => setHoveredArea6(6)}
                  onMouseLeave={() => setHoveredArea6(null)}
                >
                  {hoveredArea6 === 6 && (
                    <img
                      src="/IsoverFile/Interacive/gif-file/마감재-부착-Trim_1114.gif"
                      alt="마감재 부착"
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    />
                  )}
                </div>
                
                {/* 6페이지 마지막 영역 (유튜브 링크) */}
                <div 
                  className="absolute cursor-pointer transition-all duration-300 hover:scale-105 hover:border-2 hover:border-[#FEDB66] rounded-lg"
                  style={{
                    position: 'absolute',
                    bottom: '5.5%',
                    left: '32%',
                    width: '36%',
                    height: '4%'
                  }}
                  onClick={() => window.open('https://www.youtube.com/@%EC%83%9D%EA%B3%A0%EB%B1%85%EC%9D%B4%EC%86%8C%EB%B0%94%EC%BD%94%EB%A6%AC%EC%95%84/videos', '_blank')}
                  title="유튜브 채널 열기"
                >
                </div>
                
                {/* 왼쪽 터치 영역 (6페이지는 왼쪽) */}
                <div 
                  className="absolute left-0 top-0 w-2.5 h-full cursor-pointer hover:bg-blue-500/20 transition-colors"
                  onMouseDown={() => handleTouchAreaMouseDown('left')}
                  onMouseUp={handleTouchAreaMouseUp}
                  onTouchStart={() => handleTouchAreaTouchStart('left')}
                  onTouchEnd={handleTouchAreaTouchEnd}
                  title="이전 페이지로 이동"
                />
              </div>
            </div>

            {/* 7번째 페이지 */}
            <div 
              className="page rounded-md shadow-lg overflow-hidden" 
              key={pageData[6].id}
              data-density="hard"
            >
              <div 
                className="page-content w-full h-full bg-cover bg-center bg-no-repeat relative"
                style={{
                  backgroundImage: `url(${pageData[6].svg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* SVG 배경이 전체 페이지를 덮도록 함 */}
                
                {/* 목차로 돌아가기 버튼 */}
                <button
                  onClick={() => {
                    if (flipBookRef.current) {
                      flipBookRef.current.pageFlip().turnToPage(1);
                    }
                  }}
                  className="absolute right-4 px-3 py-2 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 z-10 hover:opacity-100"
                  style={{
                    top: '5%',
                    fontFamily: 'NanumSquareEB, sans-serif',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    backgroundColor: '#625C59',
                    color: 'white',
                    opacity: 0.9
                  }}
                  title="목차로 돌아가기"
                >
                  📋 목차
                </button>
                
                {/* 7페이지 영역 4개 배치 */}
                {/* 1. 큰 영역 (중앙) - 영상 배치용 */}
                <div 
                  className="absolute cursor-pointer transition-all duration-300 hover:scale-103"
                  style={{
                    position: 'absolute',
                    top: '18%',
                    left: '15%',
                    width: '70%',
                    height: '41%',
                    clipPath: showVideo ? 'none' : 'polygon(0 25%, 100% 0%, 100% 75%, 0% 100%)'
                  }}
                  onClick={() => handlePage7AreaClick(1)}
                >
                  {/* 이미지 표시 (영상이 재생되지 않을 때) */}
                  {!showVideo && (
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
                  )}
                  
                  {/* 영상 표시 (영상이 재생될 때) */}
                  {showVideo && (
                    <div className="absolute inset-0 rounded-lg">
                      <video
                        className="w-full h-full object-cover rounded-lg"
                        controls
                        autoPlay
                        onEnded={closeVideo}
                      >
                        <source src="/IsoverFile/Interacive/video/Isover_목업시공 액션캠.mp4" type="video/mp4" />
                        영상을 재생할 수 없습니다.
                      </video>
                    </div>
                  )}
                </div>
                
                {/* 2. 왼쪽 로고 영역 */}
                <div 
                  className="absolute cursor-pointer transition-all duration-300 hover:scale-105 hover:border-2 hover:border-[#FEDB66] rounded-lg"
                  style={{
                    position: 'absolute',
                    bottom: '6%',
                    left: '6%',
                    width: '20%',
                    height: '14%'
                  }}
                  onClick={() => handlePage7AreaClick(2)}
                >
                </div>
                
                {/* 3. 오른쪽 로고 영역 */}
                <div 
                  className="absolute cursor-pointer transition-all duration-300 hover:scale-105 hover:border-2 hover:border-[#FEDB66] rounded-lg"
                  style={{
                    position: 'absolute',
                    bottom: '10%',
                    right: '6%',
                    width: '24%',
                    height: '10%'
                  }}
                  onClick={() => handlePage7AreaClick(3)}
                >
                </div>
                
                {/* 4. 하단 노란색 부분 작은 영역 */}
                {/* <div 
                  className="absolute cursor-pointer transition-all duration-300 hover:scale-105 hover:border-2 hover:border-[#FEDB66] rounded-lg"
                  style={{
                    position: 'absolute',
                    bottom: '4.2%',
                    left: '5.5%',
                    width: '31%',
                    height: '22%'
                  }}
                  onClick={() => handlePage7AreaClick(4)}
                >
                </div> */}
                
                {/* 오른쪽 터치 영역 (7페이지는 오른쪽) */}
                <div 
                  className="absolute right-0 top-0 w-2.5 h-full cursor-pointer hover:bg-blue-500/20 transition-colors"
                  onMouseDown={() => handleTouchAreaMouseDown('right')}
                  onMouseUp={handleTouchAreaMouseUp}
                  onTouchStart={() => handleTouchAreaTouchStart('right')}
                  onTouchEnd={handleTouchAreaTouchEnd}
                  title="다음 페이지로 이동"
                />
              </div>
            </div>
            </HTMLFlipBook>
          </div>

           {/* 오른쪽 네비게이션 버튼들 */}
           <div className="flex flex-col items-center gap-2">
             {/* Right 버튼 (항상 표시) */}
             <button
               onClick={goToNextPage}
               className="cursor-pointer hover:scale-110 transition-transform duration-200"
               style={{ width: '48px', height: '48px', padding: '8px' }}
               title="다음 페이지"
             >
               <img
                 src="/IsoverFile/Interacive/arrow_right.svg"
                 alt="다음 페이지"
                 style={{ width: '32px', height: '32px' }}
               />
             </button>
             
             {/* Last 버튼 (항상 표시) */}
             <button
               onClick={goToLastPage}
               className="cursor-pointer hover:scale-110 transition-transform duration-200"
               style={{ width: '48px', height: '48px', padding: '8px' }}
               title="마지막 페이지"
             >
               <img
                 src="/IsoverFile/Interacive/arrow_last.svg"
                 alt="마지막 페이지"
                 style={{ width: '32px', height: '32px' }}
               />
             </button>
           </div>
        </div>
      </div>

      {/* 오른쪽 툴바 - 데스크톱 */}
      <div className="hidden xl:flex flex-shrink-0 flex-col gap-3 bg-gray-800 p-3">
        {/* 홈 버튼 */}
        <button
          onClick={() => (window.location.href = '/Isover')}
          className="w-8 h-8 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
          title="홈"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>

        {/* 프린터 버튼 */}
        <button
          onClick={handlePrintClick}
          className="w-8 h-8 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
          title="프린트"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
        </button>

        {/* PDF 다운로드 버튼 */}
        <button
          onClick={handleDownloadClick}
          className="w-8 h-8 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
          title="PDF 다운로드"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>
        
        {/* 공유 버튼 */}
        <button
          onClick={handleShareClick}
          className="w-8 h-8 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
          title="공유"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
        </button>

      </div>

      {/* 하단 툴바 - 1200px 이하 */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-gray-800 p-3">
        <div className="flex justify-center items-center gap-4">
          {/* 홈 버튼 */}
          <button
            onClick={() => (window.location.href = '/Isover')}
            className="w-10 h-10 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
            title="홈"
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

      {/* 페이지 정보 표시 */}
      <div className="absolute bottom-6 xl:bottom-6 bottom-20 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
        Isover 카탈로그
      </div>

      {/* 3페이지 모달 */}
      {isModalOpen && selectedArea && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeModal}
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
                src={`/IsoverFile/Popup/${selectedArea}.jpg`}
                alt={`영역 ${selectedArea}`}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  // JPG가 없으면 PNG 시도
                  if (e.target.src.includes('.jpg')) {
                    e.target.src = `/IsoverFile/Popup/${selectedArea}.png`;
                  } else {
                    // 이미지 로드 실패 시 메시지 표시
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }
                }}
              />
              
              {/* 5페이지로 이동하는 클릭 영역 */}
              <div
                className="absolute cursor-pointer transition-all duration-300 hover:scale-105 hover:border-2 hover:border-[#FEDB66] rounded-lg"
                style={{
                  top: '49%',
                  left: '7%',
                  width: '34%',
                  height: '26%'
                }}
                onClick={handleGoToPage5}
                title="5페이지로 이동"
              >
              </div>
              
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
          onClick={closeAdditionalModal}
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
                src={`/IsoverFile/Popup/pae_3-${selectedAdditionalArea - 6}.jpg`}
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
                        opacity={0.9}
                        scale={0.8}
                        position={{ x: 0, y: 0 }}
                        animationDelay={500}
                        modelPath="/IsoverFile/3dmodel/Untitled.glb"
                        isModal={true}
                      />
                    </div>
                  )}
                  
                  {selectedAdditionalArea === 8 && (
                    <div className="absolute top-[8%] left-[5%] w-[25%] h-[80%]">
                    <Isover3DModel 
                      isVisible={true} 
                      opacity={0.9}
                      scale={0.8}
                      position={{ x: 0, y: 0 }}
                      animationDelay={500}
                      modelPath="/IsoverFile/3dmodel/Untitled.glb"
                      isModal={true}
                    />
                  </div>
                  )}
                  
                  {selectedAdditionalArea === 9 && (
                    <div className="absolute top-[8%] left-[5%] w-[25%] h-[80%]">
                    <Isover3DModel 
                      isVisible={true} 
                      opacity={0.9}
                      scale={0.8}
                      position={{ x: 0, y: 0 }}
                      animationDelay={500}
                      modelPath="/IsoverFile/3dmodel/Untitled.glb"
                      isModal={true}
                    />
                  </div>
                  )}
                  
                  {selectedAdditionalArea === 10 && (
                    <div className="absolute top-[8%] left-[5%] w-[25%] h-[80%]">
                    <Isover3DModel 
                      isVisible={true} 
                      opacity={0.9}
                      scale={0.8}
                      position={{ x: 0, y: 0 }}
                      animationDelay={500}
                      modelPath="/IsoverFile/3dmodel/Untitled.glb"
                      isModal={true}
                    />
                  </div>
                  )}
                </div>
              </div>
              
              <div
                className="hidden text-gray-500 text-center"
                style={{ display: 'none' }}
              >
                <p>이미지를 불러올 수 없습니다.</p>
                <p className="text-sm">경로: /IsoverFile/Popup/pae_3-{selectedAdditionalArea - 6}.jpg</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4페이지 모달 */}
      {isPage4ModalOpen && selectedPage4Area && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closePage4Modal}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-6xl max-h-[90vh] overflow-auto relative shadow-2xl"
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
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  // 이미지 로드 실패 시 메시지 표시
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              
              {/* 3D 모델 영역 - 1,2,3 항목에만 배치 */}
              {selectedPage4Area <= 3 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    {selectedPage4Area === 1 && (
                      <div className="absolute top-[30%] left-[2%] w-[12%] h-[65%]">
                        <Isover3DModel 
                          isVisible={true} 
                          opacity={0.9}
                          scale={0.8}
                          position={{ x: 0, y: 0 }}
                          animationDelay={500}
                          modelPath="/IsoverFile/3dmodel/Untitled.glb"
                          isModal={true}
                        />
                      </div>
                    )}
                    
                    {selectedPage4Area === 2 && (
                      <div className="absolute top-[30%] left-[2%] w-[12%] h-[65%]">
                        <Isover3DModel 
                          isVisible={true} 
                          opacity={0.9}
                          scale={0.8}
                          position={{ x: 0, y: 0 }}
                          animationDelay={500}
                          modelPath="/IsoverFile/3dmodel/Untitled.glb"
                          isModal={true}
                        />
                      </div>
                    )}
                    
                    {selectedPage4Area === 3 && (
                      <div className="absolute top-[30%] left-[2%] w-[12%] h-[65%]">
                        <Isover3DModel 
                          isVisible={true} 
                          opacity={0.9}
                          scale={0.8}
                          position={{ x: 0, y: 0 }}
                          animationDelay={500}
                          modelPath="/IsoverFile/3dmodel/Untitled.glb"
                          isModal={true}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
              
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

      {/* 5페이지 모달 */}
      {isPage5ModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closePage5Modal}
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

      {/* 6페이지 모달 */}
      {isPage6ModalOpen && selectedPage6Area && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closePage6Modal}
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

        </div>
      )}

    </div>
  );
}

export default IsoverPage;

