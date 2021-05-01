import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Header } from "./header";
import { VidContainer } from "./vid-container";
import youtubeSearch, { YouTubeSearchResults } from "youtube-search";
import { firestore } from "../firebase.js";
import "../styles/styles.css";
import { VidPlayer, Vid_block_type } from "./vid_player";
import Modal from "react-modal";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import { CreateAccount } from "../pages/create-account";
import firebase from "firebase";
import { LoggedOutRoutes } from "../routes/logged-out-routes";
import { SearchedVideos } from "../pages/searched-videos";

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

interface AppContextInterface {
  setLoggedIn: Dispatch<SetStateAction<boolean>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setLoggedInUser: Dispatch<SetStateAction<any>>;
}
export const UserContext = createContext<AppContextInterface | null>(null);
export const LoggedInUserCtx = createContext<firebase.User | null>(null);

export const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [vids, setVids] = useState<Vid_block_type[]>([]);
  const [IsModalOpen, setIsOpen] = useState(false);
  const [modalVideoUrl, setModalVideoUrl] = useState("");
  const [modalRating, setModalRating] = useState(3);
  const [modalArchived, setModalArchived] = useState(false);
  const [modalPlayedSeconds, setModalPlayedSeconds] = useState(0);
  const [modalId, setModalId] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(firebase.auth().currentUser);

  const value = useMemo(() => ({ setLoggedIn, setLoading, setLoggedInUser }), [
    setLoggedIn,
    setLoading,
    setLoggedInUser,
  ]);

  const opts: youtubeSearch.YouTubeSearchOptions = {
    maxResults: 1,
    key: "AIzaSyBGGKmHHnugNI1OZknrhU949TNcEeyArqM",
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setSearchTerm(e.target.value);
  };
  const history = useHistory();
  useEffect(() => {
    fetchData();
  }, [loggedIn]);

  const fetchData = async () => {
    console.log(loggedIn);
    if (!loggedIn) {
      return;
    }
    let testVids: Vid_block_type[] = [];
    await firestore
      .collection("vid-list")
      .where("userEmail", "==", loggedInUser?.email)
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
          console.log(testVids);
        })
      );
    //doc("vid-list-id");
    setVids(testVids);
  };

  const handleSearch = async (searchTerm: string): Promise<void> => {
    console.log(history);
    if (history) {
      history.push({
        pathname: "/search",
        search: `?term=${searchTerm}`,
      });
    } else {
      console.log(this);
    }

    //    await youtubeSearch(searchTerm, opts, (err, results) => {
    //      if (err) return console.log(err);
    //      if (results) {
    //        //setVids(results);
    //        console.dir(results);
    //      }
    //    });
    //    console.log("clicked!");
  };

  const toggleModal = (video?: Vid_block_type) => {
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
    setVids(vids.filter((one) => one.id !== id));
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
      if (loggedInUser) {
        const videoThatWillWatchLater: Vid_block_type = {
          url: copiedText,
          userEmail: (loggedInUser.email && loggedInUser.email) || "test",
          rating: 3,
          archived: false,
          playedSeconds: 0,
          createdAt: new Date(),
        };
        await firestore
          .collection("vid-list")
          .add(videoThatWillWatchLater)
          .then(() => {
            const newVidList = [...vids, videoThatWillWatchLater];
            setVids(newVidList);
          });
      } else {
        console.log("no right url");
      }
    }
  };
  Modal.setAppElement("#root");
  return (
    <UserContext.Provider value={value}>
      <Router>
        {loggedIn ? (
          <Switch>
            <Route path="/" exact>
              <div className="bg-red-50">
                {/*<button onClick={() => toggleModal()}>Open Modal</button>*/}
                <Modal
                  style={customStyles}
                  isOpen={IsModalOpen}
                  onRequestClose={() => toggleModal()}
                >
                  <button className="btn" onClick={() => toggleModal()}>
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
                </Modal>
                <Header
                  addVideoToWatchLaterList={addVideoToWatchLaterList}
                  searchTerm={searchTerm}
                  handleSearch={handleSearch}
                  handleChange={handleChange}
                />
                <VidContainer
                  toggleModal={toggleModal}
                  handleDeleteButtonClick={handleDeleteButtonClick}
                  vid_list={vids}
                />
              </div>
            </Route>
            <Route path="/search">
              <SearchedVideos />
            </Route>
          </Switch>
        ) : (
          <LoggedOutRoutes />
        )}
      </Router>
    </UserContext.Provider>
  );
};
