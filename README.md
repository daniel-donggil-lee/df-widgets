# DanielFlow Widgets

DanielFlow 전체 HTML 산출물에 범용으로 삽입 가능한 위젯 모음.

## 1. Comment 위젯

모든 HTML 페이지에 플로팅 "💬 댓글" 버튼을 띄워 실시간 피드백을 수집합니다.

### 사용법

```html
<script src="https://daniel-donggil-lee.github.io/df-widgets/comment/comment.js"
        data-project="펜타캠퍼스"
        data-page="랜딩"></script>
```

### 속성

| 속성 | 필수 | 설명 |
|---|---|---|
| `data-project` | ✅ | 프로젝트명 (예: 펜타캠퍼스, 리마크에듀, 삼척제안서) |
| `data-page` | — | 페이지명 (미지정 시 `document.title`) |
| `data-endpoint` | — | Apps Script URL 오버라이드 (기본값 하드코딩됨) |

### 백엔드

- **Google Sheet**: [DanielFlow_피드백_마스터](https://docs.google.com/spreadsheets/d/1blJopvP0izqpouwM4sFYKSUZTOGIYOso-Z_T1JKyMYU/)
- **Apps Script**: `gas/Code.gs` (수동 배포 필요 — 아래 세팅 참조)

### 최초 세팅 (Apps Script 배포)

1. https://script.google.com 에서 새 프로젝트 생성
2. `gas/Code.gs` 내용 전체 복사 후 붙여넣기
3. 저장 → 배포 > 새 배포
   - 유형: **웹 앱**
   - 설명: "DanielFlow Comment Endpoint v1"
   - 액세스: **모든 사용자** (익명 허용)
   - 실행: **나 (본인 계정)**
4. 생성된 웹 앱 URL을 복사 → `comment/comment.js` 의 `ENDPOINT` 변수에 붙여넣기
5. `git push` → GitHub Pages 자동 재배포

## 2. 통합 대시보드 (예정)

전 프로젝트 피드백을 한눈에 확인하는 HTML 대시보드 추가 예정.
