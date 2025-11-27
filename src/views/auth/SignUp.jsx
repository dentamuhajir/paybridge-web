import InputField from "components/fields/InputField";
import { FcGoogle } from "react-icons/fc";
import Checkbox from "components/checkbox";
import { useState } from "react";

export default function SignUp() {
 const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    console.log("Register Form Data:", form);
  };

  return (
    <div className="mt-1 mb-1 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">

        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Create Account
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Register to start using Paybridge Wallet
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

        {/* Full Name */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="Full Name*"
          placeholder="John Doe"
          id="fullName"
          type="text"
          value={form.fullName}
          onChange={handleChange}
        />

        {/* Email */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="Email*"
          placeholder="mail@paybridge.com"
          id="email"
          type="text"
          value={form.email}
          onChange={handleChange}
        />

        {/* Phone Number */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="Phone Number*"
          placeholder="+62 812 3456 7890"
          id="phoneNumber"
          type="text"
          value={form.phoneNumber}
          onChange={handleChange}
        />

        {/* Password */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="Password*"
          placeholder="Min. 8 characters"
          id="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="linear mt-4 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300"
        >
          Create Account
        </button>

        <div className="mt-4">
          <span className=" text-sm font-medium text-navy-700 dark:text-gray-600">
            Already have an account?
          </span>
          <a
            href="/auth/sign-in"
            className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
          >
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
