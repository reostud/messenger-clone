"use client";

import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import { CldUploadButton } from "next-cloudinary";

import { useState } from "react";
import MessageInput from "./MessageInput";

const Form = () => {
  const { conversationId } = useConversation();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    setValue("message", "", { shouldValidate: true });

    try {
      await axios.post("/api/messages", {
        ...data,
        conversationId,
      });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = (result: any) => {
    const imageUrl = result?.info?.secure_url;
    console.log("Uploading image to API:", imageUrl);
  
    axios.post("/api/messages", {
      image: imageUrl,
      conversationId,
    })
    .then((response) => console.log("Image saved to DB:", response.data))
    .catch((error) => console.error("Error saving image to DB:", error));
  };
  

  return (
    <div
      className="
        py-4
        px-4
        bg-white
        border-t
        flex
        items-center
        gap-2
        lg:gap-4
        w-full
      "
    >
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onSuccess={handleUpload}
        uploadPreset="rmozmd5m"
      >
        <HiPhoto size={30} className="text-sky-500" />
      </CldUploadButton>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          required
          placeholder="Write a message"
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <span className="text-white text-sm">Sending...</span>
          ) : (
            <HiPaperAirplane size={18} className="text-white" />
          )}
        </button>
      </form>
    </div>
  );
};

export default Form;
