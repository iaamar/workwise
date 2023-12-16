import React, { ChangeEvent, Suspense, useEffect, useState } from "react";
import FormAction from "../components/FormAction";
import { resetPasswordFields } from "../constants/FormFields";
import Input from "../components/Input";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import * as authService from "../services/auth-service";

const PasswordResetPage = () => {
  const initialResetPasswordState = {
    password: "",
    "confirm-password": "",
  };

  const [queryParameters] = useSearchParams();
  const navigate = useNavigate();
  const [resetPasswordState, setResetPasswordState] = useState<any>(
    initialResetPasswordState
  );
  const [token] = useState(queryParameters.get("token"));
  const [userId] = useState(queryParameters.get("id"));
  const [validToken, setValidToken] = useState(false);
  const [response, setResponse] = useState<any>({});
  const [errorState, setErrorState] = useState<any>({
    password: "",
    "confirm-password": "",
  });
  const [loading, setLoading] = useState(false);

  const validateField = (fieldName: any, value: string) => {
    switch (fieldName) {
      case "password":
        setErrorState((prevState: any) => ({
          ...prevState,
          password:
            value.length >= 6
              ? ""
              : "Password must be at least 6 characters long",
        }));
        break;
      case "confirm-password":
        setErrorState((prevState: any) => ({
          ...prevState,
          "confirm-password":
            value === resetPasswordState.password
              ? ""
              : "Passwords do not match",
        }));
        break;
      default:
        const newErrorState = { ...errorState };
        newErrorState[fieldName] = value.trim() ? "" : "This field is required";
        setErrorState(newErrorState);
        break;
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fieldName = e.target.id;
    const value = e.target.value;
    setResetPasswordState((prevState: any) => ({
      ...prevState,
      [fieldName]: value,
    }));
    validateField(fieldName, value);
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const fieldName = e.target.id;
    const value = e.target.value;
    validateField(fieldName, value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      const res = await authService.resetPassword({
        password: resetPasswordState.password,
        token: queryParameters.get("token"),
        userId: queryParameters.get("id"),
      });
      console.log("password reset response", res);
      setResponse(res);
    }
  };

  const validateForm = () => {
    let isValid = true;

    Object.keys(resetPasswordState).forEach((fieldName) => {
      const value = resetPasswordState[fieldName];
      validateField(fieldName, value);
      if (errorState[fieldName]) {
        isValid = false;
      }
    });

    return isValid;
  };

  useEffect(() => {
    const validateToken = async () => {
      try {
        console.log("token", token);
        console.log("userId", userId);
        const response = await authService.validateToken({
          token,
          userId,
        });

        console.log("response", response);

        if (response.status === "success") {
          setValidToken(true);
        } else {
          setValidToken(false);
        }
      } catch (error) {
        console.error("Error validating token:", error);
        setValidToken(false);
      }
    };

    validateToken();
  }, [token]);

  return (
    <>
      <div
        className="flex flex-col gap-4"
        style={{ width: "40%", margin: "0 auto", marginTop: "10%" }}
      >
        {validToken ? (
          <Suspense fallback={<div></div>}>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="">
                {resetPasswordFields.map((field: any) => (
                  <div key={field.id}>
                    <Input
                      key={field.id}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      value={resetPasswordState[field.id]}
                      labelText={field.labelText}
                      labelFor={field.labelFor}
                      id={field.id}
                      name={field.name}
                      type={field.type}
                      isRequired={field.isRequired}
                      placeholder={field.placeholder}
                    />
                    {errorState[field.id] && (
                      <span style={{ color: "red" }}>
                        {errorState[field.id]}
                      </span>
                    )}
                  </div>
                ))}
                <FormAction handleSubmit={handleSubmit} text="RESET PASSWORD" />
              </div>
            </form>

            <div>
              {response.message && (
                <div className="text-center text-primary-900">
                  {response.message}
                </div>
              )}
              {response.error && (
                <div className="text-center text-error-900">
                  {response.message}
                </div>
              )}
            </div>
          </Suspense>
        ) : (
          <div className="flex justify-center items-center text-error-900 font-semibold text-lg">
            Invalid Link/ Link Expired. Please try again.
          </div>
        )}
      </div>
    </>
  );
};

export default PasswordResetPage;
