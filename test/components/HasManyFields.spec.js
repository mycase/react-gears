import assert from 'assert';

import { shallow } from 'enzyme';
import React from 'react';
import sinon, { spy } from 'sinon';

import {
  HasManyFields,
  HasManyFieldsAdd,
  HasManyFieldsRow,
  Input
} from '../../src';

const items = [ 'monkey', 'cat', 'mouse' ];
const errors = [{ name: "can't be blank" }, {}, { foo: "can't be bar" }];

describe('<HasManyFields />', () => {
  describe('uncontrolled', () => {
    const onAdd = spy();
    const onRemove = spy();
    const onUpdate = spy();
    const onChange = spy();
    const component = shallow(
      <HasManyFields
        defaultValue={items}
        errors={errors}
        template={Input}
        blank={values => values.length.toString()}
        onAdd={onAdd}
        onRemove={onRemove}
        onUpdate={onUpdate}
        onChange={onChange}
        label="Add an Animal"
      />
    );

    const addItem = component.find(HasManyFieldsAdd);

    it('should copy the defaultValue to state', () => {
      assert.deepEqual(component.state('value'), items);
    });

    it('should have an add row button', () =>
      assert.equal(addItem.prop('children'), 'Add an Animal')
    );

    it('should have correct number of rows', () => {
      assert.equal(component.find(HasManyFieldsRow).length, items.length);
      assert.equal(component.find(Input).length, items.length);
    });

    it('should pass the items at values to template', () => {
      component.find(Input).forEach((input, i) => {
        assert.equal(input.prop('value'), items[i]);
      });
    });

    it('should pass the errors to each template', () => {
      component.find(Input).forEach((input, i) => {
        assert.deepEqual(input.prop('errors'), errors[i]);
      });
    });

    it('should add a row when add button is clicked', () => {
      const expectedItems = [ 'monkey', 'cat', 'mouse', '3' ];
      addItem.simulate('click');
      assert.equal(component.find(HasManyFieldsRow).length, expectedItems.length);
      assert.equal(component.find(Input).last().prop('value'), '3');
      assert.deepEqual(component.state('value'), expectedItems);
      sinon.assert.calledWith(onChange, expectedItems);
      assert.equal(items.length, 3);
      sinon.assert.calledOnce(onAdd);
    });

    it('should remove an item', () => {
      const expectedItems = [ 'monkey', 'mouse', '3' ];
      component.find(HasManyFieldsRow).at(1).simulate('delete');
      assert.equal(component.find(HasManyFieldsRow).length, expectedItems.length);
      assert.deepEqual(component.state('value'), expectedItems);
      sinon.assert.calledWith(onChange, expectedItems);
      assert.equal(items.length, 3);
      sinon.assert.calledWith(onRemove, 1);
    });

    it('should update an item', () => {
      const expectedItems = [ 'monkey', 'la souris est sous la table', '3' ];
      component.find(Input).at(1).simulate('change', expectedItems[1]);
      assert.equal(component.find(HasManyFieldsRow).length, expectedItems.length);
      assert.equal(component.find(Input).at(1).prop('value'), expectedItems[1]);
      assert.deepEqual(component.state('value'), expectedItems);
      sinon.assert.calledWith(onChange, expectedItems);
      assert.equal(items.length, 3);
      sinon.assert.calledWith(onUpdate, 1, expectedItems[1]);
    });
  });

  describe('controlled', () => {
    const onAdd = spy();
    const onRemove = spy();
    const onUpdate = spy();
    const onChange = spy();
    const component = shallow(
      <HasManyFields
        value={items}
        errors={errors}
        template={Input}
        blank={'foo'}
        onAdd={onAdd}
        onRemove={onRemove}
        onUpdate={onUpdate}
        onChange={onChange}
        label="Add an Animal"
      />
    );

    const addItem = component.find(HasManyFieldsAdd);

    it('should not have any state', () =>
      assert.equal(component.state(), null)
    );

    it('should have correct number of rows', () => {
      assert.equal(component.find(HasManyFieldsRow).length, items.length);
      assert.equal(component.find(Input).length, items.length);
    });

    it('should pass the items at values to template', () => {
      component.find(Input).forEach((input, i) => {
        assert.equal(input.prop('value'), items[i]);
      });
    });

    it('should pass the errors to each template', () => {
      component.find(Input).forEach((input, i) => {
        assert.deepEqual(input.prop('errors'), errors[i]);
      });
    });

    it('should add a row when add button is clicked', () => {
      const expectedItems = [ 'monkey', 'cat', 'mouse', 'foo' ];
      addItem.simulate('click');
      assert.deepEqual(component.find(Input).map(input => input.prop('value')), items);
      sinon.assert.calledWith(onChange, expectedItems);
      assert.equal(items.length, 3);
      sinon.assert.calledOnce(onAdd);
    });

    it('should remove an item', () => {
      const expectedItems = [ 'monkey', 'mouse' ];
      component.find(HasManyFieldsRow).at(1).simulate('delete');
      assert.deepEqual(component.find(Input).map(input => input.prop('value')), items);
      sinon.assert.calledWith(onChange, expectedItems);
      assert.equal(items.length, 3);
      sinon.assert.calledWith(onRemove, 1);
    });

    it('should update an item', () => {
      const expectedItems = [ 'monkey', 'cat', 'la souris est sous la table' ];
      component.find(Input).at(2).simulate('change', expectedItems[2]);
      assert.deepEqual(component.find(Input).map(input => input.prop('value')), items);
      sinon.assert.calledWith(onChange, expectedItems);
      assert.equal(items.length, 3);
      sinon.assert.calledWith(onUpdate, 2, expectedItems[2]);
    });
  });

  it('should hide the delete buttons if it has the minimum number of rows', () => {
    const component = shallow(
      <HasManyFields
        template={Input}
        blank="foo"
        value={items}
        label="Add an Animal"
        minimumRows={3}
      />
    );

    assert(component.find(HasManyFieldsRow).at(0).props().hideDeleteButton);
    assert(component.find(HasManyFieldsRow).at(1).props().hideDeleteButton);
    assert(component.find(HasManyFieldsRow).at(2).props().hideDeleteButton);
  });

  it('should hide the add button if it has the maximum number of rows', () => {
    const component = shallow(
      <HasManyFields
        template={Input}
        blank="foo"
        value={items}
        label="Add an Animal"
        maximumRows={3}
      />
    );

    assert.equal(component.find(HasManyFieldsAdd).length, 0);
  });
});
