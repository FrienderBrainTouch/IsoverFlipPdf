import React from 'react';
import HTMLFlipBook from 'react-pageflip';
import IsoverPageMobile from './IsoverPage-mobile';

function IsoverPage({ onBack = null }) {
  // 화면 크기 상태 관리
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 1024);
  
  // 플립북 참조
  const flipBookRef = React.useRef(null);
  
  // 현재 페이지 상태 관리
  const [currentPage, setCurrentPage] = React.useState(0);
  const [isCoverPage, setIsCoverPage] = React.useState(true);

  // SVG 페이지 데이터
  const pageData = [
    { id: 1, svg: "/IsoverFile/IsoverPage/page_1_Front.svg", isCover: true },
    { id: 2, svg: "/IsoverFile/IsoverPage/page_2.svg" },
    { id: 3, svg: "/IsoverFile/IsoverPage/page_3.svg" },
    { id: 4, svg: "/IsoverFile/IsoverPage/page_4.svg" },
    { id: 5, svg: "/IsoverFile/IsoverPage/page_5.svg" },
    { id: 6, svg: "/IsoverFile/IsoverPage/page_6.svg" },
    { id: 7, svg: "/IsoverFile/IsoverPage/page_7.svg" },
    { id: 8, svg: "/IsoverFile/IsoverPage/page_8_Back.svg", isBack: true }
  ];

  // 화면 크기 변경 감지
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 페이지 변경 이벤트 핸들러
  const handlePageFlip = (e) => {
    const newPage = e.data;
    setCurrentPage(newPage);
    
    // 첫 페이지(0) 또는 마지막 페이지(7)인지 확인
    const isFirstPage = newPage === 0;
    const isLastPage = newPage === pageData.length - 1;
    setIsCoverPage(isFirstPage || isLastPage);
  };

  /**
   * 홈 버튼 클릭 핸들러
   */
  const handleHomeClick = () => {
    if (onBack) {
      onBack();
    }
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
    <div className="w-full h-screen overflow-hidden relative bg-white">
      {/* 왼쪽 위 Isover 로고 (홈 버튼) */}
      <button onClick={handleHomeClick} className="absolute top-6 left-6 z-40 cursor-pointer">
        <img
          src="/IsoverFile/Interacive/Isover_Logo.svg"
          alt="Isover Logo"
          className="h-8 w-auto"
        />
      </button>

      {/* 오른쪽 툴바 */}
      <div className="absolute top-0 right-0 h-full z-40 flex flex-col gap-3 bg-gray-800 p-3">
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

      {/* 중앙 플립북 컨테이너 */}
      <div className="absolute top-2.5 left-32 right-20 bottom-2.5 flex items-center justify-center">
        <div className="flex items-center gap-4">
          {/* 왼쪽 네비게이션 버튼들 */}
          <div className="flex flex-col items-center gap-2">
            {/* First 버튼 (항상 표시) */}
            <button
              onClick={goToFirstPage}
              className="p-2 cursor-pointer hover:scale-110 transition-transform duration-200"
              title="첫 페이지"
            >
              <img
                src="/IsoverFile/Interacive/arrow_first.svg"
                alt="첫 페이지"
                className="w-6 h-6"
              />
            </button>
            
            {/* Left 버튼 (항상 표시) */}
            <button
              onClick={goToPreviousPage}
              className="p-2 cursor-pointer hover:scale-110 transition-transform duration-200"
              title="이전 페이지"
            >
              <img
                src="/IsoverFile/Interacive/arrow_left.svg"
                alt="이전 페이지"
                className="w-6 h-6"
              />
            </button>
          </div>

          {/* 플립북 */}
          <HTMLFlipBook 
            ref={flipBookRef}
            width={370} 
            height={500}
            maxShadowOpacity={0}
            drawShadow={false}
            showCover={true}
            size='fixed'
            disableFlipByClick={true}
            swipeDistance={10}
            flipOnTouch={false}
            useMouseEvents={true}
            usePortrait={false}
            showPageCorners={false}
            onFlip={handlePageFlip}
          >
            {pageData.map((page) => (
              <div 
                className="page rounded-md shadow-lg overflow-hidden" 
                key={page.id}
                data-density="hard"
              >
                <div 
                  className="page-content w-full h-full bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url(${page.svg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* SVG 배경이 전체 페이지를 덮도록 함 */}
                </div>
              </div>
            ))}
          </HTMLFlipBook>

          {/* 오른쪽 네비게이션 버튼들 */}
          <div className="flex flex-col items-center gap-2">
            {/* Right 버튼 (항상 표시) */}
            <button
              onClick={goToNextPage}
              className="p-2 cursor-pointer hover:scale-110 transition-transform duration-200"
              title="다음 페이지"
            >
              <img
                src="/IsoverFile/Interacive/arrow_right.svg"
                alt="다음 페이지"
                className="w-6 h-6"
              />
            </button>
            
            {/* Last 버튼 (항상 표시) */}
            <button
              onClick={goToLastPage}
              className="p-2 cursor-pointer hover:scale-110 transition-transform duration-200"
              title="마지막 페이지"
            >
              <img
                src="/IsoverFile/Interacive/arrow_last.svg"
                alt="마지막 페이지"
                className="w-6 h-6"
              />
            </button>
          </div>
        </div>
      </div>

      {/* 페이지 정보 표시 */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
        Isover 카탈로그
      </div>
    </div>
  );
}

export default IsoverPage;
