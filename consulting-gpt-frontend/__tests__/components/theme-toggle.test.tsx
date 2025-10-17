import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';
import { ThemeToggle } from '@/app/components/theme-toggle';

// Mock next-themes
const mockSetTheme = jest.fn();
const mockTheme = 'light';

jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: mockTheme,
    setTheme: mockSetTheme,
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
  });

  it('renders theme toggle button', async () => {
    render(<ThemeToggle />);

    // Wait for component to mount
    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  it('has correct accessibility attributes', async () => {
    render(<ThemeToggle />);

    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Toggle theme');
      expect(button).toHaveAttribute('title', 'Switch to dark mode');
    });
  });

  it('calls setTheme when clicked', async () => {
    render(<ThemeToggle />);

    await waitFor(() => {
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });
  });
  it('shows placeholder during mounting', () => {
    render(<ThemeToggle />);

    // The ThemeToggle component uses useEffect to set mounted state
    // During initial render, it should show the mounted version
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('applies correct CSS classes', async () => {
    render(<ThemeToggle />);

    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toHaveClass('rounded-full', 'p-1.5', 'text-gray-500');
    });
  });
});
