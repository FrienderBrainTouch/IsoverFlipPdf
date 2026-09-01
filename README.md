# IsoverFlipPdf

React 기반 인터랙티브 디지털 카탈로그 웹 애플리케이션입니다. **생고방 이소바 코리아(Isover)** 무용접 파사드 시스템 카탈로그를 기본 화면으로 제공하고, VQ Studio·Friender 등 다른 브랜드 카탈로그와 랜딩 페이지를 URL 경로로 전환할 수 있습니다.

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 패키지명 | `react-book` |
| 빌드 도구 | Vite 6 |
| 런타임 | Node.js 18 |
| 기본 진입 | `/isover` (Isover 카탈로그) |

플립북(`react-pageflip`), 3D 모델 뷰어(Three.js), Dialogflow 챗봇, PDF 다운로드·인쇄 기능을 하나의 SPA에서 제공합니다.

## 주요 기능

### Isover 카탈로그 (기본)

- **9페이지** 플립북: 표지 + 8개 내부 페이지 (`page_1_Front` ~ `page_9`)
- **반응형**: 1025px 미만 → `IsoverPage-mobile.jsx` (스크롤 UI), 이상 → `IsoverPage.jsx` (플립북)
- **인터랙티브 핫스팟**: 페이지별 클릭·호버 영역, 모달, 이미지 슬라이더
- **3D 모델**: GLB + Draco 압축, 파트별 뷰어(파이버시멘트보드, AL 복합판넬 등)
- **미디어**: GIF 애니메이션, Video.js 비디오, 유튜브·외부 PDF 링크
- **PDF**: 원본 카탈로그 다운로드 및 인쇄 (`public/IsoverFile/func-pdf/`)

### VQ Studio

| 경로 | 컴포넌트 | 설명 |
|------|----------|------|
| `/` 또는 `/vq-main` | `VQMainPage` | VQ Studio 메인 랜딩 |
| `/catalog` | `IntroScreen` | VQ 인터랙티브 카탈로그 + 챗봇 |
| `/company` | `CompanyPage` | 회사 소개 |
| `/contact` | `ContactPage` | 문의 폼 |
| `/portfolio` | `PortfolioPage` | 포트폴리오 |
| `/vq` | `VQBook` | VQ 플립북 카탈로그 |

### Friender

| 경로 | 컴포넌트 | 설명 |
|------|----------|------|
| `/friender` | `Book` | Friender 플립북 카탈로그 |

### 공통

- **챗봇**: Google Dialogflow Messenger (`Chatbot.jsx`, `useDfMessenger.js`)
- **3D 뷰어**: `Model3D.jsx` (Friender/VQ), `Isover3DModel.jsx` (Isover)
- **독립 HTML**: `flipbook.html` — React 앱 외부의 PDF 플립북 뷰어

## 기술 스택

### 프론트엔드

- React 19, React DOM 19
- Vite 6, @vitejs/plugin-react
- Tailwind CSS 4 (@tailwindcss/vite, @tailwindcss/postcss)
- react-router-dom 7

### 플립북·3D·미디어

- react-pageflip 2.0.3
- Three.js 0.160, @react-three/fiber 9, @react-three/drei 10
- video.js 8
- lucide-react

### 챗봇

- Google Dialogflow Messenger (df-messenger 웹 컴포넌트, CDN 로드)

### 개발 도구

- ESLint 9, eslint-plugin-react-hooks

## 프로젝트 구조

```
IsoverFlipPdf/
├── index.html              # React 앱 엔트리 (Google Analytics 포함)
├── flipbook.html           # 독립 PDF 플립북 뷰어
├── vite.config.js
├── netlify.toml            # Netlify 배포 설정
├── .github/workflows/
│   └── deploy.yml          # main 브랜치 → VPS 자동 배포
├── pdf_flipbook_spec.md    # PDF 플립북 기능 기획서 (향후 개발)
├── traffic_calculation.md  # Isover 페이지 리소스·트래픽 산출
│
├── public/
│   ├── IsoverFile/         # Isover 에셋
│   │   ├── IsoverPage/     # 페이지 SVG·이미지
│   │   ├── 3dmodel/        # GLB 3D 모델
│   │   ├── Interacive/     # 화살표 아이콘, GIF, 비디오
│   │   ├── Popup/          # 모달용 이미지
│   │   └── func-pdf/       # 원본 PDF 카탈로그
│   ├── func-file/          # Friender·VQ PDF 등 (배포 시 포함)
│   └── interacivefile/     # VQ Studio 에셋
│
└── src/
    ├── main.jsx
    ├── App.jsx             # URL 기반 화면 분기
    ├── index.css
    ├── hooks/
    │   └── useDfMessenger.js
    └── components/
        ├── IsoverPage.jsx          # Isover 데스크톱 플립북
        ├── IsoverPage-mobile.jsx   # Isover 모바일
        ├── Isover3DModel.jsx       # Isover 3D 뷰어
        ├── VQMainPage.jsx          # VQ 메인
        ├── IntroScreen.jsx         # VQ 카탈로그 (데스크톱)
        ├── IntroScreen-mobile.jsx  # VQ 카탈로그 (모바일)
        ├── VQBook.jsx              # VQ 플립북
        ├── Book.jsx                # Friender 플립북
        ├── CompanyPage.jsx
        ├── ContactPage.jsx
        ├── PortfolioPage.jsx
        ├── Chatbot.jsx
        ├── Header.jsx
        ├── Footer.jsx
        ├── Model3D.jsx
        └── *-Backup.jsx            # 백업 컴포넌트
```

## URL 라우팅

`App.jsx`에서 `window.location.pathname`으로 화면을 분기합니다. `BrowserRouter`는 사용하지만 실제 전환은 `history.pushState`로 처리합니다.

| URL | 화면 |
|-----|------|
| `/isover` | Isover 카탈로그 (기본값) |
| `/vq-main`, `/` | VQ Studio 메인 |
| `/catalog` | VQ 인터랙티브 카탈로그 |
| `/company` | 회사 소개 |
| `/contact` | 문의하기 |
| `/portfolio` | 포트폴리오 |
| `/vq` | VQ 플립북 |
| `/friender` | Friender 플립북 |

## 실행 방법

### 사전 요구

- Node.js 18+
- npm

### 개발

```bash
npm install
npm run dev
```

### 빌드·미리보기

```bash
npm run build
npm run preview
```

### 린트

```bash
npm run lint
```

## 배포

### Netlify

`netlify.toml` 설정:

- 빌드: `npm run build`
- 출력: `dist`
- SPA 리다이렉트: `/*` → `/index.html` (200)
- JS/CSS MIME 타입 헤더 설정

### VPS (GitHub Actions)

`main` 브랜치 push 시 `.github/workflows/deploy.yml`이 실행됩니다.

1. `npm ci` → `npm run build`
2. `dist`를 tar로 압축 후 SCP 업로드
3. 서버 `/var/www/isover`에 배포, Nginx reload

필요한 GitHub Secrets: `SERVER_HOST`, `SERVER_USER`, `SERVER_PASSWORD`, `SERVER_PORT`

## Isover 카탈로그 상세

### 페이지 구성 (9페이지)

1. **표지** — 로고 인트로, `front.gif`, 3D 시스템 모델(선택)
2. **목차** — 섹션 바로가기, 유튜브 링크
3. **3~9페이지** — 핫스팟, 모달, GIF 호버, 3D 파트 뷰어, 영상·외부 링크

### 플립북 크기

화면 너비의 40%, 최소 400px·최대 800px. 높이는 원본 비율(2480×3507)과 화면 80% 높이를 고려해 조정합니다.

### 3D 모델

- Draco 디코더: Google CDN (`gstatic.com/draco/...`)
- 모델 경로: `public/IsoverFile/3dmodel/` (예: `system_with_panel.glb`)
- 파트별 GLB 전환 및 하이라이트 박스 클릭 영역

### PDF

- 로컬: `/IsoverFile/func-pdf/이소바&유창_무용접파사드시스템_카다로그.pdf`
- 외부: isover.co.kr 제품 카탈로그 PDF 링크

## 챗봇

`Chatbot` 컴포넌트는 Dialogflow Messenger를 동적으로 로드합니다.

- 프로젝트: `hani-chatbot`
- 채팅 제목: "E카탈로그 도우미"
- `useDfMessenger` 훅으로 사용자·봇 메시지를 CX/ES 형식 모두 파싱

VQ 관련 페이지(`VQMainPage`, `CompanyPage`, `ContactPage`, `PortfolioPage`, `/catalog`)에서 사용됩니다.

## 관련 문서

| 파일 | 내용 |
|------|------|
| `pdf_flipbook_spec.md` | PDF 업로드·변환·메모·인쇄 등 **향후** PDF 플립북 뷰어 기획 |
| `traffic_calculation.md` | Isover 페이지 리소스 크기 및 트래픽 추정 |

## 성능·에셋 참고

`traffic_calculation.md`에 따르면 Isover 필수 리소스(SVG 9장, GIF, 로고 등)는 약 7MB+, 3D GLB는 사용 시 추가 4~5MB per 모델입니다. 모바일·3G 환경에서는 3D 모델 지연 로딩과 에셋 최적화를 권장합니다.

## 브라우저 지원

Chrome, Firefox, Safari, Edge 최신 버전. WebGL(3D), 터치 제스처(플립북·모바일 UI) 필요.

---

*React, Three.js, react-pageflip을 활용한 멀티 브랜드 인터랙티브 디지털 카탈로그 플랫폼*
