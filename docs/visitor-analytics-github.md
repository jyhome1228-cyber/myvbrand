# MYV 방문자 통계 — GitHub 집계 운영

## 현재 구현
- 관리자 대시보드 및 `/admin/visitors.html`의 **비개인 방문 집계값**은 로그인 없이 볼 수 있습니다.
- 개인 문의 상세내용은 Firebase 관리자 로그인 후에만 볼 수 있습니다.
- `data/visitor-stats.json`은 GitHub Pages에서 공개되는 **집계 파일**입니다. 방문자별 ID·이메일·IP·방문시각 등 원시 기록을 이 파일에 넣지 않습니다.
- 브라우저가 `firebase-visits.js`로 Firestore `visits`에 한국 날짜별 첫 방문을 기록하는 구성입니다.
- GitHub Actions `Refresh MYV visitor analytics`가 `scripts/export_firebase_visits.py`를 실행해 30일 익명 집계를 최신화하도록 준비되어 있습니다.

## 처음 한 번 필요한 연결
1. Google Cloud의 프로젝트 **myvbrand**에서 방문 통계 읽기 전용 서비스 계정을 준비합니다. 최소 Firestore 읽기 권한을 부여하고 Firebase 관리자 계정 비밀번호를 사용하지 마세요.
2. 서비스 계정 JSON 키를 GitHub 저장소 **Settings → Secrets and variables → Actions → New repository secret**의 `FIREBASE_SERVICE_ACCOUNT_JSON`으로 등록합니다. 비밀 키를 채팅이나 공개 코드에 붙여넣지 마세요. 가능하면 장기적으로 OIDC/Workload Identity Federation으로 키 없는 인증을 사용하세요.
3. GitHub **Actions → Refresh MYV visitor analytics → Run workflow**를 실행합니다. 매시간 17분에 예약 갱신도 시도합니다.
4. `data/visitor-stats.json`의 `connected`가 `true`, `asOf`가 실제 갱신 시각으로 채워졌는지 확인합니다. 이후 방문 통계 페이지를 새로고침합니다.

## 이번 주 데이터의 의미
- 이번 주는 한국 시간 **월요일~오늘**로 계산합니다.
- 원시 Firestore `visits` 컬렉션에 이미 저장돼 있는 이번 주 기록은 최초 정상 집계 실행 시 합산할 수 있습니다.
- **기록 자체가 없던 날짜는 소급 복구할 수 없습니다.** 화면에서는 이 날짜를 임의의 0명으로 표시하지 않고 `—`로 남깁니다.
- 익명 브라우저별 하루 1회 방문을 집계합니다. 순수한 사람 수를 판별하는 통계는 아닙니다.
- 원시 데이터 보관 기간과 삭제 정책, App Check 활성화는 정식 운영 전에 별도로 설정해야 합니다.

## 개인정보 보호
GitHub에 공개하는 것은 일별 총합과 그룹 집계만입니다. 유입 사이트·페이지별 1~2건과 같은 소량 그룹은 기타로 합산하여 단독 식별 가능성을 줄였습니다. 관리자 문의 데이터와 Firebase 인증은 GitHub 공개 통계와 분리합니다.

## 대체 경로
`FIREBASE_SERVICE_ACCOUNT_JSON`이 없고 GA4를 운영하고 있다면 `GA4_PROPERTY_ID`, `GA4_SERVICE_ACCOUNT_JSON`을 GitHub Actions Secrets로 설정해 기존 GA4 페이지 조회 수 집계로 대체할 수 있습니다. 이때 화면 단위는 방문자가 아닌 **페이지 조회**입니다.
