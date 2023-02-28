import { sanityClient } from "../../sanity";
import { Post } from "../../typings";

export const getStaticPaths = async () => {
    const query = `*[_type == 'post']{
          _id,
         slug {
          current
        }
        }`;
   
    const posts = await sanityClient.fetch(query);
   
    // 把路径提供给 Next.JS 
    // 塞到数组里，每个对象都有一个名为 params 的键，其中包含实际路径：
    const paths = posts.map((post: Post) => ({
      params: {
        slug: post.slug.current,
      },
    }));
   
    return {
      paths,
      // This will block the page from not showing or showing a 404 if it doesn't exist
      fallback: "blocking",
    };
   };