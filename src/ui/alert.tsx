'use client'

import { AlertDialogCancel } from '@radix-ui/react-alert-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { cn } from '../lib/utils'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from './alert-dialog'
import { Button } from './button'

let alertCallback: (config: AlertConfig) => void

interface AlertConfig {
  image?: ReactNode
  title?: ReactNode
  body: ReactNode
  label?: string
  onClose?: () => void
}

export const alert = (config: AlertConfig) => {
  if (alertCallback) {
    alertCallback(config)
  }
}

export function Alert() {
  const [dialogConfig, setDialogConfig] = useState<AlertConfig | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    alertCallback = (config: AlertConfig) => {
      setDialogConfig(config)
      setIsOpen(true)
    }

    return () => {
      alertCallback = () => {}
    }
  }, [])

  if (!dialogConfig) return null

  const { title, body, label, onClose, image } = dialogConfig

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) {
          onClose?.()
          setDialogConfig(null)
        }
      }}
    >
      <AlertDialogContent className={cn('max-w-[400px] rounded-2xl p-5')}>
        <VisuallyHidden>
          <AlertDialogHeader>
            <AlertDialogTitle>{title || '알림'}</AlertDialogTitle>
            <AlertDialogDescription>{title}</AlertDialogDescription>
          </AlertDialogHeader>
        </VisuallyHidden>
        {image && (
          <section className={'flex items-center justify-center'}>
            {image}
          </section>
        )}
        <div className="font-bold text-label-900 text-title-3">{title}</div>
        <div className="mb-5 w-full overflow-x-auto font-medium text-label-950">
          {body}
        </div>
        <AlertDialogCancel asChild>
          <Button className="w-full">{label ?? '확인'}</Button>
        </AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialog>
  )
}
