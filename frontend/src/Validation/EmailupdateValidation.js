import * as Yup from "yup";

export const OldEmailSchema = Yup.object({
  oldEmail: Yup.string()
    .email("Invalid email")
    .required("Old email required"),
});

export const OtpSchema = Yup.object({
  otp: Yup.string()
    .required("OTP required"),
});

export const NewEmailSchema = Yup.object({
  newEmail: Yup.string()
    .email("Invalid email")
    .required("New email required"),
});