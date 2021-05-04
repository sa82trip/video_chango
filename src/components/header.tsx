import React from "react";
import firebase from "firebase";
import { Link, Redirect, useHistory } from "react-router-dom";
import { SORTING_METHOD } from "../pages/main-page";
import mainLogo from "../icon/horizontal_on_white_by_logaster-removebg-preview.png";

interface IHeaderProps {
  searchTerm: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addVideoToWatchLaterList: () => void;
  handleSorting: (method: SORTING_METHOD) => void;
}
export const Header: React.FC<IHeaderProps> = ({
  searchTerm,
  handleChange,
  addVideoToWatchLaterList,
  handleSorting,
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

  const handleSearch = (searchTerm: string) => {
    console.log("header", searchTerm);
    //      history.push({
    //        pathname: "/search",
    //        search: `?term=${searchTerm}`,
    //      });
    history.push(`/search/${searchTerm}`);
  };
  return (
    <>
      <div className="flex items-center w-full bg-gray-500 pt-5 pb-3">
        <Link to="/">
          <img className="hidden ml-5 w-32 md:block" src={mainLogo} alt="" />
        </Link>
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
            className="hidden btn bg-green-500 mt-0 ml-2 md:block"
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
