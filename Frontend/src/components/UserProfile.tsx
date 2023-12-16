import { Link } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { FaPowerOff } from "react-icons/fa";
import cx from "classix";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, selectCurrentUser } from "../store/slices/user-slice";
import { UserAvatar } from "./UserAvatar";
import { resetProjectState } from "../store/slices/project-slice";
import { resetWorkItemState } from "../store/slices/workitem-slice";
import { useTranslation } from "react-i18next";
import { AppDispatch } from "../store/store";

export const UserProfile = (): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const { t } = useTranslation("common");
  const currentUser = useSelector(selectCurrentUser);
  const logout = async () => {
    await dispatch(logoutUser());
    dispatch(resetProjectState());
    dispatch(resetWorkItemState());
  };
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="px-1 py-1 rounded-full outline-2 outline-grey-300 hover:outline-primary-900">
        <UserAvatar
          name={currentUser?.firstName}
          image={currentUser?.photoURL}
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
            sideOffset={7}
          className={cx(
            "z-50 rounded-lg shadow-xl bg-white",
            "radix-side-bottom:animate-slide-down radix-side-top:animate-slide-up"
          )}
        >
          <DropdownMenu.Item className="flex p-5 hover:bg-primary-100 ">
            <Link to={`/profile`} className="flex flex-col items-center">
              <UserAvatar
                name={currentUser?.firstName}
                image={currentUser?.photoURL}
                size={60}
              />
              <span className="mt-2 text-lg font-semibold">
                {currentUser?.firstName} {currentUser?.lastName}
              </span>
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="h-px bg-grey-400 dark:bg-dark-100" />
          <DropdownMenu.Item className="select-none p-1 !outline-non">
            <span
              onClick={logout} // To prevent dropdown menu from closing
              className="flex w-full items-center gap-2 rounded p-2 font-bold text-error-900 hover:bg-error-200"
              aria-label="Log out"
            >
              <span className="hover:text-error-900">{t("profile.button.logout.label")}</span>
            </span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
