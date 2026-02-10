'use client'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getSelection, $isRangeSelection } from 'lexical'
import { useState } from 'react'

import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

const EMOJIS = [
  '😀', '😅', '😊', '😂', '😍', '🤔', '👍', '🙏',
  '🎉', '🔥', '💯', '🥳', '🚀', '😎', '😢', '❗',
]

export default function EmojiPickerPlugin() {
  const [editor] = useLexicalComposerContext()
  const [open, setOpen] = useState(false)

  const insertEmoji = (emoji: string) => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        selection.insertText(emoji)
      }
    })
    setOpen(false)
  }

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="rounded-full"
            title="Insert emoji"
            onClick={() => setOpen(!open)}
          >
            🤔
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div>
            {EMOJIS.map((e) => (
              <Button
                type="button"
                key={e}
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => insertEmoji(e)}
              >
                {e}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </>
  )
}
