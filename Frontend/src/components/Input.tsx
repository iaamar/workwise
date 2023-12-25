const fixedInputClass =
  "rounded appearance-none relative block w-full px-3 py-2 border border-grey-300 placeholder-grey-500 text-grey-900 focus:outline-none focus:ring-primary-900 focus:border-primary-900 focus:z-10 focus:border-2  hover:bg-grey-100";

// Props interface definition for the Input component

interface InputProps {
  handleChange: any;
  handleBlur?: any;
  value: string;
  labelText: string;
  labelFor: string;
  id: string;
  name: string;
  type: string;
  isRequired?: boolean;
  placeholder?: string;
  customClass?: string;
  disabled?: boolean;
  pattern?: string;
}

// Input component definition
const Input = ({
  handleChange,
  handleBlur,
  value,
  labelText,
  labelFor,
  id,
  name,
  type,
  isRequired = false,
  placeholder,
  customClass,
  disabled = false,
  pattern = undefined,
}: InputProps) => {
  return (
    <div className="my-5">
      <input
        onChange={handleChange}
        value={value}
        id={id}
        name={name}
        type={type}
        required={isRequired}
        className={fixedInputClass + customClass}
        placeholder={placeholder}
        onBlur={handleBlur}
        disabled={disabled}
      />
    </div>
  );
};

export default Input;
