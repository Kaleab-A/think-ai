import { SignInForm } from "./components/sign-in-form";

const SignIn = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-[500px] mx-auto">
        <SignInForm />
      </div>
    </div>
  );
};

export default SignIn;
