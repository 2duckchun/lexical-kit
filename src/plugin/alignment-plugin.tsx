import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { FORMAT_ELEMENT_COMMAND } from 'lexical'
import type { LucideIcon } from 'lucide-react'
import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

type AlignType = 'left' | 'center' | 'right' | 'justify'

const ALIGN_ICONS: Record<AlignType, LucideIcon> = {
  left: AlignLeft,
  center: AlignCenter,
  right: AlignRight,
  justify: AlignJustify,
}

export function AlignmentPlugin() {
  const [editor] = useLexicalComposerContext()
  const [open, setOpen] = useState(false)

  const applyAlign = (align: AlignType) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, align)
    setOpen(false)
  }

  const aligns: AlignType[] = ['left', 'center', 'right', 'justify']

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size="icon" variant="outline" title="텍스트 정렬">
          <AlignCenter className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-fit p-2" sideOffset={4}>
        <div className="grid grid-cols-4 gap-1">
          {aligns.map((align) => {
            const Icon = ALIGN_ICONS[align]
            return (
              <Button
                type="button"
                size="icon"
                key={align}
                title={align}
                variant="outline"
                className="h-6 w-6 rounded border"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyAlign(align)}
              >
                <Icon className="h-4 w-4" />
              </Button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
