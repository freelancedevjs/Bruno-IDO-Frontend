import React from "react";

interface ITextArea extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  className?: string;
  textAreaHeight?: string;
  error?: any;
}

const TextArea: React.FC<ITextArea> = ({
  label,
  className,
  textAreaHeight,
  error,
  value,
  ...rest
}) => {
  return (
    <>
      {label && (
        <label
          htmlFor={label}
          className={`block capitalize text-lg text-gray16 font-medium mb-3`}>
          {label}
        </label>
      )}
      <div className={`flex flex-col  ${className}`}>
        <textarea
          id={label}
          {...rest}
          value={value}
          className={`${textAreaHeight} luminousGradBg min-h-[150px] text-white placeholder:text-gray16  p-4  outline-none`}></textarea>
      </div>
      {error && (
        <p className="text-xs text-red-text capitalize font-medium leading-5">
          {error}
        </p>
      )}
    </>
  );
};

export default TextArea;
