/* eslint-env mocha */

import React from 'react';
import assert from 'assert';
import sinon from 'sinon';
import { Button, CardTitle, Icon } from '../../src';
import { mount, shallow } from 'enzyme';


import BlockPanel from '../../src/components/BlockPanel.js';

describe('<BlockPanel />', () => {
  context('is expandable', () => {
    it('should be open by default', () => {
      const component = mount(
        <BlockPanel title="Open">
          <h1 id="hi">Hello World!</h1>
        </BlockPanel>
      );

      assert.equal(component.find('#hi').length, 1);
    });

    it('should be open by default', () => {
      const component = shallow(
        <BlockPanel title="Open" expandable>
          <h1 id="hi">Hello World!</h1>
        </BlockPanel>
      );

      assert.equal(component.find('#hi').length, 1);
    });

    it('should be closed when false passed as prop', () => {
      const component = shallow(
        <BlockPanel title="Open" open={false} expandable>
          <h1 id="hi">Hello World!</h1>
        </BlockPanel>
      );

      assert.equal(component.find('#hi').length, 0);
    });

    it('should be open when true passed as prop', () => {
      const component = shallow(
        <BlockPanel title="Open" open expandable>
          <h1 id="hi">Hello World!</h1>
        </BlockPanel>
      );

      assert.equal(component.find('#hi').length, 1);
    });

    it('should be open and close when clicked', () => {
      const component = shallow(
        <BlockPanel title="Open" expandable>
          <h1 id="hi">Hello World!</h1>
        </BlockPanel>
      );

      assert.equal(component.find('#hi').length, 1, 'inner block should be visible');
      component.find(CardTitle).simulate('click');
      assert.equal(component.find('#hi').length, 0, 'inner block should not be visible');
      component.find(Icon).simulate('click');
      assert.equal(component.find('#hi').length, 1, 'inner block should be visible');
    });
  });

  context('contains headerComponent', () => {
    it('should render headerComponent', () => {
      const component = shallow(
        <BlockPanel title="Open" controls={<p id="edit">Edit</p>}>
          <h1 id="hi">Hello World!</h1>
        </BlockPanel>
      );

      assert.equal(component.find('#hi').length, 1);
      assert.equal(component.find('#edit').length, 1);
    });
  });

  context('header components', () => {
    it('should not render edit link by default', () => {
      const component = mount(
        <BlockPanel title="Open">
          <h1 id="hi">Hello World!</h1>
        </BlockPanel>
      );
      assert.equal(component.ref('edit').exists(), false);
    });

    it('should render edit link when passed onEdit', () => {
      const component = mount(
        <BlockPanel title="Open" onEdit={() => {}}>
          <h1 id="hi">Hello World!</h1>
        </BlockPanel>
      );
      assert.equal(component.ref('edit').exists(), true);
    });

    it('should call onEdit when clicked', () => {
      const onEdit = sinon.spy();

      const component = mount(
        <BlockPanel title="Open" onEdit={onEdit}>
          <h1 id="hi">Hello World!</h1>
        </BlockPanel>
      );
      component.ref('edit').simulate('click');
      assert.equal(onEdit.calledOnce, true);
    });

    it('should render title components when passed', () => {
      const component = mount(
        <BlockPanel
          title={<h1 id="title">WE ARE THE CHAMPIONS</h1>}
          controls={<Button id="action">Go!</Button>}
        >
          <h1 id="hi">Hello World!</h1>
        </BlockPanel>
      );
      assert.equal(component.find('#title').exists(), true);
      assert.equal(component.find('#title').text(), 'WE ARE THE CHAMPIONS');
      assert.equal(component.find('#action').exists(), true);
      assert.equal(component.find('#action').text(), 'Go!');
    });

  });
});