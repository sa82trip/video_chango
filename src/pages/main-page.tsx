import React, { useContext, useEffect, useState } from "react";
import ReactModal from "react-modal";
import { Route, Switch, useHistory } from "react-router";
import { Header } from "../components/header";
import { VidContainer } from "../components/vid-container";
import { VidPlayer, Vid_block_type } from "../components/vid_player";
import { firestore } from "../firebase.js";
import { BrowserRouter } from "react-router-dom";
import { SearchedVideos } from "./searched-videos";
import { LoggedOutRoutes } from "../routes/logged-out-routes";
import { LoggedInUserCtx } from "../components/App";
import { bugerMenuStyle, testStyle } from "../styles/modalStyle";
import firebase from "firebase";

export enum SORTING_METHOD {
  BY_TITLE = "BY_TITLE",
  BY_DATE = "BY_DATE",
}

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

export const MainPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [fetchedVids, setFetchedVids] = useState<Vid_block_type[]>([]);
  const [sortingFlag, setSortingFlag] = useState(false);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [modalVideoUrl, setModalVideoUrl] = useState("");
  const [modalRating, setModalRating] = useState(3);
  const [modalArchived, setModalArchived] = useState(false);
  const [modalPlayedSeconds, setModalPlayedSeconds] = useState(0);
  const [modalId, setModalId] = useState("");
  const [winWidth, setWinWidth] = useState(window.innerWidth); //const [vids, setVids] = useState<YouTubeSearchResults[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setSearchTerm(e.target.value);
  };
  const history = useHistory();
  const loggedInUserCtx = useContext(LoggedInUserCtx);

  useEffect(() => {
    fetchData();
    const handleSize = () => {
      console.log("main", window.innerWidth);
      setWinWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleSize);
    return () => {
      window.removeEventListener("resize", handleSize);
    };
  }, [loggedInUserCtx]);

  const fetchData = async () => {
    if (loggedInUserCtx) {
      let videosFromFireStore: Vid_block_type[] = [];
      try {
        await firestore
          .collection("vid-list")
          .where("userEmail", "==", loggedInUserCtx?.email)
          .get()
          .then((docs) =>
            docs.forEach((doc) => {
              videosFromFireStore.push({
                id: doc.id,
                userEmail: doc.data()!.userEmail,
                url: doc.data()!.url,
                archived: doc.data()!.archived,
                rating: doc.data()!.rating,
                playedSeconds: doc.data()!.playedSeconds,
                createdAt: doc.data()!.createdAt,
                title: doc.data().title,
              });
            })
          );
        //doc("vid-list-id");
        setFetchedVids(videosFromFireStore.sort(() => Math.random() - 0.5));
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleSorting = (method: SORTING_METHOD) => {
    setIsMenuModalOpen((prev) => !prev);
    if (method === SORTING_METHOD.BY_DATE) {
      if (!sortingFlag) {
        const sortedVids = [...fetchedVids].sort(
          (a, b) => +b.createdAt! - +a.createdAt!
        );
        setFetchedVids(sortedVids);
        setSortingFlag((prev) => !prev);
      } else {
        const sortedVids = [...fetchedVids].sort(
          (a, b) => +a.createdAt! - +b.createdAt!
        );
        setFetchedVids(sortedVids);
        setSortingFlag((prev) => !prev);
      }
    }
    if (method === SORTING_METHOD.BY_TITLE) {
      return;
    }
  };

  const logoutHandler = () => {
    setIsMenuModalOpen((prev) => !prev);
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("logged out");
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
  };

  const toggleModalWithVideo = (video?: Vid_block_type) => {
    if (video) {
      setModalVideoUrl(video.url);
      setModalId(video.userEmail);
      setModalPlayedSeconds(video.playedSeconds);
      setModalArchived(video.archived);
      setModalRating(video.rating);
      console.log(
        video.url,
        video.userEmail,
        video.playedSeconds,
        video.archived,
        video.rating
      );
    }
    setIsPlayerModalOpen(!isPlayerModalOpen);
  };

  const handleDeleteButtonClick = async (id: string) => {
    console.log("delete", id);
    setFetchedVids(fetchedVids.filter((one) => one.id !== id));
    await firestore
      .collection("vid-list")
      .doc(id)
      .delete()
      .then(() => console.log(id, "is deleted"));
  };

  const addVideoToWatchLaterList = async () => {
    const copiedText = await navigator.clipboard.readText();
    console.log(copiedText.search("http"));
    if (copiedText.search("http") !== -1) {
      console.log(copiedText);
      if (loggedInUserCtx) {
        const videoThatWillWatchLater: Vid_block_type = {
          url: copiedText,
          userEmail: (loggedInUserCtx.email && loggedInUserCtx.email) || "test",
          rating: 3,
          archived: false,
          playedSeconds: 0,
          createdAt: new Date(),
        };
        await firestore
          .collection("vid-list")
          .add(videoThatWillWatchLater)
          .then(() => {
            const newVidList = [...fetchedVids, videoThatWillWatchLater];
            setFetchedVids(newVidList);
          });
      } else {
        console.log("no right url");
      }
    }
  };
  ReactModal.setAppElement("#root");
  return (
    <BrowserRouter>
      {loggedInUserCtx || sessionStorage.length !== 0 ? (
        <>
          <Header
            addVideoToWatchLaterList={addVideoToWatchLaterList}
            searchTerm={searchTerm}
            handleChange={handleChange}
            setIsModalOpen={setIsMenuModalOpen}
            handleSorting={handleSorting}
          />
          <Switch>
            <Route exact path="/">
              <div className="bg-red-50">
                {/*<button onClick={() => toggleModal()}>Open Modal</button>*/}
                <ReactModal
                  style={customStyles}
                  isOpen={isPlayerModalOpen}
                  onRequestClose={() => toggleModalWithVideo()}
                >
                  <button
                    className="btn"
                    onClick={() => toggleModalWithVideo()}
                  >
                    close
                  </button>
                  <div className="shadow-md">
                    <VidPlayer
                      playedSeconds={modalPlayedSeconds}
                      url={modalVideoUrl ? modalVideoUrl : ""}
                      userEmail={modalId}
                      rating={modalRating}
                      archived={modalArchived}
                    />
                  </div>
                </ReactModal>
                {/*menu modal*/}
                <ReactModal
                  style={winWidth < 640 ? bugerMenuStyle : testStyle}
                  isOpen={isMenuModalOpen}
                  onRequestClose={() => setIsMenuModalOpen((prev) => !prev)}
                >
                  <button className="btn" onClick={() => logoutHandler()}>
                    logout
                  </button>
                  <div className="flex flex-col mx-auto md:w-1/2 md:flex-row justify-center">
                    <button
                      className="btn bg-green-500 mt-0 ml-2 "
                      onClick={() => addVideoToWatchLaterList()}
                    >
                      import from clipboard
                    </button>
                    <button
                      className="btn mt-0 ml-2 bg-gray-300"
                      onClick={() => handleSorting(SORTING_METHOD.BY_DATE)}
                    >
                      sorting
                    </button>
                  </div>
                </ReactModal>
                <VidContainer
                  winWidth={winWidth}
                  toggleModal={toggleModalWithVideo}
                  handleDeleteButtonClick={handleDeleteButtonClick}
                  vid_list={fetchedVids}
                />
              </div>
            </Route>
            <Route path="/search/:searchTerm">
              <SearchedVideos />
            </Route>
          </Switch>
        </>
      ) : (
        <LoggedOutRoutes />
      )}
    </BrowserRouter>
  );
};
