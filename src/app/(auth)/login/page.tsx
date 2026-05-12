import { Suspense } from "react";
import styles from "../Auth.module.css";
import AuthCardSkeleton from "@/components/Skeletons/AuthCardSkeleton";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="h-full flex justify-center items-center my-20">
      <div className="authCard">
        <h2 className={styles.authTitle}>Login</h2>
        <h5 className={styles.authSubTitle}>Login to access your account</h5>
        <Suspense fallback={<AuthCardSkeleton />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
