import * as Yup from "yup";

export const loginValidationSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email address")
        .required("Field is Required"),
    password: Yup.string().required("Field is Required"),
});

const passwordRegex = /^(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\-]).*(?=.*[A-Z]).*(?=.*[a-z]).{8,}$/

export const registerValidationSchema = Yup.object().shape({
    first_name: Yup.string().required("Field is Required"),
    last_name: Yup.string().required("Field is Required"),
    email: Yup.string()
        .email("Invalid email address")
        .required("Field is Required"),
    phone: Yup.string()
        .min(8, "Invalid Phone number")
        .required("Field is Required"),
    // code: Yup.string().required("Required"),
    password: Yup.string().matches(passwordRegex, "Password requirements: Special Chars + Uppercase + Lower case + 8 characters min.").min(8, "Must be a minimum of 8 characters").required("Field is Required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Field is Required"),
});

export const businessProfileInfoValidationSchema = Yup.object().shape({
    business_name: Yup.string().required("Field is Required"),
    business_email: Yup.string().email("Invalid email address"),
    business_phone_number: Yup.string()
        .min(8, "Invalid Phone number")
        .required("Field is Required"),
    // code: Yup.string().required("Required"),
    business_address: Yup.string().required("Field is Required"),
    business_state: Yup.string().required("Field is Required"),
    business_country: Yup.string().required("Field is Required"),
    business_postal_code: Yup.string().required("Field is Required"),
    cac_number: Yup.string().required("Field is Required"),
    identity_doc: Yup.string().required("Field is Required"),
    identity_number: Yup.string().required("Field is Required"),
    // file: Yup.string().required("Field is Required")
});

export const resetPasswordValidationSchema = Yup.object().shape({
    newPassword: Yup.string().matches(passwordRegex, "Password requirements: Special Chars + Uppercase + Lower case + 8 characters min.").min(8, "Must be a minimum of 8 characters").required("Field is Required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords must match")
        .required("Field is Required"),
});

export const forgotPasswordValidationSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email address")
        .required("Field is Required"),
});