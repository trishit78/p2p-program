import { body, param, query, validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";

// Middleware to handle validation errors
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.type === "field" ? err.path : "unknown",
        message: err.msg,
      })),
    });
  }
  next();
};

// Auth validation rules
export const signUpValidation = [
  body("name")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Name is required"),
  body("email")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .isString()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  handleValidationErrors,
];

export const signInValidation = [
  body("email")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
  handleValidationErrors,
];

export const getUserByIdValidation = [
  param("id")
    .notEmpty()
    .withMessage("User ID is required"),
  handleValidationErrors,
];

// Code validation rules
export const codeRunValidation = [
  body("code")
    .isString()
    .notEmpty()
    .withMessage("Code is required"),
  body("language")
    .isIn(["javascript", "cpp", "python"])
    .withMessage("Language must be javascript, cpp, or python"),
  body("input")
    .optional()
    .isString(),
  body("expectedOutput")
    .optional()
    .isString(),
  handleValidationErrors,
];

export const submissionValidation = [
  body("code")
    .isString()
    .notEmpty()
    .withMessage("Code is required"),
  body("language")
    .isIn(["javascript", "cpp", "python"])
    .withMessage("Language must be javascript, cpp, or python"),
  body("input")
    .optional()
    .isString(),
  handleValidationErrors,
];

// API routes validation
export const answerValidation = [
  body("question")
    .notEmpty()
    .withMessage("Question is required"),
  body("solution")
    .notEmpty()
    .withMessage("Solution is required"),
  handleValidationErrors,
];

// LiveKit validation
export const getLivekitTokenValidation = [
  query("roomName")
    .isString()
    .notEmpty()
    .withMessage("Room name is required"),
  query("userName")
    .isString()
    .notEmpty()
    .withMessage("User name is required"),
  handleValidationErrors,
];
