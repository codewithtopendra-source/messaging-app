"use client";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

const page = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          toast.error("Login Failed", {
            description: "Incorrect username or password",
          });
        } else {
          toast.error("Error", {
            description: result.error,
          });
        }
        return;
      }

      // Success — do NOT wait for result.url
      toast.success("Success", {
        description: "Welcome back",
      });
      router.replace("/dashboard");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-10 pb-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Welcome back
            </h1>
            <p className="mt-2 text-zinc-400 text-[15px]">
              Sign in to continue your anonymous adventure
            </p>
          </div>

          {/* Form */}
          <div className="px-8 pb-10">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FieldGroup>
                  <Controller
                    name="identifier"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor="identifier"
                          className="text-sm font-medium text-zinc-300"
                        >
                          Email or Username
                        </FieldLabel>
                        <Input
                          {...field}
                          id="identifier"
                          aria-invalid={fieldState.invalid}
                          placeholder="you@example.com"
                          autoComplete="username"
                          className="h-11 mt-1.5 rounded-lg bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:border-zinc-500 transition-colors"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor="password"
                          className="text-sm font-medium text-zinc-300"
                        >
                          Password
                        </FieldLabel>
                        <div className="relative mt-1.5">
                          <Input
                            {...field}
                            id="password"
                            type={showPassword ? "text" : "password"}
                            aria-invalid={fieldState.invalid}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            className="h-11 pr-11 rounded-lg bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:border-zinc-500 transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 mt-2 rounded-lg bg-white hover:bg-zinc-200 text-zinc-900 font-medium transition-colors disabled:opacity-70 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>
            </Form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
              <p className="text-sm text-zinc-400">
                Not a member yet?{" "}
                <Link
                  href="/sign-up"
                  className="font-medium text-white hover:text-zinc-200 underline-offset-4 hover:underline transition-colors cursor-pointer"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Subtle brand line */}
        <p className="mt-6 text-center text-xs text-zinc-500">
          Mystery Message · Anonymous messaging
        </p>
      </div>
    </div>
  );
};

export default page;
