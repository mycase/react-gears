import React from 'react';
import { storiesOf, action } from '@storybook/react';

import { HasManyFieldsAdd, HasManyFieldsRow, Icon } from '../src';
import { Input, Button } from 'reactstrap';

const items = [
  'Chocolate Chip',
  'Oatmeal Raisin',
  'Snickerdoodle'
];

class HasManyFields extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: props.items.slice()
    }
  }

  updateItem = i => e => {
    let items = this.state.items.slice();
    items[i] = e.target.value;
    this.setState({ items });
  }

  addItem = () => {
    let items = this.state.items.slice();
    items.push('');
    this.setState({ items });
  }

  deleteItem = i => () => {
    let items = this.state.items.slice();
    items.splice(i, 1);
    this.setState({ items });
  }

  render() {
    return (
      <div>
        { this.state.items.map((item, i, items) => (
          <HasManyFieldsRow onDelete={this.deleteItem(i)} key={i + '.' + items.length}>
            <Input value={item} onChange={this.updateItem(i)} />
          </HasManyFieldsRow>
        )) }

        <HasManyFieldsAdd onClick={this.addItem}>Add A Cookie</HasManyFieldsAdd>
      </div>
    );
  }
}

storiesOf('HasManyFields', module)
  .addWithInfo('Row Wrapper', () => (
    <HasManyFields items={items}/>
  ));
