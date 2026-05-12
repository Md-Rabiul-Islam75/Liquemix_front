"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { store, persistor } from "./store";
import Spinner from "@/components/Spinner/Spinner";
import { SpinnerColor, SpinnerSize } from "@/enums/Common";

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <div className="h-screen flex justify-center items-center">
            <Spinner color={SpinnerColor.BLUE} size={SpinnerSize.LARGE} />
          </div>
        }
        persistor={persistor}
      >
        {children}
      </PersistGate>
    </Provider>
  );
};
