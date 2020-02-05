import React from 'react';
import sinon from 'sinon';
import { render, cleanup, fireEvent } from '@testing-library/react';

import RadioGroup from '../../src/components/RadioGroup';

const options = [
  { label: 'Watermelon', value: 'watermelon' },
  { label: 'Apple', value: 'apple' },
  { label: 'Lemon', value: 'lemon' },
  { label: 'Orange', value: 'orange' },
  { label: 'Grape', value: 'grape' },
];

describe('<RadioGroup />', () => {
  afterEach(cleanup);

  it('should select only one option', () => {
    const mockOnChange = sinon.spy();
    const checkboxes = render(
      <RadioGroup options={options} onChange={mockOnChange} />
    );

    let option = checkboxes.getByLabelText('Apple');
    fireEvent.click(option);

    sinon.assert.calledWith(mockOnChange, 'apple');

    option = checkboxes.getByLabelText('Watermelon');
    fireEvent.click(option);

    sinon.assert.calledWith(mockOnChange, 'watermelon');
  });

  it('should work with object values', () => {
    const coolerOptions = [
      { label: 'Boba', value: { id: 1, type: 'topping', price: '0.50' } },
      { label: 'Aiyu Jelly', value: { id: 2, type: 'topping', price: '0.50' } },
      { label: 'Konjac Pearls', value: { id: 3, type: 'topping', price: '0.50' } },
    ];
    const mockOnChange = sinon.spy();
    const checkboxes = render(
      <RadioGroup options={coolerOptions} selected={{ id: 1, type: 'topping', price: '0.50' }} onChange={mockOnChange} />
    );

    const option = checkboxes.getByLabelText('Aiyu Jelly');
    fireEvent.click(option);

    sinon.assert.calledWith(
      mockOnChange,
      { id: 2, type: 'topping', price: '0.50' }
    );
  });
});
