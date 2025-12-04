"use client";
import LoadingSpinner from "@/components/LoadingSpinner";
import Snippet from "@/components/Snippet/Snippet";
import { useSnippetContext } from "@/context/snippetsContext";
import { ISnippet } from "@/types/types";
import React, { useEffect, useState } from "react";

interface Props {
  params: {
    id: string;
  };
}

function page({ params: { id } }: Props) {
  const { getPublicSnippetById, loading } = useSnippetContext();
  const snippetId = id.split("-").at(-1);

  const [snippet, setSnippet] = useState({} as ISnippet);

  useEffect(() => {
    (async () => {
      const res = await getPublicSnippetById(snippetId);

      setSnippet(res);
    })();
  }, [snippetId]);

  return (
    <main className="p-8 relative min-h-[90vh]">
      {snippet?.title ? (
        <Snippet snippet={snippet} height="640px" />
      ) : (
        <LoadingSpinner />
      )}
    </main>
  );
}

export default page;
