import React from 'react';
import sinon from 'sinon';
import assert from 'assert';
import { mount } from 'enzyme';

import { CheckboxBooleanInput, Input } from '../../src';

describe('<CheckboxBooleanInput />', () => {
  const onChange = sinon.stub();

  const wrapper = mount(
    <CheckboxBooleanInput value onChange={onChange} />
  );

  const component = wrapper.find(Input);

  it('should be an Input', () => {
    assert.equal(component.type(), Input);
  });

  it('should not render checkboxLabel', () => {
    assert.equal(wrapper.ref('label'), undefined);
  });

  it('should use value for checked state', () => {
    assert.strictEqual(component.prop('checked'), true);
  });

  it('should call onChange with checked state', () => {
    component.simulate('change', { target: { checked: false } });
    assert(onChange.calledWith(false));
  });

  it('should render checkboxLabel if specified', () => {
    const wrapped = mount(<CheckboxBooleanInput checkboxLabel="Yowza" />);
    assert.equal(wrapped.text(), 'Yowza');
    assert(wrapped.find('label').exists());
  });

  it('should allow you to pass through other props to the input', () => {
    const checkbox = mount(
      <CheckboxBooleanInput value onChange={onChange} disabled />
    );

    const input = checkbox.find(Input);

    assert.equal(input.props().disabled, true);
  });
});
