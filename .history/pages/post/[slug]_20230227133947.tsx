import { useState } from "react";
import { Post } from "../../typings";
import { GetStaticProps } from "next";
import Header from "../components/Header";
import PortableText from "react-portable-text";
import { sanityClient, urlFor } from "../../sanity";
import { useForm, SubmitHandler } from "react-hook-form";
import Footer from "../components/Footer";

interface Props {
    post: Post;
}

interface IFormInput {
    _id: string;
    name: string;
    email: string;
    comment: string[];
}

function Post({ post }: Props) {
    const [submitted, setSubmitted] = useState(false);
    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IFormInput>();
    
    const onSubmit: SubmitHandler<IFormInput> = (data) => {
        // console.log(data);
        fetch("/api/createComment", {
            method: "POST",
            body: JSON.stringify(data),
        })
        .then(() => {
            // console.log(data);
            setSubmitted(true);
        })
        .catch((err) => {
            console.error(err);
            setSubmitted(false);
      });
    };
    
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

        <hr className="max-w-lg mx-auto my-5 border border-gray-500" />
        
        { submitted ? (
        <div className="flex flex-col max-w-2xl px-10 py-10 mx-auto my-10 text-white bg-yellow-500">
            <h3 className="text-3xl font-bold">
                Your comment has been submitted!
            </h3>
            <p>Once it has been approved, it will appear below</p>
        </div>
        ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col max-w-2xl p-5 mx-auto mb-10"
        >
          <h3 className="text-sm text-black">Enjoyed this article?</h3>
          <h4 className="text-3xl font-bold">Leave a comment below!</h4>
          <hr className="py-3 mt-2" />

          <input
            {...register("_id")}
            type="hidden"
            name="_id"
            value={post._id}
          />

          <label className="block mb-5">
            <span className="text-gray-700"> Name </span>
            <input
              {...register("name", { required: true })}
              className="block w-full px-3 py-2 mt-1 border rounded shadow outline-none form-input ring-yellow-500 focus:ring"
              placeholder="Name"
              type="text"
            />
          </label>
          <label className="block mb-5">
            <span className="text-gray-700"> Email </span>
            <input
              {...register("email", { required: true })}
              className="block w-full px-3 py-2 mt-1 border rounded shadow outline-none form-input ring-yellow-500 focus:ring"
              placeholder="Email"
              type="email"
            />
          </label>
          <label className="block mb-5">
            <span className="text-gray-700"> Comment </span>
            <textarea
              {...register("comment", { required: true })}
              className="block w-full px-3 py-2 mt-1 border rounded shadow outline-none form-textarea ring-yellow-500 focus:ring"
              placeholder="Comment"
              rows={3}
            />
          </label>
          
          {/* 字段验证失败就会返回错误 */}
          <div className="flex flex-col p-5">
            {errors.name && (
              <span className="text-red-500"> Your name required </span>
            )}
            {errors.email && (
              <span className="text-red-500"> Your email required </span>
            )}
            {errors.comment && (
              <span className="text-red-500"> Your comment required </span>
            )}
          </div>
          <input
            type="submit"
            className="px-4 py-2 font-bold text-white bg-black rounded shadow cursor-pointer hover:bg-yellow-400 focus:shadow-outline focus:outline-none"
          />
        </form>
        )}
      
        { post.comments.length > 0 ? (
          <>
            <div className="flex flex-col max-w-2xl p-10 mx-auto my-10 rounded-lg shadow-lg shadow-black ">
              <h3 className="pb-2 text-3xl">Comments</h3>
              <hr className="pb-2" />
              {post.comments.map((comment) => (
              <div key={comment._id}>
                <p>
                  <span className="text-gray-500"> {comment.name} : </span>{" "}
                  {comment.comment}
                </p>
              </div>
              ))}
            </div>
          </>
        ) : null }
        
        <Footer />
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
   
   // 帖子不存在时容错
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
