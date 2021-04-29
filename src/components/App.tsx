import React, { useEffect, useState } from "react";
import { Header } from "./header";
import { VidContainer } from "./vid-container";
import youtubeSearch, { YouTubeSearchResults } from "youtube-search";
import { firestore } from "../firebase.js";
import "../styles/styles.css";
import { VidPlayer, Vid_block_type } from "./vid_player";
import Modal from "react-modal";

const customStyles = {
  content: {
    width: "55%",
    background: "gray",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

export const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [vids, setVids] = useState<Vid_block_type[]>([]);
  const [IsModalOpen, setIsOpen] = useState(false);
  const [modalVideoUrl, setModalVideoUrl] = useState("");

  const opts: youtubeSearch.YouTubeSearchOptions = {
    maxResults: 1,
    key: "AIzaSyBGGKmHHnugNI1OZknrhU949TNcEeyArqM",
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setSearchTerm(e.target.value);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    let testVids: Vid_block_type[] = [];
    await firestore
      .collection("vid-list")
      .where("id", "==", "joon")
      .get()
      .then((docs) =>
        docs.forEach((doc) => {
          testVids.push({
            id: doc.id,
            url: doc.data()!.url,
            archived: doc.data()!.archived,
            rating: doc.data()!.rating,
            playedSeconds: doc.data()!.playedSeconds,
          });
          console.log(doc.id);
        })
      );
    //doc("vid-list-id");
    setVids(testVids);
  };

  const handleSearch = (searchTerm: string) => {
    youtubeSearch(searchTerm, opts, (err, results) => {
      if (err) return console.log(err);
      if (results) {
        //setVids(results);
        console.dir(results);
      }
    });
    console.log("clicked!");
  };

  const toggleModal = (url?: string) => {
    if (url) {
      setModalVideoUrl(url);
      console.log(url);
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
    let copiedText = "";
    copiedText = await navigator.clipboard.readText();
    console.log(copiedText.search("http"));
    if (copiedText.search("http") !== -1) {
      console.log(copiedText);
      const videoThatWillWatchLater: Vid_block_type = {
        url: copiedText,
        id: "joon",
        rating: 3,
        archived: false,
        playedSeconds: 0,
        //        createdAt: new Date(),
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
  };

  return (
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
            playedSeconds={0}
            url={modalVideoUrl ? modalVideoUrl : ""}
            id={"testId"}
            rating={3}
            archived={false}
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
  );
};