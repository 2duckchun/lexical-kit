import { cn } from '../lib/utils'
import { Separator } from '../ui/separator'

import { AlignmentPlugin } from './alignment-plugin'
import { BlockTypePlugin } from './block-type-plugin'
import { CustomLinkPlugin } from './custom-link-plugin'
import EmojiPickerPlugin from './emoji-plugin'
import { ColorPickerPlugin } from './font-color-plugin'
import { FontSizePlugin } from './font-size-plugin'
import { HorizontalDividerPlugin } from './horizontal-divider-plugin'
import { HtmlPreviewPlugin } from './html-preview-plugin'
import IframeInsertPlugin from './iframe-insert-plugin'
import ImageDropPastePlugin from './image-drop-paste-plugin'
import ImageUploadPlugin from './image-upload-plugin'
import { InlineToolbarPlugin } from './inline-style-plugin'
import { MarkdownPreviewPlugin } from './markdown-preview-plugin'
import TableActionMenuPlugin from './table-action-menu-plugin'
import TableInsertPlugin from './table-insert-plugin'
import TableCellResizerPlugin from './table-resize-plugin'

export const LexicalCustomEditorPlugins = ({
  className,
  onImageUpload,
}: {
  className?: string
  onImageUpload?: (file: File) => Promise<string>
}) => {
  return (
    <div className={cn('mb-2 flex gap-2 bg-white', className)}>
      <BlockTypePlugin />
      <Separator orientation="vertical" />
      <FontSizePlugin />
      <Separator orientation="vertical" />
      <InlineToolbarPlugin />
      <Separator orientation="vertical" />
      <AlignmentPlugin />
      <ColorPickerPlugin />
      <Separator orientation="vertical" />
      <div className="grid grid-cols-3 gap-2">
        <CustomLinkPlugin />
        <HorizontalDividerPlugin />
        <ImageUploadPlugin onImageUpload={onImageUpload} />
        <ImageDropPastePlugin onImageUpload={onImageUpload} />
        <TableInsertPlugin />
        <TableCellResizerPlugin />
        <TableActionMenuPlugin />
        <IframeInsertPlugin />
        <EmojiPickerPlugin />
      </div>
      <div className="grid grid-cols-1 gap-2">
        <HtmlPreviewPlugin />
        <MarkdownPreviewPlugin />
      </div>
    </div>
  )
}
