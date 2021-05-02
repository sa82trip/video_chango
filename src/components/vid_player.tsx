import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { firestore } from "../firebase";

export interface Vid_block_type {
  id?: string;
  url: string;
  userEmail: string;
  rating: number;
  archived: boolean;
  handleDeleteButtonClick?: (id: string) => void;
  toggleModal?: ({}: Vid_block_type) => void;
  playedSeconds: number;
  createdAt?: Date;
}
export const VidPlayer: React.FC<Vid_block_type> = ({
  id,
  url,
  userEmail,
  rating,
  archived,
  handleDeleteButtonClick,
  toggleModal,
  playedSeconds,
  createdAt,
}) => {
  const [playedSec, setPlayedSec] = useState(0);
  const [playing, setPlaying] = useState(false);

  // window.onbeforeunload = function (evt: any) {
  //   handleUpdateWatchedVideo();
  //   return "";
  // };
  const handleUpdateWatchedVideo = () => {
    const currentNum = playerRef.current?.getCurrentTime();
    setPlayedSec(playedSec && playedSec | 0);
    const flooredNum = Math.floor((currentNum && currentNum) || 0);
    console.log("id", id, flooredNum);
    const watchedVideo = firestore.collection("vid-list").doc(id);
    watchedVideo.get().then((doc) => {
      console.log(doc.data());
      watchedVideo.set({ ...doc.data(), playedSeconds: flooredNum });
    });
  };

  const playerRef = useRef<ReactPlayer>(null);
  const handleSeekTo = () => {
    console.log(playedSeconds);
    if (playedSeconds) {
      playerRef.current?.seekTo(playedSeconds, "seconds");
    } else {
      return;
    }
  };
  return (
    <div id={id} className="font-semibold text-white mx-1">
      <ReactPlayer
        onReady={(e) => setPlaying(true)}
        playing={playing}
        ref={playerRef}
        light={true}
        controls={true}
        // width={`${() => document.getElementById(`${id}`)?.offsetWidth}`}
        width={"100%"}
        url={url}
        onPause={() => {
          handleUpdateWatchedVideo();
        }}
        onEnded={() => {
          handleUpdateWatchedVideo();
        }}
      />
      <div className="flex justify-between">
        <label htmlFor="" className="my-auto">
          <select
            className="mx-5 bg-gray-300 text-black"
            id=""
            name="rating"
            defaultValue={rating}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </label>
        <div className="mr-3">
          <button onClick={() => handleSeekTo()} className="btn">
            이어보기
          </button>
          <button className="btn">archive</button>
          <button
            className="btn bg-black text-yellow-300 font-semibold"
            onClick={() =>
              toggleModal &&
              toggleModal({
                id,
                userEmail,
                url,
                rating,
                archived,
                playedSeconds,
              })
            }
          >
            Theather Mode
          </button>
          <button
            onClick={() =>
              handleDeleteButtonClick && handleDeleteButtonClick(id!)
            }
            className="btn"
          >
            delete
          </button>
        </div>
      </div>
    </div>
  );
};
