import { object, string } from "yup"; //TODO import only specific type
export const loginSchema = object().shape({
  username: string().required("Username is Required"),
  password: string().min(6, "Password Length must be at least 6"),
});
export const registrationSchema = object().shape({
  username: string().required("Username is Required"),
  name: string().required("Name is Required"),
  email: string().required("Email is required").email("Email is not valid"),
  password: string()
    .required("Password is required")
    .min(6, "Password Length must be at least 6"),
});
