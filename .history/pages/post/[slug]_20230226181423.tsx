import { sanityClient } from "../../sanity";
import { Post } from "../../typings";

interface Props {
    post: Post;
}

export const getStaticPaths = async () => {
    const query = `*[_type == 'post']{
          _id,
         slug {
          current
        }
        }`;
   
    const posts = await sanityClient.fetch(query);
   
    // 把路径提供给 Next.JS 
    // 塞到数组里，每个对象都有一个名为 params 的键，其中包含实际路径
    const paths = posts.map((post: Post) => ({
      params: {
        slug: post.slug.current,
      },
    }));
   
    return {
      paths,
      // 会对页面进行阻止，即不显示或显示 404
      fallback: "blocking",
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const query = `*[_type == "post" && slug.current == $slug][0]{
          _id,
          _createdAt,
          title,
          author-> {
              name,
              image
          },
          'comments' : *[_type == "comment" &&
            post._ref == ^._id &&
            approved== true],
          description,
          mainImage,
          slug,
          body
      }`;
    const post = await sanityClient.fetch(query, {
      slug: params?.slug,
    });
   
   // For extra protection when actually fetching the post, if it doesn't exist or if it does, we add this:
    if (!post) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        post,
    },
    revalidate: 60, // 60秒后更新旧缓存
   };
};
