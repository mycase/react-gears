import Omit from '../util/Omit';
type DateOrString = Date | string;

interface DateInputPropTypes extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'className' | 'size' | 'id' | 'className' | 'type' | 'onBlur' | 'onChange' | 'onClick' | 'onFocus' | 'onKeyDown' | 'disabled' | 'value' | 'defaultValue'>
{
  className?: string;
  dateVisible?: (currentDate: Date) => any[];
  dateFormat?: string;
  defaultValue?: DateOrString;
  disabled?: boolean;
  footer?: (JSX.Element | string) | (JSX.Element | string)[];
  header?: (JSX.Element | string) | (JSX.Element | string)[];
  id?: string;
  keyboard?: boolean;
  onBlur?: (ev: React.FocusEvent<HTMLInputElement>) => void;
  onChange?: (value: DateOrString, isDate: boolean) => void;
  parse?: (value: string, dateFormat: string) => DateOrString;
  showOnFocus?: boolean;
  value?: DateOrString;
}
declare const DateInput: React.StatelessComponent<DateInputPropTypes>;
export default DateInput;