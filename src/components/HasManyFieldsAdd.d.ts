import ButtonProps from './props/Button';
import Omit from '../util/Omit';

interface HasManyFieldsAddPropTypes extends Omit<ButtonProps,'color'> {
  className?: string;
  children: (JSX.Element | string) | (JSX.Element | string)[];
  disabled?: boolean;
}
declare const HasManyFieldsAdd: React.StatelessComponent<HasManyFieldsAddPropTypes>;
export default HasManyFieldsAdd;