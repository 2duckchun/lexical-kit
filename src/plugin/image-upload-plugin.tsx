'use client'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $insertNodes } from 'lexical'
import { ImagePlus } from 'lucide-react'
import { useEffect, useRef } from 'react'

import { getImageSize } from '../lib/utils'
import { alert } from '../ui/alert'
import { Button } from '../ui/button'
import { INSERT_IMAGE_COMMAND } from '../command/insert-image'
import { ImageNode } from '../nodes/image-node'

interface Props {
  onImageUpload?: (file: File) => Promise<string>
}

export default function ImageUploadPlugin({ onImageUpload }: Props) {
  const [editor] = useLexicalComposerContext()
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    return editor.registerCommand(
      INSERT_IMAGE_COMMAND,
      ({ src, alt, width, height }) => {
        const imageNode = new ImageNode(src, alt, width, height)
        $insertNodes([imageNode])
        return true
      },
      0,
    )
  }, [editor])

  const openFileDialog = () => {
    if (!inputRef.current) return
    inputRef.current.value = ''
    inputRef.current.click()
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !onImageUpload) return

    try {
      const url = await onImageUpload(file)
      const { width, height } = await getImageSize(url)
      const alt = prompt('이미지 대체 문구(alt 속성)를 입력해주세요.')
      editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
        src: url,
        alt: alt ?? 'default',
        width,
        height,
      })
    } catch (_err) {
      alert({
        title: '이미지 업로드에 실패했습니다.',
        body: '다시 시도해주세요.',
      })
    }
  }

  return (
    <>
      <Button
        type="button"
        onClick={openFileDialog}
        variant="outline"
        size="icon"
        className="rounded-full"
        title="Image"
      >
        <ImagePlus />
      </Button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleChange}
      />
    </>
  )
}
