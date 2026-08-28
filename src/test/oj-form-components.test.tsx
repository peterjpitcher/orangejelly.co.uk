import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Field, Input, Textarea, Select, Checkbox, Radio } from '@/components/oj';

/**
 * These mostly test the wiring the reference left to the caller.
 *
 * The supplied Field renders a label, the control, and a hint or error line, and
 * expects whoever uses it to remember aria-invalid and aria-describedby. On a
 * twelve-field enquiry form that gets forgotten, and when it does a screen-reader
 * user hears "Work email, edit text" with no indication the field is wrong.
 *
 * The port makes the association automatic, so these assert it happens without the
 * caller doing anything, and that an explicit prop still wins.
 */
describe('oj/Field', () => {
  it('associates the label with the control without being told the id', async () => {
    render(
      <Field label="Work email">
        <Input type="email" />
      </Field>
    );
    // getByLabelText only succeeds if label and control are genuinely associated.
    expect(screen.getByLabelText('Work email')).toBeInTheDocument();
  });

  it('describes the control with its hint', () => {
    render(
      <Field label="Work email" hint="No newsletters. One reply.">
        <Input type="email" />
      </Field>
    );

    const input = screen.getByLabelText('Work email');
    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy as string)).toHaveTextContent(
      'No newsletters. One reply.'
    );
  });

  it('marks the control invalid and announces the error, without the caller doing either', () => {
    render(
      <Field label="Work email" error="Enter a work email address">
        <Input type="email" />
      </Field>
    );

    const input = screen.getByLabelText('Work email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a work email address');
    expect(input.getAttribute('aria-describedby')).toBe(screen.getByRole('alert').id);
  });

  it('replaces the hint with the error rather than showing both', () => {
    render(
      <Field label="Work email" hint="No newsletters" error="Enter a work email address">
        <Input type="email" />
      </Field>
    );

    expect(screen.getByText('Enter a work email address')).toBeInTheDocument();
    expect(screen.queryByText('No newsletters')).not.toBeInTheDocument();
  });

  it('announces required rather than relying on the asterisk alone', () => {
    render(
      <Field label="Company" required>
        <Input />
      </Field>
    );
    // An orange asterisk is not a label. Colour and glyph alone fail 1.3.1.
    expect(screen.getByText('(required)')).toBeInTheDocument();
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
  });

  it('lets an explicit id win, for controls used outside a Field', () => {
    render(
      <Field label="Company" htmlFor="company-name">
        <Input />
      </Field>
    );
    expect(screen.getByLabelText('Company')).toHaveAttribute('id', 'company-name');
  });
});

describe('oj form controls', () => {
  it('accepts typing into an input and a textarea', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Field label="Company">
          <Input />
        </Field>
        <Field label="What is happening?">
          <Textarea />
        </Field>
      </>
    );

    await user.type(screen.getByLabelText('Company'), 'Barton Reed');
    await user.type(screen.getByLabelText('What is happening?'), 'Enquiries have dried up');

    expect(screen.getByLabelText('Company')).toHaveValue('Barton Reed');
    expect(screen.getByLabelText('What is happening?')).toHaveValue('Enquiries have dried up');
  });

  it('selects an option', async () => {
    const user = userEvent.setup();
    render(
      <Field label="Your role">
        <Select>
          <option value="">Choose one</option>
          <option value="md">Managing director</option>
        </Select>
      </Field>
    );

    await user.selectOptions(screen.getByLabelText('Your role'), 'md');
    expect(screen.getByLabelText('Your role')).toHaveValue('md');
  });

  it('toggles a checkbox and reports its state', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox label="Send me the write-up" onChange={onChange} />);

    const box = screen.getByRole('checkbox', { name: 'Send me the write-up' });
    expect(box).not.toBeChecked();
    await user.click(box);
    expect(box).toBeChecked();
    expect(onChange).toHaveBeenCalled();
  });

  it('groups radios by name so only one can be chosen', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Radio name="size" value="small" label="1 to 9" />
        <Radio name="size" value="mid" label="10 to 49" />
      </>
    );

    await user.click(screen.getByRole('radio', { name: '10 to 49' }));
    expect(screen.getByRole('radio', { name: '10 to 49' })).toBeChecked();
    expect(screen.getByRole('radio', { name: '1 to 9' })).not.toBeChecked();
  });

  it('gives text inputs a 44px tap target', () => {
    render(
      <Field label="Company">
        <Input />
      </Field>
    );
    expect(screen.getByLabelText('Company').className).toContain('min-h-tap');
  });
});

describe('oj/Field error announcement', () => {
  it('announces a standalone field error', () => {
    render(
      <Field label="Work email" error="Enter a work email address">
        <Input />
      </Field>
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a work email address');
  });

  it('stays quiet when the form has an error summary to do the announcing', () => {
    render(
      <Field label="Work email" error="Enter a work email address" announceError={false}>
        <Input />
      </Field>
    );
    // Otherwise a screen-reader user hears the summary and then every inline
    // message again, which buries the one that took focus.
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    // Still described by it, so the message is read when the field is reached.
    const input = screen.getByLabelText('Work email');
    expect(
      document.getElementById(input.getAttribute('aria-describedby') as string)
    ).toHaveTextContent('Enter a work email address');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });
});
