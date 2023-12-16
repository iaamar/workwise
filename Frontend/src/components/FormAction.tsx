// Importing necessary dependencies
import { useTranslation } from "react-i18next";
import React from "react";

// CSS class for styling form action button
const formActionCss =
  "justify-evenly flex cursor-pointer items-center bg-primary-light text-xs dark:focus-visible:outline-white border-1 box-border h-[40px] w-full rounded border-none bg-primary-800 outline outline-2 outline-primary-400 hover:bg-primary-600 text-white uppercase";

// Interface definition for FormActionProps
interface FormActionProps {
  handleSubmit: any;
  type?: "submit" | "button" | "reset";
  action?: string;
  text: string;
  isDisabled?: boolean;
}

// FormAction component definition
const FormAction = ({
  handleSubmit,
  type = "button",
  action = "submit",
  text,
  isDisabled = false,
}: FormActionProps) => {
  const { t } = useTranslation("common");

  // Rendering the component
  return (
    <>
      {type === "button" ? (
        <button
          disabled={isDisabled}
          type={action as "submit" | "button" | "reset" | undefined}
          className={formActionCss}
          onClick={handleSubmit}
        >
          {t(text)}
        </button>
      ) : (
        <></>
      )}
    </>
  );
};

export default FormAction;
