import {ReactNode} from 'react';

interface Props {
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  size?: 'small' | 'medium';
  color?: 'blue' | 'red' | 'gray';
  customClass?: string;
  isLink?: boolean;
  onClick?: () => void;
}

const Button = (props: Props) => {
  const {children, type, size, color, customClass, isLink, onClick} = props;

  if (isLink) {
    return (
      <button
        type="button"
        className={`${customClass || ''} text-blue-400 underline`}
        onClick={() => {
          if (onClick) onClick();
        }}
      >
        {children}
      </button>)
  }

  let sizeClass: string = 'px-10';
  if (size === 'medium') sizeClass = 'px-16';

  let colorClass: string = 'bg-blue-500 hover:bg-blue-700 focus:ring-blue-300';
  if (color === 'red') colorClass = 'bg-red-500 hover:bg-red-700 focus:ring-red-300';
  else if (color === 'gray') colorClass = 'bg-gray-500 hover:bg-gray-700 focus:ring-gray-300';

  return (
    <button
      type={type || 'button'}
      className={`${sizeClass} ${colorClass} ${customClass || ''} text-white font-bold py-2 px-10 rounded focus:outline-none focus:ring-2`}
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      {children}
    </button>
  );
};

export {Button};
