import { render, screen } from '@testing-library/react'

// Simple test component
function Button({ children }: { children: React.ReactNode }) {
  return <button>{children}</button>
}

test('renders button with text', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByText(/click me/i)).toBeInTheDocument()
})
