import * as Yup from "yup";

export const CheckoutValidationSchema = Yup.object().shape({
    firstName: Yup.string().required("Field is Required"),
    lastName: Yup.string().required("Field is Required"),
    email: Yup.string()
        .email("Invalid email address")
        .required("Field is Required"),
    phone: Yup.string()
        .min(8, "Invalid Phone number")
        .required("Field is Required"),
    // code: Yup.string().required("Required"),
    country: Yup.string().required("Field is Required"),
    state: Yup.string().required("Field is Required"),
    // city: Yup.string().required("Field is Required"),
    postalCode: Yup.string().required("Field is Required"),
    address: Yup.string().required("Field is Required"),
});