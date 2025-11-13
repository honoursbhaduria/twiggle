import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import TravelCard from "./card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useTravelApi";
import { User } from "lucide-react";



export default function SidebarDemo() {

  const {logout}=useAuth()
  const navigate=useNavigate()

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/auth");
    }
  };

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-white dark:text-neutral-200" />
      ),
    },
    {
      label: "Destination",
      href: "/destination",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-white dark:text-neutral-200" />
      ),
    },
    {
      label: "Travel Guru",
      href : "/travelguru",
      icon: (
        <User className="h-5 w-5 shrink-0 text-white dark:text-neutral-200" />
      )
    },
      {
      label: "Travel Guru Dashboard",
      href : "/travelguru/dashboard",
      icon: (
        <User className="h-5 w-5 shrink-0 text-white dark:text-neutral-200" />
      )
    },
    {
      label: "Profile",
      href: "#",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-white dark:text-neutral-200" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      onClick: handleLogout,
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-white dark:text-neutral-200" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        " flex h-[100vh] w-fit bg-transparent border-none flex-1 flex-col overflow-hidden fixed rounded-md border z-50 md:border-[#fe6d3c]/30 md:bg-[#fe6d3c] md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        // for your use case, use `h-screen` instead of `h-[60vh]`
        "h-screen"
      )}>
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody  className="justify-between gap-10">
          <div onClick={()=>navigate("/")} className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <>
              <Logo />
            </>
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
        <SidebarLink  key={idx} link={link} className="rounded-xl px-2 py-2 text-white transition-colors hover:bg-white/20" />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Tejash",
                href: "#",
                icon: (
                  <img
                    src="/logo.png"
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar" />
                ),
              }} />
          </div>
        </SidebarBody>
      </Sidebar>

    </div>
  );
}
export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-semibold text-white">
      <div
        className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-white dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-white dark:text-white">
        TWIGGLE
      </motion.span>
    </a>
  );
};
export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white">
      <div
        className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-white dark:bg-white" />
    </a>
  );
};







