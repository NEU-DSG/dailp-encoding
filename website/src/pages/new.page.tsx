import React, { useState } from "react";
import Layout from "src/layout";
import { useInsertPageMutation, usePageBySlugQuery } from "src/graphql/dailp";
import { navigate } from "vite-plugin-ssr/client/router"

const NewPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState<string | null>(null);

  const slugify = (title: string) => {
    return title.toLowerCase().replace(/ /g, "-").replace(/[^a-z0-9-]/g, "");
  }
  const [{ data },reexec] = usePageBySlugQuery({ variables: { slug }, requestPolicy: "network-only" });

  const [insertPageResult, insertPage] = useInsertPageMutation();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //check if title slug is already taken
    setSlug(slugify(title));
    await reexec({variables: {slug}});
    if (data?.pageBySlug) {
      alert("Page already exists");
      return;
    }
    e.preventDefault();

    insertPage({ pageInput: { title, body: content.split("\n\n") } }).then((res) => {
      if(res.error){
        setError(res.error.message);
      }else{
        setError(null);
        navigate(`/pages/${res.data?.insertPage}`);
      }
    });

    //console.log(title, content);
  
  }
  return (
    <Layout>
  <p>New content page</p>
  {error && <p>{error}</p>}
  <form onSubmit={handleSubmit}>
    <input type="text" placeholder="title" onChange={(e) => {setTitle(e.target.value); setSlug(slugify(e.target.value))}}/>
    <br />
    <textarea placeholder="content" onChange={(e) => {setContent(e.target.value)}}/>
    <button type="submit">Create</button>
  </form>
</Layout>
)
}

export const Page = NewPage;

