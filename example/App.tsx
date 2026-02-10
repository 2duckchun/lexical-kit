import { useState } from 'react'
import { LexicalCustomEditor } from '../src'

export default function App() {
  const [html, setHtml] = useState('')

  const handleImageUpload = async (file: File): Promise<string> => {
    // 로컬 테스트: blob URL로 변환
    return URL.createObjectURL(file)
  }

  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-2xl font-bold">
        react-lexical-kit-editor Playground
      </h1>

      <LexicalCustomEditor
        onChange={setHtml}
        onImageUpload={handleImageUpload}
      />

      <details className="mt-6">
        <summary className="cursor-pointer font-semibold">
          HTML Output
        </summary>
        <pre className="mt-2 max-h-[300px] overflow-auto rounded bg-gray-100 p-4 text-xs">
          {html}
        </pre>
      </details>
    </div>
  )
}
