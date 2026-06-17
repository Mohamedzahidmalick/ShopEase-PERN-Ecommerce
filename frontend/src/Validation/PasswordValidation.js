import * as Yup from "yup";

export const PasswordSchema = Yup.object({

currentPassword: Yup.string()
.required("Current password required"),

newPassword: Yup.string()
.min(6,"Minimum 6 characters")
.required("New password required"),

confirmPassword: Yup.string()
.oneOf([Yup.ref("newPassword")],"Passwords must match")
.required("Confirm password required"),

});