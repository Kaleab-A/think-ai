import { SignUpForm } from "./components/sign-up-form";

const Signup = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-[500px] mx-auto">
        <SignUpForm />
      </div>
    </div>
  );
};

export default Signup;
