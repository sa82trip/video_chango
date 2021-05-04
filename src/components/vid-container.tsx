import React, { useEffect, useState } from "react";
import { VidPlayer, Vid_block_type } from "./vid_player";

interface IProps {
  vid_list: Vid_block_type[];
  handleDeleteButtonClick?: (id: string) => void;
  toggleModal: ({}: Vid_block_type) => void;
}

export const VidContainer: React.FC<IProps> = ({
  vid_list,
  handleDeleteButtonClick,
  toggleModal,
}) => {
  const [winWidth, setWinWidth] = useState(window.innerWidth); //const [vids, setVids] = useState<YouTubeSearchResults[]>([]);
  const [testList, setTestList] = useState(vid_list);
  useEffect(() => {
    console.log(vid_list);
    const handleSize = () => {
      console.log(window.innerWidth);
      setWinWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleSize);
    return () => {
      window.removeEventListener("resize", handleSize);
    };
  }, []);

  return (
    <div
      className={`max-w-full mx-auto bg-gray-800 ${
        vid_list ? "h-full" : "h-200"
      }`}
    >
      {/*header
      <div className="flex items-center w-full bg-gray-500 py-5">
        <div className="mx-auto w-1/2 flex justify-center">
          <input
            type="text"
            name="search-input"
            value={searchTerm}
            onChange={handleChnage}
            className="w-7/12 text-xl border-2 border-gray-800 my-3 rounded-md"
          />
          <button
            className="bg-red-700 py-1 px-1 mt-3 ml-1 text-white font-medium mb-3 rounded-md"
            onClick={() => handleSearch(searchTerm)}
          >
            click
          </button>
        </div>
      </div>
*/}
      <div className="">
        <div
          className={`${
            winWidth > 1000 && winWidth < 1800
              ? `grid grid-cols-2 gap-3 px-3`
              : winWidth < 1000
              ? `flex-col`
              : `grid grid-cols-3 gap-5 px-3`
          }`}
        >
          {vid_list
            .filter((one) => one.url !== "")
            .map((one) => {
              console.log(one);
              return (
                <div key={one.id!} className="bg-gray-600">
                  <VidPlayer
                    id={one.id}
                    toggleModal={toggleModal}
                    handleDeleteButtonClick={handleDeleteButtonClick}
                    url={one.url}
                    archived={one.archived}
                    createdAt={one.createdAt}
                    userEmail={one.userEmail}
                    rating={one.rating}
                    playedSeconds={one.playedSeconds}
                    title={one.title}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
