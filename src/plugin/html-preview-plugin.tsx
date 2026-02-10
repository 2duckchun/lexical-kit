import { $generateHtmlFromNodes } from '@lexical/html'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useState } from 'react'

import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Textarea } from '../ui/textarea'

export const HtmlPreviewPlugin = () => {
  const [editor] = useLexicalComposerContext()
  const [open, setOpen] = useState(false)
  const [html, setHtml] = useState('')

  const showHtml = () => {
    editor.getEditorState().read(() => {
      const htmlString = $generateHtmlFromNodes(editor)
      const formatted = formatHtml(htmlString)
      setHtml(formatted)
      setOpen(true)
    })
  }

  return (
    <>
      <Button type="button" onClick={showHtml} variant="outline">
        View HTML
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="border-black border-b-2 pb-10">
            <DialogTitle>Editor HTML Preview</DialogTitle>
          </DialogHeader>
          <Textarea
            readOnly
            value={html}
            className="h-[400px] resize-none overflow-x-auto rounded bg-gray-100 p-2 font-mono text-xs"
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

function formatNode(node: Node, depth = 0): string {
  const indent = '  '.repeat(depth)
  let result = ''

  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as Element
    const tag = el.tagName.toLowerCase()
    const attrs = Array.from(el.attributes)
      .map((attr) => `${attr.name}="${attr.value}"`)
      .join(' ')

    const open = attrs.length ? `<${tag} ${attrs}>` : `<${tag}>`
    result += `${indent}${open}\n`

    for (const child of el.childNodes) {
      result += formatNode(child, depth + 1)
    }

    result += `${indent}</${tag}>\n`
  } else if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent?.trim()
    if (text) {
      result += `${indent}${text}\n`
    }
  } else if (node.nodeType === Node.COMMENT_NODE) {
    result += `${indent}<!-- ${(node as Comment).data} -->\n`
  }

  return result
}

export function formatHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const body = doc.body
  let result = ''
  for (const node of body.childNodes) {
    result += formatNode(node)
  }
  return result
}
