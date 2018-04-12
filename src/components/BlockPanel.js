import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import Button from './Button';
import Card from './Card';
import CardBody from './CardBody';
import CardHeader from './CardHeader';
import CardTitle from './CardTitle';
import Icon from './Icon';

class BlockPanel extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    color: PropTypes.string,
    controls: PropTypes.node,
    className: PropTypes.string,
    expandable: PropTypes.bool,
    hideOnToggle: PropTypes.bool,
    onEdit: PropTypes.func,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired
  };

  static defaultProps = {
    className: '',
    open: true,
    expandable: false,
    hideOnToggle: false,
    onToggle: () => {}
  };

  constructor(props) {
    super(props);

    this.state = {
      open: props.open
    };
  }

  toggle = () => {
    const open = !this.state.open;
    this.setState({ open }, () => this.props.onToggle(open));
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.open !== this.props.open) {
      this.setState({ open: nextProps.open });
    }
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { children, className, color, controls, expandable, hideOnToggle, title, onEdit, onToggle, ...props } = this.props;
    const { open } = this.state;

    // TODO simplify - these styles should be default Card, CardHeader styles in theme, not util classes
    const headerClassNames = classnames(
      'd-flex',
      'flex-wrap',
      'align-items-center',
      'justify-content-between',
      'py-2',
      'pr-2',
      {
        'pl-2': expandable,
        [`bg-${color}`]: color,
        'text-white': color === 'primary' || color === 'dark'
      }
    );

    return (
      <Card className={`border-0 shadow-1 ${className}`} {...props}>
        <CardHeader
          className={headerClassNames}
        >
          <div
            className="d-inline-flex align-items-center"
            onClick={this.toggle}
            ref="title"
            role={expandable ? 'button' : undefined}
          >
            {expandable ?
              <Icon
                className={`${(color !== 'primary' && color !== 'dark') ? 'text-muted' : ''} mr-1`}
                name="caret-right"
                rotate={open ? 90 : undefined}
                fixedWidth
                style={{ transition: 'transform 200ms ease-in-out' }}
              /> : null}
            <CardTitle className="m-0 my-1 mr-auto">
              {title}
            </CardTitle>
          </div>
          <div className="d-inline-flex">
            {controls && controls}
            {onEdit && (
              <Button
                color="link"
                className={`${(color === 'primary' || color === 'dark') ? 'text-white' : ''} p-0 ml-2 mr-1`}
                ref="edit"
                onClick={onEdit}
                role="button"
              >
                edit
              </Button>
            )}
          </div>
        </CardHeader>
        {children && (!expandable || open || hideOnToggle) ?
          <CardBody hidden={expandable && !open && hideOnToggle}>
            {children}
          </CardBody>
          : null}
      </Card>
    );
  }
}

export default BlockPanel;
