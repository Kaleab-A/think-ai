import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Command } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { AUTH_ROUTES, PROTECTED_ROUTES } from "@/routes/common/routePaths";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useStore } from "@/store/store";
import { useMutation } from "@tanstack/react-query";
import { loginMutationFn, loginWithGoogleMutationFn } from "@/lib/api";
import { toast } from "sonner";
import { Loader } from "@/components/loader";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export function SignInForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const navigate = useNavigate();

  const { setUser, setAccessToken, setExpiresAt } = useStore();

  const { mutate, isPending } = useMutation({
    mutationFn: loginMutationFn,
  });

  const { mutate: mutateGoogle } = useMutation({
    mutationFn: loginWithGoogleMutationFn,
    onSuccess: (data) => {
      const { user, accessToken, expiresAt } = data;
      setUser(user);
      setAccessToken(accessToken);
      setExpiresAt(expiresAt);
      navigate(PROTECTED_ROUTES.EVENT_TYPES);
    },
    onError: (error) => {
      toast.error(error.message || "Google login failed");
    },
  });

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: SignInFormValues) => {
    console.log("Form values:", values);
    if (isPending) return;

    mutate(values, {
      onSuccess: (data) => {
        const user = data.user;
        const accessToken = data.accessToken;
        const expiresAt = data.expiresAt;

        setUser(user);
        setAccessToken(accessToken);
        setExpiresAt(expiresAt);
        toast.success("Login successfully");

        navigate(PROTECTED_ROUTES.EVENT_TYPES);
      },
      onError: (error) => {
        console.log(error);
        toast.error(error.message || "Failed to login");
      },
    });
  };

  return (
    <div className={cn("flex flex-col gap-6 w-full", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* { Top Header} */}
          <div className="flex flex-col items-center gap-2">
            <Link
              to="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div
                className="flex aspect-square size-8 items-center 
          justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
              >
                <Command className="size-5" />
              </div>
              <span className="sr-only">Meetly</span>
            </Link>
            <h2 className="text-xl font-bold text-[#0a2540]">
              Log into your Meetly account
            </h2>
          </div>

          {/* {Form Card} */}
          <Card className="border border-border shadow-sm w-full">
            <CardHeader className="pb-4 text-center">
              <CardTitle className="text-xl">Sign in</CardTitle>
              <CardDescription>Enter your email & password to login</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              {/* Email Field */}
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label className="font-semibold !text-sm">
                      Email address
                    </Label>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="subcribeto@techwithemma.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label className="font-semibold !text-sm">Password</Label>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="***********"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={isPending} type="submit" className="w-full rounded-md">
                {isPending ? <Loader color="white" /> : "Login"}
              </Button>

              {/* {OR} */}

              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>

              <div className="grid gap-1 sm:grid-cols-1 -mt-3">
                <GoogleLogin
                  onSuccess={(credentialResponse: CredentialResponse) => {
                    if (credentialResponse.credential) {
                      mutateGoogle(credentialResponse.credential);
                    }
                  }}
                  onError={() => toast.error("Google login failed")}
                  size="large"
                  width="100%"
                  shape="rectangular"
                  text="signin_with"
                  logo_alignment="left"
                />
              </div>

              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  to={AUTH_ROUTES.SIGN_UP}
                  className="underline underline-offset-4 text-primary"
                >
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
