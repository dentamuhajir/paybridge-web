import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const OTP_LENGTH = 4;

export default function SignInOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email ?? "";

  const [digits, setDigits] = useState(() => Array(OTP_LENGTH).fill(""));
  const inputsRef = useRef([]);

  useEffect(() => {
    if (!email) {
      navigate("/auth/sign-in", { replace: true });
    }
  }, [email, navigate]);

  const focusIndex = useCallback((index) => {
    const el = inputsRef.current[index];
    if (el) el.focus();
    el?.select();
  }, []);

  const handleChange = (index, value) => {
    const char = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    if (char && index < OTP_LENGTH - 1) {
      focusIndex(index + 1);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      focusIndex(index - 1);
    }
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      focusIndex(index - 1);
    }
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      e.preventDefault();
      focusIndex(index + 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH)
      .fill("")
      .map((_, i) => pasted[i] ?? "");
    setDigits(next);
    const last = Math.min(pasted.length, OTP_LENGTH) - 1;
    focusIndex(last >= 0 ? last : 0);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length !== OTP_LENGTH) return;
    navigate("/admin/dashboard", { replace: true });
  };

  if (!email) {
    return null;
  }

  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Enter code
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600 dark:text-gray-400">
          We sent a 4-digit code to{" "}
          <span className="font-medium text-navy-700 dark:text-white">{email}</span>
        </p>

        <form onSubmit={handleVerify}>
          <p className="mb-3 ml-1 text-sm font-medium text-navy-700 dark:text-white">
            Verification code
          </p>
          <div className="mb-6 flex w-full justify-between gap-2 sm:gap-3">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputsRef.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={d}
                aria-label={`Digit ${i + 1} of ${OTP_LENGTH}`}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                className="h-14 w-full max-w-[4.5rem] rounded-xl border border-gray-200 bg-white/0 text-center text-2xl font-semibold text-navy-700 outline-none transition dark:border-white/10 dark:text-white sm:h-16 sm:text-3xl"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={digits.join("").length !== OTP_LENGTH}
            className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
          >
            Verify & continue
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
            onClick={() => {
              /* Resend OTP — wire to API later */
            }}
          >
            Resend code
          </button>
        </div>

        <div className="mt-6">
          <Link
            to="/auth/sign-in"
            replace
            className="text-sm font-medium text-navy-700 hover:text-brand-500 dark:text-gray-400 dark:hover:text-white"
          >
            ← Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
