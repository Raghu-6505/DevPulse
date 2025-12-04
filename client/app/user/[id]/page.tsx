"use client";
import Snippet from "@/components/Snippet/Snippet";
import { useSnippetContext } from "@/context/snippetsContext";
import { useUserContext } from "@/context/userContext";
import { ISnippet, IUser } from "@/types/types";
import { joinedOn } from "@/utils/dates";
import { envelope, github, linkedin } from "@/utils/Icons";
import Link from "next/link";
import React, { useEffect } from "react";

interface Props {
  params: {
    id: string;
  };
}

function page({ params: { id } }: Props) {
  const { getUserById } = useUserContext();
  const { getPublicSnippets } = useSnippetContext();

  const [creatorDetails, setCreatorDetails] = React.useState({} as IUser);
  const [snippets, setSnippets] = React.useState([]);

  // get creator id from url
  const creatorId = id.split("-").at(-1);

  useEffect(() => {
    (async () => {
      try {
        const userDetails = await getUserById(creatorId);

        console.log("userDetails", userDetails);

        setCreatorDetails(userDetails);
      } catch (error) {
        console.log("Error fetching creator details", error);
      }
    })();
  }, [creatorId]);

  useEffect(() => {
    if (creatorId) {
      // ensure user id is available before fetching snippets
      (async () => {
        try {
          const res = await getPublicSnippets(creatorId);
          setSnippets(res);
        } catch (error) {
          console.log("Error fetching snippets", error);
        }
      })();
    }
  }, [creatorId]);

  console.log("All snippets", snippets);

  return (
    <main className="p-8">
      <section className="py-8 px-[12rem] bg-2 rounded-lg">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-[#6FCF97]">
            {creatorDetails?.name}
          </h1>
          <p>Joined {joinedOn(creatorDetails?.createdAt)}</p>
        </div>

        <div className="mt-12 flex justify-between gap-14">
          <div>
            <h3 className="text-lg font-bold">User Bio</h3>
            <p>{creatorDetails?.bio}</p>
          </div>
          <div className="px-16 py-8 bg-1 flex flex-col gap-6 rounded-lg text-lg text-gray-300">
            <Link
              target="_blank"
              href={creatorDetails?.github || "https://github.com"}
              className="grid grid-cols-[40px_1fr] items-center pr-[5rem]"
            >
              <span className="text-2xl">{github}</span>
              <span>GitHub</span>
            </Link>
            <Link
              target="_blank"
              href={creatorDetails?.linkedin || "https://linkedin.com"}
              className="grid grid-cols-[40px_1fr] items-center pr-[5rem]"
            >
              <span className="text-2xl">{linkedin}</span>
              <span>LinkedIn</span>
            </Link>
            <Link
              target="_blank"
              href={`mailto:${creatorDetails?.publicEmail}`}
              className="grid grid-cols-[40px_1fr] items-center pr-[5rem]"
            >
              <span className="text-2xl">{envelope}</span>
              <span>Email</span>
            </Link>
          </div>
        </div>
      </section>

      <section>
        <h1 className="text-center text-2xl font-bold mt-12">
          Snippets created by{" "}
          <span className="text-3xl font-bold text-[#6FCF97]">
            {creatorDetails?.name}
          </span>
        </h1>

        <div className="py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {snippets.map((snippet: ISnippet) => (
            <Snippet key={snippet._id} snippet={snippet} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default page;
