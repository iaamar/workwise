// Importing React modules and components
import React, { useEffect, useRef, useState } from "react";
import Avatar from "react-avatar";
import { useSelector } from "react-redux";
import TextareaAutosize from "react-textarea-autosize";
import { selectCurrentUser } from "../../store/slices/user-slice";

// Props interface for the Comment component
interface Props {
  onEdit: (commentText: string) => void;
  onDelete: () => void;
  comment: string;
}

// Comment component for displaying and editing comments
const Comment = ({ comment, onEdit, onDelete }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment);

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsEditing(true);
  };

  const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onEdit(editedComment);
    setIsEditing(false);
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onDelete();
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsEditing(false);
  };
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Effect to focus and select text in the textarea when in editing mode
  useEffect(() => {
    if (isEditing) {
      textareaRef?.current?.setSelectionRange(
        editedComment.length,
        editedComment.length
      );
      textareaRef?.current?.focus();
    }
  }, [isEditing]);

  // Render the Comment component
  return (
    <div>
      {/* Displaying the comment in editing mode or read-only mode */}
      {isEditing ? (
        <TextareaAutosize
          minRows={2}
          maxRows={3}
          value={editedComment}
          onChange={(e) => setEditedComment(e.target.value)}
          className="w-full p-1 rounded-sm custom-textarea"
          ref={textareaRef}
        />
      ) : (
        <div className="w-full my-2 text-sm">{comment}</div>
      )}

      {/* Buttons for actions based on editing mode */}
      {isEditing ? (
        <div className="flex flex-row gap-2">
          <button
            className="bg-primary-900 text-white font-semibold hover:bg-primary-700 px-3 py-1 rounded-sm"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="text-grey-900 font-semibold bg-grey-200 hover:bg-grey-100 px-3 py-1 rounded-sm"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex flex-row gap-2">
          <button
            className="text-grey-700 hover:underline text-sm"
            onClick={handleEdit}
          >
            Edit
          </button>
          <button
            className="text-grey-700 hover:underline text-sm"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default Comment;
