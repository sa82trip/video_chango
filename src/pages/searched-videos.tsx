import React, { useContext, useEffect, useState } from "react";
import ReactModal from "react-modal";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import youtubeSearch, { YouTubeSearchResults } from "youtube-search";
import { LoggedInUserCtx } from "../components/App";
import { mockVideos } from "../components/mockData/mockVideos";
import { ISearchedVideo, SearchedVideo } from "../components/searched_video";
import { Vid_block_type } from "../components/vid_player";
import { firestore } from "../firebase";
import { customStyles } from "../styles/modalStyle";

interface SearchedVideosParam {
  searchTerm: string;
}

export const SearchedVideos = () => {
  const params = useParams<SearchedVideosParam>();
  const [searchedVideos, setSearchedVideos] = useState<ISearchedVideo[]>(
    mockVideos
  );
  const [IsModalOpen, setIsOpen] = useState(false);
  const [videoForModal, setVideoForModal] = useState<ISearchedVideo>();

  const toggleModalWithVideo = (video?: ISearchedVideo) => {
    if (video) setVideoForModal(video);
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    console.log("search term", params.searchTerm);
    searchVideo(params.searchTerm);
  }, []);

  const searchVideo = (searchTerm: string) => {
    const opts: youtubeSearch.YouTubeSearchOptions = {
      maxResults: 10,
      key: "AIzaSyBGGKmHHnugNI1OZknrhU949TNcEeyArqM",
    };
    //  setSearchedVideos(mockVideos);
    let mappedVideos: ISearchedVideo[] = [];
    youtubeSearch(searchTerm, opts, (err, results) => {
      if (err) return console.log(err);
      if (results) {
        results.forEach((video) => {
          mappedVideos.push({
            title: video.title,
            url: video.link,
            thumbnail: video.thumbnails.medium?.url || "sample image",
            channelId: video.channelId,
            channelTitle: video.channelTitle,
            videoId: video.id,
            publishedAt: video.publishedAt,
          });
        });
        console.dir(results);
        console.log("clicked!");
        setSearchedVideos(mappedVideos);
        console.log(searchedVideos);
      }
    });
  };

  const loggedInUserCtx = useContext(LoggedInUserCtx);
  const addVideoToWatchLaterList = async ({
    title,
    thumbnail,
    channelTitle,
    channelId,
    videoId,
    publishedAt,
    url,
  }: ISearchedVideo) => {
    await firestore
      .collection("vid-list")
      .where("videoId", "==", videoId)
      .get()
      .then((docs) => {
        if (docs) {
          console.log("exist!");
          return;
        } else {
          console.log("no!!");
          return;
        }
      });

    if (loggedInUserCtx) {
      const videoThatWillWatchLater: ISearchedVideo = {
        title,
        thumbnail,
        channelTitle,
        channelId,
        videoId,
        publishedAt,
        url: url,
        userEmail: (loggedInUserCtx.email && loggedInUserCtx.email) || "test",
        rating: 3,
        archived: false,
        playedSeconds: 0,
        createdAt: new Date(),
      };
      await firestore
        .collection("vid-list")
        .add(videoThatWillWatchLater)
        .then((data) => {
          console.log(data);
          if (setSearchedVideos) {
            const newVidList = [...searchedVideos, videoThatWillWatchLater];
            setSearchedVideos(newVidList);
          }
        });
    } else {
      console.log("no right url");
    }
  };
  if (searchedVideos) {
    return (
      <div className="bg-gray-800 h-200">
        <div className="flex flex-col bg-gray-800 text-white md:grid gap-3 grid-cols-5">
          <ReactModal
            style={customStyles}
            isOpen={IsModalOpen}
            onRequestClose={() => toggleModalWithVideo()}
          >
            {videoForModal && (
              <ReactPlayer
                url={videoForModal.url}
                width="100%"
                height="100%"
                playing={true}
                onPlay={() => {
                  addVideoToWatchLaterList(videoForModal);
                }}
                onPause={() => {
                  console.log("stopped");
                }}
              />
            )}
          </ReactModal>
          {searchedVideos?.map((one) => (
            <div className="flex flex-row">
              <SearchedVideo
                toggleModal={toggleModalWithVideo}
                key={one.videoId}
                videoId={one.videoId}
                url={one.url}
                title={one.title}
                thumbnail={one.thumbnail}
                channelId={one.channelId}
                channelTitle={one.channelTitle}
                publishedAt={one.publishedAt}
              />
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    return <h1>loading</h1>;
  }
};
