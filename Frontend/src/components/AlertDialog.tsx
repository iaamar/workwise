// Importing necessary components from the @radix-ui/react-alert-dialog library
import * as AlertDialog from "@radix-ui/react-alert-dialog";

// CSS classes for styling AlertDialog components
export const buttonBaseClass =
  "border-none py-1.5 px-3.5 rounded bg-grey-300 dark:bg-dark-100 font-primary-bold cursor-pointer";
export const alertDialogContentClass =
  "fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded bg-white p-5 shadow-lg dark:bg-dark-300";
export const alertDialogOverlayClass =
  "fixed top-0 left-0 z-50 h-full w-full bg-black bg-opacity-40";
export const alertDialogTitleClass = "mb-5 font-primary-black text-3xl";
export const alertDialogDescriptionClass = "mt-8 flex w-full justify-end gap-4";
export const alertDialogCancelClass =
  "hover:bg-grey-400 dark:text-font-light-dark dark:hover:bg-dark-500";
export const alertDialogConfirmClass =
  "bg-error-light text-error-dark hover:bg-error-hover dark:bg-error-main-dark dark:text-error-light-dark dark:hover:bg-error-hover-dark";

// Exporting AlertDialog components from the @radix-ui/react-alert-dialog library
export const Root = AlertDialog.Root;
export const Trigger = AlertDialog.Trigger;
export const Portal = AlertDialog.Portal;
export const Overlay = AlertDialog.Overlay;
export const Content = AlertDialog.Content;
export const Title = AlertDialog.Title;
export const Description = AlertDialog.Description;
export const Cancel = AlertDialog.Cancel;
export const Action = AlertDialog.Action;
