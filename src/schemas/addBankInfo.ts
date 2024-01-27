import * as Yup from "yup";

export const addBankInfoValidationSchema = Yup.object().shape({
    name: Yup.string().required("Field is Required"),
    accountName: Yup.string().required("Field is Required"),
    accountNumber: Yup.string().required("Field is Required"),
    country: Yup.string().required("Field is Required"),
    comment: Yup.string()
});