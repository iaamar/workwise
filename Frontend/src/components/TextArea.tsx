import { useLayoutEffect, useState, useRef } from "react";

export const TextArea = (props: TitleProps): JSX.Element => {
  const {
    name,
    value,
    setValue,
    placeholder,
    readOnly,
    autofocus,
    textareaClassName,
    onFocus,
    onBlur,
    disabled,
  } = props;

  const [textareaHeight, setTextareaHeight] = useState<number>(200);
  const textareaRef = useRef<HTMLParagraphElement>(null);

  const handleOnFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const length = target.value.length;
    // Place cursor at the end of the current text
    target.setSelectionRange(length, length);
    if (onFocus) onFocus();
  };

  const handleTitleChange = (e: React.FormEvent<HTMLTextAreaElement>): void => {
    const value = e.currentTarget.value;
    setValue(value);
  };

  const valueIsNotOnlySpaces = (): boolean => {
    return !/^( )\1*$/.test(value);
  };

  useLayoutEffect(() => {
    if (!textareaRef.current) return;

    //setTextareaHeight(textareaRef.current.scrollHeight);
  }, [value]);

  return (
    <div className="relative">
      <textarea
        disabled={disabled}
        name={name}
        className={`
          box-border w-full p-3 border hover:bg-grey-100 border-grey-300 placeholder-grey-500 text-grey-900 focus:outline-none focus:ring-primary-900 focus:border-primary-900 focus:z-10 focus:border-2 rounded-md custom-textarea
           ${textareaClassName}`}
        value={value}
        onChange={handleTitleChange}
        placeholder={placeholder}
        readOnly={readOnly}
        onFocus={handleOnFocus}
        onBlur={onBlur}
        style={{ height: `200px` }}
        autoFocus={autofocus}
      />
      <p
        ref={textareaRef}
        className={`
          absolute top-0 left-0 -z-10 box-border p-3 opacity-0
           ${textareaClassName}`}
      >
        {(valueIsNotOnlySpaces() && value) || placeholder}
      </p>
    </div>
  );
};

interface TitleProps {
  name: string;
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
  autofocus?: boolean;
  readOnly?: boolean;
  textareaClassName?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
}
