export default {
    name: "comment",
    type: "document",
    title: "Comment",
    fields: [
      {
        name: "name",
        type: "string",
      },
      {
        // 只有经作者批准的评论才会显示在博客文章中 :)
        name: "approved",
        title: "Approved",
        type: "boolean",
        description: "comments won't show on the site without approval",
      },
      {
        name: "email",
        type: "string",
      },
      {
        name: "comment",
        type: "text",
      },
      {
        name: "post",
        type: "reference",
        to: [{ type: "post" }],
      },
    ],
   };