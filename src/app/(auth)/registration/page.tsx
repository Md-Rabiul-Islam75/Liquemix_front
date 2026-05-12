import { Suspense } from "react";
import styles from "../Auth.module.css";
import RegistrationForm from "./RegistrationForm";
import RegistrationFormSkeleton from "@/components/Skeletons/RegistrationFormSkeleton";

export default function RegistrationPage() {
  return (
    <div className="h-full flex justify-center items-center my-20">
      <div className="authCard">
        <h2 className={styles.authTitle}>Sign Up</h2>
        <h5 className={styles.authSubTitle}>
          Let&apos;s get started — create your IDS account
        </h5>
        <Suspense fallback={<RegistrationFormSkeleton />}>
          <RegistrationForm />
        </Suspense>
      </div>
    </div>
  );
}
