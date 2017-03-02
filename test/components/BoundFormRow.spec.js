import React from 'react';
import sinon from 'sinon';
import assert from 'assert';
import { shallow } from 'enzyme';

import BoundFormRow from '../../src/components/BoundFormRow';

describe('<BoundFormRow />', () => {
  describe('with context', () => {
    const onChange = sinon.stub();
    const component = shallow(
      <BoundFormRow name="firstName" />, {
        context: {
          value: {
            firstName: 'First Name',
            lastName: 'Last Name'
          },
          errors: {
            firstName: 'Not Right',
            lastName: 'Something Else'
          },
          onChange
        }
      }
    );

    it('should forward props', () => {
      assert.equal(component.prop('name'), 'firstName');
    });

    it('should pass the value from context', () => {
      assert.equal(component.prop('value'), 'First Name');
    });

    it('should pass the error from context', () => {
      assert.equal(component.prop('feedback'), 'Not Right');
    });

    it('should pass the onChange handler from context', () => {
      assert.equal(component.prop('onChange'), onChange('firstName'));
    });
  });

  describe('with defaults', () => {
    const onChange = sinon.stub();
    const component = shallow(
      <BoundFormRow name="firstName" />, { context: { onChange } }
    );

    it('should set the default context value', () => {
      assert.equal(component.prop('value'), '');
    });

    it('should set the default context errors', () => {
      assert.equal(component.prop('feedback'), '');
    });
  });
});