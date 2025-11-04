# Monday Bookmark Service

북마크 관리 서비스입니다. pnpm + Turborepo 모노레포로 구성되어 있습니다.

## 🏗️ 구조

```
root/
├─ apps/
│   ├─ web/        (React + Vite + TypeScript + Tailwind + React Query)
│   └─ api/        (Node.js + Express + TypeScript + Prisma + PostgreSQL)
├─ packages/
│   ├─ types/      (공유 타입 정의)
│   ├─ utils/      (공통 유틸리티 함수)
│   ├─ ui/         (공유 UI 컴포넌트)
│   ├─ tsconfig/   (공유 TS 설정)
│   └─ eslint-config/ (공유 ESLint 규칙)
├─ pnpm-workspace.yaml
├─ turbo.json
└─ package.json
```

## 🚀 시작하기

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 데이터베이스 설정

1. **PostgreSQL 실행** – 로컬에 PostgreSQL이 없다면 Docker 컨테이너로 손쉽게 실행할 수 있습니다.
   ```bash
   docker run --name monday-postgres \
     -e POSTGRES_USER=monday \
     -e POSTGRES_PASSWORD=monday \
     -e POSTGRES_DB=monday_bookmarks \
     -p 5432:5432 -d postgres:15
   ```
   이미 PostgreSQL을 사용 중이라면 동일한 사용자/데이터베이스를 직접 생성해 주세요.

2. **환경 변수 설정**
   ```bash
   cd apps/api
   cp env.example .env
   ```
   필요하다면 `.env` 파일의 `DATABASE_URL`을 실제 접속 정보에 맞게 수정합니다.

3. **Prisma 마이그레이션 및 클라이언트 생성**
   ```bash
   pnpm prisma migrate deploy
   pnpm prisma generate
   ```

### 3. 개발 서버 실행

```bash
# 루트 디렉토리에서
pnpm dev
```

이 명령어는 다음을 실행합니다:
- 백엔드 API: http://localhost:3000
- 프론트엔드 웹: http://localhost:5173

## 📁 주요 기능

### 백엔드 (apps/api)
- **Express + TypeScript**: RESTful API 서버
- **Prisma + PostgreSQL**: 데이터베이스 ORM 및 실데이터베이스 연결
- **Zod**: 데이터 검증
- **CORS, Helmet, Morgan**: 보안 및 로깅 미들웨어

### 프론트엔드 (apps/web)
- **React + TypeScript**: 컴포넌트 기반 UI
- **Vite**: 빠른 개발 서버 및 빌드 도구
- **TailwindCSS**: 유틸리티 우선 CSS 프레임워크
- **React Query**: 서버 상태 관리
- **React Router**: 클라이언트 사이드 라우팅

### 공유 패키지
- **types**: Zod 스키마와 TypeScript 타입 정의
- **utils**: 날짜 포맷팅, URL 처리, 검증 등의 유틸리티
- **ui**: 재사용 가능한 React 컴포넌트
- **tsconfig**: 공유 TypeScript 설정
- **eslint-config**: 공유 ESLint 규칙

## 🎯 주요 API 엔드포인트

### 북마크
- `GET /api/bookmarks` - 북마크 목록 조회
- `GET /api/bookmarks/:id` - 특정 북마크 조회
- `POST /api/bookmarks` - 북마크 생성
- `PATCH /api/bookmarks/:id` - 북마크 수정
- `DELETE /api/bookmarks/:id` - 북마크 삭제 (소프트 삭제)

### 태그
- `GET /api/tags` - 태그 목록 조회
- `GET /api/tags/:id` - 특정 태그 조회
- `POST /api/tags` - 태그 생성
- `PATCH /api/tags/:id` - 태그 수정
- `DELETE /api/tags/:id` - 태그 삭제

## 🗄️ 데이터베이스 스키마

### BookmarkType
- `text`: 텍스트 북마크
- `link`: 링크 북마크
- `image`: 이미지 북마크

### BookmarkStatus
- `inbox`: 인박스 (기본값)
- `active`: 활성
- `archived`: 보관됨

### 주요 모델
- **User**: 사용자 정보
- **Bookmark**: 북마크 정보 (제목, 내용, URL, 메모 등)
- **Tag**: 태그 정보
- **BookmarkTag**: 북마크-태그 연결
- **Note**: 북마크에 대한 노트

## 🛠️ 개발 명령어

```bash
# 전체 개발 서버 실행
pnpm dev

# 빌드
pnpm build

# 린팅
pnpm lint

# 타입 체크
pnpm typecheck

# 정리
pnpm clean
```

## 📝 개발 가이드

1. **타입 공유**: 프론트엔드와 백엔드에서 `@monday-bookmark/types` 패키지를 통해 타입을 공유합니다.
2. **데이터 검증**: Zod를 사용하여 클라이언트와 서버 양쪽에서 데이터를 검증합니다.
3. **메모 필드**: 최대 5000자까지 지원합니다 (`@db.Text` 필드).
4. **상태 플로우**: inbox → active → archived 기본 플로우를 따릅니다.
5. **데이터 지속성**: Prisma ORM을 통해 PostgreSQL 데이터베이스를 사용합니다.
6. **마이그레이션**: 다른 PostgreSQL 호환 환경(Supabase 등)으로 손쉽게 이전할 수 있습니다.

## 🔧 환경 변수

### API (.env)
```
DATABASE_URL="postgresql://monday:monday@localhost:5432/monday_bookmarks?schema=public"
PORT=3000
NODE_ENV=development
```

## 📦 의존성

### 주요 의존성
- **pnpm**: 패키지 매니저
- **Turborepo**: 모노레포 빌드 시스템
- **TypeScript**: 타입 안전성
- **Prisma**: 데이터베이스 ORM
- **React Query**: 서버 상태 관리
- **TailwindCSS**: 스타일링
- **Zod**: 스키마 검증

## 🚀 배포

프로덕션 배포를 위해서는:
1. 환경 변수를 프로덕션 값으로 설정
2. `pnpm build` 실행
3. 각 앱의 빌드 결과물을 배포 서버에 배치

## 📄 라이선스

MIT License