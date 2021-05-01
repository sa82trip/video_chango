import React from "react";
import firebase from "firebase";
import { useHistory } from "react-router-dom";

interface IHeaderProps {
  searchTerm: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearch: (searchTerm: string) => void;
  addVideoToWatchLaterList: () => void;
}
export const Header: React.FC<IHeaderProps> = ({
  searchTerm,
  handleChange,
  handleSearch,
  addVideoToWatchLaterList,
}) => {
  const history = useHistory();
  const logoutHandler = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("logged out");
        history.go(0);
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
  };
  return (
    <>
      <div className="flex items-center w-full bg-gray-500 pt-5 pb-3">
        <div className="flex flex-col mx-auto md:w-1/2 md:flex-row justify-center">
          <input
            type="text"
            name="search-input"
            value={searchTerm}
            onChange={handleChange}
            className="md:w-7/12 text-xl border-2 focus:outline-none border-gray-800 my-3 rounded-md"
          />
          <button
            className="bg-red-700 py-1 px-2 ml-2 text-white font-semibold mb-3 rounded-md"
            onClick={() => handleSearch(searchTerm)}
          >
            Search
          </button>
          <button
            className="btn bg-green-500 mt-0 ml-2"
            onClick={() => addVideoToWatchLaterList()}
          >
            import from clipboard
          </button>
        </div>
        <div className="content-end">
          <button
            className="mr-3 btn bg-gray-800 text-white font-semibold"
            onClick={() => logoutHandler()}
          >
            logout
          </button>
        </div>
      </div>
    </>
  );
};
