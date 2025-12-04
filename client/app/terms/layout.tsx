import React from "react";

interface Props {
  children: React.ReactNode;
}

function layout({ children }: Props) {
  return (
    <main className="px-6 mx-auto xl:w-[80rem]">
      {children}
      <footer className="mt-6 py-12 flex justify-center items-center">
        <p className="text-center">
          &copy;{new Date().getFullYear()} TheCodeDealer. All rights reserved.
        </p>
      </footer>
    </main>
  );
}

export default layout;
