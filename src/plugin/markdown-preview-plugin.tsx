import { $generateHtmlFromNodes } from '@lexical/html'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useState } from 'react'

import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { RenderMarkdown } from '../ui/markdown-viewer'

export const MarkdownPreviewPlugin = () => {
  const [editor] = useLexicalComposerContext()
  const [open, setOpen] = useState(false)
  const [html, setHtml] = useState('')

  const showHtml = () => {
    editor.getEditorState().read(() => {
      const htmlString = $generateHtmlFromNodes(editor)
      setHtml(htmlString)
      setOpen(true)
    })
  }

  return (
    <>
      <Button type="button" onClick={showHtml} variant="outline">
        View Markdown
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[700px] max-w-[1080px] overflow-y-auto">
          <DialogHeader className="border-black border-b-2 pb-10">
            <DialogTitle>Editor Markdown Preview</DialogTitle>
          </DialogHeader>
          <div className="w-[768px]">
            <RenderMarkdown>{html}</RenderMarkdown>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
