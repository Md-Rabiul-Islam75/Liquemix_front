import Image from "next/image";
import Link from "next/link";
import logoImg from "../../../public/images/logo.png";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen relative flex flex-col">
      {/* <div className="w-[230px] h-[230px] bg-primary-200 blur-[104px] absolute top-0 right-0 -z-20"></div> */}
      <div className="w-[230px] h-[230px] bg-primary-200 blur-[104px] absolute bottom-0 left-0 -z-20"></div>

      {/* auth nav */}
      <nav className="sticky top-0 h-20 z-[999] bg-white-base flex items-center px-5 md:px-10 lg:px-20">
        <Link href="/">
          <Image
            src={logoImg}
            alt="Brand logo"
            height={44}
            style={{ width: "auto" }}
            priority
          />
        </Link>
      </nav>

      {/* auth content  */}
      <main className="flex-1 flex flex-col justify-center items-cente px-5 md:px-10 lg:px-20">
        {children}
      </main>
    </div>
  );
}
