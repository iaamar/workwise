// Importing necessary components and assets
import { Link } from "react-router-dom";
import workwise_large from "../assets/workwise_large.png";
import { useTranslation } from "react-i18next";
// Defining the properties for AuthHeader component
interface AuthHeaderProps {
  heading?: string;
  paragraph?: string;
  linkName?: string;
  linkUrl?: string;
}

// AuthHeader component definition
const AuthHeader = ({
  heading,
  paragraph,
  linkName,
  linkUrl = "#",
}: AuthHeaderProps) => {
  // Using translation hook for internationalization
  const { t } = useTranslation("common");
  return (
    <div className="">
      {/* Displaying the application logo */}
      <div className="flex justify-center">
        <img alt="" className="h-24 w-24" src={workwise_large} />
      </div>

      {/* Displaying the heading based on the linkName */}
      <h2 className="text-center text-3xl text-gray-900 header-logo">
        {linkName === "signup" ? t("login.title") : t("signup.title")}
      </h2>

      {/* Displaying the paragraph with a Link to switch between login and signup */}
      <p className=" text-center text-sm text-gray-600 mt-5">
        {linkName === "signup"
          ? t("login.signup.info")
          : t("signup.login.info")}{" "}
        <Link
          to={linkUrl}
          className="font-medium text-primary-600 hover:text-primary-900"
        >
          {linkName === "signup"
            ? t("login.button.signup.label")
            : t("signup.button.login.label")}
        </Link>
      </p>
    </div>
  );
};

export default AuthHeader;
