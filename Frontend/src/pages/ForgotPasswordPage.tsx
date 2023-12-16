import React, { useState } from "react";
import Input from "../components/Input";
import FormAction from "../components/FormAction";
import * as authService from "../services/auth-service";
import { set } from "lodash";
import { useParams } from "react-router-dom";

const ForgotPasswordPage = () => {
  console.log("forgot password page");
  const { id } = useParams();
  const { token } = useParams();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDisabled(true);
    console.log("forgot password", email);
    authService.forgotPassword(email).then(({ message, status }) => {
      if (status === "userdoesntexist") {
        setErrorMsg(message);
      } else if (status === "success") {
        setSuccessMsg(message);
      }
      //   if (res.status === 200) {
      //     setResponseMsg(res.data.message);
      //   } else {
      //     setError(res.data.message);
      //   }
    });
  };
  return (
    <div
      className="flex flex-col gap-4"
      style={{ width: "40%", margin: "0 auto", marginTop: "10%" }}
    >
      <div className="mx-auto text-center">
        <h1 className="text-3xl font-bold">Forgot Password ??</h1>
        <p className="mt-2 text-sm text-gray-500">
          Enter your email address below and we'll send you a link to reset your
          password.
        </p>
      </div>
      <form className="mt-6 space-y-6">
        <div>
          <Input
            handleChange={handleChange}
            value={email}
            labelText={""}
            labelFor="email"
            id="email"
            name="email"
            type="email"
            isRequired={true}
            placeholder={"Enter your email"}
          />
        </div>
        <div>
          <FormAction
            handleSubmit={handleSubmit}
            text={"Send reset link"}
            isDisabled={isDisabled}
          />
        </div>
      </form>

      <div className="text-success-main text-center">
        {successMsg ? <div>{successMsg}</div> : null}
      </div>
      <div className="text-error-900 text-center">
        {errorMsg ? <div>{errorMsg}</div> : null}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
