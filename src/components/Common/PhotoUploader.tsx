import { useUploadImages } from "@api/product";
import { useDeleteLogo, useUploadLogo } from "@api/seller";
import { useDeleteProfilePicture, useUploadProfilePicture } from "@api/user";
import { generateSignature } from "@utils/getSignature";
import Image from "next/image";
import React, { useId } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { BsCamera } from "react-icons/bs";

interface Props {
  imageURL: string | undefined;
  isFromBusinessProfile?: boolean;
}

function PhotoUploader({ imageURL, isFromBusinessProfile }: Props) {
  const id = useId();

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

  //user
  const { mutate, isLoading } = useUploadProfilePicture();
  const { isLoading: deleting, mutate: deleteImage } =
    useDeleteProfilePicture();

  //business
  const { mutate: uploadLogo, isLoading: uploadingLogo } = useUploadLogo();
  const { isLoading: deletingLogo, mutate: deleteLogo } = useDeleteLogo();

  const removeImageHandler = () => {
    const urlArr = imageURL?.split("/");
    if (urlArr) {
      const publicIdSplit = urlArr[urlArr.length - 1].split(".");
      const publicId = publicIdSplit[0];

      if (!isFromBusinessProfile) {
        deleteImage({ publicId });
        return;
      }
      deleteLogo({ publicId });
    }
  };

  const uploadCallback = (data: any) => {
    const image = data?.secure_url;

    if (!isFromBusinessProfile) {
      mutate({ profilePicture: image });
      return;
    }

    uploadLogo({ logo: image });
  };

  const { isLoading: uploading, mutate: upload } =
    useUploadImages(uploadCallback);

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

  const handleFile = (file: File) => {
    // console.log(file);
    if (file && file.type.includes("image")) {
      uploadHandler(file);
    }
  };

  return (
    <div className="relative group">
      <div className="flex lg:block items-center space-x-4 lg:space-x-0">
        <div className="relative group overflow-hidden h-16 lg:h-24 w-16 lg:w-24 bg-american_silver grid place-items-center rounded-full">
          <label
            htmlFor={id}
            onDrop={photoDrop}
            onDragOver={filesPresence}
            onDragEnd={endDrag}
            onDragLeave={endDrag}
            className={`absolute top-0 grid place-items-center left-0 w-full h-full cursor-pointer group-hover:opacity-100 opacity-0 transition-all duration-100 bg-black/50 rounded-full`}
          >
            <input
              type="file"
              name="file"
              accept={"image/*"}
              disabled={
                uploading ||
                deleting ||
                isLoading ||
                uploadingLogo ||
                deletingLogo
              }
              id={id}
              className="absolute top-0 w-0 h-0 -z-10 isolate"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files) handleFile(e.target.files[0]);
              }}
            />
            {imageURL && (
              <BsCamera className="w-6 lg:w-10 text-white h-6 lg:h-10" />
            )}
          </label>
          {(uploading ||
            deleting ||
            isLoading ||
            uploadingLogo ||
            deletingLogo) && (
            <span className="absolute top-0 left-0 z-10 grid w-full h-full place-items-center rounded-xs bg-black/60">
              <BiLoaderAlt className="w-6 h-6 animate-spin text-tangerine" />
            </span>
          )}
          {imageURL ? (
            <Image
              width={96}
              height={96}
              src={imageURL}
              alt={isFromBusinessProfile ? "Logo" : "Profile picture"}
              className="object-cover object-center rounded-full"
            />
          ) : (
            <BsCamera className="w-10 lg:w-16 h-10 lg:h-16" />
          )}
        </div>
        {/* <button
          type="button"
          className="text-t14 text-tangerine font-medium w-fit mx-auto group-hover:opacity-100 lg:opacity-0 block lg:hidden"
        >
          Change
        </button> */}
        {imageURL && (
          <button
            type="button"
            className="text-t14 text-red-500 font-medium lg:mt-3 lg:w-full text-center mx-auto group-hover:opacity-100 lg:opacity-0 block"
            onClick={removeImageHandler}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

export default PhotoUploader;
