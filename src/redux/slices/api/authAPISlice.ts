import { IRegisterUserPayload, ILoginUserPayload } from "@/types/Auth";
import { apiSlice } from "./apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authRegisterUser: builder.mutation<any, IRegisterUserPayload>({
      query: (payload) => ({
        url: "/auth/register",
        method: "POST",
        body: payload,
      }),
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authLoginUser: builder.mutation<any, ILoginUserPayload>({
      query: (payload) => ({
        url: "/auth/login",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authRefreshToken: builder.mutation<any, ILoginUserPayload>({
      query: (payload) => ({
        url: "/auth/refresh-token",
        method: "POST",
        body: payload,
      }),
    }),
    authLogoutUser: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useAuthRegisterUserMutation,
  useAuthLoginUserMutation,
  useAuthRefreshTokenMutation,
  useAuthLogoutUserMutation,
} = authApiSlice;
