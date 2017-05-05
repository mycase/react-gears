import React, { Component } from 'react';
import { Icon } from '../';
import styles from './InfoBox.scss';

export default class InfoBox extends Component {
  static propTypes = {
    className: React.PropTypes.string,
    color: React.PropTypes.string,
    children: React.PropTypes.node,
    icon: React.PropTypes.string,
    title: React.PropTypes.string,
    vertical: React.PropTypes.bool
  };

  static defaultProps = {
    className: '',
    color: 'info',
    vertical: false
  };

  render() {
    const { className, color, icon, title, children, vertical, ...props } = this.props;

    const headerClasses = `text-${color} font-weight-normal d-flex justify-content-between m-0 mb-3`;

    return (
      <div className={`${styles.infobox} text-${color} ${vertical ? styles.vertical : ''} p-3 ${className}`} {...props}>
        {title ?
          <h1 ref="title" className={headerClasses}>
            {title}
            {icon ? <Icon name={icon} /> : null}
          </h1>
          : null}
        <div ref="children" className="text-gray-dark">
         {children}
        </div>
      </div>
    );
  }
}