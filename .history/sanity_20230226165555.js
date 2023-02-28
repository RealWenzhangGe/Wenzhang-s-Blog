import { createCurrentUserHook, createClient } from "next-sanity";

import createImageUrlBuilder from "@sanity/image-url";

export const config = {
 dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
 projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
 apiVersion: "2021-03-25",
 useCdn: process.env.NODE_ENV === "production",
};

// 通过在 sanity studio 中查询后端来获取数据
export const sanityClient = createClient(config);

// 解析我们返回的源并提供图像 url
export const urlFor = (source) => createImageUrlBuilder(config).image(source);

export const useCurrentUser = createCurrentUserHook(config);