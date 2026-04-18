import './EyebrowLabel.css'

interface EyebrowLabelProps {
  children: React.ReactNode
  className?: string
}

const eyebrowStyles: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: '500',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
}

export default function EyebrowLabel({ children, className = '' }: EyebrowLabelProps) {
  return (
    <div className={`eyebrow-label ${className}`} style={eyebrowStyles}>
      {typeof children === 'string' ? children.toUpperCase() : children}
    </div>
  )
}
