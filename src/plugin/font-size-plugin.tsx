import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $patchStyleText } from '@lexical/selection'
import { $getSelection, $isRangeSelection } from 'lexical'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

export function FontSizePlugin() {
  const [editor] = useLexicalComposerContext()

  const onChange = (value: string) => {
    const size = value + 'px'
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { 'font-size': size })
      }
    })
  }

  return (
    <Select defaultValue="16" onValueChange={onChange}>
      <SelectTrigger
        className="h-10 w-20"
        title="Font Size"
        aria-label="Font Size"
      >
        <SelectValue placeholder="Font Size" />
      </SelectTrigger>
      <SelectContent>
        {[12, 14, 16, 18, 20, 24, 32].map((s) => (
          <SelectItem key={s} value={s.toString()}>
            {s}px
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
