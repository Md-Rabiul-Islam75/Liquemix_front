import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { setAuthenticated } from "../sync/authSlice";

const baseQuery = fetchBaseQuery({
  // baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  baseUrl: "/api", // rewritten URL
  credentials: "include", // include cookies
});

const baseQueryWithAuthHandler: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  // Check if the error is 401 Unauthorized
  if (result.error && result.error.status === 401) {
    console.log("Token expired, cleaning up and redirecting...");

    // Clear Redux auth state
    api.dispatch(setAuthenticated(false));

    // Don't redirect if we're on public pages (home, login, registration, documents)
    const publicPages = ["/", "/login", "/registration", "/documents"];
    const currentPath = typeof window !== "undefined" ? window.location.pathname : "";

    // Check if current path is public (exact match or starts with /documents/)
    const isPublicPage = publicPages.includes(currentPath) || currentPath.startsWith("/documents/");

    if (typeof window !== "undefined" && !isPublicPage) {
      window.location.href = "/login";
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuthHandler,
  tagTypes: [
    "Auth",
    "User",
    "Category",
    "Customer",
    "Specialist",
    "Notification",
    "Subscription",
    "Business",
    "Payment",
    "SubCategory",
    "TertiaryCategory",
    "Keywords",
    "CommissionInfo",
    "DocumentDetails",
    "Document",
    "DraftDocument",
    "SpecialistCategories",
    "PublicDocument",
    "PromoCode",
    "Order",
    "PublicDocumentDetails",
    "Thumbnails",
    "CurrentBalance",
    "SpecialistCheckoutList",
    "Review",
    "AppointmentSlot",
    "Appointments",
    "Dashboard",
  ], // optional: for cache invalidation later
  endpoints: () => ({}), // will be extended later
});
