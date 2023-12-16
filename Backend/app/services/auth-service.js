import TokenModel from "../models/token.model.js";
import UserModel from "../models/user-model.js";
import * as userService from "./user-service.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";
import handlebars from "handlebars";
import { readFileSync } from "fs";
import { join, dirname } from "path";
/* Function for  authenticating a user */
export const authenticateUser = async (req, res) => {
  try {
    const { email, password } = req.body; // get user details from request body

    const user = await UserModel.findOne({ email: email }); // find user by email

    if (!user) {
      // if user is not found
      return null;
    } else {
      // Compare the provided password with the stored hashed password
      const passwordMatch = await bcrypt.compare(password, user.password);

      console.log("passwordMatch", passwordMatch);

      if (passwordMatch) {
        // if password matches
        // Exclude the password field from the savedUser
        const userWithoutPassword = user.toObject({
          getters: true,
          virtuals: false,
        });
        delete userWithoutPassword.password;
        console.log("--------------", userWithoutPassword);
        return { status: "success", data: userWithoutPassword };
      } else {
        return null; // if password does not match
      }
    }
  } catch (error) {
    throw error;
  }
};

/* Function for changing password */
export const changePassword = async (userId, oldPassword, newPassword) => {
  try {
    const user = await UserModel.findById({ _id: userId }).exec(); // find user by id
    if (!user) {
      // if user is not found
      return null;
    } else {
      // Compare the provided password with the stored hashed password
      const passwordMatch = await bcrypt.compare(oldPassword, user.password);

      if (passwordMatch) {
        userService.updateUser(userId, { password: newPassword });
      } else {
        return null; // if password does not match
      }
    }
  } catch (error) {
    throw error;
  }
};

export const requestPasswordReset = async (email) => {
  const user = await UserModel.findOne({ email });
  if (!user)
    throw new Error(
      "user With this email does not exist. Try creating a new account"
    );

  let token = await TokenModel.findOne({ userId: user._id });
  if (token) await token.deleteOne();

  let resetToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.hash(resetToken, 10);

  await new TokenModel({
    userId: user._id,
    token: hash,
    createdAt: Date.now(),
  }).save();

  const link = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&id=${user._id}`;

  await sendEmail(
    user.email,
    "Password Reset Request",
    {
      name: `${user.firstName} ${user.lastName}`,
      link: link,
    },
    "../utils/templates/requestResetPassword.handlebars"
  );
  return {
    status: "success",
    message: "Password reset link sent successfully. Please check your email",
  };
};

export const resetPassword = async (userId, token, password) => {
  let passwordResetToken = await TokenModel.findOne({ userId });

  if (!passwordResetToken) {
    throw new Error("Invalid or expired password reset token");
  }

  console.log(passwordResetToken.token, token);

  const isValid = await bcrypt.compare(token, passwordResetToken.token);

  if (!isValid) {
    throw new Error("Invalid or expired password reset token");
  }

  const hash = await bcrypt.hash(password, Number(10));

  await UserModel.updateOne(
    { _id: userId },
    { $set: { password: hash } },
    { new: true }
  );

  const user = await UserModel.findById({ _id: userId });

  sendEmail(
    user.email,
    "Password Reset Successfully",
    {
      name: user.name,
    },
    "../utils/templates/resetPassword.handlebars"
  );

  await passwordResetToken.deleteOne();

  return { message: "Password reset was successful" };
};

const sendEmail = async (email, subject, payload, template) => {
  try {
    console.log("email", process.env.EMAIL_HOST);
    console.log("email", process.env.EMAIL_USERNAME);
    console.log("email", process.env.EMAIL_PASSWORD);
    console.log("email", process.env.EMAIL_FROM);
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: true,
      debug: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // const source = fs.readFileSync(path.join(__dirname, template), "utf8");
    const source = readFileSync(
      join(dirname(new URL(import.meta.url).pathname), template),
      "utf8"
    );
    const compiledTemplate = handlebars.compile(source);

    const options = () => {
      return {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: subject,
        html: compiledTemplate(payload),
      };
    };

    // Send email
    transporter.sendMail(options(), (error, info) => {
      if (error) {
        console.log("error", error);
        return error;
      } else {
        console.log("info", res);
        return res.status(200).json({
          success: true,
        });
      }
    });
  } catch (error) {
    return error;
  }
};

export const verifyToken = async (userId, token) => {
  let passwordResetToken = await TokenModel.findOne({ userId });

  if (!passwordResetToken) {
    throw new Error("Invalid or expired password reset token");
  }
  const isValid = await bcrypt.compare(token, passwordResetToken.token);
  if (!isValid) {
    throw new Error("Invalid or expired password reset token");
  }
  return { message: "token verification successful", status: "success" };
};
