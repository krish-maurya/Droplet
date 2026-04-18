"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import SignUpForm from "@/components/SignUpForm";

const ArrowRightIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export default function LandingPage() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);

  const openForm = () => {
    setDirection(1);
    setShowForm(true);
  };

  const closeForm = () => {
    setDirection(-1);
    setShowForm(false);
  };

  const landingVariants = {
    enter: (dir: 1 | -1) => ({
      x: dir === -1 ? "100%" : 0,
    }),
    center: { x: 0 },
    exit: (dir: 1 | -1) => ({
      x: dir === 1 ? "100%" : "-100%",
    }),
  };

  const formVariants = {
    enter: (dir: 1 | -1) => ({
      x: dir === 1 ? "-100%" : "100%",
    }),
    center: { x: 0 },
    exit: (dir: 1 | -1) => ({
      x: dir === -1 ? "-100%" : "100%",
    }),
  };

  const quotes = [
    { text: "Organize your digital life with calm precision.", author: "Droplet" },
    { text: "Where folders and files find perfect harmony.", author: "Droplet" },
    { text: "Minimal by design. Powerful by nature.", author: "Droplet" },
    { text: "Your workspace, elevated.", author: "Droplet" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [quotes.length]);


  return (
    <div className="relative h-screen overflow-hidden bg-[#f7f5f0]">
      <AnimatePresence mode="sync" initial={false} custom={direction}>
        {!showForm ? (
          <motion.div
            key="landing"
            custom={direction}
            variants={landingVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute inset-0 overflow-hidden"
          >
      {/* Subtle grid pattern */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      />

      {/* ========== NAVIGATION ========== */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 `}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#2c2b28] flex items-center justify-center shadow-sm">
              <span className="text-white text-sm font-medium">◈</span>
            </div>
            <span className="font-semibold text-[#2c2b28] tracking-tight text-lg">Droplet</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-[#5b5852] hover:text-[#2c2b28] transition">Features</a>
            <a href="#testimonials" className="text-sm text-[#5b5852] hover:text-[#2c2b28] transition">Testimonials</a>
            <a href="#pricing" className="text-sm text-[#5b5852] hover:text-[#2c2b28] transition">Pricing</a>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="text-sm text-[#5b5852] hover:text-[#2c2b28] transition">
              Sign in
            </Link>
            <button
              type="button"
              onClick={openForm}
              className="px-4 py-2 rounded-full bg-[#2c2b28] text-white text-sm font-medium transition hover:bg-[#3d3b37] shadow-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ========== HERO SECTION ========== */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-1.5 border border-[#e6e1d8] mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2c2b28] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2c2b28]"></span>
                </span>
                <span className="text-xs text-[#5b5852]">Introducing Droplet</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-[#2c2b28] leading-[1.1]">
                Your workspace,
                <br />
                <span className="text-[#8b877f]">elevated.</span>
              </h1>

              {/* Description */}
              <p className="text-lg text-[#8b877f] mt-6 max-w-lg mx-auto lg:mx-0">
                A calm, structured environment for your folders and files.
                Minimal by design. Powerful by nature.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
                <button
                  type="button"
                  onClick={openForm}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#2c2b28] text-white font-medium transition hover:bg-[#3d3b37] shadow-sm"
                >
                  Start free trial
                  <ArrowRightIcon />
                </button>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[#d1cbc0] bg-white/70 text-[#5b5852] font-medium transition hover:bg-white"
                >
                  Learn more
                </a>
              </div>

              {/* Animated Quote */}
              <div className="mt-12 pt-8 border-t border-[#e6e1d8]">
                <div className="text-base font-light text-[#2c2b28] leading-relaxed transition-all duration-500">
                  “{quotes[currentQuoteIndex].text}”
                </div>
                <p className="text-xs text-[#8b877f] mt-2 tracking-wide">
                  — {quotes[currentQuoteIndex].author}
                </p>
                <div className="flex justify-center lg:justify-start gap-2 mt-4">
                  {quotes.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuoteIndex(idx)}
                      className={`transition-all duration-300 rounded-full ${idx === currentQuoteIndex
                        ? "w-6 h-1.5 bg-[#2c2b28]"
                        : "w-1.5 h-1.5 bg-[#cbc4b8] hover:bg-[#a39e94]"
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right - Dashboard Preview */}
            <div className="flex-1 relative flex justify-end items-center pr-20">
              <svg width="451" height="560" viewBox="0 0 236 242" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M153.217 240.3L28.2764 200.098C20.4953 197.595 21.0309 186.397 29.0144 184.643C102.971 168.389 212.65 144 213 144H219.471C226.158 144 229.897 151.717 225.749 156.962L161.942 237.647C159.872 240.265 156.394 241.322 153.217 240.3Z" fill="black" stroke="black" />
                <path d="M69 110.354V26.6806C69 28.0465 69.9228 29.24 71.2447 29.5839L214.755 66.9161C216.077 67.26 217 68.4535 217 69.8194V148.403C217 150.376 215.129 151.812 213.224 151.301L71.2235 113.252C69.912 112.901 69 111.712 69 110.354Z" fill="white" />
                <path d="M69 24V110.354C69 111.712 69.912 112.901 71.2235 113.252L213.224 151.301C215.129 151.812 217 150.376 217 148.403V69.8194C217 68.4535 216.077 67.26 214.755 66.9161L71.2447 29.5839C69.9228 29.24 69 28.0465 69 26.6806V24Z" stroke="black" />
                <path d="M68.6969 54.4388L5.69689 98.805C4.63297 99.5542 4 100.774 4 102.075V152.564C4 155.643 7.33333 157.567 10 156.028L10.5 155.739L73 119.655C74.2376 118.94 75 117.62 75 116.191V57.7092C75 54.468 71.3469 52.5726 68.6969 54.4388Z" fill="#FFF8F8" stroke="black" />
                <path d="M77 127.56V35.8616V27.6473C77 25.7134 78.8029 24.2848 80.6856 24.7267L88.8144 26.6349C90.6971 27.0768 92.5 25.6481 92.5 23.7142V14.9097C92.5 12.9371 94.3711 11.5014 96.2765 12.0119L138.276 23.2658C139.588 23.6172 140.5 24.8057 140.5 26.1635V34.339C140.5 35.6969 141.412 36.8854 142.724 37.2368L206.276 54.2658C207.588 54.6172 208.5 55.8057 208.5 57.1635V67.8616V161.187C208.5 163.16 206.629 164.596 204.724 164.085L79.2235 130.457C77.912 130.106 77 128.917 77 127.56Z" fill="#2C2B28" stroke="black" />
                <path d="M77 127.56V35.8616V27.6473C77 25.7134 78.8029 24.2848 80.6856 24.7267L88.8144 26.6349C90.6971 27.0768 92.5 25.6481 92.5 23.7142V14.9097C92.5 12.9371 94.3711 11.5014 96.2765 12.0119L138.276 23.2658C139.588 23.6172 140.5 24.8057 140.5 26.1635V34.339C140.5 35.6969 141.412 36.8854 142.724 37.2368L206.276 54.2658C207.588 54.6172 208.5 55.8057 208.5 57.1635V67.8616V161.187C208.5 163.16 206.629 164.596 204.724 164.085L79.2235 130.457C77.912 130.106 77 128.917 77 127.56Z" fill="#2C2B28" stroke="black" />
                <path d="M77 127.56V35.8616V27.6473C77 25.7134 78.8029 24.2848 80.6856 24.7267L88.8144 26.6349C90.6971 27.0768 92.5 25.6481 92.5 23.7142V14.9097C92.5 12.9371 94.3711 11.5014 96.2765 12.0119L138.276 23.2658C139.588 23.6172 140.5 24.8057 140.5 26.1635V34.339C140.5 35.6969 141.412 36.8854 142.724 37.2368L206.276 54.2658C207.588 54.6172 208.5 55.8057 208.5 57.1635V67.8616V161.187C208.5 163.16 206.629 164.596 204.724 164.085L79.2235 130.457C77.912 130.106 77 128.917 77 127.56Z" fill="#2C2B28" stroke="black" />
                <path d="M77 127.56V35.8616V27.6473C77 25.7134 78.8029 24.2848 80.6856 24.7267L88.8144 26.6349C90.6971 27.0768 92.5 25.6481 92.5 23.7142V14.9097C92.5 12.9371 94.3711 11.5014 96.2765 12.0119L138.276 23.2658C139.588 23.6172 140.5 24.8057 140.5 26.1635V34.339C140.5 35.6969 141.412 36.8854 142.724 37.2368L206.276 54.2658C207.588 54.6172 208.5 55.8057 208.5 57.1635V67.8616V161.187C208.5 163.16 206.629 164.596 204.724 164.085L79.2235 130.457C77.912 130.106 77 128.917 77 127.56Z" fill="#2C2B28" stroke="black" />
                <path d="M77 127.56V35.8616V27.6473C77 25.7134 78.8029 24.2848 80.6856 24.7267L88.8144 26.6349C90.6971 27.0768 92.5 25.6481 92.5 23.7142V14.9097C92.5 12.9371 94.3711 11.5014 96.2765 12.0119L138.276 23.2658C139.588 23.6172 140.5 24.8057 140.5 26.1635V34.339C140.5 35.6969 141.412 36.8854 142.724 37.2368L206.276 54.2658C207.588 54.6172 208.5 55.8057 208.5 57.1635V67.8616V161.187C208.5 163.16 206.629 164.596 204.724 164.085L79.2235 130.457C77.912 130.106 77 128.917 77 127.56Z" fill="#2C2B28" stroke="black" />
                <path d="M77 127.56V35.8616V27.6473C77 25.7134 78.8029 24.2848 80.6856 24.7267L88.8144 26.6349C90.6971 27.0768 92.5 25.6481 92.5 23.7142V14.9097C92.5 12.9371 94.3711 11.5014 96.2765 12.0119L138.276 23.2658C139.588 23.6172 140.5 24.8057 140.5 26.1635V34.339C140.5 35.6969 141.412 36.8854 142.724 37.2368L206.276 54.2658C207.588 54.6172 208.5 55.8057 208.5 57.1635V67.8616V161.187C208.5 163.16 206.629 164.596 204.724 164.085L79.2235 130.457C77.912 130.106 77 128.917 77 127.56Z" fill="#2C2B28" stroke="black" />
                <path d="M70 133.56V41.8616V33.6473C70 31.7134 71.8029 30.2848 73.6856 30.7267L81.8144 32.6349C83.6971 33.0768 85.5 31.6481 85.5 29.7142V20.9097C85.5 18.9371 87.3711 17.5014 89.2765 18.0119L131.276 29.2658C132.588 29.6172 133.5 30.8057 133.5 32.1635V40.339C133.5 41.6969 134.412 42.8854 135.724 43.2368L199.276 60.2658C200.588 60.6172 201.5 61.8057 201.5 63.1635V73.8616V167.187C201.5 169.16 199.629 170.596 197.724 170.085L72.2235 136.457C70.912 136.106 70 134.917 70 133.56Z" fill="#F7F5F0" stroke="black" />
                <path d="M70 133.56V41.8616V33.6473C70 31.7134 71.8029 30.2848 73.6856 30.7267L81.8144 32.6349C83.6971 33.0768 85.5 31.6481 85.5 29.7142V20.9097C85.5 18.9371 87.3711 17.5014 89.2765 18.0119L131.276 29.2658C132.588 29.6172 133.5 30.8057 133.5 32.1635V40.339C133.5 41.6969 134.412 42.8854 135.724 43.2368L199.276 60.2658C200.588 60.6172 201.5 61.8057 201.5 63.1635V73.8616V167.187C201.5 169.16 199.629 170.596 197.724 170.085L72.2235 136.457C70.912 136.106 70 134.917 70 133.56Z" fill="#F7F5F0" stroke="black" />
                <path d="M70 133.56V41.8616V33.6473C70 31.7134 71.8029 30.2848 73.6856 30.7267L81.8144 32.6349C83.6971 33.0768 85.5 31.6481 85.5 29.7142V20.9097C85.5 18.9371 87.3711 17.5014 89.2765 18.0119L131.276 29.2658C132.588 29.6172 133.5 30.8057 133.5 32.1635V40.339C133.5 41.6969 134.412 42.8854 135.724 43.2368L199.276 60.2658C200.588 60.6172 201.5 61.8057 201.5 63.1635V73.8616V167.187C201.5 169.16 199.629 170.596 197.724 170.085L72.2235 136.457C70.912 136.106 70 134.917 70 133.56Z" fill="#F7F5F0" stroke="black" />
                <path d="M70 133.56V41.8616V33.6473C70 31.7134 71.8029 30.2848 73.6856 30.7267L81.8144 32.6349C83.6971 33.0768 85.5 31.6481 85.5 29.7142V20.9097C85.5 18.9371 87.3711 17.5014 89.2765 18.0119L131.276 29.2658C132.588 29.6172 133.5 30.8057 133.5 32.1635V40.339C133.5 41.6969 134.412 42.8854 135.724 43.2368L199.276 60.2658C200.588 60.6172 201.5 61.8057 201.5 63.1635V73.8616V167.187C201.5 169.16 199.629 170.596 197.724 170.085L72.2235 136.457C70.912 136.106 70 134.917 70 133.56Z" fill="#F7F5F0" stroke="black" />
                <path d="M61 143.56V51.8616V43.6473C61 41.7134 62.8029 40.2848 64.6856 40.7267L72.8144 42.6349C74.6971 43.0768 76.5 41.6481 76.5 39.7142V30.9097C76.5 28.9371 78.3711 27.5014 80.2765 28.0119L122.276 39.2658C123.588 39.6172 124.5 40.8057 124.5 42.1635V50.339C124.5 51.6969 125.412 52.8854 126.724 53.2368L190.276 70.2658C191.588 70.6172 192.5 71.8057 192.5 73.1635V83.8616V177.187C192.5 179.16 190.629 180.596 188.724 180.085L63.2235 146.457C61.912 146.106 61 144.917 61 143.56Z" fill="#ECE8E1" stroke="black" />
                <path d="M61 143.56V51.8616V43.6473C61 41.7134 62.8029 40.2848 64.6856 40.7267L72.8144 42.6349C74.6971 43.0768 76.5 41.6481 76.5 39.7142V30.9097C76.5 28.9371 78.3711 27.5014 80.2765 28.0119L122.276 39.2658C123.588 39.6172 124.5 40.8057 124.5 42.1635V50.339C124.5 51.6969 125.412 52.8854 126.724 53.2368L190.276 70.2658C191.588 70.6172 192.5 71.8057 192.5 73.1635V83.8616V177.187C192.5 179.16 190.629 180.596 188.724 180.085L63.2235 146.457C61.912 146.106 61 144.917 61 143.56Z" fill="#ECE8E1" stroke="black" />
                <path d="M61 143.56V51.8616V43.6473C61 41.7134 62.8029 40.2848 64.6856 40.7267L72.8144 42.6349C74.6971 43.0768 76.5 41.6481 76.5 39.7142V30.9097C76.5 28.9371 78.3711 27.5014 80.2765 28.0119L122.276 39.2658C123.588 39.6172 124.5 40.8057 124.5 42.1635V50.339C124.5 51.6969 125.412 52.8854 126.724 53.2368L190.276 70.2658C191.588 70.6172 192.5 71.8057 192.5 73.1635V83.8616V177.187C192.5 179.16 190.629 180.596 188.724 180.085L63.2235 146.457C61.912 146.106 61 144.917 61 143.56Z" fill="#ECE8E1" stroke="black" />
                <path d="M61 143.56V51.8616V43.6473C61 41.7134 62.8029 40.2848 64.6856 40.7267L72.8144 42.6349C74.6971 43.0768 76.5 41.6481 76.5 39.7142V30.9097C76.5 28.9371 78.3711 27.5014 80.2765 28.0119L122.276 39.2658C123.588 39.6172 124.5 40.8057 124.5 42.1635V50.339C124.5 51.6969 125.412 52.8854 126.724 53.2368L190.276 70.2658C191.588 70.6172 192.5 71.8057 192.5 73.1635V83.8616V177.187C192.5 179.16 190.629 180.596 188.724 180.085L63.2235 146.457C61.912 146.106 61 144.917 61 143.56Z" fill="#ECE8E1" stroke="black" />
                <path d="M54 151.56V59.8616V51.6473C54 49.7134 55.8029 48.2848 57.6856 48.7267L65.8144 50.6349C67.6971 51.0768 69.5 49.6481 69.5 47.7142V38.9097C69.5 36.9371 71.3711 35.5014 73.2765 36.0119L115.276 47.2658C116.588 47.6172 117.5 48.8057 117.5 50.1635V58.339C117.5 59.6969 118.412 60.8854 119.724 61.2368L183.276 78.2658C184.588 78.6172 185.5 79.8057 185.5 81.1635V91.8616V185.187C185.5 187.16 183.629 188.596 181.724 188.085L56.2235 154.457C54.912 154.106 54 152.917 54 151.56Z" fill="white" stroke="black" />
                <path d="M54 151.56V59.8616V51.6473C54 49.7134 55.8029 48.2848 57.6856 48.7267L65.8144 50.6349C67.6971 51.0768 69.5 49.6481 69.5 47.7142V38.9097C69.5 36.9371 71.3711 35.5014 73.2765 36.0119L115.276 47.2658C116.588 47.6172 117.5 48.8057 117.5 50.1635V58.339C117.5 59.6969 118.412 60.8854 119.724 61.2368L183.276 78.2658C184.588 78.6172 185.5 79.8057 185.5 81.1635V91.8616V185.187C185.5 187.16 183.629 188.596 181.724 188.085L56.2235 154.457C54.912 154.106 54 152.917 54 151.56Z" fill="white" stroke="black" />
                <path d="M54 151.56V59.8616V51.6473C54 49.7134 55.8029 48.2848 57.6856 48.7267L65.8144 50.6349C67.6971 51.0768 69.5 49.6481 69.5 47.7142V38.9097C69.5 36.9371 71.3711 35.5014 73.2765 36.0119L115.276 47.2658C116.588 47.6172 117.5 48.8057 117.5 50.1635V58.339C117.5 59.6969 118.412 60.8854 119.724 61.2368L183.276 78.2658C184.588 78.6172 185.5 79.8057 185.5 81.1635V91.8616V185.187C185.5 187.16 183.629 188.596 181.724 188.085L56.2235 154.457C54.912 154.106 54 152.917 54 151.56Z" fill="white" stroke="black" />
                <path d="M54 151.56V59.8616V51.6473C54 49.7134 55.8029 48.2848 57.6856 48.7267L65.8144 50.6349C67.6971 51.0768 69.5 49.6481 69.5 47.7142V38.9097C69.5 36.9371 71.3711 35.5014 73.2765 36.0119L115.276 47.2658C116.588 47.6172 117.5 48.8057 117.5 50.1635V58.339C117.5 59.6969 118.412 60.8854 119.724 61.2368L183.276 78.2658C184.588 78.6172 185.5 79.8057 185.5 81.1635V91.8616V185.187C185.5 187.16 183.629 188.596 181.724 188.085L56.2235 154.457C54.912 154.106 54 152.917 54 151.56Z" fill="white" stroke="black" />
                <path d="M44 116.56V24.8616V16.6473C44 14.7134 45.8029 13.2848 47.6856 13.7267L55.8144 15.6349C57.6971 16.0768 59.5 14.6481 59.5 12.7142V3.90968C59.5 1.93709 61.3711 0.501357 63.2765 1.0119L105.276 12.2658C106.588 12.6172 107.5 13.8057 107.5 15.1635V23.339C107.5 24.6969 108.412 25.8854 109.724 26.2368L173.276 43.2658C174.588 43.6172 175.5 44.8057 175.5 46.1635V56.8616V150.187C175.5 152.16 173.629 153.596 171.724 153.085L46.2235 119.457C44.912 119.106 44 117.917 44 116.56Z" fill="#ECE8E1" stroke="black" />
                <path d="M34 161.56V69.8616V61.6473C34 59.7134 35.8029 58.2848 37.6856 58.7267L45.8144 60.6349C47.6971 61.0768 49.5 59.6481 49.5 57.7142V48.9097C49.5 46.9371 51.3711 45.5014 53.2765 46.0119L95.2765 57.2658C96.588 57.6172 97.5 58.8057 97.5 60.1635V68.339C97.5 69.6969 98.412 70.8854 99.7235 71.2368L163.276 88.2658C164.588 88.6172 165.5 89.8057 165.5 91.1635V101.862V195.187C165.5 197.16 163.629 198.596 161.724 198.085L36.2235 164.457C34.912 164.106 34 162.917 34 161.56Z" fill="#2C2B28" stroke="black" />
                <path d="M24 166.56V74.8616V66.6473C24 64.7134 25.8029 63.2848 27.6856 63.7267L35.8144 65.6349C37.6971 66.0768 39.5 64.6481 39.5 62.7142V53.9097C39.5 51.9371 41.3711 50.5014 43.2765 51.0119L85.2765 62.2658C86.588 62.6172 87.5 63.8057 87.5 65.1635V73.339C87.5 74.6969 88.412 75.8854 89.7235 76.2368L153.276 93.2658C154.588 93.6172 155.5 94.8057 155.5 96.1635V106.862V200.187C155.5 202.16 153.629 203.596 151.724 203.085L26.2235 169.457C24.912 169.106 24 167.917 24 166.56Z" fill="#F7F5F0" stroke="black" />
                <path d="M14 171.56V79.8616V71.6473C14 69.7134 15.8029 68.2848 17.6856 68.7267L25.8144 70.6349C27.6971 71.0768 29.5 69.6481 29.5 67.7142V58.9097C29.5 56.9371 31.3711 55.5014 33.2765 56.0119L75.2765 67.2658C76.588 67.6172 77.5 68.8057 77.5 70.1635V78.339C77.5 79.6969 78.412 80.8854 79.7235 81.2368L143.276 98.2658C144.588 98.6172 145.5 99.8057 145.5 101.164V111.862V205.187C145.5 207.16 143.629 208.596 141.724 208.085L16.2235 174.457C14.912 174.106 14 172.917 14 171.56Z" fill="#ECE8E1" stroke="black" />
                <path d="M4 190.196V104.656V104.41C4 102.437 5.8711 101.001 7.77647 101.512L152 140.156L211.186 68.4389C212.977 66.2693 216.5 67.5354 216.5 70.3484V150.446C216.5 151.128 216.268 151.79 215.841 152.322L152 232L6.2264 193.094C4.91344 192.744 4 191.555 4 190.196Z" fill="white" />
                <path d="M152 232L6.2264 193.094C4.91344 192.744 4 191.555 4 190.196V104.656V104.41C4 102.437 5.8711 101.001 7.77647 101.512L152 140.156M152 232V140.156M152 232L215.841 152.322C216.268 151.79 216.5 151.128 216.5 150.446V70.3484C216.5 67.5354 212.977 66.2693 211.186 68.4389L152 140.156" stroke="black" />
                <path d="M58.106 143L89.606 150.18" stroke="black" strokeWidth="11" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TRUSTED BY SECTION ========== */}
      {/* ========== FOOTER ========== */}
      <footer className="fixed bottom-0 left-0 w-full py-4 border-t border-[#e6e1d8] bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs uppercase tracking-wider text-[#8b877f]">
            © 2025 Krish — Crafted with clarity and calm.
          </p>
        </div>
      </footer>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            custom={direction}
            variants={formVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute inset-0 overflow-y-auto"
          >
            <div className="relative min-h-screen">
              <button
                type="button"
                onClick={closeForm}
                className="fixed top-6 left-6 z-50 rounded-full border border-[#d1cbc0] bg-white/90 px-4 py-2 text-sm text-[#5b5852] backdrop-blur-sm hover:bg-white"
              >
                Back
              </button>
              <SignUpForm />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}