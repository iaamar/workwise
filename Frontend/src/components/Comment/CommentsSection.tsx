// Importing React modules and components
import React, { useState } from "react";
import Comment from "./Comment";
import AddComment from "./AddComment";
import CommentModel from "../../models/comment";
import Avatar from "react-avatar";
import { formatDateTimeConversational } from "../../utils/formatDates";
import { useTranslation } from "react-i18next";

// Props interface for the CommentsSection component
interface Props {
  comments: any[];
  onAddComment: (commentText: string) => void;
  onEditComment: (index: number, commentText: string) => void;
  onDeleteComment: (index: number) => void;
}

// CommentsSection component for displaying and managing comments
const CommentsSection = ({
  comments,
  onAddComment,
  onEditComment,
  onDeleteComment,
}: Props) => {
  console.log(comments);

  // Render the CommentsSection component
  const { t } = useTranslation("common");

  // Render the CommentsSection component
  return (
    <>
      {/* Title for the comments section */}
      <div className="font-semibold my-4">{t("comment.section.title")}</div>

      {/* AddComment component for adding new comments */}
      <div>
        <AddComment onSave={onAddComment} onCancel={() => {}} />
      </div>

      {/* Mapping through the array of comments to display each comment */}
      {comments.map((comment, index) => (
        <div key={comment._id} className="flex flex-row gap-2 my-4">
          <div>
            <Avatar
              size="32"
              src={comment?.authorId?.photoURL}
              round
              name={`${comment?.authorId?.firstName} ${comment?.authorId?.lastName}`}
            />
          </div>

          {/* Comment information and the Comment component for each comment */}
          <div className="grow flex flex-col">
            <div>
              <span className="text-grey-900 font-semibold text-sm">
                {comment?.authorId?.firstName} {comment?.authorId?.lastName}
              </span>
              <span className="text-grey-600 text-xs ml-2">
                {formatDateTimeConversational(comment.createdAt)}
              </span>
            </div>

            {/* Comment component for displaying and managing the comment */}
            <Comment
              key={comment._id}
              comment={comment.description}
              onEdit={(commentText) => onEditComment(index, commentText)}
              onDelete={() => onDeleteComment(index)}
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default CommentsSection;
