'use client'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $insertNodes, COMMAND_PRIORITY_LOW } from 'lexical'
import { useEffect } from 'react'

import { INSERT_IFRAME_COMMAND } from '../command/insert-iframe'
import { IframeNode } from '../nodes/iframe-node'

export default function IframeCommandPlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerCommand(
      INSERT_IFRAME_COMMAND,
      ({ src, width, height }) => {
        $insertNodes([new IframeNode(src, width, height)])
        return true
      },
      COMMAND_PRIORITY_LOW,
    )
  }, [editor])

  return null
}
