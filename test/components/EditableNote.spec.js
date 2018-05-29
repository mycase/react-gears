import React from 'react';
import assert from 'assert';
import sinon from 'sinon';
import { EditableNote } from '../../src';
import { mount } from 'enzyme';

describe.only('<EditableNote />', () => {
  const note = {
    text: 'Hello World!'
  };
  let component;
  let props;

  beforeEach(() => {
    const onCancel = sinon.spy();
    const onChange = sinon.spy();
    const onSave = sinon.spy();
    props = { note, onCancel, onChange, onSave };
  });

  describe('rendering', () => {
    it('should render a card', () => {
      component = mount(<EditableNote {...props} />);
      const card = component.find('Card');

      assert(card.exists);
      assert.equal(1, card.length);
    });

    context('in default mode', () => {
      beforeEach(() => {
        component = mount(<EditableNote {...props} />);
      });

      describe('should render a text input', () => {
        it('should render with text', () => {
          const input = component.ref('text');

          assert(input.exists);
          assert.equal(1, input.length);
          assert.equal(note.text, input.text());
          assert(!input.props().disabled);
        });

        it('should call onChange on text change', () => {
          const event = { target: { value: 'Yikes!' } };
          component.ref('text').simulate('change', event);
          assert(props.onChange.calledOnce);
          assert(props.onChange.calledWith(sinon.match(event), note));
        });
      });

      describe('should render a cancel button', () => {
        it('should render with text', () => {
          const button = component.ref('cancel');

          assert(button.exists);
          assert.equal(1, button.length);
          assert.equal('Cancel', button.text());
          assert(!button.props().disabled);
        });

        it('should call onCancel on click', () => {
          component.ref('cancel').simulate('click');
          assert(props.onCancel.calledOnce);
          assert(props.onCancel.calledWith(note));
        });
      });

      describe('should render a save button', () => {
        it('should render with text', () => {
          const button = component.ref('save');

          assert(button.exists);
          assert.equal(1, button.length);
          assert.equal('Save', button.text());
          assert.equal('primary', button.props().color);
          assert(!button.props().disabled);
        });

        it('should call onSave on click', () => {
          component.ref('save').simulate('click');
          assert(props.onSave.calledOnce);
          assert(props.onSave.calledWith(note));
        });
      });
    });
  });
});
