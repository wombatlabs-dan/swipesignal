import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CornerMark } from '../CornerMark';

describe('CornerMark', () => {
  it('renders correct text content', () => {
    render(<CornerMark />);
    expect(screen.getByText('SwipeSignal')).toBeInTheDocument();
  });

  it('renders the decorative dot', () => {
    const { container } = render(<CornerMark />);
    const dot = container.querySelector('.corner-mark__dot');
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveAttribute('aria-hidden', 'true');
  });

  it('has correct structure', () => {
    const { container } = render(<CornerMark />);
    const mark = container.querySelector('.corner-mark');
    expect(mark).toBeInTheDocument();
    expect(mark?.classList.contains('corner-mark')).toBe(true);
  });

  it('text has italic font style', () => {
    const { container } = render(<CornerMark />);
    const text = container.querySelector('.corner-mark__text');
    expect(text).toBeInTheDocument();
    expect(text).toHaveClass('corner-mark__text');
  });
});
