import React from 'react';
import assert from 'assert';
import { mount } from 'enzyme';
import addDays from 'date-fns/add_days';
import addMonths from 'date-fns/add_months';
import addWeeks from 'date-fns/add_weeks';
import addYears from 'date-fns/add_years';
import isSameDay from 'date-fns/is_same_day';
import isSameMonth from 'date-fns/is_same_month';
import isToday from 'date-fns/is_today';
import sinon from 'sinon';

import { MonthInput } from '../../src';

describe('<MonthInput />', () => {
  context('defaultValue', () => {
    it('should default to blank and today', () => {
      const component = mount(<MonthInput />);
      const input = component.find('input');

      assert.equal(input.get(0).value, '');
    });

    it('should format defaultValue Date prop', () => {
      const component = mount(<MonthInput defaultValue={new Date(1999, 1, 14)} />);
      const input = component.find('input');

      assert.equal(input.get(0).value, 'Feb 1999');
    });

    it('should format defaultValue date strings prop', () => {
      const component = mount(<MonthInput defaultValue="Feb 1983" />);
      const input = component.find('input');

      assert.equal(input.get(0).value, 'Feb 1983');
      assert(isSameDay(component.instance().getCurrentDate(), new Date(1983, 1, 1)));
    });

    it('should not format invalid defaultValue and default to today', () => {
      const component = mount(<MonthInput defaultValue="Veni, Vedi, Vici" />);
      const input = component.find('input');
      assert.equal(input.get(0).value, 'Veni, Vedi, Vici');
      assert(isToday(component.instance().getCurrentDate()));
    });
  });

  it('should not tab to the calendar button', () => {
    const component = mount(<MonthInput />);

    const toggle = component.find('InputGroupButton');
    const calendarButton = toggle.find('Button');
    assert.equal(calendarButton.props().tabIndex, -1);
  });

  it('should open and close when input addon clicked', () => {
    const component = mount(<MonthInput />);
    const dropdown = component.find('Dropdown');
    assert.equal(dropdown.props().isOpen, false);

    const toggle = component.find('InputGroupButton');
    toggle.simulate('click');
    assert.equal(dropdown.props().isOpen, true);

    toggle.simulate('click');
    assert.equal(dropdown.props().isOpen, false);
  });

  it('should open when focused if showOnFocus is true', () => {
    const component = mount(<MonthInput showOnFocus />);
    const dropdown = component.find('Dropdown');
    assert.equal(dropdown.props().isOpen, false);

    const input = component.find('input');
    input.simulate('focus');
    assert.equal(dropdown.props().isOpen, true);
  });

  it('should not open when focused if showOnFocus is false', () => {
    const component = mount(<MonthInput showOnFocus={false} />);
    const dropdown = component.find('Dropdown');
    assert.equal(dropdown.props().isOpen, false);

    const input = component.find('input');
    input.simulate('focus');
    assert.equal(dropdown.props().isOpen, false);
  });

  it('should not open when disabled is ture', () => {
    const component = mount(<MonthInput disabled />);

    const dropdown = component.find('Dropdown');
    assert.equal(dropdown.props().isOpen, false);

    const toggle = component.find('InputGroupButton');
    toggle.simulate('click');
    assert.equal(dropdown.props().isOpen, false);

    const input = component.find('input');
    input.simulate('focus');
    assert.equal(dropdown.props().isOpen, false);
  });

  it('should close when tab or esc pressed', () => {
    const component = mount(<MonthInput showOnFocus />);
    const input = component.find('input');
    const dropdown = component.find('Dropdown');

    input.simulate('focus');
    assert.equal(dropdown.props().isOpen, true);

    input.simulate('keydown', { key: 'Esc', keyCode: 27, which: 27 });
    assert.equal(dropdown.props().isOpen, false);

    input.simulate('focus');
    assert.equal(dropdown.props().isOpen, true);

    input.simulate('keydown', { key: 'Tab', keyCode: 9, which: 9 });
    assert.equal(dropdown.props().isOpen, false);
  });

  context('user input', () => {
    it('should set date after entering a valid date string', () => {
      const component = mount(<MonthInput />);
      const input = component.find('input');
      input.simulate('change', { target: { value: 'Dec 2014' } });
      assert(isSameDay(component.instance().getCurrentDate(), new Date(2014, 11, 1)));
    });

    it('should reset date after entering an invalid date string', () => {
      const component = mount(<MonthInput />);
      const input = component.find('input');
      input.simulate('change', { target: { value: 'Sandwiches' } });
      assert(isToday(component.instance().getCurrentDate()));
    });

    it('should reset date after clearing input', () => {
      const callback = sinon.spy();
      const component = mount(<MonthInput onChange={callback} />);
      const input = component.find('input');
      input.simulate('change', { target: { value: '' } });
      assert(isToday(component.instance().getCurrentDate()));
      assert(callback.calledWith('', false));
    });

    it('should call onChange after entering an invalid date string', () => {
      const callback = sinon.spy();
      const component = mount(<MonthInput onChange={callback} />);
      const input = component.find('input');
      input.simulate('change', { target: { value: 'Grape Jelly' } });
      assert(callback.calledWith('Grape Jelly', false));
    });

    it('should call onBlur after losing focus', () => {
      const callback = sinon.spy();
      const component = mount(<MonthInput onBlur={callback} />);
      const input = component.find('input');
      input.simulate('blur');
      assert(callback.calledOnce);
    });
  });

  context('date picker', () => {
    const callback = sinon.spy();
    const component = mount(<MonthInput onChange={callback} showOnFocus />);
    const toggle = component.find('InputGroupButton');
    toggle.simulate('click');

    it('should set date after clicking a date', () => {
      callback.reset();
      const firstDate = component.find('Label').first();
      const expectedDate = firstDate.props().date;
      firstDate.simulate('click');
      assert(isSameDay(component.instance().getCurrentDate(), expectedDate));
      assert(callback.calledWith(expectedDate, true));
    });

    it('should call onChange after clicking a date', () => {
      callback.reset();
      const lastDate = component.find('Label').first();
      const expectedDate = lastDate.props().date;
      lastDate.simulate('click');
      assert(callback.calledWith(expectedDate, true));
    });

    it('should set date after clicking prev year', () => {
      callback.reset();
      const expectedDate = addYears(component.instance().getCurrentDate(), -1);
      component.ref('prevYear').simulate('click');
      assert(isSameDay(component.instance().getCurrentDate(), expectedDate));
      assert(callback.calledWith(expectedDate, true));
    });

    it('should set date after clicking next year', () => {
      callback.reset();
      const expectedDate = addYears(component.instance().getCurrentDate(), 1);
      component.ref('nextYear').simulate('click');
      assert(isSameDay(component.instance().getCurrentDate(), expectedDate));
      assert(callback.calledWith(expectedDate, true));
    });

    it('should set date after clicking prev month', () => {
      callback.reset();
      const expectedDate = addMonths(component.instance().getCurrentDate(), -1);
      component.ref('prevMonth').simulate('click');
      assert(isSameDay(component.instance().getCurrentDate(), expectedDate));
      assert(callback.calledWith(expectedDate, true));
    });

    it('should set date after clicking next month', () => {
      callback.reset();
      const expectedDate = addMonths(component.instance().getCurrentDate(), 1);
      component.ref('nextMonth').simulate('click');
      assert(isSameDay(component.instance().getCurrentDate(), expectedDate));
      assert(callback.calledWith(expectedDate, true));
    });

    it('should set date after clicking today', () => {
      component.ref('today').simulate('click');
      assert(isSameMonth(new Date(), component.instance().getCurrentDate()));
    });

    it('should set date when using arrow keys', () => {
      const input = component.find('input');
      input.simulate('focus');

      let expectedDate = addYears(component.instance().getCurrentDate(), -1);
      input.simulate('keydown', { key: 'ArrowUp', keyCode: 38, which: 38 });
      assert(isSameDay(component.instance().getCurrentDate(), expectedDate));

      expectedDate = addMonths(component.instance().getCurrentDate(), -1);
      input.simulate('keydown', { key: 'ArrowLeft', keyCode: 37, which: 37 });
      assert(isSameDay(component.instance().getCurrentDate(), expectedDate));

      expectedDate = addYears(component.instance().getCurrentDate(), 1);
      input.simulate('keydown', { key: 'ArrowDown', keyCode: 40, which: 40 });
      assert(isSameDay(component.instance().getCurrentDate(), expectedDate));

      expectedDate = addMonths(component.instance().getCurrentDate(), 1);
      input.simulate('keydown', { key: 'ArrowRight', keyCode: 39, which: 39 });
      assert(isSameDay(component.instance().getCurrentDate(), expectedDate));
    });
  });

  context('date picker with controlled visible dates', () => {
    const callback = sinon.spy();
    const defaultDate = new Date(2017, 7, 14);
    const dateVisible = (date) => isSameDay(date, defaultDate);
    const component = mount(<MonthInput defaultValue={defaultDate} onChange={callback} dateVisible={dateVisible} showOnFocus />);
    const toggle = component.find('InputGroupButton');
    toggle.simulate('click');

    it('should pass dateVisible func to Calendar component', () => {
      const calendar = component.find('MonthCalendar');
      assert.equal(calendar.props().dateVisible, dateVisible);
    });

    it('should not allow to pick invisible date', () => {
      callback.reset();
      const currentDate = component.instance().getCurrentDate();
      const firstDate = component.find('Label').first();
      assert.equal(isSameDay(currentDate, firstDate.props().date), false);

      firstDate.simulate('click');
      assert(callback.notCalled);
      assert(isSameDay(currentDate, component.instance().getCurrentDate()));
    });
  });

  it('should render custom header prop', () => {
    const Custom = () => (<div className='custom-header'>Custom Header</div>);
    const component = mount(<MonthInput header={<Custom />} />);
    assert.equal(component.find('div.custom-header').length, 1);
    assert.equal(component.find('header.py-2').length, 0);
  });

  it('should render custom footer prop', () => {
    const Custom = () => (<div className='custom-footer'>Custom Footer</div>);
    const component = mount(<MonthInput footer={<Custom />} />);
    assert.equal(component.find('div.custom-footer').length, 1);
    assert.equal(component.find('footer.pb-2').length, 0);
  });

  it('should call custom parse function', () => {
    const callback = sinon.spy(() => new Date(2003, 0, 2));
    mount(<MonthInput parse={callback} defaultValue="1-2-3" dateFormat="MM-DD-YY" />);
    assert(callback.calledWith('1-2-3', 'MM-DD-YY'));
  });
});