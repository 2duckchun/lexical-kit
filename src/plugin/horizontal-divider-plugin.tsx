import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode'
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin'
import { LucideSeparatorHorizontal } from 'lucide-react'

import { Button } from '../ui/button'

export function HorizontalDividerPlugin() {
  const [editor] = useLexicalComposerContext()

  return (
    <>
      <HorizontalRulePlugin />
      <Button
        type="button"
        onClick={() =>
          editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)
        }
        title="수평선 추가"
        variant="outline"
        size="icon"
        className="rounded-full border"
      >
        <LucideSeparatorHorizontal />
      </Button>
    </>
  )
}
