import { useSWRInfinite } from "swr";
import { FPaginatedPosts, FPost } from "./types";

export const usePaginatedPosts = (URL: string) => {
  const {
    data,
    error,
    mutate,
    size: page,
    setSize: setPage,
    isValidating,
  } = useSWRInfinite<FPaginatedPosts>((index) => `${URL}?page=${index}`); // /api/feed?page=
  // `/api/posts?page=${index}`

  const posts: FPost[] = data
    ? [].concat(...data.map((paginatedPost) => paginatedPost.posts))
    : [];

  const isReachingEnd =
    !isValidating &&
    data?.[data.length - 1].page === data?.[data.length - 1].pages;

  return {
    error,
    posts,
    page,
    setPage, 
    isReachingEnd,
    mutate,
  };
};
