import noop from 'lodash.noop';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import HasManyFieldsAdd from './HasManyFieldsAdd';
import HasManyFieldsRow from './HasManyFieldsRow';
import withDragHandler from './Reorderable/DragHandler';
import withReorderableContainer from './Reorderable/ReorderableContainer';
import withReorderableElement from './Reorderable/ReorderableElement';

class HasManyFields extends React.Component {
  static propTypes = {
    blank: PropTypes.any,
    defaultValue: PropTypes.array,
    disabled: PropTypes.bool,
    errors: PropTypes.array,
    label: PropTypes.string.isRequired,
    onAdd: PropTypes.func,
    onRemove: PropTypes.func,
    onUpdate: PropTypes.func,
    onChange: PropTypes.func,
    template: PropTypes.oneOfType([PropTypes.func, PropTypes.element])
      .isRequired,
    value: PropTypes.array,
    minimumRows: PropTypes.number,
    maximumRows: PropTypes.number,
    reorderable: PropTypes.bool,
  };

  static defaultProps = {
    defaultValue: [],
    errors: [],
    onAdd: noop,
    onRemove: noop,
    onUpdate: noop,
    onChange: noop,
    minimumRows: 1,
    maximumRows: Infinity,
    reorderable: false,
  };

  constructor(props) {
    super(props);

    this.isUncontrolled = typeof props.value === 'undefined';

    if (this.isUncontrolled) {
      this.state = {
        value: props.defaultValue
      };
    }

    this.rowRefs = [];
  }

  get value() {
    return this.isUncontrolled ? this.state.value : this.props.value;
  }

  set value(value) {
    this.props.onChange(value);
    this.isUncontrolled && this.setState({ value }); // eslint-disable-line no-unused-expressions
  }

  updateItem = i => (update) => {
    this.props.onUpdate(i, update);
    this.value = [
      ...this.value.slice(0, i),
      update,
      ...this.value.slice(i + 1)
    ];
  };

  addItem = () => {
    this.props.onAdd();
    const blank =
      typeof this.props.blank === 'function'
        ? this.props.blank(this.value)
        : this.props.blank;
    this.value = this.value.concat(blank);
    setTimeout(() => this.focusRow(this.rowRefs.length - 1));
  };

  deleteItem = i => () => {
    this.props.onRemove(i);
    this.value = [...this.value.slice(0, i), ...this.value.slice(i + 1)];
    setTimeout(() => this.focusRow(this.value.length > i ? i : i - 1));
  };

  setRowReference = index => (rowTemplate) => {
    this.rowRefs[index] = rowTemplate;

    if (this.rowRefs.every(row => row === null)) {
      this.rowRefs = [];
    }
  };

  focusRow = (index) => {
    const row = this.rowRefs[index];
    if (!row) {
      return;
    }
    const el = ReactDOM.findDOMNode(row);
    const firstInput = el.querySelectorAll('input, select, textarea')[0];
    firstInput && firstInput.focus(); // eslint-disable-line no-unused-expressions
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    const result = Array.from(this.value);
    const [removed] = result.splice(oldIndex, 1);
    result.splice(newIndex, 0, removed);
    this.value = result;
  };

  renderAddRow() {
    const { disabled, label, maximumRows } = this.props;

    if (this.value.length < maximumRows) {
      return (
        <div>
          <HasManyFieldsAdd onClick={this.addItem} disabled={disabled}>
            {label}
          </HasManyFieldsAdd>
        </div>
      );
    }

    return null;
  }

  render() {
    const { template: Template, disabled, errors, minimumRows, reorderable } = this.props;

    if (reorderable) {
      const DragHandler = withDragHandler();

      const ItemUI = ({ key, sortIndex, value }) => (
        <div className="d-flex">
          <DragHandler />
          <div style={{ width: '100%' }}>
            <HasManyFieldsRow
              onDelete={this.deleteItem(sortIndex)}
              key={key}
              deletable={this.value.length > minimumRows}
              disabled={disabled}
            >
              <Template
                value={value}
                errors={errors[sortIndex]}
                onChange={this.updateItem(sortIndex)}
                ref={this.setRowReference(sortIndex)}
                disabled={disabled}
              />
            </HasManyFieldsRow>
          </div>
        </div>
      );
      const SortableItem = withReorderableElement(ItemUI);

      const ContainerUI = () => (
        <div>
          {this.value.map((item, i) => (
            <SortableItem key={`item-${i}`} index={i} sortIndex={i} value={item} />
          ))}
          {this.renderAddRow()}
        </div>
      );
      const ReorderableContainer = withReorderableContainer(ContainerUI);

      return (
        <ReorderableContainer onSortEnd={this.onSortEnd} useDragHandle />
      );
    }

    return (
      <div>
        {this.value.map((item, i, items) => (
          <HasManyFieldsRow
            onDelete={this.deleteItem(i)}
            key={`${i}/${items.length}`}
            deletable={this.value.length > minimumRows}
            disabled={disabled}
          >
            <Template
              value={item}
              errors={errors[i]}
              onChange={this.updateItem(i)}
              ref={this.setRowReference(i)}
              disabled={disabled}
            />
          </HasManyFieldsRow>
        ))}
        {this.renderAddRow()}
      </div>
    );
  }
}

export default HasManyFields;
