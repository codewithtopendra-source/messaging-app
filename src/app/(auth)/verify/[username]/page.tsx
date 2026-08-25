"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const VerifyAccount = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      toast.success("Success", {
        description: response.data.message,
      });

      router.replace("/sign-in");
    } catch (error) {
      console.error("Error verifying user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Verification Failed", {
        description:
          axiosError.response?.data?.message ??
          "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md">
        <div className="bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden">
          <div className="px-8 pt-10 pb-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Verify your account
            </h1>
            <p className="mt-2 text-zinc-400 text-[15px]">
              Enter the verification code sent to your email
              {params.username ? (
                <>
                  {" "}
                  for{" "}
                  <span className="text-zinc-200 font-medium">
                    @{params.username}
                  </span>
                </>
              ) : null}
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
                    name="code"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor="code"
                          className="text-sm font-medium text-zinc-300"
                        >
                          Verification code
                        </FieldLabel>
                        <Input
                          {...field}
                          id="code"
                          aria-invalid={fieldState.invalid}
                          placeholder="000000"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          maxLength={6}
                          className="h-11 mt-1.5 rounded-lg bg-zinc-800 border-zinc-700 text-white text-center tracking-[0.35em] placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:border-zinc-500"
                        />
                        {fieldState.error && (
                          <p className="text-sm text-red-400 mt-1">
                            {fieldState.error.message}
                          </p>
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>

                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full h-11 mt-2 rounded-lg bg-white hover:bg-zinc-200 text-zinc-900 font-medium transition-colors disabled:opacity-70 cursor-pointer"
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-500">
          Mystery Message · Anonymous messaging
        </p>
      </div>
    </div>
  );
};

export default VerifyAccount;
