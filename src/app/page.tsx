"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/all";
import { MagnifyingGlassIcon, PlusIcon } from "@phosphor-icons/react";

const Home = () => {
  gsap.registerPlugin(useGSAP);
  gsap.registerPlugin(SplitText);

  const demoContainer = useRef(null);
  const navContainer = useRef(null);

  // navigation animations
  useGSAP(
    () => {
      gsap.to(".nav", {
        duration: 1,
        translateY: 0,
        scale: 1,
        ease: "back.in",
      });
    },
    { scope: navContainer },
  );

  // other text fade in
  useGSAP(() => {
    gsap.to(".fadingLines", {
      duration: 1,
      opacity: 1,
      ease: "back.in",
    });
  });

  // title animations
  useEffect(() => {
    const text = document.querySelector(".headline");
    gsap.set(text, { opacity: 1 });
    const mySplitText = SplitText.create(text, {
      type: "chars, words",
      charsClass: "char",
    });
    const chars = mySplitText.chars;

    if (text) {
      gsap.from(chars, {
        duration: 1,
        delay: 1,
        opacity: 0,
        scale: 0,
        y: 80,
        rotationX: 180,
        transformOrigin: "0% 50% -50",
        ease: "back",
        stagger: 0.05,
        onComplete: () => {
          mySplitText.revert();
          text.removeAttribute("aria-hidden");
        },
      });
    }
  }, []);

  // demo container animations
  useGSAP(
    () => {
      gsap.to(".box", {
        opacity: 1,
        duration: 1,
        delay: 2,
        translateY: 0,
      });
      gsap.set(".card1", { perspective: 700, transformStyle: "preserve-3d" });
      gsap.set(".card2", { perspective: 1700, transformStyle: "preserve-3d" });
      gsap.set(".card3", { perspective: 1200, transformStyle: "preserve-3d" });
      gsap.to(".card1", {
        duration: 1,
        opacity: 1,
        delay: 2.3,
        translateX: 0,
        translateY: 0,
        scale: 1,
        ease: "circ.in",
      });
      gsap.to(".card2", {
        duration: 1.1,
        opacity: 1,
        delay: 2.4,
        translateX: 0,
        translateY: 0,
        scale: 1,
        ease: "circ.in",
      });
      gsap.to(".card3", {
        duration: 1.2,
        opacity: 1,
        delay: 2.5,
        translateX: 0,
        translateY: 0,
        scale: 1,
        ease: "circ.in",
      });
    },
    { scope: demoContainer },
  );

  return (
    <>
      <header
        ref={navContainer}
        className="flex flex-col items-center justify-center gap-6 width-full"
      >
        {/* FIXED NAV */}
        <nav className="nav fixed top-5 -translate-y-50 scale-50 left-1/2 -translate-x-1/2 flex justify-between items-center lg:w-2xl lg:max-w-none lg:min-h-auto overflow-hidden py-2 pl-5 pr-2.5 bg-[#f2f2f2] rounded-full shadow-xl/30 z-100 transition-[max-height_320ms_cubic-bezier(0.22,1,0.36,1),border-radius_260ms_ease,padding_260ms_ease]">
          <Link
            href="/"
            className="flex gap-1 font-heading items-center justify-center font-bold text-lg text-[#151515]"
          >
            Second
            <Image
              src="/logo.webp"
              alt="second-cerebro"
              width={24}
              height={24}
            />
            Cerebro
          </Link>
          <ul className="tracking-widest text-[#151515] text-[13px] font-normal flex items-center justify-center gap-6">
            <li className="hover:opacity-60 transition-opacity duration-200 ease cursor-pointer">
              PRICING
            </li>
            <li className="hover:opacity-60 transition-opacity duration-200 ease cursor-pointer">
              DOCS
            </li>
            <li className="hover:opacity-60 transition-opacity duration-200 ease cursor-pointer">
              FAQ
            </li>
          </ul>
          <Link
            href="/register"
            className="relative flex flex-col font-heading font-medium items-center justify-center text-[0.75rem] tracking-wider uppercase rounded-full h-8.5 cursor-pointer px-4 
            text-white bg-[rgb(255,75,20)]
            hover:shadow-[-1.3px_-1.3px_2.6px_0px_white,2.6px_2.6px_9.9px_0px_rgba(0,0,0,0.25)]
            hover:inset-shadow-[2.5px_2.5px_2.5px_0px_rgba(255,255,255,0.4)]
            transition-all duration-150 ease"
          >
            <div className="absolute inset-0 pointer-events-none rounded-full shadow-[inset_2.5px_2.5px_2.5px_0px_rgba(255,255,255,0.2)] transition-shadow duration-150 ease" />
            get started
          </Link>
        </nav>
      </header>
      <main>
        {/* HERO SECTION */}
        <section className="relative">
          <div className="sticky top-0 h-svh w-full overflow-hidden">
            {/* background gradient */}
            <div className="absolute inset-0 bg-linear-to-b from-black via-blue-300 via-80% to-white" />
            <div className="absolute inset-0 z-20 transform-none">
              <div className="px-8 py-24 max-w-300 h-full mx-auto flex flex-col justify-center">
                <div className="flex flex-row justify-center items-center gap-12">
                  {/* introduction */}
                  <div className="flex flex-col">
                    <h3 className="fadingLines opacity-0 m-0 text-xs text-[#f2f2f2] uppercase tracking-widest font-normal">
                      AI gave everyone the same brain
                    </h3>
                    <h1
                      aria-hidden="true"
                      className="headline text-5xl font-semibold text-white max-w-md my-2"
                    >
                      Your knowledge is your edge
                    </h1>
                    <p className="fadingLines opacity-0 text-[15px] text-[#f2f2f2] max-w-md my-4">
                      Save what matters. Write what you think.
                      <br />
                      Curate an AI that knows what you know.
                    </p>
                    <div className="fadingLines opacity-0 flex items-center gap-2.5">
                      <Link
                        href="/register"
                        className="relative flex gap-3 font-heading font-medium items-center justify-center text-[0.75rem] tracking-wider uppercase rounded-full h-8.5 cursor-pointer px-3 text-[#151515] bg-white hover:shadow-[-1.5px_-1.5px_3px_0px_rgba(255,255,255,0.5),2.5px_2.5px_10px_0px_rgba(0,0,0,0.55)] transition-all duration-150 ease"
                      >
                        <div className="bg-[rgb(255,75,20)] rounded-full size-2 animate-pulse" />
                        get started
                        <div className="absolute inset-0 pointer-events-none rounded-full shadow-[inset_2.5px_2.5px_2.5px_0px_rgba(255,255,255,0.2)] transition-shadow duration-150 ease" />
                      </Link>
                      <h3 className="font-semibold text-[11px] text-white opacity-90 text-nowrap transform-none">
                        it&apos;s free
                      </h3>
                    </div>
                  </div>
                  {/* knowledge base hypothetical demo */}
                  <div
                    ref={demoContainer}
                    className="flex mr-0 ml-auto min-w-0"
                  >
                    <div className="box relative opacity-0 -translate-y-25 p-5 w-150 min-h-100 max-h-full bg-white/10 rounded-xl shadow-[-0.74px_-0.74px_1.48px_0px_rgba(255,255,255,0.4),1.23px_1.23px_4.93px_0px_rgba(0,0,0,0.15)]">
                      <div className="mb-4 flex justify-between items-center">
                        <div className="flex gap-1 justify-center items-center">
                          <div className="size-2 rounded-full bg-white/35"></div>
                          <div className="size-2 rounded-full bg-white/35"></div>
                          <div className="size-2 rounded-full bg-white/35"></div>
                        </div>
                        <div className="flex gap-2 justify-between items-center">
                          <div className="p-2 rounded-[5px] bg-white/20 size-7 flex flex-col items-center justify-center">
                            <MagnifyingGlassIcon
                              weight="bold"
                              className="text-white"
                            />
                          </div>
                          <div className="flex justify-center items-center gap-2 bg-white/30 h-7 px-2.5 rounded-[5px]">
                            <span className="block text-[10px] tracking-widest text-white font-heading font-medium uppercase m-0 p-0 text-nowrap translate-y-[0.1px]">
                              add content
                            </span>
                            <PlusIcon
                              weight="bold"
                              className="size-2.5 text-white"
                            />
                          </div>
                        </div>
                      </div>
                      <h2 className="text-xl m-0 mb-4 font-semibold text-white">
                        Your AI encyclopedia
                      </h2>
                      <div className="grid gap-2 grid-cols-[repeat(4,1fr)]">
                        <div className="relative aspect-4/5.5 rounded-sm shadow-[inset_1.5px_1.5px_1.5px_0px_rgba(255,255,255,0.2)] transition-shadow duration-150 ease">
                          <div className="card1 absolute inset-0 bg-white p-1 rounded-sm -translate-y-50 -translate-x-50 scale-150 opacity-80">
                            <div className="flex flex-col items-start h-full gap-2 rounded-sm justify-between">
                              <div className="mb-1">
                                <Image
                                  className="rounded-sm"
                                  src="/landing/alcohol-on-body.webp"
                                  alt=""
                                  height={533}
                                  width={800}
                                />
                              </div>
                              <h2 className="text-[#151515] text-sm line-clamp-2 text-ellipsis overflow-hidden font-semibold leading-none">
                                Alcohol and your sleep
                              </h2>
                              <div className="flex items-center justify-center mt-auto mb-1 mr-1 ml-auto px-1.5 py-0.5 bg-black text-white rounded-full">
                                <span className="text-[10px]">Podcast</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="relative overflow-hidden aspect-4/5.5 rounded-sm shadow-[inset_1.5px_1.5px_1.5px_0px_rgba(255,255,255,0.2)] transition-shadow duration-150 ease">
                          <div className="absolute inset-0 bg-white p-1">
                            <div className="flex flex-col h-full gap-2 rounded-sm justify-between">
                              <h2 className="text-sm text-[#151515] line-clamp-2 text-ellipsis overflow-hidden font-semibold mt-3 ml-1">
                                Why We Sleep
                              </h2>
                              <div className="flex items-center justify-center mt-auto mb-1 ml-auto mr-1 px-1.5 py-0.5 bg-black text-white rounded-full">
                                <span className="text-[10px]">Book</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="relative overflow-hidden aspect-4/5.5 rounded-sm shadow-[inset_1.5px_1.5px_1.5px_0px_rgba(255,255,255,0.2)] transition-shadow duration-150 ease">
                          <div className="absolute inset-0 bg-slate-200/10 p-1">
                            <div className="flex flex-col h-full gap-2 rounded-sm justify-between">
                              <h2 className="text-sm line-clamp-2 text-ellipsis overflow-hidden font-semibold text-white mt-3 ml-1">
                                Intro To Large Language Models
                              </h2>
                              <div className="flex items-center justify-center mt-auto mb-1 ml-auto mr-1 px-1.5 py-0.5 bg-slate-200/20 text-white rounded-full">
                                <span className="text-[10px]">YouTube</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="relative aspect-4/5.5 rounded-sm shadow-[inset_1.5px_1.5px_1.5px_0px_rgba(255,255,255,0.2)] transition-shadow duration-150 ease">
                          <div className="card2 absolute inset-0 bg-white rounded-sm p-1 transform-3d -translate-y-60 translate-x-50 scale-200 opacity-80">
                            <div className="flex flex-col items-start h-full gap-2 rounded-sm justify-between">
                              <div className="mb-1">
                                <Image
                                  className="rounded-sm"
                                  src="/landing/interstellar.webp"
                                  alt=""
                                  height={533}
                                  width={800}
                                />
                              </div>
                              <h2 className="text-sm text-[#151515] line-clamp-2 text-ellipsis overflow-hidden font-semibold leading-none">
                                Interstellar 2014
                              </h2>
                              <div className="flex items-center justify-center mt-auto mb-1 mr-1 ml-auto px-1.5 py-0.5 bg-black text-white rounded-full">
                                <span className="text-[10px]">Movie</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="relative overflow-hidden aspect-4/5.5 rounded-sm shadow-[inset_1.5px_1.5px_1.5px_0px_rgba(255,255,255,0.2)] transition-shadow duration-150 ease">
                          <div className="absolute inset-0 bg-slate-200/10 p-1">
                            <div className="flex flex-col h-full gap-2 rounded-sm justify-between">
                              <h2 className="text-sm line-clamp-2 text-ellipsis overflow-hidden font-semibold text-white mt-3 ml-1">
                                Founders Mode
                              </h2>
                              <div className="flex items-center justify-center mt-auto mb-1 ml-auto mr-1 px-1.5 py-0.5 bg-slate-200/20 text-white rounded-full">
                                <span className="text-[10px]">Blog</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="relative aspect-4/5.5 rounded-sm shadow-[inset_1.5px_1.5px_1.5px_0px_rgba(255,255,255,0.2)] transition-shadow duration-150 ease">
                          <div className="card3 absolute inset-0 bg-white rounded-sm p-1 transform-3d translate-y-50 -translate-x-50 scale-175 opacity-80">
                            <div className="flex flex-col items-start h-full gap-2 rounded-sm justify-between">
                              <div className="mb-1">
                                <Image
                                  className="rounded-sm"
                                  src="/landing/attention-is-all-you-need.webp"
                                  alt=""
                                  height={533}
                                  width={800}
                                />
                              </div>
                              <h2 className="text-sm text-[#151515] line-clamp-2 text-ellipsis overflow-hidden font-semibold leading-none">
                                Attention Is All You Need
                              </h2>
                              <div className="flex items-center justify-center mt-auto mb-1 mr-1 ml-auto px-1.5 py-0.5 bg-black text-white rounded-full">
                                <span className="text-[10px]">PDF</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="relative overflow-hidden aspect-4/5.5 rounded-sm shadow-[inset_1.5px_1.5px_1.5px_0px_rgba(255,255,255,0.2)] transition-shadow duration-150 ease">
                          <div className="absolute inset-0 bg-white p-1">
                            <div className="flex flex-col h-full gap-2 rounded-sm justify-between">
                              <h2 className="text-sm text-[#151515] line-clamp-2 text-ellipsis overflow-hidden font-semibold mt-3 ml-1">
                                My Daily Sleep Journals
                              </h2>
                              <div className="flex items-center justify-center mt-auto mb-1 ml-auto mr-1 px-1.5 py-0.5 bg-black text-white rounded-full">
                                <span className="text-[10px]">Note</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="relative overflow-hidden aspect-4/5.5 rounded-sm shadow-[inset_1.5px_1.5px_1.5px_0px_rgba(255,255,255,0.2)] transition-shadow duration-150 ease">
                          <div className="absolute inset-0 bg-slate-200/10 p-1">
                            <div className="flex flex-col h-full gap-2 rounded-sm justify-between">
                              <h2 className="text-sm line-clamp-2 text-ellipsis overflow-hidden font-semibold text-white mt-3 ml-1">
                                Atomic Habits
                              </h2>
                              <div className="flex items-center justify-center mt-auto mb-1 ml-auto mr-1 px-1.5 py-0.5 bg-slate-200/20 text-white rounded-full">
                                <span className="text-[10px]">Book</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute inset-0 pointer-events-none rounded-xl shadow-[inset_1.5px_1.5px_1.5px_0px_rgba(255,255,255,0.2)] transition-shadow duration-150 ease" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
