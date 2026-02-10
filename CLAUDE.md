# lexical-kit

## A ready-to-use Lexical editor for React

## Tech Stack

- **Framework**: React 18/19 (peer dependency)
- **Editor**: Lexical v0.33.1
- **Build**: tsup (ESM + CJS + d.ts)
- **Styling**: Tailwind CSS v4 + shadcn/ui (내부 번들)
- **UI Primitives**: Radix UI
- **Icons**: lucide-react
- **Package Manager**: pnpm

## Project Structure

```
src/
  index.tsx          # Public API export (LexicalCustomEditor, LexicalCustomEditorProps)
  editor.tsx         # Main editor component (LexicalComposer, theme, plugins 조합)
  lib/utils.ts       # cn(), getImageSize() 유틸리티
  ui/                # 내부 shadcn 컴포넌트 (button, dialog, popover, select 등)
  nodes/             # Lexical 노드 (heading, image, iframe, table 등)
  plugin/            # 에디터 플러그인들
    index.tsx        # 플러그인 조합 컴포넌트 (LexicalCustomEditorPlugins)
    table-action-menu-plugin.tsx  # 테이블 우클릭 컨텍스트 메뉴 (행/열 추가삭제, 셀 배경색)
    table-resize-plugin/          # 테이블 셀 리사이즈 (CSS 포함)
  command/           # insert-image, insert-iframe 커맨드
  decorator/         # image-resizable-decorator
  constants/         # SupportedBlockType
example/             # Vite + React 로컬 테스트 플레이그라운드
```

## Key Commands

```bash
pnpm build        # tsup 빌드 → dist/ (index.js, index.cjs, index.d.ts, index.css)
pnpm dev          # tsup --watch 모드
pnpm example      # Vite 개발 서버로 example/ 플레이그라운드 실행
pnpm typecheck    # tsc --noEmit 타입 체크
```

## Architecture Decisions

- **UI 컴포넌트**: shadcn/ui를 패키지 내부(`src/ui/`)에 번들. 외부 노출하지 않음
- **Dependencies vs PeerDeps**: react/react-dom만 peerDependencies, 나머지(lexical, radix, lucide 등)는 모두 dependencies
- **CSS**: tsup이 `table-resize-plugin/index.css`를 번들하여 `dist/index.css` 생성. 테이블 셀 선택 하이라이트, 리사이즈 UI 스타일 포함
- **npm 배포 시 `"files": ["dist"]`**: example/, src/ 등은 배포에 포함되지 않음
- **Tailwind v4**: `@source`, `@plugin`, `@theme inline` 디렉티브 사용. 색상은 HSL 포맷

## Theme Configuration (editor.tsx)

```typescript
const theme = {
  text: { bold, italic, strikethrough, code, underline, ... },
  table: 'mt-4',
  tableCell: 'border pl-2',
  tableCellHeader: 'border pl-2',
  tableCellSelected: 'table-cell-selected',   // 셀 드래그 선택 하이라이트
  tableSelection: 'disable-selection',         // 선택 중 브라우저 기본 선택 비활성화
  link: 'prose-a',
}
```

## Table Features

- `TablePlugin` (from `@lexical/react`): 셀 드래그 다중 선택 활성화
- `TableCellResizerPlugin`: 셀 너비 조절
- `TableActionMenuPlugin`: 우클릭 컨텍스트 메뉴
  - 행/열 추가 (위/아래/왼쪽/오른쪽)
  - 행/열 삭제
  - 셀 배경색 (단일 셀 + 다중 셀 선택 모두 지원)
  - `TableCellNode.setBackgroundColor()` API 사용

## Consumer Usage

```tsx
import { LexicalCustomEditor } from "react-lexical-kit-editor";
import "react-lexical-kit-editor/styles.css";

<LexicalCustomEditor
  value={htmlContent}
  onChange={setHtmlContent}
  onImageUpload={handleUpload}
/>;
```

Consumer의 Tailwind 설정에 content 경로 추가 필요:

```js
content: ["./node_modules/react-lexical-kit-editor/dist/**/*.js"];
```

## Style Notes

- example/globals.css: Tailwind v4용 HSL CSS 변수 + `@source "../src"` + `@plugin` 설정
- 색상 포맷: **HSL** (oklch 아님). 예: `--primary: 240 5.9% 10%`
- `tailwindcss-animate` 플러그인 필요 (shadcn 애니메이션)
- `@tailwindcss/typography` 플러그인 필요 (prose 클래스)
