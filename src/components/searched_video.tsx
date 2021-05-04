import React, { useContext, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Link } from "react-router-dom";
import { firestore } from "../firebase";
import { LoggedInUserCtx } from "./App";
import { Vid_block_type } from "./vid_player";

export interface ISearchedVideo
  extends Omit<Partial<Vid_block_type>, "toggleModal"> {
  title: string;
  url: string;
  thumbnail: string;
  channelId: string;
  videoId: string;
  channelTitle: string;
  publishedAt: string;
  toggleModal?: ({}: ISearchedVideo) => void;
}

export const SearchedVideo: React.FC<ISearchedVideo> = ({
  title,
  url,
  thumbnail,
  channelId,
  channelTitle,
  videoId,
  publishedAt,
  toggleModal,
}) => {
  const [IsModalOpen, setIsOpen] = useState(false);

  const loggedInUserCtx = useContext(LoggedInUserCtx);
  const addVideoToWatchedVideoList = async () => {
    if (loggedInUserCtx) {
      const videoThatWillWatchLater: Vid_block_type = {
        url,
        userEmail: (loggedInUserCtx.email && loggedInUserCtx.email) || "test",
        rating: 3,
        archived: false,
        playedSeconds: 0,
        createdAt: new Date(),
      };
      await firestore
        .collection("vid-list")
        .add(addVideoToWatchedVideoList)
        .then(() => {});
    }
  };

  const playerRef = useRef<ReactPlayer>(null);
  // const handleSeekTo = () => {
  //   console.log(playedSeconds);
  //   if (playedSeconds) {
  //     playerRef.current?.seekTo(playedSeconds, "seconds");
  //   } else {
  //     return;
  //   }
  // };
  return (
    <>
      <div className="relative my-3 mx-3 ">
        <div className="">
          <img
            onClick={() =>
              toggleModal &&
              toggleModal({
                url,
                userEmail: loggedInUserCtx!.email || "test@email.com",
                rating: 3,
                archived: false,
                playedSeconds: 0,
                title,
                thumbnail,
                channelTitle,
                channelId,
                videoId,
                publishedAt,
              })
            }
            className="w-96 cursor-pointer hover:opacity-70 transition-colors duration-100"
            src={thumbnail}
            alt=""
          />
        </div>
        <div className="flex flex-row justify-between group">
          <h3 className="font-bold">{title}</h3>
          <span className="text-white font-bold py-1 mr-1 object-center">
            ⋮
          </span>
        </div>
        <h4
          onClick={() =>
            window.open(`https://youtube.com/channel/${channelId}`)
          }
          className="text-gray-500 cursor-pointer"
        >
          {channelTitle}
        </h4>
        <h4 className="text-sm text-gray-500">
          {new Date(publishedAt).toLocaleDateString()}에 업로드 됨
        </h4>
      </div>
    </>
  );
};
