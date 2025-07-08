"use client";

import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";

const AuthForm = ({ type }: { type: authType }) => {
  const isSignUp = type === "sign-up";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailValid, setEmailValid] = useState<null | boolean>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(value));
  };

  const validatePassword = (value: string) => {
    const errors: string[] = [];
    if (value.length < 8) errors.push("Password must be minimum of 8 characters");
    if (!/[a-zA-Z]/.test(value) || !/\d/.test(value)) errors.push("Password must be alphanumeric");
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(value)) errors.push("Password must contain a special character");
    setPasswordErrors(errors);
  };

  const validateConfirmPassword = (value: string) => {
    setConfirmPasswordError(value !== password ? "Passwords do not match" : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check again before submitting
    validateEmail(email);
    validatePassword(password);
    if (isSignUp) validateConfirmPassword(confirmPassword);

    if (!emailValid || passwordErrors.length > 0 || (isSignUp && confirmPassword !== password)) {
      return;
    }

    try {
      const res = await fetch("BACKEND_URL", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, ...(isSignUp && { confirmPassword }) })
      });

      const data = await res.json();
      console.log("Success:", data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="min-w-[300px] w-fit max-w-[524px] h-fit bg-white shadow-md py-10 px-4 md:px-20 rounded-md flex items-center justify-center flex-col">
      <p className="font-bold text-xl md:text-xl">
        {isSignUp ? "Fill out the form below to sign up" : "Welcome back"}
      </p>

      <form onSubmit={handleSubmit} className="w-full mt-5 auth-form flex flex-col gap-3">
        {isSignUp && (
          <>
            <label>First Name</label>
            <input type="text" name="firstName" className="auth-input focus:outline-none" />
          </>
        )}

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            validateEmail(e.target.value);
          }}
          className={`auth-input border ${emailValid === null ? "" : emailValid ? "border-green-500" : "border-red-500"}`}
        />

        <label>Password</label>
        <div className="relative">
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Minimum 8 characters"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              validatePassword(e.target.value);
            }}
            className={`auth-input w-full border ${passwordErrors.length === 0 && password ? "border-green-500" : password ? "border-red-500" : ""}`}
          />
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            <Image
              src={passwordVisible ? "/icons/eye-open.png" : "/icons/eye-closed.png"}
              alt="toggle visibility"
              width={20}
              height={20}
            />
          </span>
        </div>

        {passwordErrors.length > 0 && (
          <ul className="text-sm text-red-600 space-y-1">
            {passwordErrors.map((err, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="text-white bg-red-500 rounded-full h-4 w-4 flex items-center justify-center text-xs">×</span>
                {err}
              </li>
            ))}
          </ul>
        )}

        {isSignUp && (
          <>
           <label>Confirm Password</label>
                <div className="relative">
                <input
                    type={confirmPasswordVisible ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    validateConfirmPassword(e.target.value);
                    }}
                    className={`auth-input w-full border pr-10 ${
                    confirmPassword && confirmPasswordError === null
                        ? "border-green-500"
                        : confirmPasswordError
                        ? "border-red-500"
                        : ""
                    }`}
                />
                <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                >
                    <Image
                    src={confirmPasswordVisible ? "/icons/eye-open.png" : "/icons/eye-closed.png"}
                    alt="toggle visibility"
                    width={20}
                    height={20}
                    />
                </span>
                </div>
                {confirmPasswordError && (
                <p className="text-sm text-red-600 flex items-center gap-2 mt-1">
                    <span className="text-white bg-red-500 rounded-full h-4 w-4 flex items-center justify-center text-xs">×</span>
                    {confirmPasswordError}
                </p>
                )}

          </>
        )}

        {!isSignUp && (
          <div className="w-full flex justify-between">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-[20px] w-fit" />
              <p>Remember me</p>
            </label>
            <div>Forgot password?</div>
          </div>
        )}

        {isSignUp && (
          <p className="text-sm">
            By signing up, you agree to the
            <span className="text-link cursor-pointer"> Terms of Service </span>
            and
            <span className="text-link cursor-pointer"> Privacy Policy</span>.
          </p>
        )}

        <button type="submit" className="w-full py-3 bg-foreground text-white rounded-lg font-bold mt-2 cursor-pointer">
          {isSignUp ? "Sign up" : "Sign in"}
        </button>
      </form>

      <div className="flex gap-10 mt-10">
        {[
          { icon: "/icons/linkedin.png", label: "LinkedIn" },
          { icon: "/icons/google.png", label: "Google" },
        ].map(({ icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-3 cursor-pointer">
            <Image width={32} height={32} src={icon} alt={`${label} icon`} />
            <p className="text-sm font-bold">{label}</p>
          </div>
        ))}
      </div>

      <p className="text-sm font-bold mt-10">
        {isSignUp ? "Already have an account?" : "Don't have an account?"}
        <Link
          href={isSignUp ? "/sign-in" : "/sign-up"}
          className="text-link underline underline-offset-1 cursor-pointer ml-1"
        >
          {isSignUp ? "Login" : "Sign up"}
        </Link>
      </p>
    </div>
  );
};

export default AuthForm;
