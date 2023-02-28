import { GetStaticProps } from "next";
import PortableText from "react-portable-text";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typings";
import Header from "../components/Header";

interface Props {
    post: Post;
}

function Post({ post }: Props) {
    return (
    <main>
        <Header />
        {/* 渲染标题、描述、主图、作者姓名和图片等 */} 
        <img
          className="object-cover w-full h-40"
          src={urlFor(post.mainImage).url()!}
          alt=""
        />
        <article className="max-w-3xl p-5 mx-auto">
          <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
          <h2 className="mb-2 text-xl font-light text-gray-500">
            {post.description}
          </h2>
   
          <div className="flex items-center space-x-2">
            <img
              src={urlFor(post.author.image).url()!}
              className="w-10 h-10 rounded-full"
            />
            <p className="text-sm font-extralight">
              Blog post by{" "}
              <span className="text-blue-400"> {post.author.name} </span> -
              Published at {new Date(post._createdAt).toLocaleString()}
            </p>
          </div>
   
          <div>
            {/* 渲染帖子主体 */}  
            <PortableText
              className="mt-10"
              dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
              projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
              content={post.body}
             serializers={{
                h1: (props: any) => (
                  <h1 className="my-5 text-2xl font-bold" {...props} />
                ),
                h2: (props: any) => (
                  <h2 className="my-5 text-xl font-bold" {...props} />
                ),
                li: ({ children }: any) => (
                  <li className="ml-4 list-disc"> {children}</li>
                ),
                link: ({ href, children }: any) => (
                  <a href={href} className="text-blue-500 hover:underline">
                    {children}
                  </a>
                ),
              }}
            />
          </div>
        </article>
    </main>
    );
}

export default Post;

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
