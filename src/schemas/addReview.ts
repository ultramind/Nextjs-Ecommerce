import * as Yup from "yup";

export const addReviewValidationSchema = Yup.object().shape({
    title: Yup.string().required("Field is Required"),
    comment: Yup.string().required("Field is Required"),
});

export const replyValidationSchema = Yup.object().shape({
    reply: Yup.string().required("Field is Required"),
});