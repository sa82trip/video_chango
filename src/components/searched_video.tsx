import React, { useState } from "react";
import ReactModal from "react-modal";

export interface ISearchedVideo {
  title: string;
  url: string;
  thumbnail: string;
  channelId: string;
  videoId: string;
  channelTitle: string;
  publishedAt: string;
}

export const SearchedVideo: React.FC<ISearchedVideo> = ({
  title,
  url,
  thumbnail,
  channelId,
  channelTitle,
  videoId,
  publishedAt,
}) => {
  const [IsModalOpen, setIsOpen] = useState(false);
  const customStyles = {
    content: {
      width: "80%",
      height: "80vh",
      background: "gray",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };
  return (
    <div>
      <h1>hihi</h1>
      <div>
        <img src={thumbnail} alt="" />
      </div>
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        <h4 className="text-gray-400">{channelTitle}</h4>
        {/*
        <ReactModal
          style={customStyles}
          isOpen={IsModalOpen}
          onRequestClose={() => setIsOpen((prev) => !prev)}
        ></ReactModal>
		  */}
      </div>
    </div>
  );
};
