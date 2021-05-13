import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import firebase from "firebase";
import { Link, Redirect, useHistory } from "react-router-dom";
import { SORTING_METHOD } from "../pages/main-page";
import mainLogo from "../icon/horizontal_on_white_by_logaster-removebg-preview.png";
import justLogo from "../icon/just_logo.png";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSearch,
  faUser,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import ReactModal from "react-modal";
import { bugerMenuStyle, customStyles } from "../styles/modalStyle";

interface ISearchFormValues {
  searchTerm: string;
}

interface IHeaderProps {
  searchTerm: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addVideoToWatchLaterList: () => void;
  handleSorting: (method: SORTING_METHOD) => void;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}
export const Header: React.FC<IHeaderProps> = ({
  searchTerm,
  handleChange,
  addVideoToWatchLaterList,
  handleSorting,
  setIsModalOpen,
}) => {
  const [isShowingSearchBar, setIsShowingSearchBar] = useState(false);
  // search from
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
    setFocus,
  } = useForm<ISearchFormValues>({ mode: "onChange" });

  const history = useHistory();

  const handleSearch = (data: ISearchFormValues) => {
    console.log("header", data);
    //      history.push({
    //        pathname: "/search",
    //        search: `?term=${searchTerm}`,
    //      });
    history.push(`/search/${data.searchTerm}`);
  };
  return (
    <div className="container">
      <form
        className="justify-between bg-gray-700 text-white font-bold"
        onSubmit={handleSubmit(handleSearch)}
      >
        {isShowingSearchBar ? (
          <div className="flex flex-row justify-center h-14">
            <button type="button">
              <FontAwesomeIcon
                className="object-left mx-3"
                size="1x"
                icon={faArrowLeft}
                onClick={() => setIsShowingSearchBar((prev) => !prev)}
              />
            </button>
            <input
              type="text"
              {...register("searchTerm")}
              placeholder="searchTerm"
              onBlur={() => setIsShowingSearchBar(false)}
              className="w-9/12 border-none focus:outline-none pl-3 text-md text-black border-2 border-gray-800 my-3 rounded-md"
            />
            <button>
              <FontAwesomeIcon
                className=" mx-3 object-left border-1 border-red-800"
                size="1x"
                icon={faSearch}
              />
            </button>
          </div>
        ) : (
          <div className="flex flex-row justify-between h-14">
            <Link to="/">
              <img
                className="hidden ml-5 w-32 md:block"
                src={mainLogo}
                alt=""
              />
              <img className="m-1 pt-1 w-20 md:hidden" src={mainLogo} alt="" />
            </Link>
            <div className="mt-4 mr-3">
              <FontAwesomeIcon
                className="cursor-pointer object-left border-1 border-red-800"
                size="1x"
                icon={faSearch}
                onClick={() => {
                  setIsShowingSearchBar((prev) => !prev);
                }}
              />
              <FontAwesomeIcon
                onClick={() => setIsModalOpen((prev) => !prev)}
                className="ml-3 cursor-pointer"
                icon={faUser}
              />
            </div>
          </div>
        )}
      </form>
      <div className="flex items-center w-full bg-gray-500 pt-5 pb-3"></div>
    </div>
  );
};
