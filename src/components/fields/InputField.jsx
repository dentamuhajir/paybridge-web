// Custom components
import React from "react";

function InputField({ label, id, extra, variant, state, disabled, ...props }) {
  return (
    <div className={`${extra}`}>
      <label
        htmlFor={id}
        className={`text-sm text-navy-700 dark:text-white ${
          variant === "auth" ? "ml-1.5 font-medium" : "ml-3 font-bold"
        }`}
      >
        {label}
      </label>

      <input
        id={id}
        disabled={disabled}
        {...props}     // <-- CRITICAL: this carries register("fullName") props
        className={`mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none ${
          disabled
            ? "!border-none !bg-gray-100 dark:!bg-white/5"
            : state === "error"
            ? "border-red-500 text-red-500"
            : state === "success"
            ? "border-green-500 text-green-500"
            : "border-gray-200 dark:!border-white/10 dark:text-white"
        }`}
      />
    </div>
  );
}


export default InputField;