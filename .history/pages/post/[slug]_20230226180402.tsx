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
   
    // To figure out the paths and provide them to Next.JS. We provide them within an array whereby each object has a key called params, which would have the actual path inside of it:
    const paths = posts.map((post: Post) => ({
      // This means I'm going to directly return an object
      // The first one:
      params: {
        // The second one; is going to be the params that matches up to [slug]
        slug: post.slug.current,
      },
    }));
   
    return {
      paths,
      // This will block the page from not showing or showing a 404 if it doesn't exist
      fallback: "blocking",
    };
   };