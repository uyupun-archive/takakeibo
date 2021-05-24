import {ReactNode, useRef, MouseEvent} from 'react';
import {Button} from './button';

interface Props {
  children: ReactNode;
  isVisible: boolean;
  cancelText?: string;
  submitText?: string;
  submitBtnColor?: 'blue' | 'red';
  onCancel: () => void;
  onSubmit: () => void;
}

const Modal = (props: Props) => {
  const { children, isVisible, cancelText, submitText, submitBtnColor, onCancel, onSubmit } = props;

  if (!isVisible) return null;

  const ref = useRef(null);
  let btnColor = submitBtnColor || 'blue';
  let cancelBtnText = cancelText || 'キャンセル';
  let submitBtnText = submitText || '確定';

  const onClickRef = (event: MouseEvent<HTMLDivElement>): void => {
    if (ref.current === event.target) onCancel();
  }

  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 w-full h-screen overflow-hidden bg-black bg-opacity-25 z-50"
      onClick={(event) => onClickRef(event)}
    >
      <div className="absolute top-1/2 left-1/2 w-4/5 transform -translate-x-1/2 -translate-y-1/2 bg-white">
        <div className="p-8">{children}</div>
        <div className="flex justify-around item-center py-6 border-t border-gray-400">
          <Button color="gray" onClick={() => onCancel()}>{cancelBtnText}</Button>
          <Button color={btnColor} onClick={() => onSubmit()}>{submitBtnText}</Button>
        </div>
      </div>
    </div>
  );
};

export {Modal}
