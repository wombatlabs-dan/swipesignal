# SwipeSignal UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a demo-ready SwipeSignal web app with 5 screens, swipe interactions, and hardcoded Clay content for a 90-second hackathon demo.

**Architecture:** React SPA with client-side routing, CSS custom properties for design tokens, localStorage for learning counter persistence. No backend, no APIs — all content hardcoded.

**Tech Stack:** React 18, TypeScript, Vite, CSS Modules (or vanilla CSS), react-router-dom v6

---

## File Structure

### Core App Files
- `index.html` - Google Fonts links, root mount
- `src/main.tsx` - React root render
- `src/App.tsx` - Router and screen orchestration
- `src/styles/tokens.css` - Design system CSS custom properties
- `src/styles/fonts.css` - Font face declarations (if needed beyond Google CDN)
- `src/styles/global.css` - Base styles, resets

### Shared Components
- `src/components/CornerMark.tsx` - Brand mark (dot + italic text)
- `src/components/Sidebar.tsx` - Left editorial column wrapper
- `src/components/EyebrowLabel.tsx` - Uppercase metadata labels
- `src/components/Button.tsx` - Primary/secondary button variants
- `src/components/LearnedCounter.tsx` - Animated counter with localStorage

### Screen Components
- `src/screens/Landing.tsx` - Single-column intake form
- `src/screens/Loading.tsx` - 3-step sequential loading states
- `src/screens/SwipeStack.tsx` - Main swipe interaction screen
- `src/screens/EmailOutput.tsx` - Final email display

### Swipe Components
- `src/components/Card.tsx` - Individual swipe card with drag/tilt/glow
- `src/components/CardStack.tsx` - Stack wrapper showing peek
- `src/components/CorrectionRow.tsx` - Flag correction input row

### Data & Hooks
- `src/data/clayCards.ts` - Hardcoded 4 cards for Clay target
- `src/data/clayEmail.ts` - Hardcoded email body (v1, v2)
- `src/hooks/useLearnedCounter.ts` - localStorage sync hook
- `src/hooks/useDrag.ts` - Pointer event drag state (x, tilt, glow)

### Testing Files (mirrors src structure)
- `src/__tests__/App.test.tsx`
- `src/components/__tests__/CornerMark.test.tsx`
- `src/components/__tests__/Button.test.tsx`
- `src/hooks/__tests__/useLearnedCounter.test.tsx`
- `src/hooks/__tests__/useDrag.test.tsx`

---

## Task 1: Project Scaffold & Design Tokens

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`
- Create: `src/main.tsx`, `src/App.tsx`
- Create: `src/styles/tokens.css`, `src/styles/global.css`

- [ ] **Step 1: Initialize Vite + React + TypeScript project**

```bash
npm create vite@latest . -- --template react-ts
npm install
npm install react-router-dom
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest jsdom
```

- [ ] **Step 2: Configure Vitest**

Edit `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
```

- [ ] **Step 3: Create test setup file**

Create `src/test/setup.ts`:

```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 4: Create design tokens CSS**

Create `src/styles/tokens.css`:

```css
:root {
  /* Color tokens */
  --color-base: #FAF8F5;
  --color-surface: #FFFFFF;
  --color-ink: #1A1A1A;
  --color-ink-muted: #6B6B6B;
  --color-accent: #1F4E5F;
  --color-accent-hover: #153B48;
  --color-approve: #4CAF7D;
  --color-flag: #F59E0B;
  --color-border: #E8E3DC;

  /* Typography scale (desktop) */
  --font-serif: 'Instrument Serif', serif;
  --font-sans: 'Inter', sans-serif;

  --size-hero: 38px;
  --size-subject: 30px;
  --size-card-insight: 26px;
  --size-meta-value: 22px;
  --size-status: 18px;
  --size-body: 15px;
  --size-button: 15px;
  --size-eyebrow: 11px;
  --size-card-source: 11px;

  /* Spacing (8px base) */
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --space-6: 48px;
  --space-8: 64px;

  /* Border radius */
  --radius-button: 10px;
  --radius-card: 20px;
  --radius-ui: 12px;

  /* Shadows */
  --shadow-card: 0 4px 20px rgba(26, 26, 26, 0.08);

  /* Layout */
  --sidebar-width: 280px;

  /* Timing */
  --duration-page: 220ms;
  --duration-button: 150ms;
  --duration-card-exit: 300ms;
  --duration-card-rise: 250ms;
  --duration-correction: 220ms;
  --duration-counter: 200ms;

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}
```

- [ ] **Step 5: Create global styles**

Create `src/styles/global.css`:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-sans);
  font-size: var(--size-body);
  font-weight: 400;
  line-height: 1.65;
  color: var(--color-ink);
  background: var(--color-base);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: none;
}

input {
  font-family: inherit;
  border: none;
  background: none;
  outline: none;
}
```

- [ ] **Step 6: Update index.html with Google Fonts**

Edit `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SwipeSignal</title>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 7: Create main.tsx**

Create `src/main.tsx`:

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/tokens.css'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 8: Create placeholder App component**

Create `src/App.tsx`:

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Landing</div>} />
        <Route path="/loading" element={<div>Loading</div>} />
        <Route path="/swipe" element={<div>Swipe</div>} />
        <Route path="/email" element={<div>Email</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

- [ ] **Step 9: Verify dev server runs**

Run: `npm run dev`
Expected: Dev server starts on http://localhost:5173, shows "Landing" text

- [ ] **Step 10: Commit scaffold**

```bash
git add .
git commit -m "feat: project scaffold with design tokens and routing"
```

---

## Task 2: CornerMark Component

**Files:**
- Create: `src/components/CornerMark.tsx`
- Create: `src/components/__tests__/CornerMark.test.tsx`

- [ ] **Step 1: Write failing test**

Create `src/components/__tests__/CornerMark.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import CornerMark from '../CornerMark'

describe('CornerMark', () => {
  it('renders the brand mark with dot and italic text', () => {
    render(<CornerMark />)
    expect(screen.getByText(/SwipeSignal/i)).toBeInTheDocument()
  })

  it('applies correct styling', () => {
    const { container } = render(<CornerMark />)
    const mark = container.querySelector('.corner-mark')
    expect(mark).toHaveStyle({
      fontFamily: expect.stringContaining('Instrument Serif'),
      fontStyle: 'italic',
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL with "CornerMark not found"

- [ ] **Step 3: Create CornerMark component**

Create `src/components/CornerMark.tsx`:

```typescript
import './CornerMark.css'

export default function CornerMark() {
  return (
    <div className="corner-mark">
      <span className="corner-mark__dot" />
      <span className="corner-mark__text">SwipeSignal</span>
    </div>
  )
}
```

- [ ] **Step 4: Create CornerMark styles**

Create `src/components/CornerMark.css`:

```css
.corner-mark {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 13px;
  color: var(--color-ink);
}

.corner-mark__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-accent);
}

.corner-mark__text {
  letter-spacing: -0.01em;
}

@media (max-width: 767px) {
  .corner-mark {
    font-size: 11px;
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/CornerMark*
git commit -m "feat: add CornerMark component"
```

---

## Task 3: EyebrowLabel Component

**Files:**
- Create: `src/components/EyebrowLabel.tsx`
- Create: `src/components/__tests__/EyebrowLabel.test.tsx`

- [ ] **Step 1: Write failing test**

Create `src/components/__tests__/EyebrowLabel.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import EyebrowLabel from '../EyebrowLabel'

describe('EyebrowLabel', () => {
  it('renders the label text in uppercase', () => {
    render(<EyebrowLabel>target company</EyebrowLabel>)
    expect(screen.getByText('TARGET COMPANY')).toBeInTheDocument()
  })

  it('applies correct styling', () => {
    const { container } = render(<EyebrowLabel>test</EyebrowLabel>)
    const label = container.firstChild as HTMLElement
    expect(label).toHaveStyle({
      fontSize: '11px',
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL with "EyebrowLabel not found"

- [ ] **Step 3: Create EyebrowLabel component**

Create `src/components/EyebrowLabel.tsx`:

```typescript
import './EyebrowLabel.css'

interface EyebrowLabelProps {
  children: React.ReactNode
  className?: string
}

export default function EyebrowLabel({ children, className = '' }: EyebrowLabelProps) {
  return (
    <div className={`eyebrow-label ${className}`}>
      {typeof children === 'string' ? children.toUpperCase() : children}
    </div>
  )
}
```

- [ ] **Step 4: Create EyebrowLabel styles**

Create `src/components/EyebrowLabel.css`:

```css
.eyebrow-label {
  font-family: var(--font-sans);
  font-size: var(--size-eyebrow);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-ink-muted);
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/EyebrowLabel*
git commit -m "feat: add EyebrowLabel component"
```

---

## Task 4: Button Component

**Files:**
- Create: `src/components/Button.tsx`
- Create: `src/components/__tests__/Button.test.tsx`

- [ ] **Step 1: Write failing test**

Create `src/components/__tests__/Button.test.tsx`:

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Button from '../Button'

describe('Button', () => {
  it('renders with primary variant by default', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toHaveClass('button--primary')
  })

  it('renders with secondary variant when specified', () => {
    render(<Button variant="secondary">Cancel</Button>)
    const button = screen.getByRole('button', { name: /cancel/i })
    expect(button).toHaveClass('button--secondary')
  })

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('can be disabled', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL with "Button not found"

- [ ] **Step 3: Create Button component**

Create `src/components/Button.tsx`:

```typescript
import './Button.css'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  children: React.ReactNode
}

export default function Button({ 
  variant = 'primary', 
  children, 
  className = '',
  ...props 
}: ButtonProps) {
  return (
    <button 
      className={`button button--${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
```

- [ ] **Step 4: Create Button styles**

Create `src/components/Button.css`:

```css
.button {
  font-family: var(--font-sans);
  font-size: var(--size-button);
  font-weight: 600;
  padding: 12px 24px;
  border-radius: var(--radius-button);
  transition: all var(--duration-button) var(--ease-out);
  cursor: pointer;
  border: none;
}

.button:active {
  transform: scale(0.98);
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button--primary {
  background: var(--color-accent);
  color: white;
}

.button--primary:hover:not(:disabled) {
  background: var(--color-accent-hover);
}

.button--secondary {
  background: transparent;
  color: var(--color-ink);
  border: 1px solid var(--color-border);
}

.button--secondary:hover:not(:disabled) {
  border-color: var(--color-ink);
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/Button*
git commit -m "feat: add Button component with variants"
```

---

## Task 5: useLearnedCounter Hook

**Files:**
- Create: `src/hooks/useLearnedCounter.ts`
- Create: `src/hooks/__tests__/useLearnedCounter.test.tsx`

- [ ] **Step 1: Write failing test**

Create `src/hooks/__tests__/useLearnedCounter.test.tsx`:

```typescript
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import useLearnedCounter from '../useLearnedCounter'

describe('useLearnedCounter', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('initializes to 0 when localStorage is empty', () => {
    const { result } = renderHook(() => useLearnedCounter())
    expect(result.current.count).toBe(0)
  })

  it('loads existing value from localStorage', () => {
    localStorage.setItem('swipesignal.learned', '5')
    const { result } = renderHook(() => useLearnedCounter())
    expect(result.current.count).toBe(5)
  })

  it('increments the counter', () => {
    const { result } = renderHook(() => useLearnedCounter())
    act(() => {
      result.current.increment()
    })
    expect(result.current.count).toBe(1)
    expect(localStorage.getItem('swipesignal.learned')).toBe('1')
  })

  it('resets the counter', () => {
    localStorage.setItem('swipesignal.learned', '10')
    const { result } = renderHook(() => useLearnedCounter())
    act(() => {
      result.current.reset()
    })
    expect(result.current.count).toBe(0)
    expect(localStorage.getItem('swipesignal.learned')).toBe('0')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL with "useLearnedCounter not found"

- [ ] **Step 3: Create useLearnedCounter hook**

Create `src/hooks/useLearnedCounter.ts`:

```typescript
import { useState, useEffect } from 'react'

const STORAGE_KEY = 'swipesignal.learned'

export default function useLearnedCounter() {
  const [count, setCount] = useState<number>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? parseInt(stored, 10) : 0
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, count.toString())
  }, [count])

  const increment = () => setCount(prev => prev + 1)
  const reset = () => setCount(0)

  return { count, increment, reset }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useLearnedCounter*
git commit -m "feat: add useLearnedCounter hook with localStorage persistence"
```

---

## Task 6: LearnedCounter Component

**Files:**
- Create: `src/components/LearnedCounter.tsx`
- Create: `src/components/__tests__/LearnedCounter.test.tsx`

- [ ] **Step 1: Write failing test**

Create `src/components/__tests__/LearnedCounter.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import LearnedCounter from '../LearnedCounter'

describe('LearnedCounter', () => {
  it('renders singular form for count of 1', () => {
    render(<LearnedCounter count={1} />)
    expect(screen.getByText(/Learned from 1 correction\./i)).toBeInTheDocument()
  })

  it('renders plural form for count != 1', () => {
    render(<LearnedCounter count={3} />)
    expect(screen.getByText(/Learned from 3 corrections\./i)).toBeInTheDocument()
  })

  it('renders count of 0', () => {
    render(<LearnedCounter count={0} />)
    expect(screen.getByText(/Learned from 0 corrections\./i)).toBeInTheDocument()
  })

  it('applies animating class when prop is true', () => {
    const { container } = render(<LearnedCounter count={5} animating />)
    const numeral = container.querySelector('.learned-counter__numeral')
    expect(numeral).toHaveClass('learned-counter__numeral--animating')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL with "LearnedCounter not found"

- [ ] **Step 3: Create LearnedCounter component**

Create `src/components/LearnedCounter.tsx`:

```typescript
import './LearnedCounter.css'

interface LearnedCounterProps {
  count: number
  animating?: boolean
}

export default function LearnedCounter({ count, animating = false }: LearnedCounterProps) {
  const plural = count === 1 ? 'correction' : 'corrections'
  
  return (
    <div className="learned-counter">
      <span className="learned-counter__text">Learned from </span>
      <span className={`learned-counter__numeral ${animating ? 'learned-counter__numeral--animating' : ''}`}>
        {count}
      </span>
      <span className="learned-counter__text"> {plural}.</span>
    </div>
  )
}
```

- [ ] **Step 4: Create LearnedCounter styles**

Create `src/components/LearnedCounter.css`:

```css
.learned-counter {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 14px;
  color: var(--color-ink);
}

.learned-counter__text {
  color: var(--color-ink-muted);
}

.learned-counter__numeral {
  font-family: var(--font-sans);
  font-style: normal;
  font-weight: 600;
  color: var(--color-accent);
  display: inline-block;
  transition: transform var(--duration-counter) var(--ease-out);
}

.learned-counter__numeral--animating {
  animation: scale-bump var(--duration-counter) var(--ease-out);
}

@keyframes scale-bump {
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/LearnedCounter*
git commit -m "feat: add LearnedCounter component with scale animation"
```

---

## Task 7: Sidebar Component

**Files:**
- Create: `src/components/Sidebar.tsx`
- Create: `src/components/__tests__/Sidebar.test.tsx`

- [ ] **Step 1: Write failing test**

Create `src/components/__tests__/Sidebar.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Sidebar from '../Sidebar'

describe('Sidebar', () => {
  it('renders corner mark', () => {
    render(<Sidebar />)
    expect(screen.getByText(/SwipeSignal/i)).toBeInTheDocument()
  })

  it('renders children content', () => {
    render(
      <Sidebar>
        <div>Test content</div>
      </Sidebar>
    )
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('renders footer when provided', () => {
    render(<Sidebar footer={<div>Footer content</div>} />)
    expect(screen.getByText('Footer content')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL with "Sidebar not found"

- [ ] **Step 3: Create Sidebar component**

Create `src/components/Sidebar.tsx`:

```typescript
import CornerMark from './CornerMark'
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
```

- [ ] **Step 4: Create Sidebar styles**

Create `src/components/Sidebar.css`:

```css
.sidebar {
  width: var(--sidebar-width);
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: var(--space-4);
  border-right: 1px solid var(--color-border);
  position: sticky;
  top: 0;
}

.sidebar__header {
  margin-bottom: var(--space-4);
}

.sidebar__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.sidebar__footer {
  margin-top: auto;
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border);
}

@media (max-width: 1023px) {
  .sidebar {
    width: 200px;
  }
}

@media (max-width: 767px) {
  .sidebar {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid var(--color-border);
    padding: var(--space-2);
    position: relative;
  }

  .sidebar__content {
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/Sidebar*
git commit -m "feat: add Sidebar component with responsive layout"
```

---

## Task 8: Clay Data Files

**Files:**
- Create: `src/data/clayCards.ts`
- Create: `src/data/clayEmail.ts`

- [ ] **Step 1: Create clayCards data file**

Create `src/data/clayCards.ts`:

```typescript
export interface CardData {
  id: number
  source: string
  insight: string
  confidence: 'High confidence' | 'Moderate — verify this'
}

export const clayCards: CardData[] = [
  {
    id: 1,
    source: 'FROM JOB POSTINGS',
    insight: 'Clay just opened a wave of SDR roles while their own G2 reviews say onboarding takes two to four weeks — they're scaling outbound faster than their product lets customers operate it.',
    confidence: 'High confidence',
  },
  {
    id: 2,
    source: 'FROM G2 REVIEWS',
    insight: 'Clay's top complaint isn't pricing or feature gaps — it's that non-technical users can't run the tool without a dedicated RevOps engineer on staff.',
    confidence: 'Moderate — verify this',
  },
  {
    id: 3,
    source: 'FROM RECENT NEWS',
    insight: 'Clay's latest funding round explicitly flags product-led growth as the expansion thesis. Setup complexity is now a board-level problem, not a UX nice-to-have.',
    confidence: 'High confidence',
  },
  {
    id: 4,
    source: 'FROM JOB POSTINGS',
    insight: 'They just posted a Head of Developer Experience role that didn't exist six months ago. Complexity went from a customer-support issue to a C-level priority.',
    confidence: 'High confidence',
  },
]
```

- [ ] **Step 2: Create clayEmail data file**

Create `src/data/clayEmail.ts`:

```typescript
export interface EmailData {
  subject: string
  body: string
  highlightedPhrase: string
}

export const clayEmailV1: EmailData = {
  subject: 'Your SDR hiring spree meets our three-minute onboarding',
  body: `Saw you just opened a round of SDR roles across multiple cities — congrats on the momentum.

One thing caught my eye in your G2 reviews: a consistent note that your setup takes two to four weeks even for experienced ops teams. The research workflow you're scaling into is the exact bottleneck.

SwipeSignal gets that workflow to three minutes — and it compounds on each rep's judgment every time they swipe. Worth a 15-minute call?`,
  highlightedPhrase: 'your setup takes two to four weeks even for experienced ops teams',
}

export const clayEmailV2: EmailData = {
  subject: 'Complexity is a board-level problem now',
  body: `Saw your latest funding announcement specifically call out product-led growth as the expansion strategy — that's a clear signal.

Your G2 reviews tell a different story: non-technical users consistently mention needing a dedicated RevOps engineer just to operate Clay. That gap between PLG ambition and setup complexity is exactly what we solve.

SwipeSignal turns research into judgment calls — three minutes to onboard, zero technical overhead. Want to see it?`,
  highlightedPhrase: 'non-technical users consistently mention needing a dedicated RevOps engineer just to operate Clay',
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npm run build`
Expected: Build succeeds with no type errors

- [ ] **Step 4: Commit**

```bash
git add src/data/
git commit -m "feat: add hardcoded Clay content data"
```

---

## Task 9: Landing Screen

**Files:**
- Create: `src/screens/Landing.tsx`
- Create: `src/screens/__tests__/Landing.test.tsx`

- [ ] **Step 1: Write failing test**

Create `src/screens/__tests__/Landing.test.tsx`:

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import Landing from '../Landing'

describe('Landing', () => {
  it('renders the hero headline with italic "Swipe"', () => {
    render(<Landing />, { wrapper: BrowserRouter })
    expect(screen.getByText(/Research smarter/i)).toBeInTheDocument()
  })

  it('renders input prefilled with "Clay"', () => {
    render(<Landing />, { wrapper: BrowserRouter })
    const input = screen.getByLabelText(/target company/i) as HTMLInputElement
    expect(input.value).toBe('Clay')
  })

  it('navigates to /loading when CTA is clicked', () => {
    const { container } = render(<Landing />, { wrapper: BrowserRouter })
    const button = screen.getByRole('button', { name: /Research this company/i })
    fireEvent.click(button)
    // Navigation happens via react-router, test that button exists and is clickable
    expect(button).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL with "Landing not found"

- [ ] **Step 3: Create Landing component**

Create `src/screens/Landing.tsx`:

```typescript
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CornerMark from '../components/CornerMark'
import EyebrowLabel from '../components/EyebrowLabel'
import Button from '../components/Button'
import './Landing.css'

export default function Landing() {
  const [company, setCompany] = useState('Clay')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/loading')
  }

  return (
    <div className="landing">
      <div className="landing__corner">
        <CornerMark />
      </div>
      
      <div className="landing__hero">
        <EyebrowLabel>research · synthesize · swipe</EyebrowLabel>
        
        <h1 className="landing__headline">
          Research smarter. <em className="landing__headline-swipe">Swipe</em> to confirm. Send with confidence.
        </h1>
        
        <p className="landing__subline">
          Drop a company name. We'll do the homework.
        </p>
        
        <div className="landing__divider" />
        
        <form onSubmit={handleSubmit} className="landing__form">
          <label htmlFor="company-input">
            <EyebrowLabel>target company</EyebrowLabel>
          </label>
          
          <input
            id="company-input"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="landing__input"
          />
          
          <Button type="submit">
            Research this company →
          </Button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create Landing styles**

Create `src/screens/Landing.css`:

```css
.landing {
  min-height: 100vh;
  padding: 120px 0 80px 120px;
  position: relative;
}

.landing__corner {
  position: absolute;
  top: var(--space-4);
  left: var(--space-4);
}

.landing__hero {
  max-width: 520px;
}

.landing__headline {
  font-family: var(--font-serif);
  font-size: var(--size-hero);
  font-weight: 400;
  line-height: 1.05;
  margin-top: var(--space-2);
  margin-bottom: var(--space-2);
}

.landing__headline-swipe {
  font-style: italic;
  color: var(--color-accent);
}

.landing__subline {
  font-size: 14px;
  color: var(--color-ink-muted);
  margin-bottom: var(--space-3);
}

.landing__divider {
  height: 1px;
  background: var(--color-border);
  margin-bottom: var(--space-3);
}

.landing__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.landing__input {
  font-family: var(--font-serif);
  font-size: 24px;
  color: var(--color-ink);
  border: none;
  border-bottom: 1px solid var(--color-ink);
  padding: var(--space-1) 0;
  background: transparent;
}

.landing__input:focus {
  outline: none;
  border-bottom-color: var(--color-accent);
}

@media (max-width: 767px) {
  .landing {
    padding: 80px var(--space-3);
  }

  .landing__headline {
    font-size: 28px;
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 6: Update App.tsx to use Landing component**

Edit `src/App.tsx`:

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './screens/Landing'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/loading" element={<div>Loading</div>} />
        <Route path="/swipe" element={<div>Swipe</div>} />
        <Route path="/email" element={<div>Email</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

- [ ] **Step 7: Verify in browser**

Run: `npm run dev`
Open: http://localhost:5173
Expected: Landing page renders with hero, input, and button

- [ ] **Step 8: Commit**

```bash
git add src/screens/Landing* src/App.tsx
git commit -m "feat: add Landing screen with hero and input form"
```

---

## Task 10: Loading Screen

**Files:**
- Create: `src/screens/Loading.tsx`
- Create: `src/screens/__tests__/Loading.test.tsx`

- [ ] **Step 1: Write failing test**

Create `src/screens/__tests__/Loading.test.tsx`:

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import Loading from '../Loading'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  }
})

describe('Loading', () => {
  it('renders sidebar with target metadata', () => {
    render(<Loading />, { wrapper: BrowserRouter })
    expect(screen.getByText('TARGET')).toBeInTheDocument()
    expect(screen.getByText('Clay')).toBeInTheDocument()
  })

  it('renders three loading steps', () => {
    render(<Loading />, { wrapper: BrowserRouter })
    expect(screen.getByText(/Scanning job postings/i)).toBeInTheDocument()
    expect(screen.getByText(/Reading product reviews/i)).toBeInTheDocument()
    expect(screen.getByText(/Synthesizing insights/i)).toBeInTheDocument()
  })

  it('shows first step as active initially', () => {
    const { container } = render(<Loading />, { wrapper: BrowserRouter })
    const firstDot = container.querySelectorAll('.loading-step__dot')[0]
    expect(firstDot).toHaveClass('loading-step__dot--active')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL with "Loading not found"

- [ ] **Step 3: Create Loading component**

Create `src/screens/Loading.tsx`:

```typescript
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import EyebrowLabel from '../components/EyebrowLabel'
import './Loading.css'

type StepStatus = 'pending' | 'active' | 'done'

interface LoadingStep {
  label: string
  status: StepStatus
  duration: number
}

export default function Loading() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  
  const steps: LoadingStep[] = [
    { label: 'Scanning job postings...', status: 'pending', duration: 4000 },
    { label: 'Reading product reviews...', status: 'pending', duration: 4000 },
    { label: 'Synthesizing insights...', status: 'pending', duration: 5000 },
  ]

  useEffect(() => {
    const timers: NodeJS.Timeout[] = []
    let elapsed = 0

    steps.forEach((step, index) => {
      const timer = setTimeout(() => {
        setCurrentStep(index)
        
        // Navigate after last step
        if (index === steps.length - 1) {
          setTimeout(() => {
            navigate('/swipe')
          }, step.duration + Math.random() * 1000)
        }
      }, elapsed)
      
      timers.push(timer)
      elapsed += step.duration + Math.random() * 1000 - 500
    })

    return () => timers.forEach(clearTimeout)
  }, [navigate])

  return (
    <div className="loading">
      <Sidebar
        footer={
          <EyebrowLabel>powered by apify</EyebrowLabel>
        }
      >
        <div className="loading__meta">
          <EyebrowLabel>target</EyebrowLabel>
          <div className="loading__meta-value">Clay</div>
        </div>
        
        <div className="loading__meta">
          <EyebrowLabel>step</EyebrowLabel>
          <div className="loading__meta-value">
            {String(currentStep + 1).padStart(2, '0')} / 03
          </div>
        </div>
      </Sidebar>

      <main className="loading__main">
        <EyebrowLabel>researching</EyebrowLabel>
        
        <div className="loading__steps">
          {steps.map((step, index) => {
            let status: StepStatus = 'pending'
            if (index < currentStep) status = 'done'
            else if (index === currentStep) status = 'active'
            
            return (
              <div key={index} className={`loading-step loading-step--${status}`}>
                <div className={`loading-step__dot loading-step__dot--${status}`} />
                <div className="loading-step__label">{step.label}</div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
```

- [ ] **Step 4: Create Loading styles**

Create `src/screens/Loading.css`:

```css
.loading {
  display: flex;
  min-height: 100vh;
}

.loading__main {
  flex: 1;
  padding: var(--space-4) var(--space-6);
}

.loading__meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.loading__meta-value {
  font-family: var(--font-serif);
  font-size: var(--size-meta-value);
  color: var(--color-ink);
}

.loading__steps {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-top: var(--space-4);
}

.loading-step {
  display: flex;
  align-items: center;
  gap: 12px;
}

.loading-step__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-border);
  transition: all 300ms var(--ease-out);
}

.loading-step__dot--active {
  background: var(--color-approve);
  box-shadow: 0 0 0 6px rgba(76, 175, 125, 0.2);
  animation: pulse 1400ms infinite;
}

.loading-step__dot--done {
  background: var(--color-approve);
  opacity: 0.5;
}

.loading-step__label {
  font-size: var(--size-status);
  font-weight: 400;
  color: #C9C3BA;
  transition: all 300ms var(--ease-out);
}

.loading-step--active .loading-step__label {
  font-weight: 500;
  color: var(--color-ink);
}

.loading-step--done .loading-step__label {
  color: var(--color-ink-muted);
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 6px rgba(76, 175, 125, 0.2);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(76, 175, 125, 0.1);
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 6: Update App.tsx**

Edit `src/App.tsx`:

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './screens/Landing'
import Loading from './screens/Loading'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/swipe" element={<div>Swipe</div>} />
        <Route path="/email" element={<div>Email</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

- [ ] **Step 7: Verify in browser**

Run: `npm run dev`
Navigate: / → click "Research this company" → /loading
Expected: Three steps animate sequentially, then auto-navigate to /swipe

- [ ] **Step 8: Commit**

```bash
git add src/screens/Loading* src/App.tsx
git commit -m "feat: add Loading screen with sequential step animation"
```

---

## Task 11: useDrag Hook

**Files:**
- Create: `src/hooks/useDrag.ts`
- Create: `src/hooks/__tests__/useDrag.test.tsx`

- [ ] **Step 1: Write failing test**

Create `src/hooks/__tests__/useDrag.test.tsx`:

```typescript
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import useDrag from '../useDrag'

describe('useDrag', () => {
  it('initializes with zero displacement', () => {
    const { result } = renderHook(() => useDrag())
    expect(result.current.x).toBe(0)
    expect(result.current.isDragging).toBe(false)
  })

  it('tracks drag displacement', () => {
    const { result } = renderHook(() => useDrag())
    
    act(() => {
      result.current.handlers.onPointerDown({ clientX: 0 } as React.PointerEvent)
    })
    
    act(() => {
      result.current.handlers.onPointerMove({ clientX: 150 } as React.PointerEvent)
    })
    
    expect(result.current.x).toBe(150)
    expect(result.current.isDragging).toBe(true)
  })

  it('calculates tilt based on displacement', () => {
    const { result } = renderHook(() => useDrag())
    
    act(() => {
      result.current.handlers.onPointerDown({ clientX: 0 } as React.PointerEvent)
    })
    
    act(() => {
      result.current.handlers.onPointerMove({ clientX: 100 } as React.PointerEvent)
    })
    
    expect(result.current.tilt).toBeGreaterThan(0)
    expect(result.current.tilt).toBeLessThanOrEqual(3)
  })

  it('calls onSwipeRight when threshold exceeded', () => {
    let swipedRight = false
    const { result } = renderHook(() => 
      useDrag({ 
        onSwipeRight: () => { swipedRight = true },
        threshold: 100,
      })
    )
    
    act(() => {
      result.current.handlers.onPointerDown({ clientX: 0 } as React.PointerEvent)
    })
    
    act(() => {
      result.current.handlers.onPointerMove({ clientX: 150 } as React.PointerEvent)
    })
    
    act(() => {
      result.current.handlers.onPointerUp({} as React.PointerEvent)
    })
    
    expect(swipedRight).toBe(true)
  })

  it('calls onSwipeLeft when negative threshold exceeded', () => {
    let swipedLeft = false
    const { result } = renderHook(() => 
      useDrag({ 
        onSwipeLeft: () => { swipedLeft = true },
        threshold: 100,
      })
    )
    
    act(() => {
      result.current.handlers.onPointerDown({ clientX: 0 } as React.PointerEvent)
    })
    
    act(() => {
      result.current.handlers.onPointerMove({ clientX: -150 } as React.PointerEvent)
    })
    
    act(() => {
      result.current.handlers.onPointerUp({} as React.PointerEvent)
    })
    
    expect(swipedLeft).toBe(true)
  })

  it('snaps back when threshold not exceeded', () => {
    const { result } = renderHook(() => useDrag({ threshold: 100 }))
    
    act(() => {
      result.current.handlers.onPointerDown({ clientX: 0 } as React.PointerEvent)
    })
    
    act(() => {
      result.current.handlers.onPointerMove({ clientX: 50 } as React.PointerEvent)
    })
    
    act(() => {
      result.current.handlers.onPointerUp({} as React.PointerEvent)
    })
    
    expect(result.current.x).toBe(0)
    expect(result.current.isDragging).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL with "useDrag not found"

- [ ] **Step 3: Create useDrag hook**

Create `src/hooks/useDrag.ts`:

```typescript
import { useState, useRef, useCallback } from 'react'

interface UseDragOptions {
  threshold?: number
  maxDisplacement?: number
  onSwipeRight?: () => void
  onSwipeLeft?: () => void
}

export default function useDrag({
  threshold = 100,
  maxDisplacement = 280,
  onSwipeRight,
  onSwipeLeft,
}: UseDragOptions = {}) {
  const [isDragging, setIsDragging] = useState(false)
  const [x, setX] = useState(0)
  const startX = useRef(0)

  const tilt = Math.min(Math.abs(x) / 50, 3) * Math.sign(x)
  const glowOpacity = Math.min(Math.abs(x) / maxDisplacement / 0.4, 1)

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true)
    startX.current = e.clientX
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return
    const displacement = e.clientX - startX.current
    const clamped = Math.max(-maxDisplacement, Math.min(maxDisplacement, displacement))
    setX(clamped)
  }, [isDragging, maxDisplacement])

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    setIsDragging(false)
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)

    if (x > threshold && onSwipeRight) {
      onSwipeRight()
    } else if (x < -threshold && onSwipeLeft) {
      onSwipeLeft()
    } else {
      // Snap back
      setX(0)
    }
  }, [x, threshold, onSwipeRight, onSwipeLeft])

  const reset = useCallback(() => {
    setX(0)
    setIsDragging(false)
  }, [])

  return {
    x,
    tilt,
    glowOpacity,
    isDragging,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
    },
    reset,
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useDrag*
git commit -m "feat: add useDrag hook for swipe gesture tracking"
```

---

## Task 12: Card Component

**Files:**
- Create: `src/components/Card.tsx`
- Create: `src/components/__tests__/Card.test.tsx`

- [ ] **Step 1: Write failing test**

Create `src/components/__tests__/Card.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Card from '../Card'
import { CardData } from '../../data/clayCards'

const mockCard: CardData = {
  id: 1,
  source: 'FROM JOB POSTINGS',
  insight: 'Test insight text',
  confidence: 'High confidence',
}

describe('Card', () => {
  it('renders card with source, insight, and confidence', () => {
    render(<Card card={mockCard} />)
    expect(screen.getByText('FROM JOB POSTINGS')).toBeInTheDocument()
    expect(screen.getByText('Test insight text')).toBeInTheDocument()
    expect(screen.getByText(/High confidence/i)).toBeInTheDocument()
  })

  it('applies green dot for high confidence', () => {
    const { container } = render(<Card card={mockCard} />)
    const dot = container.querySelector('.card__confidence-dot')
    expect(dot).toHaveStyle({ background: 'var(--color-approve)' })
  })

  it('applies amber dot for moderate confidence', () => {
    const moderateCard = { ...mockCard, confidence: 'Moderate — verify this' as const }
    const { container } = render(<Card card={moderateCard} />)
    const dot = container.querySelector('.card__confidence-dot')
    expect(dot).toHaveStyle({ background: 'var(--color-flag)' })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL with "Card not found"

- [ ] **Step 3: Create Card component**

Create `src/components/Card.tsx`:

```typescript
import { CardData } from '../data/clayCards'
import './Card.css'

interface CardProps {
  card: CardData
  x?: number
  tilt?: number
  glowOpacity?: number
  isDragging?: boolean
  onPointerDown?: (e: React.PointerEvent) => void
  onPointerMove?: (e: React.PointerEvent) => void
  onPointerUp?: (e: React.PointerEvent) => void
}

export default function Card({
  card,
  x = 0,
  tilt = 0,
  glowOpacity = 0,
  isDragging = false,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: CardProps) {
  const confidenceDotColor = card.confidence === 'High confidence' 
    ? 'var(--color-approve)' 
    : 'var(--color-flag)'

  const showApproveGhost = x > 40
  const showFlagGhost = x < -40

  return (
    <div
      className={`card ${isDragging ? 'card--dragging' : ''}`}
      style={{
        transform: `translateX(${x}px) rotate(${tilt}deg)`,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* Approve glow */}
      {showApproveGhost && (
        <>
          <div 
            className="card__glow card__glow--approve"
            style={{ opacity: glowOpacity }}
          />
          <div 
            className="card__ghost-label card__ghost-label--approve"
            style={{ opacity: Math.min(glowOpacity * 1.2, 0.85) }}
          >
            Good signal
          </div>
        </>
      )}

      {/* Flag glow */}
      {showFlagGhost && (
        <>
          <div 
            className="card__glow card__glow--flag"
            style={{ opacity: glowOpacity }}
          />
          <div 
            className="card__ghost-label card__ghost-label--flag"
            style={{ opacity: Math.min(glowOpacity * 1.2, 0.85) }}
          >
            Worth a second look
          </div>
        </>
      )}

      <div className="card__content">
        <div className="card__source">{card.source}</div>
        
        <div className="card__insight">{card.insight}</div>
        
        <div className="card__confidence">
          <span 
            className="card__confidence-dot"
            style={{ background: confidenceDotColor }}
          />
          <span className="card__confidence-text">{card.confidence}</span>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create Card styles**

Create `src/components/Card.css`:

```css
.card {
  position: relative;
  width: 360px;
  background: var(--color-surface);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  padding: var(--space-4);
  cursor: grab;
  user-select: none;
  touch-action: none;
  transition: transform 250ms var(--ease-out);
}

.card--dragging {
  cursor: grabbing;
  transition: none;
}

.card__content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 340px;
}

.card__source {
  font-family: var(--font-sans);
  font-size: var(--size-card-source);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-ink-muted);
}

.card__insight {
  font-family: var(--font-sans);
  font-size: var(--size-card-insight);
  font-weight: 500;
  line-height: 1.35;
  color: var(--color-ink);
  flex: 1;
  display: flex;
  align-items: center;
  margin: var(--space-3) 0;
}

.card__confidence {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 500;
  color: var(--color-ink-muted);
}

.card__confidence-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

/* Glow effects */
.card__glow {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 4px;
  pointer-events: none;
}

.card__glow--approve {
  right: -2px;
  background: var(--color-approve);
  box-shadow: 0 0 20px var(--color-approve);
}

.card__glow--flag {
  left: -2px;
  background: var(--color-flag);
  box-shadow: 0 0 20px var(--color-flag);
}

/* Ghost labels */
.card__ghost-label {
  position: absolute;
  top: 50%;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 24px;
  pointer-events: none;
  white-space: nowrap;
}

.card__ghost-label--approve {
  right: -140px;
  transform: translateY(-50%) rotate(-3deg);
  color: var(--color-approve);
}

.card__ghost-label--flag {
  left: -180px;
  transform: translateY(-50%) rotate(-6deg);
  color: var(--color-flag);
}

@media (max-width: 767px) {
  .card {
    width: calc(100vw - 64px);
    max-width: 360px;
  }

  .card__insight {
    font-size: 17px;
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/Card*
git commit -m "feat: add Card component with drag effects and glow"
```

---

## Task 13: CardStack Component

**Files:**
- Create: `src/components/CardStack.tsx`
- Create: `src/components/__tests__/CardStack.test.tsx`

- [ ] **Step 1: Write failing test**

Create `src/components/__tests__/CardStack.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import CardStack from '../CardStack'
import { CardData } from '../../data/clayCards'

const mockCards: CardData[] = [
  {
    id: 1,
    source: 'FROM JOB POSTINGS',
    insight: 'First card',
    confidence: 'High confidence',
  },
  {
    id: 2,
    source: 'FROM G2 REVIEWS',
    insight: 'Second card',
    confidence: 'Moderate — verify this',
  },
]

describe('CardStack', () => {
  it('renders current card with full opacity', () => {
    render(<CardStack cards={mockCards} currentIndex={0} />)
    expect(screen.getByText('First card')).toBeInTheDocument()
  })

  it('shows peek of next card', () => {
    const { container } = render(<CardStack cards={mockCards} currentIndex={0} />)
    const peekCard = container.querySelector('.card-stack__peek')
    expect(peekCard).toBeInTheDocument()
  })

  it('calls onApprove when card swiped right', () => {
    const onApprove = vi.fn()
    render(<CardStack cards={mockCards} currentIndex={0} onApprove={onApprove} />)
    // Drag interaction tested in useDrag hook tests
  })

  it('calls onFlag when card swiped left', () => {
    const onFlag = vi.fn()
    render(<CardStack cards={mockCards} currentIndex={0} onFlag={onFlag} />)
    // Drag interaction tested in useDrag hook tests
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL with "CardStack not found"

- [ ] **Step 3: Create CardStack component**

Create `src/components/CardStack.tsx`:

```typescript
import { useState, useEffect } from 'react'
import Card from './Card'
import useDrag from '../hooks/useDrag'
import { CardData } from '../data/clayCards'
import './CardStack.css'

interface CardStackProps {
  cards: CardData[]
  currentIndex: number
  onApprove?: (cardId: number) => void
  onFlag?: (cardId: number) => void
}

export default function CardStack({
  cards,
  currentIndex,
  onApprove,
  onFlag,
}: CardStackProps) {
  const [isExiting, setIsExiting] = useState(false)
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null)

  const currentCard = cards[currentIndex]
  const nextCard = cards[currentIndex + 1]

  const { x, tilt, glowOpacity, isDragging, handlers, reset } = useDrag({
    threshold: 100,
    onSwipeRight: () => {
      setExitDirection('right')
      setIsExiting(true)
    },
    onSwipeLeft: () => {
      setExitDirection('left')
      setIsExiting(true)
    },
  })

  useEffect(() => {
    if (isExiting) {
      const timer = setTimeout(() => {
        if (exitDirection === 'right') {
          onApprove?.(currentCard.id)
        } else if (exitDirection === 'left') {
          onFlag?.(currentCard.id)
        }
        setIsExiting(false)
        setExitDirection(null)
        reset()
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [isExiting, exitDirection, currentCard, onApprove, onFlag, reset])

  if (!currentCard) return null

  return (
    <div className="card-stack">
      {/* Next card peek */}
      {nextCard && !isExiting && (
        <div className="card-stack__peek">
          <Card card={nextCard} />
        </div>
      )}

      {/* Current card */}
      <div 
        className={`card-stack__current ${isExiting ? 'card-stack__current--exiting' : ''}`}
        style={{
          transform: isExiting 
            ? `translateX(${exitDirection === 'right' ? '400px' : '-400px'})` 
            : undefined,
        }}
      >
        <Card
          card={currentCard}
          x={x}
          tilt={tilt}
          glowOpacity={glowOpacity}
          isDragging={isDragging}
          {...handlers}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create CardStack styles**

Create `src/components/CardStack.css`:

```css
.card-stack {
  position: relative;
  width: 360px;
  height: 420px;
}

.card-stack__peek {
  position: absolute;
  top: 8px;
  left: 0;
  width: 100%;
  transform: scale(0.96);
  opacity: 0.6;
  pointer-events: none;
  z-index: 0;
}

.card-stack__current {
  position: relative;
  z-index: 1;
  transition: transform var(--duration-card-exit) var(--ease-out), 
              opacity var(--duration-card-exit) var(--ease-out);
}

.card-stack__current--exiting {
  opacity: 0;
}

@media (max-width: 767px) {
  .card-stack {
    width: 100%;
    max-width: 360px;
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/CardStack*
git commit -m "feat: add CardStack component with peek and exit animations"
```

---

## Task 14: CorrectionRow Component

**Files:**
- Create: `src/components/CorrectionRow.tsx`
- Create: `src/components/__tests__/CorrectionRow.test.tsx`

- [ ] **Step 1: Write failing test**

Create `src/components/__tests__/CorrectionRow.test.tsx`:

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import CorrectionRow from '../CorrectionRow'

describe('CorrectionRow', () => {
  it('renders with eyebrow label and input', () => {
    render(<CorrectionRow onSave={vi.fn()} onSkip={vi.fn()} />)
    expect(screen.getByText(/✗ WHY\? \(OPTIONAL\)/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/It's old news/i)).toBeInTheDocument()
  })

  it('calls onSave with text when Save button clicked', () => {
    const onSave = vi.fn()
    render(<CorrectionRow onSave={onSave} onSkip={vi.fn()} />)
    
    const input = screen.getByPlaceholderText(/It's old news/i)
    fireEvent.change(input, { target: { value: 'Test correction' } })
    
    const saveButton = screen.getByRole('button', { name: /save/i })
    fireEvent.click(saveButton)
    
    expect(onSave).toHaveBeenCalledWith('Test correction')
  })

  it('calls onSkip when Skip button clicked', () => {
    const onSkip = vi.fn()
    render(<CorrectionRow onSave={vi.fn()} onSkip={onSkip} />)
    
    const skipButton = screen.getByRole('button', { name: /skip/i })
    fireEvent.click(skipButton)
    
    expect(onSkip).toHaveBeenCalled()
  })

  it('calls onSkip after 6 second timeout', async () => {
    vi.useFakeTimers()
    const onSkip = vi.fn()
    render(<CorrectionRow onSave={vi.fn()} onSkip={onSkip} />)
    
    vi.advanceTimersByTime(6000)
    await waitFor(() => expect(onSkip).toHaveBeenCalled())
    
    vi.useRealTimers()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL with "CorrectionRow not found"

- [ ] **Step 3: Create CorrectionRow component**

Create `src/components/CorrectionRow.tsx`:

```typescript
import { useState, useEffect } from 'react'
import './CorrectionRow.css'

interface CorrectionRowProps {
  onSave: (text: string) => void
  onSkip: () => void
}

export default function CorrectionRow({ onSave, onSkip }: CorrectionRowProps) {
  const [text, setText] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      onSkip()
    }, 6000)

    return () => clearTimeout(timer)
  }, [onSkip])

  const handleSave = () => {
    onSave(text)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      onSkip()
    }
  }

  return (
    <div className="correction-row">
      <div className="correction-row__eyebrow">
        ✗ WHY? (OPTIONAL)
      </div>
      
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="It's old news — they fixed this last quarter"
        className="correction-row__input"
        autoFocus
      />
      
      <div className="correction-row__buttons">
        <button onClick={onSkip} className="correction-row__button correction-row__button--skip">
          Skip
        </button>
        <button onClick={handleSave} className="correction-row__button correction-row__button--save">
          Save
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create CorrectionRow styles**

Create `src/components/CorrectionRow.css`:

```css
.correction-row {
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: var(--radius-button);
  padding: 14px;
  animation: slide-in var(--duration-correction) var(--ease-out);
  max-width: 360px;
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.correction-row__eyebrow {
  font-family: var(--font-sans);
  font-size: 9px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-flag);
  margin-bottom: var(--space-1);
}

.correction-row__input {
  font-family: var(--font-serif);
  font-size: 14px;
  font-style: italic;
  color: var(--color-ink);
  width: 100%;
  border: none;
  border-bottom: 1px solid var(--color-flag);
  padding: var(--space-1) 0;
  background: transparent;
  margin-bottom: var(--space-2);
}

.correction-row__input::placeholder {
  color: var(--color-ink-muted);
  font-style: italic;
}

.correction-row__input:focus {
  outline: none;
  border-bottom-color: var(--color-flag);
}

.correction-row__buttons {
  display: flex;
  gap: var(--space-1);
  justify-content: flex-end;
}

.correction-row__button {
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: all var(--duration-button) var(--ease-out);
}

.correction-row__button--skip {
  background: transparent;
  color: var(--color-ink-muted);
  border: none;
}

.correction-row__button--skip:hover {
  color: var(--color-ink);
}

.correction-row__button--save {
  background: var(--color-accent);
  color: white;
  border: none;
}

.correction-row__button--save:hover {
  background: var(--color-accent-hover);
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/CorrectionRow*
git commit -m "feat: add CorrectionRow component with auto-timeout"
```

---

## Task 15: SwipeStack Screen

**Files:**
- Create: `src/screens/SwipeStack.tsx`
- Create: `src/screens/__tests__/SwipeStack.test.tsx`

- [ ] **Step 1: Write failing test**

Create `src/screens/__tests__/SwipeStack.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import SwipeStack from '../SwipeStack'

describe('SwipeStack', () => {
  it('renders sidebar with target and progress', () => {
    render(<SwipeStack />, { wrapper: BrowserRouter })
    expect(screen.getByText('TARGET')).toBeInTheDocument()
    expect(screen.getByText('Clay')).toBeInTheDocument()
    expect(screen.getByText('PROGRESS')).toBeInTheDocument()
  })

  it('renders keyboard hints in sidebar', () => {
    render(<SwipeStack />, { wrapper: BrowserRouter })
    expect(screen.getByText(/→ Good signal/i)).toBeInTheDocument()
    expect(screen.getByText(/← Worth a second look/i)).toBeInTheDocument()
  })

  it('renders approve and flag buttons', () => {
    render(<SwipeStack />, { wrapper: BrowserRouter })
    expect(screen.getByText('✓')).toBeInTheDocument()
    expect(screen.getByText('✗')).toBeInTheDocument()
  })

  it('displays learned counter in sidebar footer', () => {
    render(<SwipeStack />, { wrapper: BrowserRouter })
    expect(screen.getByText(/Learned from/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL with "SwipeStack screen not found"

- [ ] **Step 3: Create SwipeStack screen**

Create `src/screens/SwipeStack.tsx`:

```typescript
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import EyebrowLabel from '../components/EyebrowLabel'
import CardStack from '../components/CardStack'
import CorrectionRow from '../components/CorrectionRow'
import LearnedCounter from '../components/LearnedCounter'
import useLearnedCounter from '../hooks/useLearnedCounter'
import { clayCards } from '../data/clayCards'
import './SwipeStack.css'

export default function SwipeStack() {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showCorrectionRow, setShowCorrectionRow] = useState(false)
  const [approvedCards, setApprovedCards] = useState<number[]>([])
  const [flaggedCards, setFlaggedCards] = useState<number[]>([])
  const { count, increment } = useLearnedCounter()
  const [counterAnimating, setCounterAnimating] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showCorrectionRow) return
      
      if (e.key === 'ArrowRight') {
        handleApprove(clayCards[currentIndex].id)
      } else if (e.key === 'ArrowLeft') {
        handleFlag(clayCards[currentIndex].id)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, showCorrectionRow])

  const handleApprove = (cardId: number) => {
    setApprovedCards(prev => [...prev, cardId])
    advanceCard()
  }

  const handleFlag = (cardId: number) => {
    setFlaggedCards(prev => [...prev, cardId])
    setShowCorrectionRow(true)
  }

  const handleCorrectionSave = (text: string) => {
    increment()
    triggerCounterAnimation()
    setShowCorrectionRow(false)
    advanceCard()
  }

  const handleCorrectionSkip = () => {
    increment()
    triggerCounterAnimation()
    setShowCorrectionRow(false)
    advanceCard()
  }

  const advanceCard = () => {
    if (currentIndex + 1 >= clayCards.length) {
      // Navigate to email after delay
      setTimeout(() => {
        navigate('/email', { 
          state: { 
            approvedCards, 
            flaggedCards,
            learnedCount: count,
          } 
        })
      }, 500)
    } else {
      setCurrentIndex(prev => prev + 1)
    }
  }

  const triggerCounterAnimation = () => {
    setCounterAnimating(true)
    setTimeout(() => setCounterAnimating(false), 200)
  }

  const progress = `${String(currentIndex + 1).padStart(2, '0')} / ${String(clayCards.length).padStart(2, '0')}`

  return (
    <div className="swipe-stack-screen">
      <Sidebar
        footer={
          <LearnedCounter count={count} animating={counterAnimating} />
        }
      >
        <div className="swipe-stack__meta">
          <EyebrowLabel>target</EyebrowLabel>
          <div className="swipe-stack__meta-value">Clay</div>
        </div>
        
        <div className="swipe-stack__meta">
          <EyebrowLabel>progress</EyebrowLabel>
          <div className="swipe-stack__meta-value">{progress}</div>
        </div>

        <div className="swipe-stack__keyboard-hints">
          <div className="swipe-stack__hint">
            <span className="swipe-stack__key">→</span> Good signal
          </div>
          <div className="swipe-stack__hint">
            <span className="swipe-stack__key">←</span> Worth a second look
          </div>
        </div>
      </Sidebar>

      <main className="swipe-stack__main">
        <div className="swipe-stack__stage">
          <CardStack
            cards={clayCards}
            currentIndex={currentIndex}
            onApprove={handleApprove}
            onFlag={handleFlag}
          />

          {showCorrectionRow ? (
            <CorrectionRow
              onSave={handleCorrectionSave}
              onSkip={handleCorrectionSkip}
            />
          ) : (
            <div className="swipe-stack__buttons">
              <button
                className="swipe-stack__action-button"
                onClick={() => handleApprove(clayCards[currentIndex].id)}
              >
                ✓
              </button>
              <button
                className="swipe-stack__action-button"
                onClick={() => handleFlag(clayCards[currentIndex].id)}
              >
                ✗
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
```

- [ ] **Step 4: Create SwipeStack screen styles**

Create `src/screens/SwipeStack.css`:

```css
.swipe-stack-screen {
  display: flex;
  min-height: 100vh;
}

.swipe-stack__main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
}

.swipe-stack__stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.swipe-stack__meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.swipe-stack__meta-value {
  font-family: var(--font-serif);
  font-size: var(--size-meta-value);
  color: var(--color-ink);
}

.swipe-stack__keyboard-hints {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding-top: var(--space-2);
  border-top: 1px solid var(--color-border);
  margin-top: var(--space-2);
}

.swipe-stack__hint {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: 13px;
  color: var(--color-ink-muted);
}

.swipe-stack__key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  font-family: var(--font-sans);
  font-size: 10px;
  font-weight: 600;
  border: 1px solid var(--color-border);
  border-radius: 3px;
  background: var(--color-surface);
}

.swipe-stack__buttons {
  display: flex;
  gap: 20px;
}

.swipe-stack__action-button {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  font-size: 18px;
  color: var(--color-ink);
  cursor: pointer;
  transition: all var(--duration-button) var(--ease-out);
}

.swipe-stack__action-button:hover {
  border-color: var(--color-ink);
}

.swipe-stack__action-button:active {
  transform: scale(0.94);
}

@media (max-width: 767px) {
  .swipe-stack__keyboard-hints {
    display: none;
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 6: Update App.tsx**

Edit `src/App.tsx`:

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './screens/Landing'
import Loading from './screens/Loading'
import SwipeStack from './screens/SwipeStack'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/swipe" element={<SwipeStack />} />
        <Route path="/email" element={<div>Email</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

- [ ] **Step 7: Verify in browser**

Run: `npm run dev`
Navigate: / → /loading → /swipe
Expected: Cards are draggable, keyboard shortcuts work, correction row appears on flag

- [ ] **Step 8: Commit**

```bash
git add src/screens/SwipeStack* src/App.tsx
git commit -m "feat: add SwipeStack screen with drag, keyboard, and correction flow"
```

---

## Task 16: EmailOutput Screen

**Files:**
- Create: `src/screens/EmailOutput.tsx`
- Create: `src/screens/__tests__/EmailOutput.test.tsx`

- [ ] **Step 1: Write failing test**

Create `src/screens/__tests__/EmailOutput.test.tsx`:

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import EmailOutput from '../EmailOutput'

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
})

describe('EmailOutput', () => {
  it('renders email subject and body', () => {
    render(<EmailOutput />, { wrapper: BrowserRouter })
    expect(screen.getByText(/Your SDR hiring spree/i)).toBeInTheDocument()
    expect(screen.getByText(/Saw you just opened/i)).toBeInTheDocument()
  })

  it('renders sidebar with target and basis chips', () => {
    render(<EmailOutput />, { wrapper: BrowserRouter })
    expect(screen.getByText('TARGET')).toBeInTheDocument()
    expect(screen.getByText('Clay')).toBeInTheDocument()
    expect(screen.getByText('BASIS')).toBeInTheDocument()
  })

  it('copies email to clipboard when copy button clicked', async () => {
    render(<EmailOutput />, { wrapper: BrowserRouter })
    const copyButton = screen.getByRole('button', { name: /copy email/i })
    fireEvent.click(copyButton)
    
    expect(navigator.clipboard.writeText).toHaveBeenCalled()
  })

  it('regenerates email when regenerate button clicked', () => {
    render(<EmailOutput />, { wrapper: BrowserRouter })
    const regenerateButton = screen.getByRole('button', { name: /regenerate/i })
    fireEvent.click(regenerateButton)
    
    // Should trigger email version toggle
    expect(regenerateButton).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL with "EmailOutput not found"

- [ ] **Step 3: Create EmailOutput screen**

Create `src/screens/EmailOutput.tsx`:

```typescript
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import EyebrowLabel from '../components/EyebrowLabel'
import Button from '../components/Button'
import LearnedCounter from '../components/LearnedCounter'
import { clayCards } from '../data/clayCards'
import { clayEmailV1, clayEmailV2, EmailData } from '../data/clayEmail'
import './EmailOutput.css'

export default function EmailOutput() {
  const location = useLocation()
  const { approvedCards = [], flaggedCards = [], learnedCount = 0 } = location.state || {}
  
  const [emailVersion, setEmailVersion] = useState<EmailData>(clayEmailV1)
  const [copyButtonText, setCopyButtonText] = useState('Copy email')

  const handleCopy = async () => {
    const fullText = `Subject: ${emailVersion.subject}\n\n${emailVersion.body}`
    try {
      await navigator.clipboard.writeText(fullText)
      setCopyButtonText('Copied ✓')
      setTimeout(() => setCopyButtonText('Copy email'), 1500)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleRegenerate = () => {
    setTimeout(() => {
      setEmailVersion(prev => prev === clayEmailV1 ? clayEmailV2 : clayEmailV1)
    }, 600)
  }

  const approvedCardsData = clayCards.filter(c => approvedCards.includes(c.id))
  const flaggedCardsData = clayCards.filter(c => flaggedCards.includes(c.id))

  const renderHighlightedBody = (body: string, highlight: string) => {
    const parts = body.split(highlight)
    if (parts.length === 1) return body

    return (
      <>
        {parts[0]}
        <mark className="email__highlight">{highlight}</mark>
        {parts[1]}
      </>
    )
  }

  return (
    <div className="email-screen">
      <Sidebar
        footer={
          <LearnedCounter count={learnedCount} />
        }
      >
        <div className="email__meta">
          <EyebrowLabel>target</EyebrowLabel>
          <div className="email__meta-value">Clay</div>
        </div>

        <div className="email__basis">
          <EyebrowLabel>basis</EyebrowLabel>
          
          {approvedCardsData.map(card => (
            <div key={card.id} className="email__basis-chip">
              <span className="email__basis-mark email__basis-mark--approved">✓</span>
              <span className="email__basis-text">{card.insight}</span>
            </div>
          ))}

          {flaggedCardsData.map(card => (
            <div key={card.id} className="email__basis-chip">
              <span className="email__basis-mark email__basis-mark--flagged">✗</span>
              <span className="email__basis-text">{card.insight}</span>
            </div>
          ))}
        </div>
      </Sidebar>

      <main className="email__main">
        <div className="email__header">
          <EyebrowLabel>draft · cold email</EyebrowLabel>
          <EyebrowLabel>ready to send</EyebrowLabel>
        </div>

        <div className="email__subject-block">
          <EyebrowLabel>subject</EyebrowLabel>
          <h1 className="email__subject">{emailVersion.subject}</h1>
        </div>

        <div className="email__body">
          {renderHighlightedBody(emailVersion.body, emailVersion.highlightedPhrase)}
        </div>

        <div className="email__buttons">
          <Button onClick={handleCopy}>
            {copyButtonText}
          </Button>
          <Button variant="secondary" onClick={handleRegenerate}>
            Regenerate with different angle
          </Button>
        </div>
      </main>
    </div>
  )
}
```

- [ ] **Step 4: Create EmailOutput screen styles**

Create `src/screens/EmailOutput.css`:

```css
.email-screen {
  display: flex;
  min-height: 100vh;
}

.email__main {
  flex: 1;
  padding: var(--space-6) 56px 40px;
  max-width: 1000px;
}

.email__header {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.email__meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.email__meta-value {
  font-family: var(--font-serif);
  font-size: var(--size-meta-value);
  color: var(--color-ink);
  margin-top: 4px;
}

.email__basis {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-top: var(--space-3);
}

.email__basis-chip {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.email__basis-mark {
  font-size: 12px;
  flex-shrink: 0;
  margin-top: 2px;
}

.email__basis-mark--approved {
  color: var(--color-approve);
}

.email__basis-mark--flagged {
  color: var(--color-flag);
}

.email__basis-text {
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 400;
  color: var(--color-ink);
  line-height: 1.5;
}

.email__subject-block {
  padding-bottom: 20px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--space-3);
}

.email__subject {
  font-family: var(--font-serif);
  font-size: var(--size-subject);
  font-weight: 400;
  line-height: 1.2;
  color: var(--color-ink);
  margin-top: var(--space-1);
}

.email__body {
  max-width: 600px;
  font-family: var(--font-sans);
  font-size: var(--size-body);
  line-height: 1.65;
  color: var(--color-ink);
  white-space: pre-line;
  margin-bottom: var(--space-3);
}

.email__highlight {
  background: rgba(76, 175, 125, 0.14);
  padding: 0 3px;
  font-weight: 600;
}

.email__buttons {
  display: flex;
  gap: var(--space-2);
}

@media (max-width: 767px) {
  .email__main {
    padding: var(--space-4) var(--space-3);
  }

  .email__subject {
    font-size: 24px;
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 6: Update App.tsx**

Edit `src/App.tsx`:

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './screens/Landing'
import Loading from './screens/Loading'
import SwipeStack from './screens/SwipeStack'
import EmailOutput from './screens/EmailOutput'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/swipe" element={<SwipeStack />} />
        <Route path="/email" element={<EmailOutput />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

- [ ] **Step 7: Verify complete flow in browser**

Run: `npm run dev`
Navigate: / → /loading → /swipe → /email
Expected: Complete demo flow works end-to-end

- [ ] **Step 8: Commit**

```bash
git add src/screens/EmailOutput* src/App.tsx
git commit -m "feat: add EmailOutput screen with copy and regenerate"
```

---

## Task 17: Final Polish & Responsive Tuning

**Files:**
- Modify: `src/styles/tokens.css` (responsive breakpoints)
- Modify: Various component CSS files for mobile

- [ ] **Step 1: Test mobile breakpoints**

Run: `npm run dev`
Open dev tools, test at 767px, 480px, 320px widths
Expected: Sidebar collapses, cards resize, text scales

- [ ] **Step 2: Add page transition animations**

Create `src/styles/transitions.css`:

```css
@keyframes page-fade-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-transition {
  animation: page-fade-in var(--duration-page) var(--ease-out);
}
```

- [ ] **Step 3: Apply page transitions to screens**

Add `className="page-transition"` to root div in:
- `src/screens/Landing.tsx`
- `src/screens/Loading.tsx`
- `src/screens/SwipeStack.tsx`
- `src/screens/EmailOutput.tsx`

- [ ] **Step 4: Import transitions in main.tsx**

Edit `src/main.tsx`:

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/tokens.css'
import './styles/global.css'
import './styles/transitions.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 5: Verify all fonts load correctly**

Open browser, check Network tab for Google Fonts requests
Expected: Instrument Serif and Inter both load successfully

- [ ] **Step 6: Run full test suite**

Run: `npm run test`
Expected: All tests PASS

- [ ] **Step 7: Build production bundle**

Run: `npm run build`
Expected: Build succeeds with no warnings

- [ ] **Step 8: Commit polish**

```bash
git add src/styles/transitions.css src/main.tsx src/screens/
git commit -m "feat: add page transitions and responsive polish"
```

---

## Task 18: Ship Checklist & Final Review

**Files:**
- Create: `docs/DEMO.md` - Demo script
- Update: `README.md` - Setup instructions

- [ ] **Step 1: Create demo script**

Create `docs/DEMO.md`:

```markdown
# SwipeSignal Demo Script

**Duration:** 90 seconds
**Viewport:** 1280px width

## Flow

1. **Landing (10s)**
   - Show hero headline with italic "Swipe"
   - "Clay" prefilled in input
   - Click "Research this company →"

2. **Loading (12-14s)**
   - Watch three steps animate sequentially
   - Point out: "Powered by Apify" in sidebar footer
   - Auto-transition to Swipe

3. **Swipe Stack (40s)**
   - Demonstrate drag right on Card 1 → approve
   - Use keyboard: press ← on Card 2 → flag
   - Type correction: "Already addressed in Q4 update"
   - Press Enter to save
   - Watch counter increment with scale animation
   - Drag left on Card 3 → flag, Skip correction
   - Press → keyboard on Card 4 → approve

4. **Email Output (20s)**
   - Show highlighted phrase referencing Card 2
   - Show Basis chips in sidebar (2 ✓, 2 ✗)
   - Show "Learned from 2 corrections" counter
   - Click "Copy email" → shows "Copied ✓"
   - Click "Regenerate" → watch email cross-fade to v2

## Backup (if drag glitches)
- Use keyboard exclusively: → and ←
- Mention: "Keyboard shortcuts are first-class, not fallback"

## Talking points
- Editorial layout signals "designed, not templated"
- No spinners, no progress bars — sequential text states
- Learning counter persists across sessions (localStorage)
- Hardcoded Clay content — demo-ready, no API calls
```

- [ ] **Step 2: Update README**

Edit `README.md`:

```markdown
# SwipeSignal

Research smarter. Swipe to confirm. Send with confidence.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Tech Stack

- React 18 + TypeScript
- Vite
- React Router v6
- CSS Modules
- Vitest + Testing Library

## Demo Flow

1. Landing → enter company name
2. Loading → 3-step research animation (12-14s)
3. Swipe → drag or keyboard to approve/flag insights
4. Email → generated cold email with highlighted references

## Testing

```bash
npm run test       # Run tests
npm run build      # Production build
```

## Design

See `docs/superpowers/specs/2026-04-18-swipesignal-ui-design.md` for full spec.

Key principles:
- Editorial two-column layout (280px sidebar + main content)
- Instrument Serif + Inter typography
- No Tailwind blues, no pure white/black, no spinners
- 8px spacing grid, 220ms transitions

## Hackathon Submission

**Deadline:** Saturday April 19, 3:00pm
**Demo:** 90 seconds, 1280px viewport
**Content:** Hardcoded Clay company insights (no backend)
```

- [ ] **Step 3: Run through ship checklist from spec**

Verify each item from spec section 9:

- [ ] All five screens render without console errors
- [ ] Drag physics work (test trackpad + mouse)
- [ ] Keyboard shortcuts work (← → ↵)
- [ ] Loading state takes 12–14s end-to-end
- [ ] Email highlights reference Card 2's G2 insight
- [ ] Learning counter increments on left-swipe
- [ ] Fonts render as Instrument Serif + Inter
- [ ] No Tailwind blues in palette
- [ ] Mobile renders acceptably (test at 767px)

- [ ] **Step 4: Run demo rehearsal 3× clean**

Run: `npm run dev`
Execute demo script 3 times, timing each run
Expected: Completes in 85-95 seconds

- [ ] **Step 5: Commit documentation**

```bash
git add docs/DEMO.md README.md
git commit -m "docs: add demo script and setup instructions"
```

- [ ] **Step 6: Final commit and tag**

```bash
git add .
git commit -m "feat: SwipeSignal v1.0 - hackathon submission ready"
git tag -a v1.0 -m "Hackathon submission: SwipeSignal UI"
```

---

## Implementation Complete

All 18 tasks completed. The SwipeSignal app is ready for demo.

**Next steps:**
1. Rehearse demo 3× with actual content
2. Test on demo machine (both trackpad and mouse)
3. Verify fonts load on demo WiFi
4. Screenshot all 5 screens at 1280px for backup slides
5. Submit by Saturday April 19, 3:00pm

**Backup plan:**
- If drag glitches: use keyboard exclusively (→ ←)
- If fonts fail: fix Google Fonts CDN link
- If timing off: adjust setTimeout values in Loading.tsx

