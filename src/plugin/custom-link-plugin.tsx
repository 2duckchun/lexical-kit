import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { $isAtNodeEnd } from '@lexical/selection'
import { mergeRegister } from '@lexical/utils'
import type {
  BaseSelection,
  EditorState,
  LexicalEditor,
  RangeSelection,
} from 'lexical'
import {
  $getSelection,
  $isRangeSelection,
  SELECTION_CHANGE_COMMAND,
} from 'lexical'
import { LinkIcon, PencilIcon } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../lib/utils'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

const LowPriority = 1

export function CustomLinkPlugin() {
  const [editor] = useLexicalComposerContext()
  const [isLink, setIsLink] = useState(false)
  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, {
        url: 'https://',
        target: '_blank',
        rel: 'noopener noreferrer',
      })
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
    }
  }, [editor, isLink])

  const updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if (!$isRangeSelection(selection)) return

    const node = getSelectedNode(selection)
    const parent = node.getParent()
    if ($isLinkNode(parent) || $isLinkNode(node)) {
      setIsLink(true)
    } else {
      setIsLink(false)
    }
  }, [])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar()
        })
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          updateToolbar()
          return false
        },
        LowPriority,
      ),
    )
  }, [editor, updateToolbar])

  return (
    <>
      <LinkPlugin />
      <Button
        className={cn(
          'rounded-full border',
          isLink && 'bg-primary text-primary-foreground',
        )}
        onMouseDown={(event) => event.preventDefault()}
        size="icon"
        variant="outline"
        type="button"
        onClick={(event) => {
          event.preventDefault()
          insertLink()
          editor.focus()
        }}
      >
        <LinkIcon />
      </Button>
      {isLink &&
        createPortal(<FloatingLinkEditor editor={editor} />, document.body)}
    </>
  )
}

function getSelectedNode(selection: RangeSelection) {
  const anchor = selection.anchor
  const focus = selection.focus
  const anchorNode = selection.anchor.getNode()
  const focusNode = selection.focus.getNode()
  if (anchorNode === focusNode) {
    return anchorNode
  }
  const isBackward = selection.isBackward()
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode
  }
}

function positionEditorElement(editor: HTMLElement, rect: DOMRect | null) {
  if (rect === null) {
    editor.style.opacity = '0'
    editor.style.top = '-1000px'
    editor.style.left = '-1000px'
  } else {
    editor.style.opacity = '1'
    editor.style.top = `${rect.top + rect.height + window.pageYOffset + 10}px`
    editor.style.left = `${
      rect.left + window.pageXOffset - editor.offsetWidth / 2 + rect.width / 2
    }px`
  }
}

function FloatingLinkEditor({ editor }: { editor: LexicalEditor }) {
  const editorRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const mouseDownRef = useRef(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [isEditMode, setEditMode] = useState(true)
  const [lastSelection, setLastSelection] = useState<BaseSelection | null>(null)

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection)
      const parent = node.getParent()
      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL())
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL())
      } else {
        setLinkUrl('')
      }
    }
    const editorElem = editorRef.current
    const nativeSelection = window.getSelection()
    const activeElement = document.activeElement

    if (editorElem === null) {
      return
    }

    const rootElement = editor.getRootElement()

    if (
      selection !== null &&
      !nativeSelection?.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection?.anchorNode ?? null)
    ) {
      const domRange = nativeSelection?.getRangeAt(0)
      let rect
      if (nativeSelection?.anchorNode === rootElement) {
        let inner = rootElement
        while (inner.firstElementChild !== null) {
          inner = inner.firstElementChild as HTMLElement
        }
        rect = inner.getBoundingClientRect()
      } else {
        rect = domRange?.getBoundingClientRect()
      }

      if (!mouseDownRef.current) {
        positionEditorElement(editorElem, rect ?? null)
      }
      setLastSelection(selection)
    } else if (!activeElement || activeElement !== inputRef.current) {
      positionEditorElement(editorElem, null)
      setLastSelection(null)
      setEditMode(false)
      setLinkUrl('')
    }

    return true
  }, [editor])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(
        ({ editorState }: { editorState: EditorState }) => {
          editorState.read(() => {
            updateLinkEditor()
          })
        },
      ),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor()
          return true
        },
        LowPriority,
      ),
    )
  }, [editor, updateLinkEditor])

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor()
    })
  }, [editor, updateLinkEditor])

  useEffect(() => {
    if (isEditMode && inputRef.current) {
      requestAnimationFrame(() => {
        inputRef.current?.focus({ preventScroll: true })
      })
    }
  }, [isEditMode])

  return (
    <div
      ref={editorRef}
      className="link-editor absolute z-50 rounded-sm bg-primary p-2"
    >
      {isEditMode ? (
        <Input
          ref={inputRef}
          className={cn('max-w-[300px] overflow-x-auto overflow-y-hidden')}
          value={linkUrl}
          onChange={(event) => {
            setLinkUrl(event.target.value)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              if (lastSelection !== null) {
                if (linkUrl !== '') {
                  editor.dispatchCommand(TOGGLE_LINK_COMMAND, {
                    url: linkUrl,
                    target: '_blank',
                    rel: 'noopener noreferrer',
                  })
                }
                setEditMode(false)
              }
            } else if (event.key === 'Escape') {
              event.preventDefault()
              setEditMode(false)
            }
          }}
        />
      ) : (
        <>
          <div className="link-input flex items-center gap-2">
            <p className="flex h-10 w-fit max-w-[300px] items-center overflow-x-auto overflow-y-hidden rounded-md bg-white px-3 py-2 text-sm">
              {linkUrl}
            </p>
            <Button
              type="button"
              className="link-edit"
              size="icon"
              role="button"
              tabIndex={0}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setEditMode(true)
              }}
            >
              <PencilIcon />
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
