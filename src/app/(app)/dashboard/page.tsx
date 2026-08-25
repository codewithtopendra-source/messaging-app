"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import {
  ArrowUpRight,
  Check,
  Copy,
  Inbox,
  Loader2,
  RefreshCcw,
  Share2,
} from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type AcceptMessageResponse = ApiResponse & {
  isAcceptingMessage: boolean;
};

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isSettingsLoading, setIsSettingsLoading] = useState(true);

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessages: false,
    },
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  const handleDeleteMessage = (messageId: string) => {
    setMessages((currentMessages) =>
      currentMessages.filter((message) => message._id !== messageId),
    );
  };

  const fetchAcceptMessage = useCallback(async () => {
    setIsSettingsLoading(true);

    try {
      const response = await axios.get<AcceptMessageResponse>(
        "/api/accept-messages",
      );

      setValue("acceptMessages", response.data.isAcceptingMessage, {
        shouldDirty: false,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.error("Couldn't load settings", {
        description:
          axiosError.response?.data.message ??
          "Failed to fetch message settings",
      });
    } finally {
      setIsSettingsLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (refresh = false) => {
    setIsLoading(true);

    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");

      setMessages(response.data.messages || []);

      if (refresh) {
        toast.success("Inbox refreshed", {
          description: "Showing your latest messages.",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.error("Couldn't load messages", {
        description:
          axiosError.response?.data.message ?? "Failed to fetch your messages.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session?.user) return;

    fetchMessages();
    fetchAcceptMessage();
  }, [session, fetchMessages, fetchAcceptMessage]);

  const handleSwitchChange = async (checked: boolean) => {
    setIsSwitchLoading(true);

    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: checked,
      });

      setValue("acceptMessages", checked, {
        shouldDirty: false,
      });

      toast.success(
        checked ? "Messages are now on" : "Messages are now paused",
        {
          description: response.data.message,
        },
      );
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.error("Couldn't update settings", {
        description:
          axiosError.response?.data.message ??
          "Failed to update message settings",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  };

  if (!session?.user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0b0b0e] px-5 text-white">
        <div className="text-center">
          <p className="text-sm text-white/40">
            You need to be logged in to view your inbox.
          </p>
        </div>
      </main>
    );
  }

  const { username } = session.user as User;

  const baseUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : "";

  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);

      setIsCopied(true);

      toast.success("Link copied", {
        description: "Your anonymous message link is ready to share.",
      });

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch {
      toast.error("Couldn't copy link");
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0b0e] text-white">
      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 lg:py-14">
        {/* Header */}
        <header className="flex flex-col gap-6 border-b border-white/[0.08] pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              <span className="text-xs font-medium uppercase tracking-[0.16em] text-white/35">
                Your private inbox
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              @{username}
            </h1>

            <p className="mt-4 text-base text-white/35">
              Messages from people who want to stay anonymous.
            </p>
          </div>

          <Button
            variant="ghost"
            onClick={() => fetchMessages(true)}
            disabled={isLoading}
            className="
              h-10
              w-fit
              gap-2
              rounded-lg
              border
              border-white/[0.08]
              bg-white/[0.02]
              px-4
              text-sm
              text-white/60
              hover:bg-white/[0.06]
              hover:text-white
            "
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}

            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>
        </header>

        {/* Controls */}
        <section className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]">
          {/* Share link */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#111115] p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-white/40" />

                  <p className="text-base font-medium text-white/80">
                    Your anonymous link
                  </p>
                </div>

                <p className="text-sm leading-5 text-white/30">
                  Share this link anywhere. Anyone can leave you a message
                  without signing in.
                </p>
              </div>

              <a
                href={`/u/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  shrink-0
                  rounded-lg
                  p-2
                  text-white/30
                  transition
                  hover:bg-white/[0.05]
                  hover:text-white
                "
                aria-label="Open profile"
              >
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <div className="flex min-w-0 flex-1 items-center rounded-lg border border-white/[0.08] bg-[#0b0b0e] px-4">
                <span className="truncate text-base text-white/45">
                  {profileUrl}
                </span>
              </div>

              <Button
                onClick={copyToClipboard}
                className="
                  h-11
                  gap-2
                  rounded-lg
                  bg-white
                  px-5
                  text-sm
                  font-medium
                  text-black
                  hover:bg-white/90 cursor-pointer
                "
              >
                {isCopied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy link
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Message settings */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#111115] p-5 sm:p-6">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-base font-medium text-white/80">
                  Accept messages
                </p>

                <p className="mt-1 text-sm leading-5 text-white/30">
                  Control whether people can send you anonymous messages.
                </p>
              </div>

              <Switch
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                disabled={isSettingsLoading || isSwitchLoading}
                className="
                  border border-white/10
                  bg-white/10
                  transition-colors
                  data-[state=checked]:border-emerald-500/30
                  data-[state=checked]:bg-emerald-500
                  data-[state=checked]:hover:bg-emerald-400
                  data-[state=unchecked]:bg-white/10
                "
              />
            </div>

            <div className="mt-6 flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  acceptMessages ? "bg-emerald-400" : "bg-white/20"
                }`}
              />

              <span className="text-sm text-white/45">
                {acceptMessages ? "Your inbox is open" : "Your inbox is paused"}
              </span>
            </div>
          </div>
        </section>

        {/* Messages heading */}
        <section className="mt-12">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Inbox className="h-4 w-4 text-white/40" />

                <h2 className="text-lg font-medium text-white">Messages</h2>

                {messages.length > 0 && (
                  <span className="rounded-full bg-white/[0.08] px-2 py-0.5 text-xs text-white/40">
                    {messages.length}
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm text-white/30">
                Your latest anonymous messages.
              </p>
            </div>
          </div>

          <Separator className="mt-5 bg-white/[0.08]" />

          {/* Messages */}
          {messages.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {messages.map((message) => (
                <MessageCard
                  key={message._id}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))}
            </div>
          ) : (
            <div className="mt-6 flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.015] px-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03]">
                <Inbox className="h-5 w-5 text-white/30" />
              </div>

              <h3 className="mt-5 text-base font-medium text-white/70">
                No messages yet
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-white/30">
                Share your anonymous link with friends and wait for the first
                message to arrive.
              </p>

              <Button
                onClick={copyToClipboard}
                variant="ghost"
                className="
                  mt-5
                  gap-2
                  text-sm
                  text-white/50
                  hover:bg-white/[0.05]
                  hover:text-white
                "
              >
                {isCopied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy your link
                  </>
                )}
              </Button>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-white/[0.08] pt-6">
          <div className="flex flex-col items-center justify-between gap-3 text-xs text-white/20 sm:flex-row">
            <span className="text-sm">Anonymous messages</span>

            <a
              href={`/u/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white/50 text-sm"
            >
              View your public page →
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default Page;
