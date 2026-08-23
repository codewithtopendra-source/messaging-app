"use client";

import { useState } from "react";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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
  const user: User = session?.user as User;
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.delete<ApiResponse>("/api/delete-account");
      toast.success(response.data.message, {
        description: response.data.message,
      });
      await signOut({ redirect: false });
      router.replace("/sign-up");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error", {
        description:
          axiosError.response?.data.message || "Failed to delete account",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <nav className="p-4 md:p-6 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link href="/" className="text-xl font-bold mb-4 md:mb-0">
          Mystry Message
        </Link>
        {session ? (
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <span className="mr-0 md:mr-2">
              Welcome, {user?.username || user?.email}
            </span>
            <Button
              className="w-full md:w-auto cursor-pointer"
              onClick={() => signOut()}
            >
              Logout
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="w-full md:w-auto cursor-pointer"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and all your messages from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="cursor-pointer"
                    onClick={handleDeleteAccount}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ) : (
          <Link href="/sign-in">
            <Button className="w-full md:w-auto cursor-pointer">Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
