import { Link } from "react-router-dom";
import logo from "../assets/workwise.png";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../store/slices/user-slice";
import { useTranslation } from "react-i18next";
import { UserProfile } from "./UserProfile";

const MainHeader = (): JSX.Element => {
  const { t } = useTranslation("common");
  const currentUser = useSelector(selectCurrentUser);
  return (
    <header className="relative z-10 flex w-full items-center justify-between bg-white py-2 px-5 shadow-[0_1px_5px_-1px_rgba(0,0,0,0.3)] dark:bg-dark-200">
      <section className="hover:bg-primary-100 rounded">
        <Link
          to="/"
          className="flex cursor-pointer items-center rounded py-2 px-3 hover:bg-primary-light dark:hover:bg-dark-100"
        >
          <img src={logo} width={24} height={24} alt="Logo" />
          <span className="ml-2 text-lg font-bold text-primary-900">
            {t("header.title")}
          </span>
        </Link>
      </section>
      <section>
        <UserProfile />
      </section>
    </header>
  );
};

export default MainHeader;
