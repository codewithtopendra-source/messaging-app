"use client";

import { useState } from "react";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, LogOut, Trash2, ArrowUpRight } from "lucide-react";
import { MessageSquareLock } from "lucide-react";
import { Button } from "./ui/button";
import { ApiResponse } from "@/types/ApiResponse";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user as User;

  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  const handleDeleteAccount = async () => {
    setIsDeleting(true);

    try {
      const response = await axios.delete<ApiResponse>("/api/delete-account");

      toast.success("Account deleted", {
        description: response.data.message,
      });

      await signOut({ redirect: false });

      router.replace("/sign-up");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.error("Couldn't delete account", {
        description:
          axiosError.response?.data.message ?? "Failed to delete account",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <nav className="border-b border-white/[0.06] bg-[#111115]/95 text-white backdrop-blur-sm">
      <div className="mx-auto flex min-h-20 w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 text-white hover:opacity-90 transition-opacity"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-zinc-800 border border-zinc-700">
            <MessageSquareLock className="size-4 text-white" />
          </span>
          <span className="text-xl font-semibold tracking-tight">
            Mystery Message
          </span>
        </Link>

        {session ? (
          <div className="flex items-center gap-2 sm:gap-5">
            {/* Welcome text */}
            <span className="mr-1 hidden text-base text-white/50 sm:block">
              Welcome,{" "}
              <span className="text-white/85">
                {user?.username || user?.email}
              </span>
            </span>

            {/* Logout */}
            <Button
              variant="ghost"
              onClick={() => signOut()}
              className="
                h-9
                gap-2
                rounded-lg
                border
                border-white/[0.08]
                bg-white/[0.02]
                px-3
                text-white/50
                hover:bg-white/[0.06]
                hover:text-white
                cursor-pointer
              "
            >
              <LogOut className="h-4 w-4" />

              <span className="hidden sm:inline">Logout</span>
            </Button>

            {/* Delete Account */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  disabled={isDeleting}
                  className="
                    h-9
                    gap-2
                    rounded-lg
                    border
                    border-white/[0.08]
                    bg-white/[0.02]
                    px-3
                    text-white/40
                    hover:border-red-500/20
                    hover:bg-red-500/10
                    hover:text-red-400
                    cursor-pointer
                  "
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}

                  <span className="hidden sm:inline">Delete Account</span>
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent className="border-white/[0.08] bg-[#111115] text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete your account?</AlertDialogTitle>

                  <AlertDialogDescription className="text-white/40">
                    This will permanently delete your account and all of your
                    anonymous messages. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel
                    className="
                      border-white/[0.08]
                      bg-transparent
                      text-white/60
                      hover:bg-white/[0.05]
                      hover:text-white
                    "
                  >
                    Cancel
                  </AlertDialogCancel>

                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="
                      gap-2
                      bg-red-500
                      text-white
                      hover:bg-red-600
                    "
                  >
                    {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              className="py-5 px-6 border-zinc-700 bg-transparent text-white hover:text-white hover:bg-zinc-900 cursor-pointer"
            >
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button
              asChild
              className="py-5 px-6 bg-white text-zinc-900 hover:bg-zinc-200 cursor-pointer"
            >
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
