# MYV Firebase 보안 규칙 설치 안내

이 저장소의 `firestore.rules`는 **규칙 원본**이며, GitHub에 커밋한 것만으로 Firebase Console에 자동 적용되지 않습니다.

## Firebase Console에 적용
1. Firebase 프로젝트 `myvbrand` → Firestore Database → 규칙
2. 루트 `firestore.rules` 파일 내용을 붙여넣고 **게시**
3. Authentication → 사용자에서 관리자 계정을 확인하고 해당 계정의 **UID** 복사
4. Firestore Database → 데이터 → `admins` 컬렉션 → 문서 ID를 해당 UID로 만들고 `active` (boolean) `true` 저장
5. Rules Playground에서 관리자/비로그인 요청을 각각 테스트

관리자 권한은 이메일 주소 문자열이 아니라 `admins/{uid}` 문서로 판정합니다. 이 컬렉션의 문서를 일반 브라우저에서 만들거나 수정하는 것은 규칙으로 금지됩니다.

## 데이터 구조

- `admins/{uid}`: `active: true`; 관리자 콘솔에서만 초기 등록
- `inquiries/{autoId}`: `type`, `name`, `email`, `phone`, 선택 `company`, `subject`, `message`, `privacyConsent: true`, `status: 'new'`, `createdAt: serverTimestamp()`
- `visitDaily/{YYYY-MM-DD}`, `visitSources/{id}`, `visitPages/{id}`, `visitEvents/{id}`: 관리자 읽기만 허용, 기록은 서버(Admin SDK)에서 수행

## 중요한 운영 제한

- 보안 규칙은 도메인 기반 접속을 보증하거나 서버 측 요청 빈도를 제한하지 않습니다. 익명 문의 등록은 **Firebase App Check**를 웹 앱에 연동하고 Firestore 강제 적용을 충분히 테스트한 후 공개합니다. 규모가 커지면 Cloud Functions에 스팸 방지/속도 제한 로직을 추가합니다.
- 통계 카운트를 방문자의 브라우저에서 직접 쓰도록 허용하면 임의 조작이 가능하므로 Firestore 보안 규칙에서 금지합니다. 수집 서버/Cloud Functions와 개인정보처리방침을 별도로 갖춰야 합니다.
- 아직 `contact.html`은 FormSubmit 이메일 제출 방식, 방문자 기능은 기존 Cloudflare/GA4 준비 코드입니다. **Firestore 규칙만 게시해도 홈페이지가 Firebase로 전환되지는 않습니다.**
- 공개 프론트엔드에서는 인증 비밀값이나 서비스 계정 키를 사용하지 않습니다.

## 2026-11-17 방문 통계 연동 (펜타곤·태평제지 유형)

- 공개 페이지에서 `script.js`가 `firebase-visits.js`를 불러옵니다.
- `visits/{YYYY-MM-DD}_{anonymousBrowserId}`에 브라우저별 한국 날짜 하루 1회의 첫 방문을 기록합니다.
- 필드: `visitorId`, `date`, `path`, `source`, `device`, `createdAt`.
- 관리자 화면은 `admin/firebase-visitors.js`를 통해 일·주·월 현황, 유입 도메인, 첫 방문 페이지 및 기기별 수치를 조회합니다.
- `admin/firebase-admin.js`는 운영 계정으로 로그인되어 있을 때 대시보드에도 일·주·월 수치를 표시합니다.
- **반드시 최신 `firestore.rules`를 Firebase 콘솔에서 다시 게시**해야 `visits`의 생성 및 관리자 조회가 허용됩니다.
- GitHub의 `myv` 화면 암호는 단순 접근 안내이며 실제 데이터 보안 경계가 아닙니다. 방문 기록은 Firebase 관리자 인증과 `admins/{uid}.active=true`가 있어야 열람 가능합니다.
- 방문 기록이 생성되기 전 과거 방문의 소급 복구는 불가합니다. 신규 기록은 Firestore 규칙 게시 후부터 누적됩니다.
- DNT 또는 Global Privacy Control 설정이 켜진 브라우저는 수집에서 제외됩니다.
- 운영 전 Firestore App Check 및 데이터 보유기간/삭제 정책을 검토해야 합니다. 현재 수집만으로는 30일 초과 기록이 자동 삭제되지 않습니다.

### 검수 순서

1. Firebase Console → Firestore Database → 규칙 → 새 `visits` 규칙을 포함한 최신 파일을 게시합니다.
2. Firestore → 데이터에서 `admins/{관리자 UID}` 문서가 `active: true`인지 확인합니다.
3. 새 브라우저로 `https://myvbrand.com/` 접속하여 `visits` 컬렉션에 오늘 날짜 문서가 생성되는지 확인합니다.
4. `https://myvbrand.com/admin/visitors.html`에서 `myv` 화면 잠금 해제 후 Firebase 운영 계정으로 로그인하고 오늘/주간/월간 수치를 확인합니다.
5. 다른 페이지 이동은 같은 브라우저·날짜에 중복 기록하지 않으며, 다른 브라우저나 다음 날짜는 별도 기록됩니다.
