import React, { useRef, useState } from "react";
import ReactPlayer from "react-player";
import { firestore } from "../firebase";

export interface Vid_block_type {
  url: string;
  id: string;
  rating: number;
  archived: boolean;
  handleDeleteButtonClick?: (id: string) => void;
  toggleModal?: (url: string) => void;
  playedSeconds: number;
  //createdAt: Date;
}
export const VidPlayer: React.FC<Vid_block_type> = ({
  url,
  id,
  rating,
  archived,
  handleDeleteButtonClick,
  toggleModal,
  playedSeconds,
  //createdAt,
}) => {
  const [playedSec, setPlayedSec] = useState(0);
  const handleUpdateWatchedVideo = () => {
    const currentNum = playerRef.current?.getCurrentTime();
    const flooredNum = Math.floor((currentNum && currentNum) || 0);
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
    <div id={id} className="font-semibold text-white">
      <ReactPlayer
        ref={playerRef}
        light={true}
        controls={true}
        width={`${() => document.getElementById(`${id}`)?.offsetWidth}`}
        url={url}
        onProgress={(played) => {
          console.log(played.playedSeconds);
          setPlayedSec(played.playedSeconds);
        }}
        onPause={() => {
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
            onClick={() => toggleModal && toggleModal(url)}
          >
            Theather Mode
          </button>
          <button
            onClick={() =>
              handleDeleteButtonClick && handleDeleteButtonClick(id)
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
