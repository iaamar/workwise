// Importing necessary React components, hooks, and icons
import React, { useEffect, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { FaCheck, FaTimes } from "react-icons/fa";
import { RiCloseLine } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import Task from "./Task";
import { LiaTimesSolid } from "react-icons/lia";
import { LiaCheckSolid } from "react-icons/lia";
import { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";
import { createNewTask } from "../../store/slices/task-slice";
import { useTranslation } from "react-i18next";
import { use } from "i18next";
interface Props {
  tasks: Array<any>;
  assignees: Array<any> | undefined;
  onAddTask: (taskText: string) => void;
  onEditTask: (index: number, taskText: string) => void;
  onDeleteTask: (index: number) => void;
  ownerId: string;
  workItemId: string;
  isTaskEmpty?: boolean;
}

// TasksSection component displaying a list of tasks
const TasksSection = ({
  tasks,
  assignees,
  ownerId,
  workItemId,
  onAddTask,
  onEditTask,
  onDeleteTask,
  isTaskEmpty = false,
}: Props) => {
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;

  // Initializing Redux dispatch function
  const dispatch: AppDispatch = useDispatch();

  // Calculating task completion progress
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // State for managing new task input and its visibility
  const [newTask, setNewTask] = React.useState("");
  const [isAddingTask, setIsAddingTask] = React.useState(isTaskEmpty);
  const { t } = useTranslation("common");

  // Function to open the new task input
  const openNewTaskInput = () => {
    setIsAddingTask(true);
  };

  useEffect(() => {
    console.log("isTaskEmpty", isTaskEmpty);
    if (isTaskEmpty) {
      openNewTaskInput();
    }
  }, []);

  const addNewTask = () => {
    if (newTask.trim() !== "") {
      onAddTask(newTask.trim());
      setIsAddingTask(false);
      setNewTask("");
      const task = {
        description: newTask.trim(),
        ownerId: ownerId,
        workItemId: workItemId,
      };
      console.log("task", task);
      dispatch(createNewTask(task));
    }
  };

  // Function to discard the new task
  const discardNewTask = () => {
    setIsAddingTask(false);
    setNewTask("");
  };

  // Ref for the new task textarea element
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // useEffect hook to focus on the new task textarea when adding a task
  useEffect(() => {
    if (isAddingTask && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isAddingTask]);

  // Render the TasksSection component
  return (
    <div>
      {/* Task progress display */}
      <div className="flex flex-row justify-between items-center my-3">
        <div className="font-semibold">{t("tasks.button.label")}</div>
        {!isTaskEmpty ? (
          <div className="hover:cursor-pointer" onClick={openNewTaskInput}>
            <FaPlus size={24} />
          </div>
        ) : null}
      </div>
      {!isTaskEmpty ? (
        <div className="flex flex-row items-center">
          <div
            className="rounded-lg"
            style={{
              height: "16px",
              width: "100%",
              backgroundColor: "#D4D4D8",
            }}
          >
            <div
              className="rounded-lg"
              style={{
                height: "100%",
                width: `${progress}%`,
                backgroundColor: "#08845C",
              }}
            ></div>
          </div>
          <div
            style={{ width: "24%" }}
            className="flex flex-row justify-end grow-1"
          >
            {`${Math.round(progress)}% ${t("tasks.done.label")}`}
          </div>
        </div>
      ) : null}

      <div className="mt-3">
        {tasks.length
          ? tasks.map((task: any, index: number) => (
              <Task task={task} key={index} assignees={assignees} />
            ))
          : null}
        {/* Displaying new task input */}
        {isAddingTask ? (
          <div className="flex flex-row items-center justify-between">
            <div className="relative w-full">
              <TextareaAutosize
                ref={textareaRef}
                maxRows={3}
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter new task..."
                className="w-full p-1 pr-8 rounded-sm custom-textarea"
              />
              {/* Buttons for new task input */}
              <div className="absolute right-0 top-0 h-full flex items-center pr-2">
                <LiaTimesSolid
                  size={18}
                  className="cursor-pointer font-light"
                  onClick={discardNewTask}
                />
                <LiaCheckSolid
                  size={18}
                  className="ml-2 cursor-pointer font-light"
                  onClick={addNewTask}
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TasksSection;
