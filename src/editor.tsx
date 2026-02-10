'use client'

import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { TablePlugin } from '@lexical/react/LexicalTablePlugin'
import type { EditorState, LexicalEditor } from 'lexical'
import { $getRoot } from 'lexical'
import { useEffect, useState } from 'react'
import { nodes } from './nodes'
import { LexicalCustomEditorPlugins } from './plugin'

const theme = {
  text: {
    bold: 'font-bold',
    italic: 'italic',
    strikethrough: 'line-through',
    code: 'font-mono',
    subscript: 'text-xs',
    superscript: 'text-xs',
    underline: 'underline',
  },
  table: 'mt-4 ',
  tableCell: 'border pl-2',
  tableCellHeader: 'border pl-2',
  tableCellSelected: 'table-cell-selected',
  tableSelection: 'disable-selection',
  link: 'prose-a',
}

function onError() {}

export interface LexicalCustomEditorProps {
  onImageUpload?: (file: File) => Promise<string>
  value?: string
  onChange?: (content: string) => void
}

export const LexicalCustomEditor = ({
  onImageUpload,
  value,
  onChange,
}: LexicalCustomEditorProps) => {
  const [isMounted, setIsMounted] = useState(false)

  const initialConfig = {
    namespace: 'MyEditor',
    theme,
    editorState: value
      ? (editor: LexicalEditor) => {
          const dom = new DOMParser().parseFromString(value, 'text/html')
          editor.update(() => {
            const nodes = $generateNodesFromDOM(editor, dom)
            const root = $getRoot()
            root.clear()
            root.append(...nodes)
          })
        }
      : undefined,
    onError,
    nodes: nodes,
  }

  const handleChange = (editorState: EditorState, editor: LexicalEditor) => {
    const html = editorState.read(() => $generateHtmlFromNodes(editor, null))
    onChange?.(html)
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="border bg-white p-4">
        <LexicalCustomEditorPlugins
          className="mb-10"
          onImageUpload={onImageUpload}
        />
        <div className="prose relative mx-auto prose-img:my-0 prose-p:my-0 max-h-[700px] min-h-[240px] w-full max-w-none overflow-y-auto">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="relative min-h-[240px] w-full bg-white outline-hidden"
                aria-placeholder={'입력해주세요.'}
                placeholder={
                  <div className="pointer-events-none absolute top-0 left-0 select-none">
                    Enter some text...
                  </div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <OnChangePlugin onChange={handleChange} />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <TablePlugin />
      </div>
    </LexicalComposer>
  )
}
