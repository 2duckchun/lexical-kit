import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical'
import { Bold, Italic, Strikethrough, Underline } from 'lucide-react'
import type { FC } from 'react'
import { useEffect, useState } from 'react'

import { cn } from '../lib/utils'
import { Button } from '../ui/button'

export const InlineToolbarPlugin: FC = () => {
  const [editor] = useLexicalComposerContext()

  const [isBold, setIsBold] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)
  const [isItalic, setIsItalic] = useState(false)

  useEffect(() => {
    editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection()

        if (!$isRangeSelection(selection)) return

        setIsBold(selection.hasFormat('bold'))
        setIsUnderline(selection.hasFormat('underline'))
        setIsStrikethrough(selection.hasFormat('strikethrough'))
        setIsItalic(selection.hasFormat('italic'))
      })
    })
  }, [editor])

  return (
    <div className="grid grid-cols-2 gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        title="Bold"
        className={cn(isBold && 'bg-blue-500')}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
        }}
      >
        <Bold />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        title="Underline"
        className={isUnderline ? 'bg-blue-500' : ''}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
        }}
      >
        <Underline />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        title="Strikethrough"
        className={isStrikethrough ? 'bg-blue-500' : ''}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
        }}
      >
        <Strikethrough />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        title="Italic"
        className={isItalic ? 'bg-blue-500' : ''}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
        }}
      >
        <Italic />
      </Button>
    </div>
  )
}
