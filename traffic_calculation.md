# Isover 페이지 트래픽 계산

## 리소스 목록 및 예상 크기

### 1. 필수 로드 리소스 (모든 사용자)
- **SVG 페이지 파일 (9개)**: page_1_Front.svg ~ page_9.svg
  - 예상 크기: 각 200KB - 1MB (평균 500KB)
  - 총: 9 × 500KB = 4.5MB
  
- **로고 SVG (2개)**: Isover_Logo.svg, Yoochang_Logo.svg
  - 예상 크기: 각 50KB
  - 총: 2 × 50KB = 100KB
  
- **아이콘 SVG (4개)**: arrow_left, arrow_right, arrow_first, arrow_last
  - 예상 크기: 각 10KB
  - 총: 4 × 10KB = 40KB
  
- **표지 GIF**: front.gif
  - 예상 크기: 2MB
  
- **표지 전체 SVG**: page_1_Front_full.svg
  - 예상 크기: 500KB

**필수 리소스 총합: 약 7.14MB**

### 2. 선택적 리소스 (사용자 행동에 따라)

#### 3D 모델 파일 (GLB)
- system_with_panel_test.glb: 5MB
- system_without_panel_test.glb: 4MB
- 1_System_Fiber_SET_test.glb: 3MB
- 2_System_Alu-Complex_SET_test.glb: 3MB
- 3_System_Alu-Sheet_SET_test.glb: 3MB
- 4_System_Three_SET_test.glb: 3MB
- BlackFacing_test.glb: 2MB
- L-Bar.glb: 1MB
- L-AnkerBracket.glb: 1MB
- L-HBar.glb: 1MB
- L-Holder.glb: 1MB
- **총 3D 모델: 약 27MB**

#### 팝업 이미지 (PNG/JPG)
- 3페이지 모달 이미지 (1~6번): 각 1MB (총 6MB)
- 추가 영역 이미지 (pae_3-1 ~ pae_3-4): 각 1MB (총 4MB)
- 4페이지 모달 이미지 (4-1 ~ 4-4): 각 1MB (총 4MB)
- 5페이지 모달 이미지 (pae_new_5-1 ~ pae_new_5-6): 각 1.5MB (총 9MB)
- 기타 이미지 (top_3-1, 3-4-2-Korean 등): 각 1MB (총 5MB)
- **총 팝업 이미지: 약 28MB**

#### GIF 파일
- L-Bracket-고정-1114.gif: 3MB
- 단열재-끼우기_1114.gif: 3MB
- 화스너-고정-Trim_1114.gif: 3MB
- 수직-L-Bar-고정_1114.gif: 3MB
- 수평-Bar-고정-Trim_1114.gif: 3MB
- 마감재-부착-Trim_1114.gif: 3MB
- 1126_2.gif: 2MB
- 1126_1.gif: 2MB
- 1124_1.gif: 2MB
- 1124_2.gif: 2MB
- **총 GIF: 약 26MB**

#### 비디오 파일
- Isover_목업시공 액션캠.mp4: 30MB
- 액션캡 영상 이미지.png: 500KB
- **총 비디오: 약 30.5MB**

#### PDF 파일
- 무용접파사드시스템.pdf: 5MB

#### 슬라이더 이미지
- pae_3_5_1.jpg ~ pae_3_5_4.jpg: 각 1MB (총 4MB)

## 사용자 행동 시나리오

### 시나리오 1: 기본 사용자 (30%)
- 필수 리소스만 로드: 7.14MB
- 평균 2개 모달 열람: 2MB
- **총: 약 9MB**

### 시나리오 2: 일반 사용자 (50%)
- 필수 리소스: 7.14MB
- 평균 4개 모달 열람: 4MB
- 1개 3D 모델 로드: 3MB
- 2개 GIF 확인: 4MB
- **총: 약 18MB**

### 시나리오 3: 적극적 사용자 (20%)
- 필수 리소스: 7.14MB
- 평균 8개 모달 열람: 8MB
- 3개 3D 모델 로드: 9MB
- 5개 GIF 확인: 10MB
- 비디오 재생: 30MB
- PDF 다운로드: 5MB
- **총: 약 69MB**

## 트래픽 계산

### 하루 50명 사용 시
- 시나리오 1 (30% = 15명): 15 × 9MB = 135MB
- 시나리오 2 (50% = 25명): 25 × 18MB = 450MB
- 시나리오 3 (20% = 10명): 10 × 69MB = 690MB
- **하루 총 트래픽: 약 1.28GB**

### 하루 100명 사용 시
- 시나리오 1 (30% = 30명): 30 × 9MB = 270MB
- 시나리오 2 (50% = 50명): 50 × 18MB = 900MB
- 시나리오 3 (20% = 20명): 20 × 69MB = 1.38GB
- **하루 총 트래픽: 약 2.55GB**

### 한 달 트래픽 (30일 기준)

#### 하루 50명 사용 시
- **한 달 총 트래픽: 약 38.4GB**

#### 하루 100명 사용 시
- **한 달 총 트래픽: 약 76.5GB**

## 최적화 고려사항

1. **CDN 사용**: 정적 리소스를 CDN에 배치하여 트래픽 분산
2. **이미지 최적화**: WebP 포맷 사용, 압축률 향상
3. **지연 로딩**: 모달 이미지와 3D 모델은 필요할 때만 로드
4. **캐싱**: 브라우저 캐싱 및 서버 캐싱 활용
5. **비디오 스트리밍**: 전체 다운로드 대신 스트리밍 사용

## 참고사항
- 실제 파일 크기는 실제 측정이 필요합니다
- 브라우저 캐싱으로 인해 재방문 시 트래픽은 크게 감소합니다
- 모바일 사용자는 일부 리소스를 로드하지 않을 수 있습니다



