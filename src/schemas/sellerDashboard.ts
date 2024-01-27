import * as Yup from "yup";

const numberRegex = /^[0-9]+$/;
// const accountNmber = /^[0-9]{10}$/;

export const selectProductTypeSchema = Yup.object().shape({
  product_type: Yup.string().required("Field is Required"),
});

export const createAffiliateSchema = Yup.object().shape({
  product_type: Yup.string().required("Field is Required"),
  product_image: Yup.string(),
  product_name: Yup.string().required("Field is Required"),
  product_description: Yup.string().required("Field is Required"),
  product_category: Yup.string().required("Field is Required"),
  product_sub_category: Yup.string().required("Field is Required"),
  product_brand: Yup.string(),
  currency: Yup.string().required("Field is Required"),
  product_price: Yup.string().required("Field is Required"),
  quantity_available: Yup.string()
    .matches(numberRegex, "Please type a number")
    .required("Field is Required"),
  affiliate_url: Yup.string().required("Field is Required"),
  moq: Yup.string()
    .matches(numberRegex, "Please type a number")
    .required("Field is Required"),
});

export const createVirtualSchema = Yup.object().shape({
  product_type: Yup.string().required("Field is Required"),
  product_image: Yup.string(),
  product_name: Yup.string().required("Field is Required"),
  product_description: Yup.string().required("Field is Required"),
  product_category: Yup.string().required("Field is Required"),
  product_sub_category: Yup.string().required("Field is Required"),
  product_brand: Yup.string(),
  download_link: Yup.string().required("Field is Required"),
  quantity_available: Yup.string()
    .matches(numberRegex, "Please type a number")
    .required("Field is Required"),
  currency: Yup.string().required("Field is Required"),
  product_price: Yup.string().required("Field is Required"),
  moq: Yup.string()
    .matches(numberRegex, "Please type a number")
    .required("Field is Required"),
});

export const createPhysicalSchema = Yup.object().shape({
  product_type: Yup.string().required("Field is Required"),
  product_image: Yup.string(),
  product_name: Yup.string().required("Field is Required"),
  product_description: Yup.string().required("Field is Required"),
  product_category: Yup.string().required("Field is Required"),
  product_sub_category: Yup.string().required("Field is Required"),
  product_brand: Yup.string(),
  colors_available: Yup.string().required("Field is Required"),
  sizes_available: Yup.string().required("Field is Required"),
  quantity_available: Yup.string()
    .matches(numberRegex, "Please type a number")
    .required("Field is Required"),
  weight: Yup.string()
    .matches(numberRegex, "Please type a number").required("Field is Required"),
  weight_unit: Yup.string()
    .required("Field is Required"),
  moq: Yup.string()
    .matches(numberRegex, "Please type a number")
    .required("Field is Required"),
  currency: Yup.string().required("Field is Required"),
  product_price: Yup.string().required("Field is Required"),
});

export const WithdrawBalanceSchema = Yup.object().shape({
  account_type: Yup.string().required("Field is Required"),
  amount: Yup.string().required("Field is Required"),
  bankId: Yup.string().required("Field is Required"),
});
