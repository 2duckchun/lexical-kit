'use client'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { DRAG_DROP_PASTE } from '@lexical/rich-text'
import { isMimeType, mergeRegister } from '@lexical/utils'
import { COMMAND_PRIORITY_LOW, PASTE_COMMAND } from 'lexical'
import { useCallback, useEffect } from 'react'

import { getImageSize } from '../lib/utils'
import { INSERT_IMAGE_COMMAND } from '../command/insert-image'

interface Props {
  onImageUpload?: (file: File) => Promise<string>
}

export default function ImageDropPastePlugin({ onImageUpload }: Props) {
  const [editor] = useLexicalComposerContext()

  const uploadAndInsert = useCallback(
    async (file: File) => {
      if (!onImageUpload) return
      const url = await onImageUpload(file)
      const { width, height } = await getImageSize(url)
      const alt = prompt('이미지 대체 문구(alt 속성)를 입력해주세요.')
      editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
        src: url,
        alt: alt ?? 'default',
        width,
        height,
      })
    },
    [editor, onImageUpload],
  )

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        DRAG_DROP_PASTE,
        (files: FileList) => {
          Array.from(files).forEach((file) => {
            if (isMimeType(file, ['image/'])) void uploadAndInsert(file)
          })
          return true
        },
        COMMAND_PRIORITY_LOW,
      ),

      editor.registerCommand(
        PASTE_COMMAND,
        (event: ClipboardEvent) => {
          const items = Array.from(event.clipboardData?.items ?? [])
          let handled = false

          items.forEach((item) => {
            if (item.kind === 'file' && item.type.startsWith('image/')) {
              const file = item.getAsFile()
              if (file) {
                void uploadAndInsert(file)
                handled = true
              }
            }
          })

          return handled
        },
        COMMAND_PRIORITY_LOW,
      ),
    )
  }, [editor, uploadAndInsert])

  return null
}
