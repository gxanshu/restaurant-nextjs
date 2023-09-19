"use client";
import useReservation from "@/hooks/useReservation";
import { SubmitHandler, useForm } from "react-hook-form";
import { searchParams } from "../page";
import { CircularProgress } from "@mui/material";
import { useState } from "react";

interface FormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  occasion: string;
  request: string;
}

export default function Form({
  searchParams,
  slug,
}: {
  searchParams: searchParams;
  slug: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const { createReservation, error, loading } = useReservation();
  const [didBook, setDidBook] = useState(false);

  const submitHandler: SubmitHandler<FormData> = async (formData) => {
    const data = await createReservation({
      ...searchParams,
      slug,
      ...formData,
      setDidBook,
    });

    console.log(data);
  };

  return (
    <div className="mt-10 flex flex-wrap justify-between w-[660px]">
      {didBook ? (
        <div className="bg-gray-100 h-screen">
          <div className="bg-white p-6  md:mx-auto">
            <svg
              viewBox="0 0 24 24"
              className="text-green-600 w-16 h-16 mx-auto my-6"
            >
              <path
                fill="currentColor"
                d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
              ></path>
            </svg>
            <div className="text-center">
              <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
                Booked Successfully
              </h3>
              <p className="text-gray-600 my-2">
                Thank you for completing your secure online payment.
              </p>
              <p> Have a great day!</p>
              <div className="py-10 text-center">
                <a
                  href="#"
                  className="px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3"
                >
                  GO BACK
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <input
            type="text"
            className={`border ${
              errors.firstName ? "border-red-500" : ""
            } rounded p-3 w-80 mb-4`}
            placeholder="First name"
            {...register("firstName", {
              required: true,
              pattern: /^[a-zA-Z]+$/,
            })}
          />
          <input
            type="text"
            className={`border ${
              errors.lastName ? "border-red-500" : ""
            } rounded p-3 w-80 mb-4`}
            placeholder="Last name"
            {...register("lastName", {
              required: true,
              pattern: /^[a-zA-Z]+$/,
            })}
          />
          <input
            type="text"
            className={`border ${
              errors.phoneNumber ? "border-red-500" : ""
            } rounded p-3 w-80 mb-4`}
            placeholder="Phone number"
            {...register("phoneNumber", {
              required: true,
              pattern: /^[0-9+-]+$/,
              maxLength: 10,
              minLength: 10,
            })}
          />
          <input
            type="text"
            className={`border ${
              errors.email ? "border-red-500" : ""
            } rounded p-3 w-80 mb-4`}
            placeholder="Email"
            {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
          />
          <input
            type="text"
            className={`border rounded p-3 w-80 mb-4`}
            placeholder="Occasion (optional)"
            {...register("occasion")}
          />
          <input
            type="text"
            className={`border rounded p-3 w-80 mb-4`}
            placeholder="Requests (optional)"
            {...register("request")}
          />
          <button
            className={`bg-red-600 w-full p-3 text-white font-bold rounded disabled:bg-gray-300 ${
              loading ? "bg-gray-300" : ""
            }`}
            disabled={loading}
            onClick={handleSubmit(submitHandler)}
          >
            {loading ? (
              <CircularProgress color="inherit" />
            ) : (
              "Complete reservation"
            )}
          </button>
          <p className="mt-4 text-sm">
            By clicking “Complete reservation” you agree to the OpenTable Terms
            of Use and Privacy Policy. Standard text message rates may apply.
            You may opt out of receiving text messages at any time.
          </p>
        </>
      )}
    </div>
  );
}
