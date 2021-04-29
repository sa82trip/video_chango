import React, { useEffect, useState } from "react";
import { firestore } from "../firebase";
import { Vid_block_type } from "./vid_player";

interface IHeaderProps {
  searchTerm: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearch: (searchTerm: string) => void;
  addVideoToWatchLaterList: () => void;
}
export const Header: React.FC<IHeaderProps> = ({
  searchTerm,
  handleChange,
  handleSearch,
  addVideoToWatchLaterList,
}) => {
  return (
    <>
      <div className="flex items-center w-full bg-gray-500 pt-5 pb-3">
        <div className="mx-auto w-1/2 flex justify-center">
          <input
            type="text"
            name="search-input"
            value={searchTerm}
            onChange={handleChange}
            className="w-7/12 text-xl border-2 border-gray-800 my-3 rounded-md"
          />
          <button
            className="bg-red-700 py-1 px-2 mt-3 ml-1 text-white font-semibold mb-3 rounded-md"
            onClick={() => handleSearch(searchTerm)}
          >
            Search
          </button>
          <button
            className="btn bg-green-500"
            onClick={() => addVideoToWatchLaterList()}
          >
            input data test
          </button>
        </div>
      </div>
    </>
  );
};
