"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowUpRight, RefreshCw, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import * as z from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";
import { useParams } from "next/navigation";
import { messageSchema } from "@/schemas/messageSchema";

/* -------------------------------------------------------------------------- */
/*                         QUESTION BANK                                      */
/* -------------------------------------------------------------------------- */

const questionBank = [
  "What's something you've been enjoying lately?",
  "What's a movie you can watch again and again?",
  "What's a skill you'd love to learn?",
  "What's your perfect way to spend a free afternoon?",
  "What's the best meal you've had recently?",
  "If you could travel anywhere tomorrow, where would you go?",
  "What's a song you've been listening to a lot lately?",
  "What's something that always makes you smile?",
  "What's your favorite way to relax?",
  "What's one thing on your bucket list?",
  "What's the most interesting place you've visited?",
  "What's a hobby you'd like to start?",
  "If you could instantly master one skill, what would it be?",
  "What's your favorite childhood game?",
  "What's a food you could never get bored of?",
  "What's your dream weekend?",
  "What's the funniest thing you've seen recently?",
  "What's your comfort movie or show?",
  "What's something you think everyone should try once?",
  "What's the best advice you've ever received?",
  "If you could have dinner with any fictional character, who would it be?",
  "What's something you're surprisingly good at?",
  "What's your favorite thing about weekends?",
  "What's one place you'd love to visit?",
  "What's something you've always wanted to try?",
  "What's your go-to comfort food?",
  "What's a small thing that can instantly improve your day?",
  "What's your favorite season and why?",
  "What's a random fact you find interesting?",
  "If you had an extra hour every day, how would you spend it?",
  "What's your favorite thing to do with friends?",
  "What's a show you think everyone should watch?",
  "What's one thing you would buy if money wasn't an issue?",
  "What's the most spontaneous thing you've ever done?",
  "What's your favorite type of music?",
  "What's something you're looking forward to?",
  "What's your ideal vacation?",
  "What's one invention you couldn't live without?",
  "What's something you wish you were better at?",
  "What's your favorite place to hang out?",
  "What's a simple thing that makes you happy?",
  "What's the best gift you've ever received?",
  "If you could live in any fictional world, which one?",
  "What's something you've learned recently?",
  "What's your favorite thing about your hometown?",
  "What's a tradition you really like?",
  "What's your favorite way to spend a rainy day?",
  "What's something you could talk about for hours?",
  "What's one thing you'd love to accomplish this year?",
];

/* -------------------------------------------------------------------------- */
/*                         RANDOM QUESTIONS                                   */
/* -------------------------------------------------------------------------- */

const getRandomQuestions = () => {
  const shuffled = [...questionBank].sort(() => Math.random() - 0.5);

  return shuffled.slice(0, 3);
};

/* -------------------------------------------------------------------------- */
/*                         PAGE                                               */
/* -------------------------------------------------------------------------- */

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const [isLoading, setIsLoading] = useState(false);

  const [suggestions, setSuggestions] = useState<string[]>(() =>
    getRandomQuestions(),
  );

  /* ------------------------------------------------------------------------ */
  /*                         FORM                                             */
  /* ------------------------------------------------------------------------ */

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const messageContent = form.watch("content");

  /* ------------------------------------------------------------------------ */
  /*                         QUESTION CLICK                                   */
  /* ------------------------------------------------------------------------ */

  const handleMessageClick = (message: string) => {
    form.setValue("content", message, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  /* ------------------------------------------------------------------------ */
  /*                         SEND MESSAGE                                     */
  /* ------------------------------------------------------------------------ */

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);

    try {
      const response = await axios.post<ApiResponse>("/api/send-messages", {
        ...data,
        username,
      });

      toast.success("Message sent", {
        description: response.data.message,
      });

      form.reset({
        content: "",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.error("Couldn't send message", {
        description:
          axiosError.response?.data.message ?? "Failed to send message",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                         NEW QUESTIONS                                    */
  /* ------------------------------------------------------------------------ */

  const fetchSuggestedMessages = () => {
    setSuggestions(getRandomQuestions());
  };

  /* ------------------------------------------------------------------------ */
  /*                         UI                                               */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0B0E] text-white">
      {/* Background glow */}
      <div
        aria-hidden
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[-180px]
          h-[420px]
          w-[420px]
          -translate-x-1/2
          rounded-full
          bg-violet-500/[0.08]
          blur-[120px]
        "
      />

      <div className="relative mx-auto w-full max-w-2xl px-5 py-12 sm:px-8 md:py-20">
        {/* Small label */}
        <div className="mb-6 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

          <span className="text-[11px] uppercase tracking-[0.18em] text-white/30">
            Anonymous message
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
          Send <span className="text-white/40">@{username}</span> a message.
        </h1>

        <p className="mt-3 max-w-md text-sm leading-6 text-white/40">
          Say whatever you want. They won't know who sent it.
        </p>

        {/* ------------------------------------------------------------------ */}
        {/* MESSAGE FORM                                                       */}
        {/* ------------------------------------------------------------------ */}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Message</FormLabel>

                  <FormControl>
                    <div className="relative">
                      <Textarea
                        {...field}
                        placeholder="Write your message..."
                        className="
                          min-h-[150px]
                          resize-none
                          rounded-xl
                          border
                          border-white/[0.08]
                          bg-white/[0.025]
                          p-5
                          !text-lg
                          leading-7
                          text-white
                          shadow-none
                          outline-none
                          placeholder:text-white/20
                          focus-visible:border-white/[0.18]
                          focus-visible:ring-0
                        "
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Send button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isLoading || !messageContent?.trim()}
                className="
                  w-full
                  cursor-pointer
                  gap-2
                  rounded-xl
                  bg-white
                  py-6
                  font-['Manrope']
                  font-semibold
                  text-[#0B0B0E]
                  transition
                  hover:bg-white/90
                  disabled:opacity-30
                "
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span className="text-base">Send</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>

        {/* ------------------------------------------------------------------ */}
        {/* SUGGESTIONS                                                        */}
        {/* ------------------------------------------------------------------ */}

        <section className="mt-16">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-medium text-white/70">
                Not sure what to say?
              </p>

              <p className="mt-1 text-sm text-white/30">
                Pick a question to get the conversation started.
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={fetchSuggestedMessages}
              className="
                h-9
                gap-2
                rounded-lg
                px-3
                text-sm
                text-white/40
                hover:bg-white/[0.05]
                hover:text-white
              "
            >
              <RefreshCw className="h-3.5 w-3.5" />
              New questions
            </Button>
          </div>

          {/* Questions */}
          <div className="mt-5 divide-y divide-white/[0.06] border-y border-white/[0.06]">
            {suggestions.map((message, index) => (
              <button
                key={`${message}-${index}`}
                type="button"
                onClick={() => handleMessageClick(message)}
                className="
                  group
                  flex
                  w-full
                  items-center
                  justify-between
                  gap-5
                  py-4
                  text-left
                  text-base
                  text-white/50
                  transition
                  hover:text-white cursor-pointer
                "
              >
                <span>{message}</span>

                <ArrowUpRight
                  className="
                    h-4
                    w-4
                    shrink-0
                    text-white/20
                    transition
                    group-hover:-translate-y-0.5
                    group-hover:translate-x-0.5
                    group-hover:text-white/60
                  "
                />
              </button>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* FOOTER                                                             */}
        {/* ------------------------------------------------------------------ */}

        <div className="mt-16 border-t border-white/[0.06] pt-8 text-center">
          <p className="text-xs text-white/45">
            Want your own anonymous inbox?
          </p>

          <Link
            href="/sign-up"
            className="
              mt-2
              inline-flex
              items-center
              gap-1
              text-sm
              text-white/70
              transition
              hover:text-white
            "
          >
            Create your account
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
