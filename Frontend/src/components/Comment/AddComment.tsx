// Importing React modules and components
import React, { useState } from "react";
import Avatar from "react-avatar";
import { useSelector } from "react-redux";
import TextareaAutosize from "react-textarea-autosize";
import { selectCurrentUser } from "../../store/slices/user-slice";
import { useTranslation } from "react-i18next";

// Props interface for AddComment component
interface Props {
  onSave: (commentText: string) => void;
  onCancel: () => void;
}

// AddComment component for adding comments
const AddComment = ({ onSave, onCancel }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const currentUser = useSelector(selectCurrentUser);
  const [commentText, setCommentText] = useState("");

  const handleTextareaClick = () => {
    setIsEditing(true);
  };

  // Function to handle saving the comment
  const handleSave = () => {
    onSave(commentText);
    setIsEditing(false);
    setCommentText("");
  };

  // Function to handle canceling the comment
  const handleCancel = () => {
    onCancel();
    setIsEditing(false);
    setCommentText("");
  };

  const { t } = useTranslation("common");

  // Render the AddComment component
  return (
    <>
      {/* Container for the AddComment component */}
      <div className="flex flex-row align-center gap-2">
        <Avatar
          size="32"
          src={currentUser?.photoURL}
          round
          name={`${currentUser?.firstName} ${currentUser?.lastName}`}
        />

        {/* TextareaAutosize component for multiline comment input */}
        <div className="grow">
          <TextareaAutosize
            minRows={1}
            maxRows={2}
            onClick={handleTextareaClick}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={t("comment.input.comment.placeholder") + "..."}
            readOnly={!isEditing}
            className="w-full rounded-mhover:cursor-pointer custom-textarea p-3 border hover:bg-grey-100 border-grey-300 placeholder-grey-500 text-grey-900 focus:outline-none focus:ring-primary-900 focus:border-primary-900 focus:z-10 focus:border-2 custom-textarea"
          />

          {/* Buttons for saving and canceling the comment when in editing mode */}
          {isEditing && (
            <div className="flex flex-row gap-1 ">
              <button
                disabled={!commentText}
                className="bg-primary-900 text-white font-semibold hover:bg-primary-700 px-3 py-1 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer disabled:hover:bg-primary-900 disabled:hover:text-white disabled:hover:opacity"
                onClick={handleSave}
              >
                {t("comment.button.add.label")}
              </button>
              <button
                className=" text-grey-900 font-semibold bg-grey-200 hover:bg-grey-100 px-3 py-1 rounded-sm"
                onClick={handleCancel}
              >
                {t("comment.button.cancel.label")}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AddComment;
