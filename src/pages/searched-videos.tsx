import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import youtubeSearch, { YouTubeSearchResults } from "youtube-search";
import { mockVideos } from "../components/mockData/mockVideos";
import { ISearchedVideo, SearchedVideo } from "../components/searched_video";

interface SearchedVideosParam {
  searchTerm: string;
}

export const SearchedVideos = () => {
  const params = useParams<SearchedVideosParam>();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedVideos, setSearchedVideos] = useState<ISearchedVideo[] | null>(
    mockVideos
  );
  const opts: youtubeSearch.YouTubeSearchOptions = {
    maxResults: 3,
    key: "AIzaSyBGGKmHHnugNI1OZknrhU949TNcEeyArqM",
  };

  useEffect(() => {
    console.log("search term", params.searchTerm);
    searchVideo(params.searchTerm);
    console.log("um?");
  });
  const searchVideo = (searchTerm: string) => {
    setSearchedVideos(mockVideos);
    let mappedVideos: ISearchedVideo[] = [];
    // youtubeSearch(searchTerm, opts, (err, results) => {
    //   if (err) return console.log(err);
    //   if (results) {
    //     results.forEach((video) => {
    //       mappedVideos.push({
    //         title: video.title,
    //         url: video.link,
    //         thumbnail: video.thumbnails.medium?.url || "sample image",
    //         channelId: video.channelId,
    //         channelTitle: video.channelTitle,
    //         videoId: video.id,
    //         publishedAt: video.publishedAt,
    //       });
    //     });
    //     console.dir(results);
    //     console.log("clicked!");
    //     console.log(searchedVideos);
    //   }
    // });
  };
  if (searchedVideos) {
    return (
      <div>
        <h1>SearchedVideos</h1>
        <div className="grid gap-3 grid-cols-3">
          {searchedVideos?.map((one) => (
            <SearchedVideo
              videoId={one.videoId}
              url={one.url}
              title={one.title}
              thumbnail={one.thumbnail}
              channelId={one.channelId}
              channelTitle={one.channelTitle}
              publishedAt={one.publishedAt}
            />
          ))}
        </div>
      </div>
    );
  } else {
    return <h1>loading</h1>;
  }
};
