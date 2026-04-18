import { CornerMark } from './CornerMark'
import './Sidebar.css'

interface SidebarProps {
  children?: React.ReactNode
  footer?: React.ReactNode
}

export default function Sidebar({ children, footer }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <CornerMark />
      </div>

      {children && (
        <div className="sidebar__content">
          {children}
        </div>
      )}

      {footer && (
        <div className="sidebar__footer">
          {footer}
        </div>
      )}
    </aside>
  )
}
