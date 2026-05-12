"use client";

import Spinner from "@/components/Spinner/Spinner";
import {
  AuthLoadingType,
  ResponseStatusType,
  SpinnerColor,
  SpinnerSize,
} from "@/enums/Common";
import {
  useAuthRegisterUserMutation,
} from "@/redux/slices/api/authAPISlice";
import { RegistrationFormData, RegistrationSchema } from "@/schemas/AuthSchema";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ZodFormattedError } from "zod";
import { IoEye, IoEyeOff } from "@/lib/utils/Icon";
import { ErrorToast, SuccessToast } from "@/helpers/ToastHelper";
import { getErrorMessage } from "@/lib/utils/ErrorHelper";

export default function RegistrationForm() {
  const router = useRouter();

  const [registrationFormData, setRegistrationFormData] =
    useState<RegistrationFormData>({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });
  const [registrationFormError, setRegistrationFormError] =
    useState<ZodFormattedError<RegistrationFormData> | null>(null);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loadingType, setLoadingType] = useState<string | null>(null);

  const [registerUser, { isLoading: isRegisterUserLoading }] =
    useAuthRegisterUserMutation();

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setRegistrationFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegistrationSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    const result = RegistrationSchema.safeParse(registrationFormData);

    if (!result.success) {
      const formattedErrors = result.error.format();
      setRegistrationFormError(formattedErrors);
      return;
    }

    setRegistrationFormError(null);

    try {
      setLoadingType(AuthLoadingType.REGISTRATION);

      const payload = {
        firstName: registrationFormData.firstName,
        lastName: registrationFormData.lastName,
        email: registrationFormData.email,
        password: registrationFormData.password,
      };
      const response = await registerUser(payload).unwrap();

      if (response?.status === ResponseStatusType.SUCCESS) {
        SuccessToast(
          "Registration successful",
          "Please login to continue"
        );
        router.push("/login");
      }
    } catch (err: unknown) {
      const errMsg = getErrorMessage(err, "Registration failed");
      ErrorToast(errMsg);
    } finally {
      setLoadingType(null);
      setRegistrationFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });
    }
  };

  const isLoading = isRegisterUserLoading;

  return (
    <>
      <form
        className="mt-10 flex flex-col gap-6"
        onSubmit={handleRegistrationSubmit}
      >
        {/* first name & last name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="">
            <div className="inputWrapper">
              <label htmlFor="firstName" className="inputLabel">
                First Name<span className="requiredIcon">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="inputField"
                value={registrationFormData?.firstName}
                onChange={handleOnchange}
              />
            </div>

            {registrationFormError?.firstName?._errors[0] && (
              <p className="errorMsg">
                {registrationFormError.firstName._errors[0]}
              </p>
            )}
          </div>

          <div className="">
            <div className="inputWrapper">
              <label htmlFor="lastName" className="inputLabel">
                Last Name<span className="requiredIcon">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="inputField"
                value={registrationFormData?.lastName}
                onChange={handleOnchange}
              />
            </div>

            {registrationFormError?.lastName?._errors[0] && (
              <p className="errorMsg">
                {registrationFormError.lastName._errors[0]}
              </p>
            )}
          </div>
        </div>

        {/* email */}
        <div>
          <div className="inputWrapper">
            <label htmlFor="email" className="inputLabel">
              Email<span className="requiredIcon">*</span>
            </label>
            <input
              type="text"
              id="email"
              name="email"
              className="inputField"
              value={registrationFormData?.email}
              onChange={handleOnchange}
            />
          </div>

          {registrationFormError?.email?._errors[0] && (
            <p className="errorMsg">{registrationFormError.email._errors[0]}</p>
          )}
        </div>

        {/* password */}
        <div>
          <div className="inputWrapper">
            <label htmlFor="password" className="inputLabel">
              Password<span className="requiredIcon">*</span>
            </label>
            <div className="inputPasswordField">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={registrationFormData?.password}
                onChange={handleOnchange}
              />
              <div
                className="eyeIconContainer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <IoEyeOff className="eyeIcon" />
                ) : (
                  <IoEye className="eyeIcon" />
                )}
              </div>
            </div>
          </div>

          {registrationFormError?.password?._errors[0] && (
            <p className="errorMsg">
              {registrationFormError.password._errors[0]}
            </p>
          )}
        </div>

        {/* btn */}
        <div>
          <button
            type="submit"
            disabled={isLoading && loadingType === AuthLoadingType.REGISTRATION}
            className="w-full primaryBtn"
          >
            {isLoading && loadingType === AuthLoadingType.REGISTRATION ? (
              <Spinner color={SpinnerColor.BLUE} size={SpinnerSize.SMALL} />
            ) : (
              "Sign Up"
            )}
          </button>
        </div>

        {/* link */}
        <div>
          <p className="authLinkContent">
            Already have an account?{" "}
            <Link href="/login" className="linkBlue">
              Login
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}
