// Importing necessary modules
import { Suspense } from "react";
import AuthHeader from "../components/AuthHeader";
import Signup from "../components/Signup";

// SignupPage component
const SignupPage = () => {
  // Render the SignupPage component
  return (
    <>
      {/* Container for the SignupPage */}
      <div className="min-h-full h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ">
        <div className="max-w-md w-[600px] space-y-5 px-8 pb-4 pt-10 rounded-lg duration-100 ease-linear hover:text-primary-main hover:shadow-xl hover:outline-primary-main hover:bg-primary-100  dark:bg-dark-200">
          <Suspense fallback={<div></div>}>
            {/* AuthHeader component with signup-related information */}
            <AuthHeader
              heading="Sign Up to create an account"
              paragraph="Already have an account? "
              linkName="Login"
              linkUrl="/login"
            />

            {/* Signup component for user registration */}
            <Signup />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
