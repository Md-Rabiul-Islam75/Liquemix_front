import { toast } from "sonner";

class ToastHelper {
  SuccessToast(title: string, description: string = "") {
    return toast.success(title, {
      description,
    });
  }

  InfoToast(title: string, description: string = "") {
    return toast.info(title, {
      description,
    });
  }

  WarningToast(title: string, description: string = "") {
    return toast.warning(title, {
      description,
    });
  }

  ErrorToast(title: string, description: string = "") {
    return toast.error(title, {
      description,
    });
  }
}

export const { SuccessToast, InfoToast, WarningToast, ErrorToast } =
  new ToastHelper();
