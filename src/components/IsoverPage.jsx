import React, { useState, useEffect, useRef } from 'react';
import IsoverPageMobile from './IsoverPage-mobile';

function IsoverPage({ onBack = null }) {
  // 화면 크기 상태 관리
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // 상태 관리 변수들
  const [showIntro, setShowIntro] = useState(true); // 인트로 화면 표시 여부
  const [logoOpacity, setLogoOpacity] = useState(0); // 로고 투명도
  const [whiteScreenVisible, setWhiteScreenVisible] = useState(true); // 흰 화면 표시 여부
  const [mainScreenVisible, setMainScreenVisible] = useState(false); // 본 화면 표시 여부
  const [imageScale, setImageScale] = useState(1.2); // 중앙 이미지 스케일 (120%에서 시작)
  const [imageOpacity, setImageOpacity] = useState(0); // 중앙 이미지 투명도
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 번호 (0: 표지, 1-7: 내부 페이지)

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

  /**
   * 화면 크기 변경 감지 및 이미지 크기 업데이트
   */
  useEffect(() => {
    const handleResize = () => {
      // 화면 크기가 변경되면 컴포넌트를 다시 렌더링하여 이미지 크기 업데이트
      setCurrentPage((prev) => prev);
      // 모바일/데스크톱 분기 업데이트
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // Isover 페이지별 이미지 데이터 (7페이지)
  const pageImages = [
    {
      id: 0,
      name: '표지',
      backgroundImage: '/IsoverFile/IsoverPage/page_1_Front.svg',
      overlays: [],
    },
    {
      id: 1,
      name: '페이지 1',
      backgroundImage: '/IsoverFile/IsoverPage/page_2.svg',
      overlays: [],
    },
    {
      id: 2,
      name: '페이지 2',
      backgroundImage: '/IsoverFile/IsoverPage/page_3.svg',
      overlays: [],
    },
    {
      id: 3,
      name: '페이지 3',
      backgroundImage: '/IsoverFile/IsoverPage/page_4.svg',
      overlays: [],
    },
    {
      id: 4,
      name: '페이지 4',
      backgroundImage: '/IsoverFile/IsoverPage/page_5.svg',
      overlays: [],
    },
    {
      id: 5,
      name: '페이지 5',
      backgroundImage: '/IsoverFile/IsoverPage/page_6.svg',
      overlays: [],
    },
    {
      id: 6,
      name: '페이지 6',
      backgroundImage: '/IsoverFile/IsoverPage/page_7.svg',
      overlays: [],
    },
  ];

  /**
   * 컴포넌트 마운트 시 애니메이션 시퀀스 실행
   */
  useEffect(() => {
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
          animationRef.current = requestAnimationFrame(animate);
        } else {
          // 로고 애니메이션 완료 후 2초 대기
          setTimeout(() => {
            startTransition();
          }, 2000);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    };

    // 2단계: 흰 화면이 위로 사라지는 전환
    const startTransition = () => {
      setWhiteScreenVisible(false);

      // 전환 완료 후 본 화면 표시
      setTimeout(() => {
        setMainScreenVisible(true);
        startImageAnimation();
      }, 500);
    };

    // 3단계: 중앙 이미지 애니메이션

    // 애니메이션 시작
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
   * 이전 페이지로 이동
   */
  const goToPreviousPage = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);

      // 표지 페이지(0번)로 돌아올 때 애니메이션 재실행
      if (newPage === 0) {
        setTimeout(() => {
          startCoverPageAnimation();
        }, 300);
      }
    }
  };

  /**
   * 표지 페이지 애니메이션 시작 함수
   */
  const startCoverPageAnimation = () => {
    // 애니메이션 상태 초기화
    resetAnimationStates();
  };

  /**
   * 다음 페이지로 이동
   */
  const goToNextPage = () => {
    if (currentPage < 6) {
      // Isover는 7페이지 (0-6)
      setCurrentPage(currentPage + 1);

      // 표지 페이지(0번)에서 다음 페이지로 이동할 때 애니메이션 초기화
      if (currentPage === 0) {
        resetAnimationStates();
      }
    }
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
    setCurrentPage(0);

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
            animationRef.current = requestAnimationFrame(animate);
          } else {
            setTimeout(() => {
              setWhiteScreenVisible(false);
              setTimeout(() => {
                setMainScreenVisible(true);
                startCoverPageAnimation();
              }, 500);
            }, 2000);
          }
        };

        animationRef.current = requestAnimationFrame(animate);
      };

      logoAnimation();
    }, 500);
  };

  /**
   * 프린터 버튼 클릭 핸들러 - PDF를 열고 프린트
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
        .then(() => {
          // Web Share API 성공 후에도 클립보드에 복사
          navigator.clipboard
            .writeText(window.location.href)
            .then(() => {
              console.log('Isover 링크가 클립보드에 복사되었습니다!');
            })
            .catch(() => {
              console.log('클립보드 복사에 실패했습니다.');
            });
        })
        .catch(() => {
          // Web Share API 실패 시 클립보드에 복사
          navigator.clipboard
            .writeText(window.location.href)
            .then(() => {
              alert('Isover 링크가 클립보드에 복사되었습니다!');
            })
            .catch(() => {
              alert('클립보드 복사에 실패했습니다.');
            });
        });
    } else {
      // Web Share API를 지원하지 않는 경우 클립보드에 복사
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          alert('Isover 링크가 클립보드에 복사되었습니다!');
        })
        .catch(() => {
          alert('클립보드 복사에 실패했습니다.');
        });
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
        <div className="w-full h-full relative bg-white">
          {/* 왼쪽 위 Isover 로고 (홈 버튼) */}
          <button onClick={handleHomeClick} className="absolute top-6 left-6 z-40 cursor-pointer">
            <img
              src="/IsoverFile/Interacive/Isover_Logo.svg"
              alt="Isover Logo"
              className="h-8 w-auto"
            />
          </button>

          {/* 오른쪽 툴바 - 상단 아이콘들 */}
          <div className="absolute top-0 right-0 h-full z-40 flex flex-col gap-3 bg-gray-800 p-3">
            {/* 홈(Intro) 버튼 */}
            <button
              onClick={() => (window.location.href = '/Isover')}
              className="w-8 h-8 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
              title="홈(Isover)"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </button>

            {/* 프린터 버튼 */}
            <button
              onClick={handlePrintClick}
              className="w-8 h-8 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
              title="프린트"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
            </button>

            {/* PDF 다운로드 버튼 */}
            <button
              onClick={handleDownloadClick}
              className="w-8 h-8 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
              title="PDF 다운로드"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </button>

            {/* 공유 버튼 */}
            <button
              onClick={handleShareClick}
              className="w-8 h-8 text-white flex items-center justify-center hover:text-gray-300 hover:bg-gray-700 rounded transition-colors duration-300 cursor-pointer"
              title="공유"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
            </button>
          </div>

          {/* 중앙 이미지 컨테이너 */}
          <div className="absolute top-2.5 left-32 right-20 bottom-2.5 flex items-center justify-center">
            <div className="relative flex items-center justify-center w-full h-full">
              {/* 중앙 이미지 */}
              <div
                className="h-full overflow-hidden shadow-2xl border-2 border-black relative"
                style={{
                  opacity: imageOpacity,
                  transition: 'opacity 0.3s ease-in-out',
                  aspectRatio: 'auto',
                  width: 'auto',
                }}
              >
                {/* 현재 페이지의 배경 이미지 */}
                <img
                  src={pageImages[currentPage].backgroundImage}
                  alt={pageImages[currentPage].name}
                  className="w-full h-full object-cover"
                  style={{
                    transform: currentPage === 0 ? `scale(${imageScale})` : 'scale(1)',
                    transition: 'transform 0.3s ease-in-out',
                  }}
                />

              </div>

              {/* 페이지 네비게이션 화살표 - 중앙 이미지 옆에 배치 */}
              <div className="ml-4 flex flex-col gap-2">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 0}
                  className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-300 shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === pageImages.length - 1}
                  className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-300 shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* 페이지 정보 표시 */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
            {pageImages[currentPage].name} ({currentPage + 1} / {pageImages.length})
          </div>
        </div>
      )}

    </div>
  );
}

export default IsoverPage;
