"use client";
import { useUserContext } from "@/context/userContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import SearchInput from "../SearchInput/SearchInput";
import { login, register } from "@/utils/Icons";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context/globalContext";
import SearchIcon from "@/public/Icons/SearchIcon";

function Header() {
  const { user } = useUserContext();
  const { openModalForSnippet, openProfileModal, openModalForSearch } =
    useGlobalContext();

  const photo = user?.photo;
  const router = useRouter();

  return (
    <div className="fixed z-20 top-0 w-full px-8 flex items-center justify-between bg-1 border-b-[2px] border-rgba-2 h-[8vh]">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/thecodedealer--logo-white.png"
          alt="logo"
          width={30}
          height={30}
          className="ml-[1px]"
        />
        <h1 className="flex items-center font-bold text-white text-2xl">
          Snippy
        </h1>
      </Link>

      <div className="lg:flex hidden">
        <SearchInput />
      </div>

      {!user._id ? (
        <div className="flex items-center gap-4">
          <button
            className="btn-hover relative h-[47px] px-8 bg-[#3A3B3C] flex items-center justify-center gap-4 rounded-xl overflow-hidden"
            onClick={() => router.push("/login")}
          >
            <span className="text-xl text-gray-200">{login}</span>
            <span className="font-bold text-white">Login</span>
            <div className="blob"></div>
          </button>
          <button
            className="btn-hover relative h-[47px] px-8 bg-[#7263F3] flex items-center justify-center gap-4 rounded-xl overflow-hidden"
            onClick={() => router.push("/register")}
          >
            <span className="text-xl text-gray-200">{register}</span>
            <span className="font-bold text-white">Register</span>
            <div className="blob"></div>
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button
            className="mr-4 h-[42px] px-4 flex items-center justify-center text-black bg-white rounded-lg font-semibold hover:bg-white/80 transition duration-200 ease-in-out"
            onClick={openModalForSnippet}
          >
            Create Snippet
          </button>

          <button
            onClick={openModalForSearch}
            className="w-[42px] h-[42px] flex items-center justify-center bg-rgba-3 rounded-lg lg:hidden"
          >
            <SearchIcon stroke="rgba(249,249,249,0.6)" />
          </button>

          <button
            onClick={openProfileModal}
            className="w-[43px] h-[42px] flex items-center justify-center bg-rgba-3 rounded-lg"
          >
            <Image
              src={photo || "/image--user.png"}
              alt="profile"
              width={35}
              height={35}
              className="rounded-lg"
            />
          </button>
        </div>
      )}
    </div>
  );
}

export default Header;
