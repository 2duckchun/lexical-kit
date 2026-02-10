import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'
import { $getNodeByKey } from 'lexical'
import { useRef, useState } from 'react'

import type { ImageNode } from '../nodes/image-node'

export default function ResizableImageDecorator({
  src,
  alt,
  width,
  height,
  nodeKey,
}: {
  src: string
  alt: string
  width: number | 'auto'
  height: number | 'auto'
  nodeKey: string
}) {
  const [size, setSize] = useState({ w: width, h: height })
  const [editor] = useLexicalComposerContext()
  const [selected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey)
  const imgRef = useRef<HTMLImageElement>(null)

  const onClick = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.preventDefault()
    e.stopPropagation()
    editor.update(() => {
      if (e.shiftKey) {
        setSelected(!selected)
      } else {
        clearSelection()
        setSelected(true)
      }
    })
    if (!selected && imgRef.current) {
      setSize({
        w: imgRef.current.offsetWidth,
        h: imgRef.current.offsetHeight,
      })
    }
  }

  const startResize = (
    eDown: React.MouseEvent<HTMLImageElement, MouseEvent>,
  ) => {
    eDown.preventDefault()
    const startX = eDown.clientX
    const startY = eDown.clientY
    const startW = imgRef.current?.offsetWidth ?? 0
    const startH = imgRef.current?.offsetHeight ?? 0

    const onMove = (eMove: MouseEvent) => {
      const nextW = Math.max(40, startW + (eMove.clientX - startX))
      const nextH = Math.max(40, startH + (eMove.clientY - startY))
      setSize({ w: nextW, h: nextH })
      editor.update(
        () => {
          const node = $getNodeByKey(nodeKey) as ImageNode
          node?.setSize(nextW, nextH)
        },
        {
          discrete: true,
        },
      )
    }
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const isNum = (v: unknown): v is number => Number.isFinite(v)
  const displayW = isNum(size.w) ? `${Math.round(size.w)}px` : 'auto'
  const displayH = isNum(size.h) ? `${Math.round(size.h)}px` : 'auto'

  return (
    <span
      contentEditable={false}
      draggable={false}
      className="relative inline-block"
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={typeof size.w === 'number' ? size.w : undefined}
        height={typeof size.h === 'number' ? size.h : undefined}
        onClick={onClick}
        className={`${selected && 'border-2 border-black border-dashed'}`}
      />
      {selected && (
        <>
          <span
            onMouseDown={startResize}
            className="absolute right-0 bottom-0 h-3 w-3 cursor-se-resize rounded-sm bg-blue-500"
          />
          <span className="absolute right-2 bottom-2 rounded bg-black/70 px-1 font-mono text-[10px] text-white">
            {displayW} × {displayH}
          </span>
        </>
      )}
    </span>
  )
}
