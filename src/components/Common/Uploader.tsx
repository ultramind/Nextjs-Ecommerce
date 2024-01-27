import { useDeleteImageFromCloudinary, useUploadImages } from "@api/product";
import { generateSignature } from "@utils/getSignature";
import { ErrorMessage, Field } from "formik";
import React, { useEffect, useId, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { HiUser } from "react-icons/hi";
import { IoIosClose } from "react-icons/io";

interface UploaderProps {
  name: string;
  required: boolean;
  className: string;
  disabled: boolean;
  accept: string;
  label: string;
  customImage: JSX.Element;
  callBack?: (url: string) => void;
}

function Uploader({
  name = "file",
  required = false,
  className,
  disabled = false,
  accept = "",
  label,
  customImage,
  callBack,
}: Partial<UploaderProps>) {
  const id = useId();
  const [currentFile, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");

  const filesPresence = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const endDrag = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const photoDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const dt = e.dataTransfer;
    const file = dt.files[0];

    handleFile(file);
  };

  const uploadCallback = (data: any) => {
    const image = data?.secure_url;
    setUrl(image);
    if (callBack) {
      callBack(image);
    }
  };

  const {
    isLoading: uploading,
    mutate: upload,
    isError,
  } = useUploadImages(uploadCallback);

  useEffect(() => {
    if (isError) {
      setFile(null);
    }
  }, [isError]);

  const uploadHandler = (file: File) => {
    const api_key = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

    const dataToSign = {
      timestamp: new Date().getTime().toString(),
    };

    const callBack = (data: any) => {
      const signature = data;
      if (signature) {
        const formData = new FormData();
        formData.append("file", file as Blob);
        formData.append("api_key", api_key as string);
        formData.append("timestamp", dataToSign.timestamp);
        formData.append("signature", signature);

        upload(formData);
      }
    };

    generateSignature(callBack, dataToSign);
  };

  const {
    isLoading: deleting,
    mutate: deleteImage,
    isSuccess: imageDeleted,
  } = useDeleteImageFromCloudinary();

  useEffect(() => {
    if (imageDeleted) {
      setFile(null);
      setUrl("");
      const inputField = document.getElementById(id);
      const imageElement = document.getElementById("document__image");
      if (inputField && imageElement) {
        inputField?.parentElement?.removeChild(imageElement);
      }
    }
  }, [imageDeleted]);

  const removeImageHandler = () => {
    const api_key = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const urlArr = url.split("/");
    const publicIdSplit = urlArr[urlArr.length - 1].split(".");
    const public_id = publicIdSplit[0];

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

  const getBase64 = (image: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFile = (file: File) => {
    // console.log(file);
    setFile(file);
    // if (file && file.type.includes("pdf")) {
    //   const imageElement = document.getElementById("image");
    //   if (imageElement) imageElement.remove();
    //   setFileType("pdf");
    //   return;
    // }
    if (file && file.type.includes("image")) {
      getBase64(file)
        .then((data) => {
          const inputField = document.getElementById(id);
          const currentImage = document.querySelector("#image");
          if (currentImage && currentFile) {
            inputField?.parentElement?.removeChild(currentImage);
          }
          const imageElement = document.createElement("img");
          imageElement.src = data as string;
          imageElement.id = "document__image";
          imageElement.className =
            "h-full w-auto object-center object-center rounded-[0.56rem]";

          if (inputField) {
            inputField?.parentElement?.append(imageElement);
          }
        })
        .finally(() => {
          uploadHandler(file);
        });
    }
  };

  return (
    <div className="relative">
      {url && (
        <button
          type="button"
          disabled={deleting}
          className="p-2 bg-gray-300 z-30 rounded-full group hover:bg-red-500 absolute -top-2 -right-2"
          onClick={removeImageHandler}
        >
          <IoIosClose className="w-4 h-4 group-hover:text-white" />
        </button>
      )}
      <Field
        as="label"
        htmlFor={id}
        onDrop={photoDrop}
        onDragOver={filesPresence}
        onDragEnd={endDrag}
        onDragLeave={endDrag}
        className={`relative group ${className}`}
        disabled={uploading || deleting}
      >
        <Field
          type="file"
          name={name}
          accept={accept}
          required={required}
          disabled={disabled || uploading || deleting}
          id={id}
          className="absolute top-0 w-0 h-0 -z-10 isolate"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) handleFile(e.target.files[0]);
          }}
        />
        {!currentFile &&
          (customImage ? (
            customImage
          ) : (
            <HiUser className="w-10 h-10 text-secondary" />
          ))}
        {!currentFile && (
          <h4 className="font-product_sans font-normal text-t12 lg:text-t14 text-chinese_silver text-center mx-auto w-fit block max-w-[11.31rem] lg:max-w-full">
            {label}
          </h4>
        )}
        {currentFile && !disabled && !uploading && !deleting && (
          <span className="absolute top-0 left-0 z-10 grid w-full h-full text-xs font-semibold text-white transition-opacity duration-200 opacity-0 lg:text-sm group-hover:opacity-100 place-items-center rounded-xs bg-black/60">
            Change
          </span>
        )}
        {(uploading || deleting) && (
          <span className="absolute top-0 left-0 z-10 grid w-full h-full place-items-center rounded-xs bg-black/60">
            <BiLoaderAlt className="w-6 h-6 animate-spin text-tangerine" />
          </span>
        )}
        <ErrorMessage name={name}>
          {(msg: string) => <p className="mt-1 text-xs text-red-500">{msg}</p>}
        </ErrorMessage>
      </Field>
    </div>
  );
}

export default Uploader;
