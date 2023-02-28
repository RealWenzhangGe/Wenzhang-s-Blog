import { Post } from '../typings';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from "next/link";
import Header from "../pages/components/Header";
import Footer from "../pages/components/Footer";
import { sanityClient, urlFor } from "../sanity";

interface Props {
  posts: [Post];
}

const Home = ({ posts }: Props) => {
  return (
    <div className="mx-auto max-w-7xl">
      <Head>
        <title>Wenzhang's Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <div className="flex items-center justify-between px-10 mx-auto space-y-5 bg-gray-300 rounded max-w-7xl sm:p-10">
        <div className="">
          <h1 className="max-w-xl font-sans text-5xl ">
            <span className="font-serif cursor-pointer">我在这里记录想法</span>
          </h1>
          <h2 className="pt-5 font-sans text-2xl text-black">
            Join in, you might be interested!{" "}
          </h2>
        </div>

        <div className="items-center hidden md:inline-flex">
          <img
            className="h-auto rounded-lg w-96 "
            src="https://images.unsplash.com/photo-1508780709619-79562169bc64?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
          />
        </div>
      </div>
      {/* posts */}
      <div
        className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-6 md:p-6"
        id="posts"
      >
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className="overflow-hidden border rounded-lg cursor-pointer group">
              <img
                src={urlFor(post.mainImage).url()!}
                alt=""
                className="object-cover w-full transition-transform duration-200 ease-in-out h-60 group-hover:scale-105"
              />
              <div className="flex justify-between p-5 bg-white">
                <div>
                  <p className="text-lg font-bold">{post.title}</p>
                  <p className="text-xs">
                    {post.description} by {post.author.name}
                  </p>
                </div>
                <img
                  src={urlFor(post.author.image).url()!}
                  alt=""
                  className="w-12 h-12 rounded-full"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Footer />
    </div>
  )
}

export default Home

export const getServerSideProps = async () => {
  const query = `*[_type == "post"] {
    _id,
    title,
    author-> {
     name,
     image
    },
    description,
    mainImage,
    slug
  }`;
  const posts = await sanityClient.fetch(query);
 
  return{
    props: {
      posts,
    }
  }
 }
