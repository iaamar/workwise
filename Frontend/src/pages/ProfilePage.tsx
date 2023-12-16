import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../store/slices/user-slice";
import Input from "../components/Input";
import { updateProfileFileds } from "../constants/FormFields";
import FormAction from "../components/FormAction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  updateUserProfile,
  deleteUserAccount,
  logoutUser,
} from "../store/slices/user-slice";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { AppDispatch } from "../store/store";
import { useNavigate } from "react-router-dom";
import { resetProjectState } from "../store/slices/project-slice";
import { resetWorkItemState } from "../store/slices/workitem-slice";
import { useTranslation } from "react-i18next";

const ProfilePage = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const fields = updateProfileFileds;
  const fieldsState: { [key: string]: string } = {};
  fields.forEach((field) => (fieldsState[field.id] = ""));
  const [updateProfileState, setUpdateProfileState] = useState(fieldsState);

  const fileRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<File | null | undefined>(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const { t } = useTranslation("common");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setUpdateProfileState({
      ...updateProfileState,
      [e.target.id]: e.target.value,
    });
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {};
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(
      updateUserProfile({
        ...updateProfileState,
        _id: currentUser?._id,
      })
    );
    toast.success(t("profile.update.success.label"));
  };

  const handleFileUpload = async (image: File) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
        setIsImageUploading(true);
      },
      (error) => {
        toast.error(t("profile.image.upload.error.label"));
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUpdateProfileState({
            ...updateProfileState,
            photoURL: downloadURL,
          });
          dispatch(
            updateUserProfile({
              ...updateProfileState,
              _id: currentUser?._id,
              photoURL: downloadURL,
            })
          );
          setIsImageUploading(false);
          toast.dismiss("upload-progress");
          toast.success(t("profile.image.upload.success.label"));
        });
      }
    );
  };

  useEffect(() => {
    setUpdateProfileState({
      firstName: currentUser?.firstName ?? "",
      lastName: currentUser?.lastName ?? "",
      email: currentUser?.email ?? "",
      photoURL: currentUser?.photoURL ?? "",
    });
  }, [currentUser]);

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const changeUserPassword = () => {};

  const deleteAccount = async () => {
    await dispatch(deleteUserAccount(currentUser?._id ?? ""));
    navigate("/login");
  };

  const logout = async () => {
    await dispatch(logoutUser());
    dispatch(resetProjectState());
    dispatch(resetWorkItemState());
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        {t("profile.title")}
      </h1>
      <form className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) =>
            setImage(e?.target?.files ? e.target.files[0] : null)
          }
        />
        <img
          src={currentUser?.photoURL}
          alt="profile"
          className="h-44 w-44 self-center cursor-pointer rounded-full object-cover mt-2"
          onClick={() => fileRef?.current?.click()}
        />

        <p className="text-sm self-center">
          {isImageUploading ? (
            <span className="text-primary">{`${t(
              "profile.uplaod.uploading.label"
            )}: ${imagePercent} %`}</span>
          ) : null}
        </p>
        <div className="">
          {fields.map((field) => (
            <div key={field.id}>
              <Input
                key={field.id}
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={updateProfileState[field.id]}
                labelText={t(`profile.input.${field.id}.label`)}
                labelFor={field.labelFor}
                id={field.id}
                name={field.name}
                type={field.type}
                isRequired={field.isRequired}
                placeholder={`profile.input.${field.id}.placeholder`}
                disabled={field.disabled}
              />
            </div>
          ))}
          <FormAction
            handleSubmit={handleSubmit}
            text={t("profile.button.update.label")}
          />
        </div>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={deleteAccount}
          className="justify-evenly flex cursor-pointer items-center bg-primary-light text-xs dark:focus-visible:outline-white border-1 box-border h-[40px] w-full rounded border-none bg-error-800 outline outline-2 outline-error-400 hover:bg-error-600 text-white uppercase"
        >
          {t("profile.button.delete.label")}
        </span>
      </div>
    </div>
  );
};

export default ProfilePage;
