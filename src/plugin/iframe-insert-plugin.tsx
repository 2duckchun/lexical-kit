'use client'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import { Button } from '../ui/button'
import { INSERT_IFRAME_COMMAND } from '../command/insert-iframe'

import IframeCommandPlugin from './iframe-command-plugin'

const toPx = (value: string | null) =>
  value?.trim() ? value.trim() + 'px' : ''

export default function IframeInsertPlugin() {
  const [editor] = useLexicalComposerContext()

  const onClick = () => {
    const url = prompt('iframe URL을 입력하세요')
    if (!url || !/^https?:\/\//.test(url)) return
    const wRaw = prompt('너비(px) - 빈칸이면 500px', '')
    const hRaw = prompt('높이(px) - 빈칸이면 890px', '')

    const width = wRaw ? toPx(wRaw) : '500px'
    const height = hRaw ? toPx(hRaw) : '890px'

    editor.dispatchCommand(INSERT_IFRAME_COMMAND, {
      src: url,
      width,
      height,
    })
  }

  return (
    <>
      <IframeCommandPlugin />
      <Button
        type="button"
        onClick={onClick}
        className="rounded-full"
        variant="outline"
        title="Iframe"
        size="icon"
      >
        Iframe
      </Button>
    </>
  )
}
