import { render, screen } from '@testing-library/react';
import Index from '@/app/page';

// Mock the TechnologyForm component
jest.mock('@/app/components/forms/technology-form', () => {
  return function MockTechnologyForm() {
    return <div data-testid="technology-form">Technology Form</div>;
  };
});

describe('Home Page (Index)', () => {
  it('renders the main title', () => {
    render(<Index />);
    expect(
      screen.getByRole('heading', { name: 'Health Technology Assessment (HTA)' })
    ).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<Index />);
    expect(
      screen.getByText(
        'Fill out the form below to generate your comprehensive commercial viability report'
      )
    ).toBeInTheDocument();
  });

  it('renders the TechnologyForm component', () => {
    render(<Index />);
    expect(screen.getByTestId('technology-form')).toBeInTheDocument();
  });
  it('applies correct styling classes', () => {
    const { container } = render(<Index />);

    // Check if the main container has the gradient background
    const mainContainer = container.querySelector('.min-h-screen');
    expect(mainContainer).toHaveClass('bg-gradient-to-br');
  });

  it('has correct heading hierarchy', () => {
    render(<Index />);

    const mainHeading = screen.getByRole('heading', {
      name: 'Health Technology Assessment (HTA)',
    });
    expect(mainHeading.tagName).toBe('H1');
  });

  it('contains descriptive text about the application', () => {
    render(<Index />);

    const description = screen.getByText(/Fill out the form below to generate/);
    expect(description).toBeInTheDocument();
  });
});
