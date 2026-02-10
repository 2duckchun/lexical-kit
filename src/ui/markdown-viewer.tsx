import type { Options } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkBreaks from 'remark-breaks'
import { cn } from '../lib/utils'

interface RenderMarkdownProps extends Options {
  children: string
  className?: string
}

export function RenderMarkdown({
  children,
  className,
  ...props
}: RenderMarkdownProps) {
  return (
    <div
      className={cn(
        'prose mx-auto prose-img:my-0 prose-p:my-0 min-w-full [&_img[data-lexical-image]]:inline-block',
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkBreaks]}
        rehypePlugins={[rehypeRaw]}
        {...props}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
