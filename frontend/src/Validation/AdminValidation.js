import * as Yup from "yup";

export const AdminLoginSchema = Yup.object({

  email: Yup.string()
    .email("Invalid email")
    .required("Email required"),

  password: Yup.string()
    .min(6, "Min 6 chars")
    .required("Password required"),

});