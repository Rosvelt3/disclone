import dynamic from "next/dynamic";
const SignupCard = dynamic(() => import("./SignupCard"), {
  ssr: false,
});

export default function Login() {
  return (
    <main className="h-full flex justify-center items-center bg-gradient-to-br from-sky-600 to-blue-800">
      <SignupCard />
    </main>
  );
}
