import * as React from 'react'
import { ScrollArea as ScrollAreaPrimitive } from 'radix-ui'

import { cn } from '@/shared/lib/utils'

const SCROLLBAR_HOVER_ZONE = 30

type HoveredEdges = {
  vertical: boolean
  horizontal: boolean
}

const NO_HOVERED_EDGES: HoveredEdges = { vertical: false, horizontal: false }

function ScrollArea({
  className,
  children,
  style,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  const [hoveredEdges, setHoveredEdges] = React.useState<HoveredEdges>(NO_HOVERED_EDGES)
  const hoveredEdgesRef = React.useRef(NO_HOVERED_EDGES)
  const rootRef = React.useRef<HTMLDivElement>(null)
  const [height, setHeight] = React.useState(0)

  React.useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const observer = new ResizeObserver(([entry]) => {
      if (entry) setHeight(entry.contentRect.height)
    })
    observer.observe(root)

    return () => observer.disconnect()
  }, [])

  const updateHoveredEdges = (next: HoveredEdges) => {
    const current = hoveredEdgesRef.current
    if (next.vertical === current.vertical && next.horizontal === current.horizontal) {
      return
    }
    hoveredEdgesRef.current = next
    setHoveredEdges(next)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    updateHoveredEdges({
      vertical: rect.right - event.clientX <= SCROLLBAR_HOVER_ZONE,
      horizontal: rect.bottom - event.clientY <= SCROLLBAR_HOVER_ZONE,
    })
  }

  return (
    <ScrollAreaPrimitive.Root
      ref={rootRef}
      data-slot="scroll-area"
      data-v-hovered={hoveredEdges.vertical ? 'true' : 'false'}
      data-h-hovered={hoveredEdges.horizontal ? 'true' : 'false'}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => updateHoveredEdges(NO_HOVERED_EDGES)}
      className={cn('group/scroll-area relative', className)}
      style={{ '--scroll-area-height': `${height}px`, ...style } as React.CSSProperties}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollBar orientation="horizontal" />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

function ScrollBar({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        'group/scrollbar flex cursor-default touch-none select-none',
        orientation === 'vertical'
          ? 'h-full w-1.5 border-l border-l-transparent'
          : 'h-1.5 flex-col border-t border-t-transparent',
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className={cn(
          'relative flex-1 cursor-default rounded-full bg-transparent transition-colors',
          'group-hover/scrollbar:bg-muted-foreground/40 group-active/scrollbar:bg-muted-foreground/70! active:bg-muted-foreground/70!',
          orientation === 'vertical'
            ? 'group-data-[v-hovered=true]/scroll-area:bg-muted-foreground/40'
            : 'group-data-[h-hovered=true]/scroll-area:bg-muted-foreground/40',
        )}
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
}

export { ScrollArea, ScrollBar }
