import userRouter from "./user-routes.js";
import projectRouter from "./project-routes.js";
import workItemRouter from "./workItem-routes.js";
import authRouter from "./auth-routes.js";
import commentRouter from "./comment-routes.js";
import taskRouter from "./task-routes.js";
import * as authController from "../controllers/auth-controller.js";

export default (app) => {
  app.use("/api/users", authController.authMiddleware, userRouter); // Route for user
  app.use("/api/projects", authController.authMiddleware, projectRouter);
  app.use("/api/workitems", authController.authMiddleware, workItemRouter); // Route for workItem
  app.use("/api/auth", authRouter); // Route for authentication
  app.use("/api/comments", authController.authMiddleware, commentRouter);
  app.use("/api/tasks", authController.authMiddleware, taskRouter);
};
