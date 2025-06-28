import { createApi } from "@reduxjs/toolkit/query/react";
import defaultFetchBase from "./defaultFetchBase";

export const recommendAPI = createApi({
  reducerPath: "recommendAPI",
  baseQuery: defaultFetchBase,
  tagTypes: ["Recommend"],
  endpoints: (builder) => ({
    getAIRecommend: builder.query({
      query: (params) => ({
        url: "/recommends",
        params,
        credentials: "include",
      }),
      providesTags: ["Recommend"],
    }),
  }),
});

export const {
  useGetAIRecommendQuery
} = recommendAPI;
