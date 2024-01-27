import {
  useGetBrands,
  useGetCategories,
  useGetColors,
  useGetSubCategories,
} from "@api/category";
import {
  useCreateProduct,
  useDeleteImage,
  useDeleteImageFromCloudinary,
  useEditProduct,
  useUploadImages,
} from "@api/product";
import { useGetProduct } from "@api/seller";
import PictureIcon from "@assets/icons/Picture";
import { productTypeState } from "@atoms/productTypeState";
import { PrimaryButton, SecondaryButton } from "@components/Common/Buttons";
import CustomSelect from "@components/Common/CustomSelect";
import { InputField, NumberInput, TextArea } from "@components/Common/Input";
import Select from "@components/Common/Select";
import {
  affiliateProductValues,
  physicalProductValues,
  virtualProductValues,
} from "@libs/productFormData";
import { removeEmptyProperties } from "@utils/RemoveEmptyProps";
import { generateSignature } from "@utils/getSignature";
import { ConnectedFocusError } from "focus-formik-error";
import { ErrorMessage, Form, Formik } from "formik";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { BiLoaderAlt } from "react-icons/bi";
import { IoIosClose } from "react-icons/io";
import ImageUploading from "react-images-uploading";
import MultiSelect from "react-select";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  createAffiliateSchema,
  createPhysicalSchema,
  createVirtualSchema,
} from "src/schemas/sellerDashboard";
import { CreateProductProps } from "types/seller";

interface CreateProductFormProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  edit?: boolean;
}

function CreateProductForm({
  setShowModal,
  edit = false,
}: CreateProductFormProps) {
  const router = useRouter();
  const productType = useRecoilValue(productTypeState);
  const setProductType = useSetRecoilState(productTypeState);
  let submitAction: string | undefined = undefined;
  const [price, setPrice] = useState<string | undefined>("");
  const [images, setImages] = useState([]);
  const maxNumber = 5;

  //images
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const [removingIndex, setRemovingIndex] = useState<null | number>(null);

  const onChange = (imageList: any) => {
    setImages(imageList);
  };

  const { data } = useGetProduct(router?.query?.slug as string);

  useEffect(() => {
    if (data?.type) {
      setProductType(data?.type);
      setPrice(BigInt(data?.sellerPrice || data?.price).toLocaleString());
      setUploadedImages([...data?.productImages]);
    }
  }, [data]);

  const initialValues = useMemo(() => {
    if (productType.toLowerCase() === "physical") {
      return {
        ...physicalProductValues(data),
        product_type: productType,
        // product_price: data?.price || price,
      };
    }
    if (productType.toLowerCase() === "affiliate") {
      return {
        ...affiliateProductValues(data),
        product_type: productType,
        // product_price: data?.price || price,
      };
    }

    if (productType.toLowerCase() === "virtual") {
      return {
        ...virtualProductValues(data),
        product_type: productType,
        // product_price: data?.price || price,
      };
    }

    return { ...physicalProductValues(data), product_type: "" };
  }, [productType]);

  const createProductSchema = useMemo(() => {
    if (productType.toLowerCase() === "physical") {
      return createPhysicalSchema;
    } else if (productType.toLowerCase() === "affiliate") {
      return createAffiliateSchema;
    } else if (productType.toLowerCase() === "virtual") {
      return createVirtualSchema;
    }
    return createPhysicalSchema;
  }, [productType]);

  const { isLoading, mutate, isSuccess } = useCreateProduct();
  const {
    isLoading: editing,
    mutate: editProduct,
    isSuccess: edited,
  } = useEditProduct(router?.query?.slug as string);

  useEffect(() => {
    if (isSuccess || edited) {
      setShowModal(true);
    }
  }, [isSuccess, edited]);

  const sendProduct = (values: any) => {
    const data: Partial<CreateProductProps> = {
      name: values.product_name?.trim(),
      brand: values.product_brand?.trim(),
      currency: values.currency,
      category: values.product_category?.trim(),
      subCategory: values.product_sub_category?.trim(),
      description: values.product_description?.trim(),
      type: values.product_type?.toLowerCase(),
      price:
        typeof values?.product_price === "number"
          ? values?.product_price
          : Number(values?.product_price?.replace(/,/g, "")),
      size: values?.sizes_available?.replace(/ /g, "") || "",
      color: values?.colors_available?.replace(/ /g, "") || "",
      quantity: values?.quantity_available,
      moq: values?.moq,
      weight: values?.weight
        ? `${values?.weight?.toString()?.replace(/ /g, "")} ${
            values?.weight ? values?.weight_unit : ""
          }`
        : "",
      productImages: [...uploadedImages],
      downloadLink: values?.download_link?.trim(),
      affiliateUrl: values?.affiliate_url?.trim(),
      state: submitAction,
    };

    removeEmptyProperties(data);

    // console.log(data);
    if (edit) {
      editProduct(data);
      return;
    }

    mutate(data);
  };

  const uploadCallback = (data: any) => {
    const image = data?.secure_url;
    setUploadedImages((prev) => [...prev, image]);
  };

  const {
    isLoading: uploading,
    mutate: upload,
    isSuccess: uploaded,
  } = useUploadImages(uploadCallback);

  useEffect(() => {
    if (uploaded) {
      setImages([]);
    }
  }, [uploaded]);

  const uploadHandler = () => {
    const api_key = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

    const dataToSign = {
      timestamp: new Date().getTime().toString(),
    };

    const callBack = (data: any) => {
      const signature = data;
      if (signature) {
        images.forEach((img: any) => {
          const formData = new FormData();
          formData.append("file", img?.file);
          formData.append("api_key", api_key as string);
          formData.append("timestamp", dataToSign.timestamp);
          formData.append("signature", signature);

          upload(formData);
        });
      }
    };

    generateSignature(callBack, dataToSign);
  };

  const { mutate: deleteImageFromBackend } = useDeleteImage(
    router?.query?.slug as string,
  );

  const {
    isLoading: deleting,
    mutate: deleteImage,
    isSuccess: imageDeleted,
  } = useDeleteImageFromCloudinary();

  useEffect(() => {
    if (imageDeleted && removingIndex !== null) {
      setUploadedImages((prev) => {
        const res = prev.filter((item, index) => index !== removingIndex);
        return res;
      });
      setRemovingIndex(null);
    }
  }, [imageDeleted]);

  const removeImageHandler = (url: string, index: number) => {
    const api_key = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const urlArr = url.split("/");
    const publicIdSplit = urlArr[urlArr.length - 1].split(".");
    const public_id = publicIdSplit[0];

    if (edit) {
      deleteImageFromBackend({ publicId: public_id, index });
      return;
    }

    const dataToSign = {
      timestamp: new Date().getTime().toString(),
      public_id,
      invalidate: "true",
    };

    const callBack = (data: any) => {
      const signature = data;

      if (signature) {
        deleteImage({
          public_id,
          signature,
          api_key,
          timestamp: dataToSign.timestamp,
          invalidate: "true",
        });
      }
    };

    generateSignature(callBack, dataToSign);
  };

  const [selectedCategory, setSelectedCategory] = useState("");

  const { data: categories, isFetching: gettingCategories } =
    useGetCategories();
  const { data: subCategories, isFetching: gettingSubCategories } =
    useGetSubCategories(selectedCategory);

  //brands
  const { data: brands, isFetching: gettingBrands } = useGetBrands();

  //colors
  const { data: colors, isFetching: gettingColors } = useGetColors();

  return (
    <>
      <Formik
        enableReinitialize
        // validateOnMount
        initialValues={{
          ...initialValues,
          colors_available: data?.color?.join(", ") || "",
        }}
        validationSchema={createProductSchema}
        onSubmit={(values, { setSubmitting }) => {
          // console.log(values);
          sendProduct(values);
          setSubmitting(false);
        }}
      >
        {({ setFieldValue, values, setFieldError }) => (
          <Form>
            <ConnectedFocusError />
            <Select
              name="product_type"
              value={values.product_type}
              classNameContainer="block font-product_sans font-normal text-t14 mb-4 lg:mb-8"
              className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
              options={["physical", "virtual"]}
              productPlaceholder="Product Type"
              onChange={(value) => {
                setProductType(value);
              }}
              disabled={edit}
            />
            <div>
              <ImageUploading
                multiple
                value={images}
                onChange={onChange}
                maxNumber={maxNumber}
                dataURLKey="data_url"
                maxFileSize={2000000}
                inputProps={{
                  accept: ".png, .jpg, .jpeg",
                }}
              >
                {({
                  // imageList,
                  onImageUpload,
                  onImageRemove,
                  isDragging,
                  dragProps,
                  errors,
                }) => (
                  <div className="upload__image-wrapper mb-[0.95rem]">
                    <div
                      onClick={onImageUpload}
                      className="w-full max-w-full rounded-xs mb-[0.5rem] lg:mb-[1rem] flex cursor-pointer justify-center items-center flex-col gap-[0.56rem] min-h-[7rem] border-platinum border-xs"
                      {...dragProps}
                      style={isDragging ? { color: "red" } : undefined}
                    >
                      <PictureIcon />
                      <span className="block text-center md:max-w-xs">
                        {/* <button
                          type="button"
                          className="block mx-auto font-normal text-center hover:text-tangerine font-product_sans text-t12 lg:text-t14 text-chinese_silver w-fit"
                         
                        >
                          Click or drop to add product images
                        </button>{" "} */}
                        <p className="mt-1 font-medium text-t10 text-chinese_silver">
                          Maximum number images: 5
                        </p>
                        <p className="mt-1 text-red-500 text-t10">
                          {errors?.maxFileSize && "Size exceeds maximum of 2MB"}
                        </p>
                      </span>
                    </div>
                    {images?.length > 0 && (
                      <div className="flex items-center space-x-3 overflow-auto h-28 overflow-scroll-hidden">
                        {images?.map((image, index) => (
                          <div
                            key={index}
                            className="relative w-20 h-20 rounded-md image-item"
                          >
                            <Image
                              fill
                              src={image["data_url"]}
                              alt="product image"
                              className="object-cover object-center"
                            />
                            <div className="absolute -top-2 -right-2 image-item__btn-wrapper w-fit">
                              <button
                                type="button"
                                className="p-1 bg-gray-300 rounded-full group hover:bg-red-500"
                                onClick={() => onImageRemove(index)}
                              >
                                <IoIosClose className="w-4 h-4 group-hover:text-white" />
                              </button>
                            </div>
                          </div>
                        ))}
                        {images?.length > 0 && (
                          <span>
                            <button
                              onClick={uploadHandler}
                              disabled={uploading}
                              type="button"
                              className="flex items-center px-4 py-2 space-x-1 text-sm font-medium text-white rounded-md disabled:opacity-50 bg-tangerine"
                            >
                              {uploading && (
                                <BiLoaderAlt className="w-4 h-4 text-white animate-spin" />
                              )}
                              <span>Upload</span>
                            </button>
                            <span className="block mt-2 text-xs text-gray-400">
                              Please upload image(s) before creating the
                              product.
                            </span>
                          </span>
                        )}
                      </div>
                    )}
                    {uploadedImages.length > 0 && (
                      <div className="flex items-center space-x-3 overflow-auto h-28 overflow-scroll-hidden">
                        {uploadedImages?.map((image: string, index: number) => (
                          <div key={index} className="relative">
                            <span className="relative block w-20 h-20 overflow-hidden rounded-md">
                              <Image
                                fill
                                src={image}
                                alt="product image"
                                className="object-cover object-center"
                              />
                            </span>
                            <button
                              disabled={deleting}
                              type="button"
                              className="absolute -top-3 -right-3 text-granite_gray/70 hover:text-red-500"
                              aria-label="remove"
                              onClick={() => {
                                removeImageHandler(image, index);
                                setRemovingIndex(index);
                              }}
                            >
                              {typeof removingIndex === "number" ? (
                                removingIndex === index &&
                                deleting && (
                                  <BiLoaderAlt className="w-6 h-6 text-tangerine animate-spin" />
                                )
                              ) : (
                                <AiFillCloseCircle className="w-6 h-6" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </ImageUploading>
            </div>

            <InputField
              name="product_name"
              type="text"
              productPlaceholder="Product Name"
              classNameContainer="block font-product_sans font-normal text-t14 mb-4 lg:mb-8"
              className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
            />

            <TextArea
              name="product_description"
              productPlaceholder="Description"
              classNameContainer="block font-product_sans font-normal text-t14 mb-4 lg:mb-8"
              className="w-full border-platinum border-xs pt-4 outline-none lg:pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] resize-none rounded-xs min-h-[5rem] lg:min-h-[7rem]"
            />

            <CustomSelect
              name="product_category"
              value={values.product_category}
              classNameContainer="block font-product_sans font-normal text-t14 mb-4 lg:mb-8"
              className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
              options={
                categories?.data?.length > 0
                  ? categories?.data?.map(
                      (cat: { name: string; _id: string }) => ({
                        label: cat?.name,
                        value: cat?.name,
                      }),
                    )
                  : []
              }
              disabled={gettingCategories}
              productPlaceholder={
                gettingCategories ? "Getting Categories" : "Category"
              }
              onChange={(value) => {
                setSelectedCategory(value);
                setFieldValue("product_category", value);
                setFieldValue("product_sub_category", "");
              }}
            />
            <CustomSelect
              name="product_sub_category"
              value={values.product_sub_category}
              classNameContainer="block font-product_sans font-normal text-t14 mb-4 lg:mb-8"
              className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
              options={
                subCategories?.data?.length > 0
                  ? subCategories?.data?.map(
                      (cat: { name: string; _id: string }) => ({
                        label: cat?.name,
                        value: cat?.name,
                      }),
                    )
                  : []
              }
              disabled={gettingSubCategories}
              productPlaceholder={
                gettingSubCategories ? "Getting Sub-categories" : "Sub Category"
              }
              onChange={(value) => setFieldValue("product_sub_category", value)}
              handleOnClick={(toggleFunc) => {
                if (
                  subCategories?.data?.length === 0 ||
                  subCategories?.length === 0
                ) {
                  setFieldError(
                    "product_category",
                    "No subcategories under this category",
                  );
                  return;
                }
                toggleFunc();
              }}
            />
            <CustomSelect
              name="product_brand"
              value={values.product_brand}
              classNameContainer="block font-product_sans font-normal text-t14 mb-4 lg:mb-8"
              className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
              options={
                brands?.data?.length > 0
                  ? brands?.data?.map(
                      (brand: { name: string; _id: string }) => ({
                        label: brand?.name,
                        value: brand?.name,
                      }),
                    )
                  : []
              }
              disabled={gettingBrands}
              productPlaceholder={gettingBrands ? "Getting Brands" : "Brand"}
              onChange={(value) => setFieldValue("product_brand", value)}
            />
            {/* <InputField
              name="product_brand"
              type="text"
              productPlaceholder="Brand"
              classNameContainer="block font-product_sans font-normal text-t14 mb-4 lg:mb-8"
              className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
            /> */}
            {productType?.toLowerCase() === "physical" && (
              <>
                <div className="mb-4 lg:mb-8">
                  {values?.colors_available && (
                    <label className="block mb-2 font-bold font-product_sans text-t12 text-tangerine">
                      Available Colors
                    </label>
                  )}
                  <MultiSelect
                    name="colors_available"
                    placeholder={
                      gettingColors ? "Getting colors" : "Select colors"
                    }
                    isDisabled={gettingColors}
                    unstyled
                    classNames={{
                      container: () =>
                        "w-full border-platinum relative border-xs outline-none py-[0.45rem] px-[1.5rem] rounded-xs",
                      input: () => "font-product_sans font-normal text-t14",
                      placeholder: () =>
                        "text-light_silver font-product_sans font-normal text-t14",
                      menu: () =>
                        "bg-white shadow-md shadow-black/20 rounded-md left-0 absolute w-full text-t14",
                      option: () =>
                        "hover:bg-tangerine !cursor-pointer px-[1.5rem] font-product_sans rounded-md text-t14 py-[0.35rem] hover:text-white transition-all duration-100",
                      dropdownIndicator: () => "w-4 h-4 cursor-pointer",
                      clearIndicator: () => "w-4 h-4 cursor-pointer",
                      multiValue: () =>
                        `bg-tangerine text-white rounded text-t14 p-1 font-product_sans`,
                      valueContainer: () => "space-x-1",
                      noOptionsMessage: () =>
                        "bg-white shadow-sm rounded-md py-[0.45rem] font-product_sans text-t14 text-red-500 px-[1.5rem] w-full",
                    }}
                    options={
                      colors?.data?.length > 0
                        ? colors?.data?.map(
                            (color: { name: string; _id: string }) => ({
                              label: color?.name,
                              value: color?.name,
                            }),
                          )
                        : []
                    }
                    onChange={(values) => {
                      const colors = values?.map((color: any) => color.value);
                      setFieldValue("colors_available", colors.join(", "));
                    }}
                    defaultValue={
                      data?.color?.length > 0
                        ? data?.color?.map((color: string) => ({
                            label: color,
                            value: color,
                          }))
                        : ""
                    }
                    isMulti
                  />
                  <ErrorMessage name="colors_available">
                    {(msg: string) => (
                      <p className="mt-1 text-xs text-red-500">{msg}</p>
                    )}
                  </ErrorMessage>
                </div>
                <InputField
                  name="sizes_available"
                  type="text"
                  productPlaceholder="Sizes Available"
                  classNameContainer="block font-product_sans font-normal text-t14 mb-4 lg:mb-8"
                  className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
                  helperText="Enter multiple sizes by separating them with coma (,)"
                />
              </>
            )}

            <InputField
              name="quantity_available"
              type="tel"
              productPlaceholder={
                productType?.toLowerCase() === "virtual"
                  ? "Quantity"
                  : "Quantity Available"
              }
              classNameContainer="block font-product_sans font-normal text-t14 mb-4 lg:mb-8"
              className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
            />

            {productType?.toLowerCase() === "virtual" ? (
              <InputField
                name="download_link"
                type="url"
                productPlaceholder={"Download Link"}
                classNameContainer="block font-product_sans font-normal text-t14 mb-4 lg:mb-8"
                className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
              />
            ) : (
              ""
            )}

            {productType?.toLowerCase() === "affiliate" ? (
              <InputField
                name="affiliate_url"
                type="url"
                productPlaceholder={"Affiliate Link"}
                classNameContainer="block font-product_sans font-normal text-t14 mb-4 lg:mb-8"
                className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
              />
            ) : (
              ""
            )}

            {productType?.toLowerCase() === "physical" && (
              <>
                <div className="flex items-start mb-4 space-x-2 lg:mb-8">
                  <InputField
                    name="weight"
                    type="number"
                    productPlaceholder="Weight"
                    classNameContainer="block font-product_sans font-normal text-t14 w-full"
                    className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
                  />
                  <Select
                    name="weight_unit"
                    classNameContainer="block font-product_sans font-normal text-t14 lg:max-w-[5rem]"
                    className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1rem] rounded-xs"
                    options={[
                      {
                        label: "Kilogram(kg)",
                        value: "kg",
                      },
                      {
                        label: "Gram(g)",
                        value: "g",
                      },
                      {
                        label: "Milligram(mg)",
                        value: "mg",
                      },
                      {
                        label: "Pounds(lb)",
                        value: "lb",
                      },
                      {
                        label: "Ounces(oz)",
                        value: "oz",
                      },
                    ]}
                    productPlaceholder="Unit"
                    onChange={(value) => {
                      setFieldValue("weight_unit", value);
                    }}
                  />
                </div>
              </>
            )}

            <InputField
              name="moq"
              type="number"
              productPlaceholder="Minimum Order Quantity"
              min={1}
              classNameContainer="block font-product_sans font-normal text-t14 mb-4 lg:mb-8"
              className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
            />

            <Select
              name="currency"
              value={values.currency}
              classNameContainer="block font-product_sans font-normal text-t14 mb-4 lg:mb-8"
              className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
              options={[
                { value: "NGN", label: "Naira" },
                { label: "US Dollars", value: "USD" },
              ]}
              onChange={(value) => setFieldValue("currency", value)}
              productPlaceholder="Currency"
            />
            <NumberInput
              name="product_price"
              productPlaceholder={`Price ${
                values.currency ? `in ${values.currency}` : ""
              }`}
              value={price === "0" ? "" : price}
              max={9}
              classNameContainer="block font-product_sans font-normal text-t14 mb-4 lg:mb-8"
              className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
              handleFormatting={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPrice(
                  BigInt(
                    e.target?.value?.replaceAll(/\D/g, ""),
                  )?.toLocaleString(),
                );
                setFieldValue(
                  "product_price",
                  BigInt(
                    e.target?.value?.replaceAll(/\D/g, ""),
                  )?.toLocaleString(),
                );
              }}
            />
            <div className="flex justify-between gap-x-[14px]">
              {edit ? (
                <PrimaryButton
                  disabled={editing}
                  text="Update Product"
                  type="submit"
                />
              ) : (
                <>
                  <SecondaryButton
                    text="Save as Draft"
                    type="submit"
                    disabled={isLoading || uploadedImages.length === 0}
                    onClick={() => {
                      submitAction = "draft";
                    }}
                  />
                  <PrimaryButton
                    disabled={isLoading || uploadedImages.length === 0}
                    text="Publish Product"
                    type="submit"
                    onClick={() => {
                      submitAction = "published";
                    }}
                  />
                </>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default CreateProductForm;
