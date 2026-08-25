"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock, Mail, Shield, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const features = [
  {
    icon: Lock,
    title: "Stay anonymous",
    body: "Senders never reveal who they are. Recipients only see the words.",
  },
  {
    icon: Shield,
    title: "You control the inbox",
    body: "Pause messages anytime. Delete anything you do not want to keep.",
  },
  {
    icon: Sparkles,
    title: "Share one link",
    body: "Copy your public page and collect honest notes from anyone.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-white">
      <main className="grow flex flex-col items-center px-4 md:px-24 py-16">
        {/* Hero */}
        <section className="text-center mb-10 md:mb-14 max-w-2xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
            Anonymous by design
          </p>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Dive into the world of anonymous feedback
          </h1>
          <p className="mt-4 text-base md:text-lg text-zinc-400">
            Mystery Message — where your identity remains a secret.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              asChild
              className="h-11 !px-6 bg-white text-zinc-900 hover:bg-zinc-200 cursor-pointer"
            >
              <Link href="/sign-up" className="inline-flex items-center gap-2">
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 px-9 border-zinc-700 bg-transparent text-white hover:text-white hover:bg-zinc-900 cursor-pointer"
            >
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>
        </section>

        {/* Carousel */}
        <Carousel
          plugins={[Autoplay({ delay: 2500 })]}
          opts={{ loop: true }}
          className="w-full max-w-lg md:max-w-xl cursor-grab active:cursor-grabbing select-none"
        >
          <CarouselContent className="cursor-grab active:cursor-grabbing">
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card className="bg-zinc-900 border-zinc-800 text-white cursor-grab active:cursor-grabbing">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Mail className="h-4 w-4 text-zinc-400 shrink-0" />
                      {message.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-zinc-200 leading-relaxed">
                      {message.content}
                    </p>
                    <p className="mt-3 text-xs text-zinc-500">
                      {message.received}
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Feature cards */}
        <section className="mt-16 grid w-full max-w-5xl gap-4 md:grid-cols-3">
          {features.map((item) => (
            <Card
              key={item.title}
              className="bg-zinc-900 border-zinc-800 text-white p-6"
            >
              <item.icon className="h-5 w-5 text-zinc-400" />
              <h2 className="mt-4 text-base font-semibold text-white">
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {item.body}
              </p>
            </Card>
          ))}
        </section>
      </main>

      <footer className="border-t border-zinc-800 text-center p-4 md:p-6 text-zinc-500 text-sm">
        © {new Date().getFullYear()} Mystery Message. All rights reserved.
      </footer>
    </div>
  );
}
