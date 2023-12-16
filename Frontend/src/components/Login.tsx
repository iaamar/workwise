import React, { ChangeEvent, useEffect, useState } from "react";
import { loginFields } from "../constants/FormFields";
import Input from "./Input";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  loginUser,
  selectLoginStatus,
} from "../store/slices/user-slice";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import FormExtra from "./FormExtra";

const fields = loginFields;

// Login component definition
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginState, setLoginState] = useState({
    email: "",
    password: "",
  });
  const loginStatus = useSelector(selectLoginStatus);

  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const [incorrectCredentials, setIncorrectCredentials] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLoginState((prevState) => ({ ...prevState, [id]: value }));
    setIncorrectCredentials(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    validateForm();

    if (isValid) {
      await authenticateUser();
    }
  };

  // Form validation function
  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!loginState.email) {
      errors.email = "Email is required";
    }

    if (!loginState.password) {
      errors.password = "Password is required";
    }

    setValidationErrors(errors);

    // Check if all fields are filled and set the button state
    const isAllFieldsFilled = Object.values(loginState).every(
      (field) => field.trim() !== ""
    );
    setIsButtonDisabled(!isAllFieldsFilled);
  };

  const authenticateUser = async () => {
    try {
      await dispatch(loginUser(loginState) as any); // Cast loginUser to 'any'
      if (loginStatus === "succeeded") {
        console.log("logged in successfully");
        navigate("/projects");
        dispatch(fetchUsers() as any); // Cast fetchUsers to 'any'
      } else {
        setIncorrectCredentials(true);
        console.log("login failed");
      }
    } catch (error) {
      console.log("login failed", error);
    }
  };

  // Set language on component mount
  useEffect(() => {
    if (loginStatus === "succeeded") {
      navigate("/projects");
    }
  }, [loginStatus, navigate]);

  const { t } = useTranslation("common");
  const { i18n } = useTranslation();

  function changeLang(lng: string) {
    i18n.changeLanguage(lng);
    setLanguage(lng);
  }

  const LANGUAGE_KEY = "language";

  const setLanguage = (language: string) => {
    localStorage.setItem(LANGUAGE_KEY, language);
  };

  useEffect(() => {
    const storedLanguage = getLanguage();
    changeLang(storedLanguage);
  }, []);

  const getLanguage = () => {
    return localStorage.getItem(LANGUAGE_KEY) || "en";
  };

  const isValid = Object.keys(validationErrors).length === 0;

  return (
    <div className="flex flex-col justify-between">
      <div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="">
            <Input
              handleChange={handleChange}
              value={loginState["email"]}
              labelText={t("login.input.email.label")}
              labelFor="email"
              id="email"
              name="email"
              type="email"
              isRequired={true}
              placeholder={t("login.input.email.placeholder")}
            />
            {validationErrors.email && (
              <p className="text-red-500">{validationErrors.email}</p>
            )}

            <Input
              handleChange={handleChange}
              value={loginState["password"]}
              labelText={t("login.input.password.label")}
              labelFor="password"
              id="password"
              name="password"
              type="password"
              isRequired={true}
              placeholder={t("login.input.password.placeholder")}
            />
            {validationErrors.password && (
              <p className="text-red-500">{validationErrors.password}</p>
            )}

            {incorrectCredentials && (
              <p className="text-red-500">
                {t("login.error.emailpassword.invalid")}.
              </p>
            )}
          </div>
          <FormExtra />
          <button
            type="submit"
            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-white text-md font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-10 uppercase ${
              isButtonDisabled
                ? "bg-grey-500 hover:bg-grey-500"
                : "bg-primary-700 hover:bg-primary-800"
            }`}
            disabled={!isValid}
          >
            {t("login.button.login.label")}
          </button>
        </form>
      </div>
      <div
        style={{ position: "absolute", bottom: "0", right: "0%" }}
        className="justify-center flex w-full"
      >
        <div className="flex items-center justify-center p-4">
          <button
            className="mr-2 hover:text-primary-900"
            onClick={() => changeLang("ta")}
          >
            தமிழ்
          </button>
          <button
            className="mr-2 hover:text-primary-900"
            onClick={() => changeLang("en")}
          >
            English
          </button>
          <button
            className="mr-2 hover:text-primary-900"
            onClick={() => changeLang("mr")}
          >
            मराठी
          </button>
          <button
            className="mr-2 hover:text-primary-900"
            onClick={() => changeLang("hi")}
          >
            हिंदी
          </button>
          <button
            className="mr-2 hover:text-primary-900"
            onClick={() => changeLang("te")}
          >
            తెలుగు
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
