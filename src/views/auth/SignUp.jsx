import InputField from "components/fields/InputField";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../validation/registerSchema";
import { registerUser } from "../../services/authService";
import Alert from "components/alert/Alert";
import { useState } from "react";
import { Link } from "react-router-dom";


export default function SignUp() {
  const [alert, setAlert] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
  try {
    console.log("Submitting:", data);

    const response = await registerUser(data);

    console.log("REGISTER SUCCESS:", response);
    setAlert({
      type: "success",
      message: (
        <>
          Registration successful!{" "}
          <Link to="/auth/sign-in" className="underline font-semibold text-green-900">
            Sign in
          </Link>
        </>
      ),
    });

  } catch (error) {
    console.error("REGISTER FAILED:", error);
    
    if (error.response) {
      setAlert({
        type: "error",
        message: error.response.data.message || "Registration failed",
      });
    } else {
      setAlert({
        type: "error",
        message: "Network error",
      });
    }
  }
};

  return (
    <div className="mt-1 mb-1 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">

        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Create Account
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Register to start using Paybridge Apps
        </p>

        {/* Google signup */}
        <div className="mb-6 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-lightPrimary hover:cursor-pointer dark:bg-navy-800">
          <div className="rounded-full text-xl">
            <FcGoogle />
          </div>
          <h5 className="text-sm font-medium text-navy-700 dark:text-white">
            Sign Up with Google
          </h5>
        </div>

        <div className="mb-6 flex items-center gap-3">
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
          <p className="text-base text-gray-600 dark:text-white"> or </p>
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
        </div>
        {alert && <Alert type={alert.type}>{alert.message}</Alert>}

        {/* Full Name */}
        <InputField
          label="Full Name*"
          id="fullName"
          type="text"
          placeholder="John Doe"
          {...register("fullName")}
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm">{errors.fullName.message}</p>
        )}

         {/* Email */}
        <InputField
          label="Email*"
          id="email"
          type="text"
          placeholder="mail@paybridge.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

         {/* Phone Number */}
        <InputField
          label="Phone Number*"
          id="phoneNumber"
          type="text"
          placeholder="+62..."
          {...register("phoneNumber")}
        />
        {errors.phoneNumber && (
          <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
        )}

        {/* Password */}
        <InputField
          label="Password*"
          id="password"
          type="password"
          placeholder="Min 8 characters"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}


        {/* Submit */}
        <button
          onClick={handleSubmit(onSubmit)}
          className="linear mt-4 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300"
        >
          Create Account
        </button>

        <div className="mt-4">
          <span className=" text-sm font-medium text-navy-700 dark:text-gray-600">
            Already have an account?
          </span>
          <Link 
          to="/auth/sign-in" className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
