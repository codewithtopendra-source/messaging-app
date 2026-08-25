"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useState, useEffect } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
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
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setisCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const debounced = useDebounceCallback(setUsername, 300);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setisCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`,
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username",
          );
        } finally {
          setisCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast.success("Success", {
        description: response.data.message,
      });
      router.replace(`/verify/${username}`);
    } catch (error) {
      console.error("Error in signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Signup Failed", {
        description: axiosError.response?.data.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 pt-10">
      <div className="w-full max-w-md">
        <div className="bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden">
          <div className="px-8 pt-10 pb-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Join Mystery Message
            </h1>
            <p className="mt-2 text-zinc-400 text-[15px]">
              Sign up to start your anonymous adventure
            </p>
          </div>

          <div className="px-8 pb-10">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FieldGroup>
                  <Controller
                    name="username"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor="username"
                          className="text-sm font-medium text-zinc-300"
                        >
                          Username
                        </FieldLabel>
                        <Input
                          {...field}
                          id="username"
                          aria-invalid={fieldState.invalid}
                          placeholder="Enter a username"
                          autoComplete="off"
                          onChange={(e) => {
                            field.onChange(e);
                            debounced(e.target.value);
                          }}
                          className="h-11 mt-1.5 rounded-lg bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:border-zinc-500"
                        />
                        {isCheckingUsername && (
                          <p className="text-sm text-zinc-500 mt-1">
                            Checking...
                          </p>
                        )}
                        {!isCheckingUsername && usernameMessage && (
                          <p
                            className={`text-sm mt-1 ${
                              usernameMessage === "Username is unique"
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {username}: {usernameMessage}
                          </p>
                        )}
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor="email"
                          className="text-sm font-medium text-zinc-300"
                        >
                          Email
                        </FieldLabel>
                        <Input
                          {...field}
                          id="email"
                          type="email"
                          aria-invalid={fieldState.invalid}
                          placeholder="you@example.com"
                          autoComplete="email"
                          className="h-11 mt-1.5 rounded-lg bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:border-zinc-500"
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
                            autoComplete="new-password"
                            className="h-11 pr-11 rounded-lg bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:border-zinc-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((p) => !p)}
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
                      Please wait
                    </>
                  ) : (
                    "Sign up"
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
              <p className="text-sm text-zinc-400">
                Already a member?{" "}
                <Link
                  href="/sign-in"
                  className="font-medium text-white hover:text-zinc-200 underline-offset-4 hover:underline transition-colors cursor-pointer"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-500">
          Mystery Message · Anonymous messaging
        </p>
      </div>
    </div>
  );
};

export default page;
