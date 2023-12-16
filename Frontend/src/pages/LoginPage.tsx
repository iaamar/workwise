import { useTranslation } from "react-i18next";
import AuthHeader from "../components/AuthHeader";
import Login from "../components/Login";
import { Suspense } from "react";

// LoginPage component
const LoginPage = () => {
  // Render the component
  return (
    <>
      {/* Page container */}
      <div className="min-h-full h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 pt-10 px-6 pb-6 rounded-lg duration-100 ease-linear hover:text-primary-main hover:shadow-xl hover:outline-primary-main hover:bg-primary-100 dark:bg-dark-900">
          <Suspense fallback={<div>Loading translations...</div>}>
            <AuthHeader linkUrl="/signup" linkName={"signup"} />
            <Login />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
