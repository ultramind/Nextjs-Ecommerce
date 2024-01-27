import * as Yup from "yup";

export const PersonalDetailsValidationSchema = Yup.object().shape({
    firstName: Yup.string().required("Field can't be empty"),
    lastName: Yup.string().required("Field can't be empty"),
    email: Yup.string().email("Invalid email address").required("Field can't be empty"),
    phoneNumber: Yup.string().min(10, "Invalid phone number").required("Field can't be empty"),
    // code: Yup.string()
});

export const AddressValidationSchema = Yup.object().shape({
    country: Yup.string().required("Field is required"),
    state: Yup.string().required("Field is required"),
    // city: Yup.string().required("Field is required"),
    postalCode: Yup.string().required("Field is required"),
    address: Yup.string().required("Field is required"),
});
