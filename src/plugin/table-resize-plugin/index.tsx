import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useLexicalEditable } from '@lexical/react/useLexicalEditable'
import { type ReactPortal, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { TableCellResizer } from './table-cell-resizer'

export default function TableCellResizerPlugin(): null | ReactPortal {
  const [editor] = useLexicalComposerContext()
  const [mounted, setMounted] = useState(false)
  const isEditable = useLexicalEditable()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isEditable) return null
  return createPortal(<TableCellResizer editor={editor} />, document.body)
}
