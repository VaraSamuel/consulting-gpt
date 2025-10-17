import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BackToTopButton } from '@/app/components/back-to-top-button';

// Mock window.scrollTo
const mockScrollTo = jest.fn();
Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true,
});

describe('BackToTopButton Component', () => {
  beforeEach(() => {
    mockScrollTo.mockClear();
    Object.defineProperty(window, 'pageYOffset', {
      value: 0,
      writable: true,
    });
  });

  it('does not render when page is not scrolled', () => {
    render(<BackToTopButton />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders when page is scrolled down', async () => {
    render(<BackToTopButton />);

    // Simulate scrolling down
    Object.defineProperty(window, 'pageYOffset', {
      value: 400,
      writable: true,
    });

    fireEvent.scroll(window);

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  it('scrolls to top when clicked', async () => {
    render(<BackToTopButton />);

    // Simulate scrolling down to make button visible
    Object.defineProperty(window, 'pageYOffset', {
      value: 400,
      writable: true,
    });

    fireEvent.scroll(window);

    await waitFor(() => {
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });
    });
  });

  it('has correct accessibility attributes', async () => {
    render(<BackToTopButton />);

    // Make button visible
    Object.defineProperty(window, 'pageYOffset', {
      value: 400,
      writable: true,
    });

    fireEvent.scroll(window);

    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Scroll to top');
    });
  });

  it('applies correct CSS classes', async () => {
    render(<BackToTopButton />);

    // Make button visible
    Object.defineProperty(window, 'pageYOffset', {
      value: 400,
      writable: true,
    });

    fireEvent.scroll(window);

    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toHaveClass('fixed', 'bottom-8', 'right-8', 'z-50');
    });
  });

  it('removes event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = render(<BackToTopButton />);

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });
});
