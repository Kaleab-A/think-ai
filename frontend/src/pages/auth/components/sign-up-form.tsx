import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Command } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { AUTH_ROUTES } from "@/routes/common/routePaths";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { registerMutationFn } from "@/lib/api";
import { toast } from "sonner";
import { Loader } from "@/components/loader";

// Define the form schema using Zod
const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: registerMutationFn,
  });

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });

  const onSubmit = (values: SignUpFormValues) => {
    console.log("Form values:", values);
    if (isPending) return;

    mutate(values, {
      onSuccess: () => {
        toast.success("Registered successfully");
        navigate(AUTH_ROUTES.SIGN_IN);
      },
      onError: (error) => {
        console.log(error);
        toast.error(error.message || "Failed to Sign up");
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
              Sign up with Meetly for free
            </h2>
          </div>

          <div
            className="w-full bg-white flex flex-col gap-5 rounded-[6px] p-[38px_28px]"
            style={{
              boxShadow: "rgba(0, 74, 116, 0.15) 0px 1px 5px",
              border: "1px solid #d4e0ed",
            }}
          >
            <div className="flex flex-col gap-4">
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label className="font-semibold !text-sm">
                      Enter your email to get started
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

              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label className="font-semibold !text-sm">
                      Enter your full name
                    </Label>
                    <FormControl>
                      <Input {...field} type="text" placeholder="John Doe" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label className="font-semibold !text-sm">
                      Choose a password with at least 6 characters
                    </Label>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-end">
                <Button disabled={isPending} type="submit">
                  {isPending ? <Loader size="sm" color="white" /> : "Signup"}
                </Button>
              </div>
            </div>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link
                to={AUTH_ROUTES.SIGN_IN}
                className="underline underline-offset-4 text-primary"
              >
                Sign in
              </Link>
            </div>
          </div>
        </form>
      </Form>

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
