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
  const [IsModalOpen, setIsOpen] = useState(false);
  const [modalVideoUrl, setModalVideoUrl] = useState("");
  const [modalRating, setModalRating] = useState(3);
  const [modalArchived, setModalArchived] = useState(false);
  const [modalPlayedSeconds, setModalPlayedSeconds] = useState(0);
  const [modalId, setModalId] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setSearchTerm(e.target.value);
  };
  const history = useHistory();
  const loggedInUserCtx = useContext(LoggedInUserCtx);

  useEffect(() => {
    fetchData();
  }, [loggedInUserCtx]);

  const fetchData = async () => {
    if (loggedInUserCtx) {
      let testVids: Vid_block_type[] = [];
      try {
        await firestore
          .collection("vid-list")
          .where("userEmail", "==", loggedInUserCtx?.email)
          .get()
          .then((docs) =>
            docs.forEach((doc) => {
              testVids.push({
                id: doc.id,
                userEmail: doc.data()!.userEmail,
                url: doc.data()!.url,
                archived: doc.data()!.archived,
                rating: doc.data()!.rating,
                playedSeconds: doc.data()!.playedSeconds,
                createdAt: doc.data()!.createdAt,
              });
            })
          );
        //doc("vid-list-id");
        setFetchedVids(testVids);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const sortingWithMethod = (method: SORTING_METHOD) => {
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
    setIsOpen(!IsModalOpen);
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
            handleSorting={sortingWithMethod}
          />
          <Switch>
            <Route exact path="/">
              <div className="bg-red-50">
                {/*<button onClick={() => toggleModal()}>Open Modal</button>*/}
                <ReactModal
                  style={customStyles}
                  isOpen={IsModalOpen}
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
                <VidContainer
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
