import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '../components/common/Modal';

describe('Modal Dialog Accessibility & Keyboard Interactions', () => {
  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()} title="Test Dialog">
        <p>Dialog Body Content</p>
      </Modal>
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders role="dialog" with aria-modal="true" and connects aria-labelledby', () => {
    render(
      <Modal
        isOpen={true}
        onClose={vi.fn()}
        title="Add Custom Vendor"
        subtitle="Specify vendor roles and estimates"
      >
        <p>Dialog Body Content</p>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');

    // Title and subtitle are linked
    const heading = screen.getByRole('heading', { level: 3, name: 'Add Custom Vendor' });
    expect(heading).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-labelledby', heading.id);

    const closeBtn = screen.getByLabelText('Close dialog');
    expect(closeBtn).toBeInTheDocument();
  });

  it('invokes onClose when Escape key is pressed', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Escape Test Dialog">
        <p>Content</p>
      </Modal>
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('invokes onClose when backdrop is clicked', () => {
    const handleClose = vi.fn();
    const { container } = render(
      <Modal isOpen={true} onClose={handleClose} title="Backdrop Test Dialog">
        <p>Content</p>
      </Modal>
    );

    const backdrop = container.querySelector('[aria-hidden="true"]');
    expect(backdrop).toBeInTheDocument();
    fireEvent.click(backdrop);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not invoke onClose when clicking inside the dialog content', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Stop Propagation Dialog">
        <button>Inside Button</button>
      </Modal>
    );

    const insideBtn = screen.getByText('Inside Button');
    fireEvent.click(insideBtn);
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('invokes onClose when clicking the close (X) button', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Close Button Dialog">
        <p>Content</p>
      </Modal>
    );

    const closeBtn = screen.getByLabelText('Close dialog');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('manages focus by ensuring an interactive element inside the modal receives focus', async () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Focus Test Dialog">
        <input type="text" placeholder="First Input" />
      </Modal>
    );

    await new Promise((resolve) => setTimeout(resolve, 80));
    const dialog = screen.getByRole('dialog');
    expect(dialog).toContainElement(document.activeElement);
  });
});
