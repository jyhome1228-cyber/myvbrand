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
