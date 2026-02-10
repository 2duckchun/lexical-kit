'use client'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $deleteTableColumnAtSelection,
  $deleteTableRowAtSelection,
  $getTableCellNodeFromLexicalNode,
  $insertTableColumnAtSelection,
  $insertTableRowAtSelection,
  $isTableCellNode,
  $isTableSelection,
  TableNode,
} from '@lexical/table'
import { $getSelection, $isRangeSelection } from 'lexical'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  PaintBucket,
  Trash2,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'

const CELL_COLORS = [
  { name: '빨간색', value: '#fde8e8' },
  { name: '주황색', value: '#fef3e2' },
  { name: '노란색', value: '#fef9e7' },
  { name: '초록색', value: '#e8f5e9' },
  { name: '파란색', value: '#e3f2fd' },
  { name: '보라색', value: '#f3e5f5' },
  { name: '분홍색', value: '#fce4ec' },
  { name: '회색', value: '#f5f5f5' },
  { name: '진빨간색', value: '#f8b4b4' },
  { name: '진주황색', value: '#fcd9a8' },
  { name: '진노란색', value: '#fdf0b2' },
  { name: '진초록색', value: '#b9e6bf' },
  { name: '진파란색', value: '#b3d9f7' },
  { name: '진보라색', value: '#dbb6e0' },
  { name: '진분홍색', value: '#f4b8c8' },
  { name: '진회색', value: '#e0e0e0' },
]

interface MenuPosition {
  x: number
  y: number
}

export default function TableActionMenuPlugin() {
  const [editor] = useLexicalComposerContext()
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null)
  const [isInTable, setIsInTable] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const closeMenu = useCallback(() => {
    setMenuPosition(null)
    setShowColorPicker(false)
  }, [])

  // 우클릭 이벤트 감지
  useEffect(() => {
    const removeRootListener = editor.registerRootListener(
      (rootElement, prevRootElement) => {
        const handleContextMenu = (e: MouseEvent) => {
          editor.getEditorState().read(() => {
            const selection = $getSelection()

            // 다중 셀 선택 (드래그)
            if ($isTableSelection(selection)) {
              e.preventDefault()
              setMenuPosition({ x: e.clientX, y: e.clientY })
              setIsInTable(true)
              return
            }

            // 단일 셀 선택
            if (!$isRangeSelection(selection)) return

            const node = selection.getNodes()[0]
            if (!node) return

            const tableCellNode = $getTableCellNodeFromLexicalNode(node)
            if (tableCellNode) {
              e.preventDefault()
              setMenuPosition({ x: e.clientX, y: e.clientY })
              setIsInTable(true)
            }
          })
        }

        prevRootElement?.removeEventListener('contextmenu', handleContextMenu)
        rootElement?.addEventListener('contextmenu', handleContextMenu)
      },
    )

    return removeRootListener
  }, [editor])

  // 테이블 존재 여부 추적
  useEffect(() => {
    return editor.registerMutationListener(TableNode, () => {
      setIsInTable(true)
    })
  }, [editor])

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    if (!menuPosition) return

    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu()
      }
    }

    const handleScroll = () => closeMenu()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }

    document.addEventListener('click', handleClick)
    document.addEventListener('scroll', handleScroll, true)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('scroll', handleScroll, true)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuPosition, closeMenu])

  const insertRowAbove = () => {
    editor.update(() => {
      $insertTableRowAtSelection(false)
    })
    closeMenu()
  }

  const insertRowBelow = () => {
    editor.update(() => {
      $insertTableRowAtSelection(true)
    })
    closeMenu()
  }

  const insertColumnLeft = () => {
    editor.update(() => {
      $insertTableColumnAtSelection(false)
    })
    closeMenu()
  }

  const insertColumnRight = () => {
    editor.update(() => {
      $insertTableColumnAtSelection(true)
    })
    closeMenu()
  }

  const deleteRow = () => {
    editor.update(() => {
      $deleteTableRowAtSelection()
    })
    closeMenu()
  }

  const deleteColumn = () => {
    editor.update(() => {
      $deleteTableColumnAtSelection()
    })
    closeMenu()
  }

  const setCellBackgroundColor = (color: string | null) => {
    editor.update(() => {
      const selection = $getSelection()

      // 다중 셀 선택: 선택된 모든 셀에 색상 적용
      if ($isTableSelection(selection)) {
        const nodes = selection.getNodes()
        for (const node of nodes) {
          if ($isTableCellNode(node)) {
            node.setBackgroundColor(color)
          }
        }
        return
      }

      // 단일 셀 선택
      if (!$isRangeSelection(selection)) return

      const node = selection.getNodes()[0]
      if (!node) return

      const tableCellNode = $getTableCellNodeFromLexicalNode(node)
      if (tableCellNode) {
        tableCellNode.setBackgroundColor(color)
      }
    })
    closeMenu()
  }

  if (!menuPosition) return null

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-[100] min-w-[180px] rounded-lg border bg-popover p-1 shadow-lg"
      style={{ left: menuPosition.x, top: menuPosition.y }}
    >
      <MenuItem
        icon={<ArrowUp className="h-4 w-4" />}
        label="위에 행 추가"
        onClick={insertRowAbove}
      />
      <MenuItem
        icon={<ArrowDown className="h-4 w-4" />}
        label="아래에 행 추가"
        onClick={insertRowBelow}
      />

      <Separator className="my-1" />

      <MenuItem
        icon={<ArrowLeft className="h-4 w-4" />}
        label="왼쪽에 열 추가"
        onClick={insertColumnLeft}
      />
      <MenuItem
        icon={<ArrowRight className="h-4 w-4" />}
        label="오른쪽에 열 추가"
        onClick={insertColumnRight}
      />

      <Separator className="my-1" />

      <div className="relative">
        <MenuItem
          icon={<PaintBucket className="h-4 w-4" />}
          label="셀 배경색"
          onClick={() => setShowColorPicker(!showColorPicker)}
        />
        {showColorPicker && (
          <div className="px-2 pb-1">
            <div className="grid grid-cols-8 gap-1">
              {CELL_COLORS.map(({ name, value }) => (
                <button
                  type="button"
                  key={value}
                  title={name}
                  style={{ backgroundColor: value }}
                  className="h-5 w-5 rounded border border-gray-300 hover:ring-2 hover:ring-primary hover:ring-offset-1"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setCellBackgroundColor(value)}
                />
              ))}
            </div>
            <button
              type="button"
              className="mt-1 flex w-full items-center gap-2 rounded-md px-1 py-1 text-xs text-muted-foreground hover:bg-accent"
              onClick={() => setCellBackgroundColor(null)}
            >
              <X className="h-3 w-3" />
              색상 제거
            </button>
          </div>
        )}
      </div>

      <Separator className="my-1" />

      <MenuItem
        icon={<Trash2 className="h-4 w-4 text-destructive" />}
        label="행 삭제"
        onClick={deleteRow}
        destructive
      />
      <MenuItem
        icon={<Trash2 className="h-4 w-4 text-destructive" />}
        label="열 삭제"
        onClick={deleteColumn}
        destructive
      />
    </div>,
    document.body,
  )
}

function MenuItem({
  icon,
  label,
  onClick,
  destructive,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  destructive?: boolean
}) {
  return (
    <button
      type="button"
      className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent ${
        destructive ? 'text-destructive hover:text-destructive' : ''
      }`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  )
}
