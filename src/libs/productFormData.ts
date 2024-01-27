import { ProductProps } from "types/product";

export const physicalProductValues = (data: ProductProps) => ({
  product_type: data?.type || "",
  product_image: "",
  product_name: data?.name || "",
  product_description: data?.description || "",
  product_category: data?.category || "",
  product_sub_category: data?.subCategory || "",
  product_brand: data?.brand || "",
  colors_available: data?.color?.join(", ") || "",
  sizes_available: data?.size?.join(", ") || "",
  quantity_available: data?.quantity || "",
  weight: data?.weight?.split(" ")[0] || "",
  weight_unit: data?.weight?.split(" ")[1] || "kg",
  dimension: "",
  moq: data?.moq || "",
  currency: data?.currency || "",
  product_price: data?.sellerPrice || data?.price || ""
});

export const affiliateProductValues = (data: ProductProps) => ({
  product_type: data?.type || "",
  product_image: "",
  product_name: data?.name || "",
  product_description: data?.description || "",
  product_category: data?.category || "",
  product_sub_category: data?.subCategory || "",
  product_brand: data?.brand || "",
  quantity_available: data?.quantity || "",
  currency: data?.currency || "",
  product_price: data?.sellerPrice || data?.price || "",
  affiliate_url: data?.affiliateUrl || "",
  moq: data?.moq || ""
});

export const virtualProductValues = (data: ProductProps) => ({
  product_type: data?.type || "",
  product_image: "",
  product_name: data?.name || "",
  product_description: data?.description || "",
  product_category: data?.category || "",
  product_sub_category: data?.subCategory || "",
  product_brand: data?.brand || "",
  quantity_available: data?.quantity || "",
  currency: data?.currency || "",
  product_price: data?.sellerPrice || data?.price || "",
  download_link: data?.downloadLink || "",
  moq: data?.moq || ""
});
