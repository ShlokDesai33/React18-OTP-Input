import { useLayoutEffect, useRef, useState } from "react";
import { clsx } from "clsx";

// ---- Types ---- //

interface OTPFieldProps {
  length: number;
  className?: string;
  error?: boolean;
}

interface NumericInputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  focus: boolean;
  error?: boolean;
}

// ---- x ---- //

// ---- Helper Component ---- //

const NumericInputField = ({
  focus,
  error,
  ...props
}: NumericInputFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (inputRef.current) {
      if (focus) {
        inputRef.current.focus();
        inputRef.current.select();
      } else {
        inputRef.current.blur();
      }
    }
  }, [focus]);

  return (
    <input
      type="text"
      autoComplete="off"
      maxLength={1}
      className={clsx(
        "ADD TAILWDINCSS STYLES HERE"
        /* conditional styles */
        error && "ADD TAILWDINCSS STYLES HERE",
      )}
      ref={inputRef}
      {...props}
    />
  );
};

// ---- x ---- //

// ---- Main Component ---- //

const OTPField = ({ length, className, error }: OTPFieldProps) => {
  const [activeInputIndex, setActiveInputIndex] = useState(0);
  const [inputs, setInputs] = useState(Array<string>(length).fill(""));

  const focusInput = (index: number) => {
    if (activeInputIndex === 0 && index === -1) return;
    setActiveInputIndex(Math.max(Math.min(length - 1, index), 0));
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!/^[0-9]$/.test(e.currentTarget.value)) {
      e.preventDefault();
    }
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;

    switch (key) {
      case "Backspace":
      case "Delete": {
        e.preventDefault();
        if (inputs[activeInputIndex].length !== 0) {
          const newInputs = [...inputs];
          newInputs[activeInputIndex] = "";
          setInputs(newInputs);
        } else {
          const newInputs = [...inputs];
          newInputs[activeInputIndex - 1] = "";
          setInputs(newInputs);
          focusInput(activeInputIndex - 1);
        }
        break;
      }
      case "ArrowLeft": {
        e.preventDefault();
        focusInput(activeInputIndex - 1);
        break;
      }
      case "ArrowRight": {
        e.preventDefault();
        focusInput(activeInputIndex + 1);
        break;
      }
      default: {
        if (/^[0-9]$/.test(key)) {
          e.preventDefault();
          const newInputs = [...inputs];
          newInputs[activeInputIndex] = key;
          setInputs(newInputs);
          if (activeInputIndex === length - 1) {
            setActiveInputIndex(-1);
          } else {
            focusInput(activeInputIndex + 1);
          }
          break;
        }
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pastedData = e.clipboardData
      .getData("text/plain")
      .trim()
      .slice(0, length - activeInputIndex)
      .split("");

    if (pastedData) {
      let nextFocusIndex = 0;
      const updatedInputs = [...inputs];

      updatedInputs.forEach((val, index) => {
        if (index >= activeInputIndex) {
          let changedValue = pastedData.shift() || val;
          changedValue = Number(changedValue) >= 0 ? changedValue : "";
          if (changedValue) {
            updatedInputs[index] = changedValue;
            nextFocusIndex = index;
          }
        }
      });

      setInputs(updatedInputs);
      if (nextFocusIndex === length - 1) {
        setActiveInputIndex(-1);
      } else {
        focusInput(nextFocusIndex + 1);
      }
    }
  };

  return (
    <div className={clsx("ADD TAILWDINCSS STYLES HERE", className)}>
      {inputs.map((value, index) => (
        <NumericInputField
          key={`input-${index}`}
          id={`input-${index}`}
          error={error}
          focus={activeInputIndex === index}
          onFocus={() => focusInput(index)}
          value={value}
          onChange={handleOnChange}
          onBlur={() => setActiveInputIndex(-1)}
          onKeyDown={handleOnKeyDown}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
};

export default OTPField;

// ---- x ---- //
