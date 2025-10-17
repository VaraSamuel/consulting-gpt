import { render, screen } from '@testing-library/react';
import { FormError } from '@/app/components/forms/form-error';
import { FormSuccess } from '@/app/components/forms/form-success';

describe('FormError Component', () => {
  it('renders error message when message prop is provided', () => {
    render(<FormError message="This is an error message" />);
    expect(screen.getByText('This is an error message')).toBeInTheDocument();
  });

  it('does not render when message prop is not provided', () => {
    const { container } = render(<FormError />);
    expect(container.firstChild).toBeNull();
  });

  it('does not render when message prop is empty string', () => {
    const { container } = render(<FormError message="" />);
    expect(container.firstChild).toBeNull();
  });
  it('displays AlertCircle icon with error message', () => {
    render(<FormError message="Error occurred" />);

    // Check that both text and icon are present
    expect(screen.getByText('Error occurred')).toBeInTheDocument();
    // The icon should be an SVG, check if it exists
    const container = screen.getByText('Error occurred').parentElement;
    const svgIcon = container?.querySelector('svg');
    expect(svgIcon).toBeInTheDocument();
  });
  it('renders properly with styling', () => {
    render(<FormError message="Error message" />);

    // Check that the error div is rendered
    const errorDiv = screen.getByText('Error message').parentElement;
    expect(errorDiv).toBeInTheDocument();
  });
});

describe('FormSuccess Component', () => {
  it('renders success message when message prop is provided', () => {
    render(<FormSuccess message="Operation completed successfully" />);
    expect(screen.getByText('Operation completed successfully')).toBeInTheDocument();
  });

  it('does not render when message prop is not provided', () => {
    const { container } = render(<FormSuccess />);
    expect(container.firstChild).toBeNull();
  });

  it('does not render when message prop is empty string', () => {
    const { container } = render(<FormSuccess message="" />);
    expect(container.firstChild).toBeNull();
  });
  it('displays CheckCircle icon with success message', () => {
    render(<FormSuccess message="Success!" />);

    // Check that both text and icon are present
    expect(screen.getByText('Success!')).toBeInTheDocument();
    // The icon should be an SVG, check if it exists
    const container = screen.getByText('Success!').parentElement;
    const svgIcon = container?.querySelector('svg');
    expect(svgIcon).toBeInTheDocument();
  });
  it('renders properly with styling', () => {
    render(<FormSuccess message="Success message" />);

    // Check that the success div is rendered
    const successDiv = screen.getByText('Success message').parentElement;
    expect(successDiv).toBeInTheDocument();
  });
});
