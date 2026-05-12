interface ApiError {
  data?: {
    message?: string;
  };
  message?: string;
}

function isApiError(err: unknown): err is ApiError {
  return (
    typeof err === "object" &&
    err !== null &&
    ("data" in err || "message" in err)
  );
}

export function getErrorMessage(
  err: unknown,
  fallback = "Something went wrong"
): string {
  if (isApiError(err)) {
    return err.data?.message || err.message || fallback;
  } else if (err instanceof Error) {
    return err.message;
  }
  return fallback;
}
