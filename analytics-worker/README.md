# MYV 방문 통계 Worker 배포

현재 `analytics-config.json`은 endpoint가 비어 있어 수집되지 않습니다.

1. Cloudflare D1 데이터베이스를 생성하고 `schema.sql`을 적용합니다.
2. Cloudflare Worker에 `worker.js`를 배포하고 D1 바인딩 이름을 `DB`로 지정합니다.
3. Worker secret `ADMIN_TOKEN`을 강력한 임의 문자열로 설정합니다. GitHub에 토큰을 올리지 않습니다.
4. 환경 변수 `ALLOWED_ORIGIN=https://myvbrand.com`을 설정합니다. GitHub Pages 테스트 도메인을 쓰려면 별도 환경에서 정확한 origin으로 배포합니다.
5. Cron Trigger를 매일 실행하도록 설정하여 30일 초과 데이터를 삭제합니다.
6. Worker URL을 확인한 후 루트 `analytics-config.json`의 `endpoint`에 입력합니다.
7. `/admin/visitors.html`에서 ADMIN_TOKEN을 입력하고 실제 통계를 확인합니다.

방문자 수가 아니라 페이지 조회 수입니다. IP, 쿠키, 식별자를 저장하지 않습니다. Cloudflare Worker 및 D1 배포는 계정 권한이 있어야 완료할 수 있습니다.
