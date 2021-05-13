import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import ReactModal from "react-modal";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import youtubeSearch, { YouTubeSearchResults } from "youtube-search";
import { LoggedInUserCtx } from "../components/App";
import { ISearchedVideo, SearchedVideo } from "../components/searched_video";
import { Vid_block_type } from "../components/vid_player";
import { firestore } from "../firebase";
import { customStyles } from "../styles/modalStyle";

interface SearchedVideosParam {
  searchTerm: string;
}

interface ISearchedVideos {
  setFetchedVids: Dispatch<SetStateAction<Vid_block_type[]>>;
  fetchedVids: Vid_block_type[];
}

export const SearchedVideos: React.FunctionComponent<ISearchedVideos> = ({
  setFetchedVids,
  fetchedVids,
}) => {
  const params = useParams<SearchedVideosParam>();
  const [searchedVideos, setSearchedVideos] = useState<ISearchedVideo[]>([]);
  const [IsModalOpen, setIsOpen] = useState(false);
  const [videoForModal, setVideoForModal] = useState<ISearchedVideo>();
  const [searchKeyword, setSearchKeyword] = useState("");

  const toggleModalWithVideo = (video?: ISearchedVideo) => {
    if (video) setVideoForModal(video);
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    console.log("search term", params.searchTerm);
    setSearchKeyword(() => params.searchTerm);
    //code for calling this fucn with previous param
    if (searchKeyword !== "") searchVideo(searchKeyword);
  }, [searchKeyword, params.searchTerm]);

  const searchVideo = async (searchTerm: string) => {
    const opts: youtubeSearch.YouTubeSearchOptions = {
      maxResults: 25,
      key: "AIzaSyBGGKmHHnugNI1OZknrhU949TNcEeyArqM",
    };
    //  setSearchedVideos(mockVideos);
    let mappedVideos: ISearchedVideo[] = [];
    await youtubeSearch(searchTerm, opts, (err, results) => {
      if (err) return console.log(err);
      if (!results) {
        return <h1 className="text-white">No video available</h1>;
      }
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
        console.log("searchterm:", searchTerm);
        console.dir(results);
        console.log("clicked!");
        setSearchedVideos(mappedVideos);
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
    console.log(title, videoId);
    let isExist: boolean = false;
    await firestore
      .collection("vid-list")
      .where("videoId", "==", videoId)
      .get()
      .then((docs) => {
        if (docs.size !== 0) {
          console.log("exist!");
          isExist = true;
        } else {
          isExist = false;
          console.log("yes~ we can add~");
        }
      });
    if (isExist) return;

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
          if (setSearchedVideos !== undefined) {
            const mappedVideo = ISearchedVideoToVidmapper(
              videoThatWillWatchLater
            );
            //const newVidList = [...fetchedVids, videoThatWillWatchLater];
            setFetchedVids([...fetchedVids, mappedVideo]);
          }
        });
    } else {
      console.log("no right url");
    }
  };
  const ISearchedVideoToVidmapper = ({
    url,
    id,
    title,
    createdAt,
  }: ISearchedVideo): Vid_block_type => {
    return {
      url,
      userEmail: loggedInUserCtx?.email!,
      id,
      title,
      playedSeconds: 0,
      archived: false,
      rating: 3,
      createdAt,
    };
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
                controls={true}
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
          {searchedVideos?.map((one, index) => (
            <div className="flex flex-row">
              <SearchedVideo
                toggleModal={toggleModalWithVideo}
                key={index}
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
