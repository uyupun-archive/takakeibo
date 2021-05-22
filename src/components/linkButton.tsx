import {ReactNode} from 'react';

interface Props {
  children: ReactNode;
  customClass?: string;
  onClick?: () => void;
}

const LinkButton = (props: Props) => {
  const {children, customClass, onClick} = props;

  return (
    <button
      type="button"
      className={`${customClass || ''} text-blue-400 underline focus:outline-none focus:ring-2 focus:ring-blue-400`}
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      {children}
    </button>
  );
};

export {LinkButton}
