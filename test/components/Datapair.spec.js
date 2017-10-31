import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { Col, Datapair } from '../../src';

describe('<Datapair />', () => {
  const component = shallow(<Datapair label="stuff" value="something" />);

  it('should have a label and value', () => {
    const cols = component.find(Col);
    assert.equal(cols.length, 2);
    assert.equal(cols.first().childAt(0).text(), 'stuff');
    assert.equal(cols.last().childAt(0).text(), 'something');
  });

  it('should align and correctly size label column', () => {
    const labelCol = component.find(Col).first();
    assert.equal(labelCol.prop('sm'), '4');
    assert.equal(labelCol.prop('xs'), '12');
    assert.equal(labelCol.prop('className'), 'text-sm-right text-muted');
  });

  it('should correctly size value column', () => {
    const valCol = component.find(Col).last();
    assert.equal(valCol.prop('sm'), '8');
    assert.equal(valCol.prop('xs'), '12');
  });

  it('should support html in value', () => {
    const fancyComponent = shallow(<Datapair label="stuff"><span>Special</span></Datapair>);
    const valCol = fancyComponent.find(Col).last();
    assert.equal(valCol.childAt(0).html(), '<span>Special</span>');
  });

  it('should support node in label', () => {
    const fancyComponent = shallow(<Datapair label={<span>stuff</span>}>Special</Datapair>);
    const valCol = fancyComponent.find(Col).first();
    assert.equal(valCol.childAt(0).html(), '<span>stuff</span>');
  });
});
