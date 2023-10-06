import React from "react";

const Error = () => {
  return (
    <div>
      <div className="w-screen min-h-full bg-sky-400 flex justify-center">
        <div className="flex justify-center w-5/6	 mt-20	">
          <div className=" h-min 	 p-12 rounded-sm 	font-sans font-semibold">
            <p className=" text-9xl	text-zinc-600 wb-10"> Error 404</p>
            <p> Page not found</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error;
