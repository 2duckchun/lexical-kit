import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
} from '@lexical/list'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import type { HeadingTagType } from '@lexical/rich-text'
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from '@lexical/rich-text'
import { $setBlocksType } from '@lexical/selection'
import { $getNearestNodeOfType } from '@lexical/utils'
import { $createParagraphNode, $getSelection, $isRangeSelection } from 'lexical'
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { type BlockType, SupportedBlockType } from '../constants'
import { cn } from '../lib/utils'
import { Button } from '../ui/button'

export const BlockTypePlugin = () => {
  const [blockType, setBlockType] = useState<BlockType>('paragraph')
  const [editor] = useLexicalComposerContext()

  const formatHeading = useCallback(
    (type: HeadingTagType) => {
      if (blockType !== type) {
        setBlockType(type as BlockType)
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode(type))
          }
        })
      }
    },
    [blockType, editor],
  )

  const formatParagraph = useCallback(() => {
    if (blockType !== 'paragraph') {
      setBlockType('paragraph')
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode())
        }
      })
    }
  }, [blockType, editor])

  const formatQuote = useCallback(() => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode())
        }
      })
    }
  }, [blockType, editor])

  const formatBulletList = useCallback(() => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
    }
  }, [blockType, editor])

  const formatNumberedList = useCallback(() => {
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
    }
  }, [blockType, editor])

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection()
        if (!$isRangeSelection(selection)) return

        const anchorNode = selection.anchor.getNode()
        const targetNode =
          anchorNode.getKey() === 'root'
            ? anchorNode
            : anchorNode.getTopLevelElementOrThrow()

        if ($isHeadingNode(targetNode)) {
          const tag = targetNode.getTag()
          setBlockType(tag as BlockType)
        } else if ($isListNode(targetNode)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode)
          const listType = parentList
            ? parentList.getListType()
            : targetNode.getListType()

          setBlockType(listType as BlockType)
        } else {
          const nodeType = targetNode.getType()
          if (nodeType in SupportedBlockType) {
            setBlockType(nodeType as BlockType)
          } else {
            setBlockType('paragraph')
          }
        }
      })
    })
  }, [editor])

  return (
    <div className="grid grid-cols-4 gap-2">
      <ListPlugin />
      <Button
        type="button"
        size="icon"
        title="Heading 1"
        variant="outline"
        className={cn('rounded border', {
          'bg-primary text-primary-foreground': blockType === 'h1',
        })}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => formatHeading('h1')}
      >
        <Heading1 />
      </Button>
      <Button
        type="button"
        size="icon"
        title="Heading 2"
        variant="outline"
        className={cn('rounded border', {
          'bg-primary text-primary-foreground': blockType === 'h2',
        })}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => formatHeading('h2')}
      >
        <Heading2 />
      </Button>
      <Button
        type="button"
        size="icon"
        title="Heading 3"
        variant="outline"
        className={cn('rounded border', {
          'bg-primary text-primary-foreground': blockType === 'h3',
        })}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => formatHeading('h3')}
      >
        <Heading3 />
      </Button>
      <Button
        type="button"
        size="icon"
        title="Paragraph"
        variant="outline"
        className={cn('rounded border', {
          'bg-primary text-primary-foreground': blockType === 'paragraph',
        })}
        onMouseDown={(e) => e.preventDefault()}
        onClick={formatParagraph}
      >
        <span className="font-bold text-sm">P</span>
      </Button>
      <Button
        type="button"
        size="icon"
        title="Quote"
        variant="outline"
        className={cn('rounded border', {
          'bg-primary text-primary-foreground': blockType === 'quote',
        })}
        onMouseDown={(e) => e.preventDefault()}
        onClick={formatQuote}
      >
        <Quote />
      </Button>
      <Button
        type="button"
        size="icon"
        title="Bulleted List"
        variant="outline"
        className={cn('rounded border', {
          'bg-primary text-primary-foreground': blockType === 'bullet',
        })}
        onMouseDown={(e) => e.preventDefault()}
        onClick={formatBulletList}
      >
        <List />
      </Button>
      <Button
        type="button"
        size="icon"
        title="Numbered List"
        variant="outline"
        className={cn('rounded border', {
          'bg-primary text-primary-foreground': blockType === 'number',
        })}
        onMouseDown={(e) => e.preventDefault()}
        onClick={formatNumberedList}
      >
        <ListOrdered />
      </Button>
    </div>
  )
}
