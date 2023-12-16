import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const FormExtra = () => {
  const { t } = useTranslation("common");

  // Render the checkbox and label for "Remember Me" option
  return (
    <div className="flex flex-row-reverse items-center justify-between ">
      {/* <div className="flex items-center cursor-pointer">
        <input
          id="remember-me"
          name="remember-me"
          type="checkbox"
          className="h-4 w-4 text-primary-900 focus:ring-primary-900 border-gray-300 rounded cursor-pointer"
        />
        <label
          htmlFor="remember-me"
          className="ml-2 block text-sm text-gray-900 cursor-pointer"
        >
          {t("login.button.rememberme.label")}
        </label>
      </div> */}

      {/* <div className="text-sm">
        <a
          href="#"
          className="font-medium text-primary-600 hover:text-primary-900"
        >
          {t("login.button.forgotpassword.label")}
        </a>
      </div> */}
      <div className="text-sm">
        <Link
          to="/forgot-password"
          className="font-medium text-primary-900 hover:text-primary-800"
        >
          {t("login.button.forgotpassword.label")}
        </Link>
      </div>
    </div>
  );
};

export default FormExtra;
