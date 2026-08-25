import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from 'react'
import { joinClassNames } from '../../utils/join-class-names'
import styles from './filter-popover.module.css'

export function FilterPopover({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [thumb, setThumb] = useState({ visible: false, height: 0, top: 0 })

  useEffect(() => {
    const scrollArea = scrollRef.current
    if (!scrollArea) return

    const updateThumb = () => {
      const { clientHeight, scrollHeight, scrollTop } = scrollArea
      if (scrollHeight <= clientHeight) {
        setThumb({ visible: false, height: 0, top: 0 })
        return
      }

      const height = Math.max(20, clientHeight * clientHeight / scrollHeight)
      const top = scrollTop / (scrollHeight - clientHeight) * (clientHeight - height)
      setThumb({ visible: true, height, top })
    }

    updateThumb()
    scrollArea.addEventListener('scroll', updateThumb, { passive: true })
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateThumb)
    observer?.observe(scrollArea)
    for (const child of scrollArea.children) observer?.observe(child)
    window.addEventListener('resize', updateThumb)

    return () => {
      scrollArea.removeEventListener('scroll', updateThumb)
      observer?.disconnect()
      window.removeEventListener('resize', updateThumb)
    }
  }, [children])

  return (
    <div className={joinClassNames(styles.popover, className)} {...props}>
      <div className={styles.scrollArea} ref={scrollRef}>{children}</div>
      {thumb.visible ? (
        <span className={styles.scrollbar} aria-hidden="true">
          <span className={styles.thumb} style={{ height: thumb.height, transform: `translateY(${thumb.top}px)` }} />
        </span>
      ) : null}
    </div>
  )
}
