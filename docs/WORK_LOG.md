# Work Log

## Tailwind CSS 프리컴파일 + Consumer 테스트 환경 구축

### 배경

`lexical-kit`은 내부적으로 Tailwind CSS 유틸리티 클래스를 사용하지만, 기존에는 컴파일된 Tailwind CSS가 `dist/index.css`에 포함되지 않았다. 그래서 consumer가 반드시 Tailwind를 설치하고 `@source "node_modules/lexical-kit/dist"` 설정을 해야만 스타일이 동작했다.

### 목표

Tailwind가 설치되지 않은 프로젝트에서도 `import 'lexical-kit/styles.css'` 하나로 모든 스타일이 적용되도록 한다.

---

### 변경 사항

#### 1. `src/styles.css` 생성 (신규)

Tailwind CSS 빌드 엔트리 파일. 빌드 시 `src/` 내 모든 컴포넌트에서 사용하는 Tailwind 유틸리티를 스캔하여 컴파일한다.

포함 내용:
- `@import "tailwindcss"` + 플러그인 (`tailwindcss-animate`, `@tailwindcss/typography`)
- `@source "."` - src 디렉토리 스캔
- `@import "./plugin/table-resize-plugin/index.css"` - 테이블 CSS 통합
- 기본 shadcn/ui 테마 CSS 변수 (`:root` + `@theme inline`)

#### 2. `package.json` 빌드 스크립트 수정

```diff
- "build": "tsup"
+ "build": "tsup && npx tailwindcss -i src/styles.css -o dist/index.css --minify"
```

tsup이 JS/타입 빌드 후, Tailwind CLI가 CSS를 컴파일하여 `dist/index.css`에 출력한다.

#### 3. `@tailwindcss/cli` devDependency 추가

Tailwind v4의 CLI 빌드를 위해 `@tailwindcss/cli@^4.1.18` 설치.

#### 4. `table-cell-resizer.tsx`에서 CSS import 제거

```diff
- import './index.css'
```

테이블 리사이즈 CSS는 이제 `src/styles.css`에서 `@import`로 통합 관리한다. 소스 코드에서 직접 import하면 tsup이 별도로 CSS를 번들링하므로 제거.

---

### 결과

- `dist/index.css`: 623B -> **38.7KB** (Tailwind 유틸리티 + 테이블 CSS + 테마 변수 포함)
- Consumer는 Tailwind 설치 없이 CSS import만으로 에디터 사용 가능

### Consumer 사용법 (변경 후)

```tsx
import { LexicalCustomEditor } from 'lexical-kit'
import 'lexical-kit/styles.css'

<LexicalCustomEditor onChange={setHtml} onImageUpload={handleUpload} />
```

테마 커스터마이징이 필요하면 CSS 변수를 오버라이드:

```css
:root {
  --primary: 220 90% 56%;
  --background: 0 0% 98%;
}
```

---

### 테스트 환경

`/Users/kts/Desktop/test-lexical-consumer/`에 Tailwind 없는 Vite + React + TS 프로젝트를 생성하여 `npm pack` tarball로 설치 테스트.

테스트 방법:
```bash
# lexical-kit에서
pnpm build && npm pack

# consumer에서
npm install /Users/kts/Desktop/lexical-kit/lexical-kit-0.0.1.tgz
npm run dev
```
