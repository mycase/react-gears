import React, { Component } from 'react';
import { Table } from '../';
import classnames from 'classnames';
import addWeeks from 'date-fns/add_weeks';
import eachDay from 'date-fns/each_day';
import endOfWeek from 'date-fns/end_of_week';
import format from 'date-fns/format';
import isFuture from 'date-fns/is_future';
import isPast from 'date-fns/is_past';
import isSameDay from 'date-fns/is_same_day';
import isSameMonth from 'date-fns/is_same_month';
import isToday from 'date-fns/is_today';
import startOfDay from 'date-fns/start_of_day';
import startOfMonth from 'date-fns/start_of_month';
import startOfWeek from 'date-fns/start_of_week';
import style from './Calendar.scss';

// TODO locale/localize

const Day = ({ day, dateFormat, ...props }) => {
  const classNames = classnames(
    'text-center',
    { 'bg-primary text-white': day.selected },
    { 'text-muted': !day.sameMonth },
    style.date
  );
  return (
    <td
      className={classNames}
      {...props}
    >
      {format(day.date, dateFormat)}
    </td>
  );
};

class Calendar extends Component {

  static propTypes = {
    className: React.PropTypes.string,
    date: React.PropTypes.instanceOf(Date),
    dateFormat: React.PropTypes.string,
    onSelect: React.PropTypes.func,
    weekDayFormat: React.PropTypes.string
  };

  static defaultProps = {
    className: '',
    date: new Date(),
    dateFormat: 'D',
    weekDayFormat: 'dd',
    onSelect: () => {}
  };

  // TODO extract as module to share or test easier?:

  visibleDays(currentDate) {
    const start = startOfWeek(startOfMonth(currentDate));
    const end = endOfWeek(addWeeks(start, 5));

    // Generate calendar days:
    return eachDay(start, end).map(date => {
      return {
        selected: isSameDay(currentDate, date),
        date: startOfDay(date),
        past: isPast(date),
        today: isToday(date),
        sameMonth: isSameMonth(currentDate, date),
        future: isFuture(date)
      };
    });
  }

  visibleWeeks(currentDate) {
    const days = this.visibleDays(currentDate);
    // Chunk into list of weeks:
    const weeks = [];
    for (let i = 0, len = days.length; i < len; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return weeks;
  }

  render() {
    const { date, dateFormat, onSelect, weekDayFormat, ...props } = this.props;
    const weeks = this.visibleWeeks(date);

    return (
      <Table
        bordered={false}
        hover={false}
        striped={false}
        {...props}
      >
        <thead>
          <tr>
            {weeks[0].map((day, i) => <th key={i} className="text-center">{format(day.date, weekDayFormat)}</th>)}
          </tr>
        </thead>
        <tbody>
          {weeks.map((days, w) => (
            <tr key={w}>
              {days.map((day, d) => <Day day={day} dateFormat={dateFormat} key={d} onClick={() => onSelect(day.date)} />)}
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}

export default Calendar;