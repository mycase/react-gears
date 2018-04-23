import Omit from '../util/Omit';

interface FormRowPropTypes extends 
  Omit<React.HTMLAttributes<HTMLInputElement>, 'id'>{
  children?: (JSX.Element | string) | (JSX.Element | string)[];
  color?: string;
  label?: (JSX.Element | string) | (JSX.Element | string)[];
  hint?: string;
  feedback?: any;
  id?: string;
  required?: boolean;
  rowClassName?: string;
  type?: 'checkbox' | 'radio' | 'static' | 'file' | 'string';
  inline?: boolean;
  stacked?: boolean;
  state?: string;
  size?: string;
  width?: {
    size?: boolean | number | string
    push?: string | number
    pull?: string | number
    offset?: string | number
  }
}
declare const FormRow: React.StatelessComponent<FormRowPropTypes>;
export default FormRow;