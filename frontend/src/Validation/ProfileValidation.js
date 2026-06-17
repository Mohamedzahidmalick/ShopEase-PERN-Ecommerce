import * as Yup from "yup";

export const ProfileSchema = Yup.object({

name: Yup.string()
.min(3,"Name too short")
.required("Name required"),

email: Yup.string()
.email("Invalid email")
.required("Email required"),

phone: Yup.string()
.matches(/^[0-9]{10}$/,"Phone must be 10 digits")
.required("Phone required")

});

