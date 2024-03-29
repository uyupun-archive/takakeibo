import {ReactNode} from 'react';

interface Props {
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  size?: 'small' | 'medium';
  color?: 'blue' | 'red' | 'gray';
  customClass?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const Button = (props: Props) => {
  const {children, type, size, color, customClass, disabled, onClick} = props;

  const sizeClass: string = size === 'medium' ? 'max-w-xxs' : 'max-w-xxxs';

  let colorClass: string = 'bg-blue-500 hover:bg-blue-700 focus:ring-blue-300';
  if (color === 'red') colorClass = 'bg-red-500 hover:bg-red-700 focus:ring-red-300';
  else if (color === 'gray') colorClass = 'bg-gray-500 hover:bg-gray-700 focus:ring-gray-300';

  const disabledClass: string = disabled ? 'disabled:opacity-50' : '';

  return (
    <button
      type={type || 'button'}
      className={`${sizeClass} ${colorClass} ${customClass || ''} ${disabledClass} w-full text-white font-bold p-2 rounded focus:outline-none focus:ring-2`}
      disabled={disabled}
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      {children}
    </button>
  );
};

export {Button};
