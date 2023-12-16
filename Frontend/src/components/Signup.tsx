import React, { ChangeEvent, useEffect, useState } from "react";
import FormAction from "./FormAction";
import Input from "./Input";
import { signupFields } from "../constants/FormFields";
import * as authService from "../services/auth-service";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

type FieldType = {
  id: string;
  labelText: string;
  labelFor: string;
  name: string;
  type: string;
  isRequired: boolean;
  placeholder: string;
};

type SignupState = {
  email: string;
  password: string;
  "confirm-password": string;
  firstName: string;
  lastName: string;
};

type ErrorState = {
  [key in keyof SignupState]: string;
};

const initialSignupState: SignupState = {
  email: "",
  password: "",
  "confirm-password": "",
  firstName: "",
  lastName: "",
};

const Signup: React.FC = () => {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const [signupState, setSignupState] =
    useState<SignupState>(initialSignupState);
  const [errorState, setErrorState] = useState<ErrorState>({
    email: "",
    password: "",
    "confirm-password": "",
    firstName: "",
    lastName: "",
  });
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    // Initially, the button should be disabled
    setIsButtonDisabled(true);
  }, []);

  const validateField = (fieldName: keyof SignupState, value: string) => {
    if (fieldName === "password" || fieldName === "confirm-password") {
      setErrorState((prevState) => ({
        ...prevState,
        [fieldName]:
          value.length >= 6
            ? ""
            : "Password must be at least 6 characters long",
      }));
    } else {
      setErrorState((prevState) => ({
        ...prevState,
        [fieldName]: value.trim() ? "" : "This field is required",
      }));
    }

    // Check if all fields are filled and set the button state
    const isAllFieldsFilled = Object.values(signupState).every(
      (field) => field.trim() !== ""
    );
    setIsButtonDisabled(!isAllFieldsFilled);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fieldName = e.target.id as keyof SignupState;
    const value = e.target.value;
    setSignupState((prevState) => ({ ...prevState, [fieldName]: value }));
    validateField(fieldName, value);
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const fieldName = e.target.id as keyof SignupState;
    const value = e.target.value;
    validateField(fieldName, value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      // Show a toast notification if the form is not valid
      alert("Please complete all fields.");
      return; // Prevent form submission
    }

    if (signupState.password !== signupState["confirm-password"]) {
      // Show an error message if passwords do not match
      setErrorState((prevState) => ({
        ...prevState,
        "confirm-password": "Passwords do not match",
      }));
      return; // Prevent form submission
    }

    await createAccount();
  };

  const validateForm = () => {
    let isValid = true;

    Object.keys(signupState).forEach((fieldName) => {
      const value = signupState[fieldName as keyof SignupState];
      validateField(fieldName as keyof SignupState, value);
      if (errorState[fieldName as keyof ErrorState]) {
        isValid = false;
      }
    });

    return isValid;
  };

  const createAccount = async () => {
    try {
      setLoading(true);
      const response = await authService.signup(signupState);

      if (response && typeof response === "object") {
        const userResponse = response as { status?: string; message?: string };

        if (userResponse.status === "userexists") {
          setErrorState((prevState) => ({
            ...prevState,
            email: userResponse.message || "",
          }));
        } else if (userResponse.status === "success") {
          toast.success("Signup successful", {
            autoClose: 2000,
            onClose: () => {
              navigate("/login");
            },
          });
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("Error during signup:", error);
      setLoading(false);
    }
  };

  const translate = (key: string) => t(key);

  return (
    <>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="text-center">
          {signupFields.map((field: FieldType) => (
            <div key={field.id}>
              <Input
                key={field.id}
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={signupState[field.id as keyof SignupState]}
                labelText={translate(`signup.input.${field.id}.label`)}
                labelFor={field.labelFor}
                id={field.id}
                name={field.name}
                type={field.type}
                isRequired={field.isRequired}
                placeholder={translate(`signup.input.${field.id}.placeholder`)}
              />
              {errorState[field.id as keyof ErrorState] && (
                <span style={{ color: "red" }}>
                  {errorState[field.id as keyof ErrorState]}
                </span>
              )}
            </div>
          ))}
          <button
  type="submit"
  className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-white text-md font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-10 uppercase ${
    isButtonDisabled ? "bg-grey-500" : "bg-primary-700"
  }`}
  disabled={isButtonDisabled}
>
  {translate("signup.button.signup.label")}
</button>
        </div>
      </form>
      {loading && <div>Loading...</div>}
    </>
  );
};

export default Signup;
