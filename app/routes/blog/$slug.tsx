import { Entry, TagLink } from "contentful";
import * as React from "react";
import {
  HtmlMetaDescriptor,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
  useLoaderData
} from "remix";
import { ContentfulBlogPost } from "~/contentful/types";
import { fixedWidthLayoutClasses } from "~/constants";
import { getContentfulBlogPostBySlug } from "~/contentful/contentfulClient";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { options } from "~/contentful/defaultRichTextMarkdown";
import styles from "~/styles/blogpost.css";
import { links as BlockQuoteStyles } from "~/components/Contentful/BlockQuote/BlockQuote";
import { links as ImageMediaStyles } from "~/components/Contentful/ImageMedia/ImageMedia";
import { links as CodeBlockStyles } from "~/components/Contentful/CodeBlock/CodeBlock";
import { useTheme } from "~/providers/ThemeProvider";
import { SupportedTheme } from "~/types";
import AuthorSection from "~/components/BlogPost/AuthorSection/AuthorSection";
import { getPostsAndTags, PostsAndTags } from "~/api/getPostsAndTags";
import RelatedPostsSection from "~/components/BlogPost/RelatedPostsSection/RelatedPostsSection";
import { tagIdsToDisplayNames } from "~/components/Blog/BlogPostTags";
import FloatingHeader, {
  links as ProgressBarStyles
} from "~/components/FloatingHeader/FloatingHeader";

interface PostLoaderData extends PostsAndTags {
  blogPost: Entry<ContentfulBlogPost>;
}

export const meta: MetaFunction = ({ data, location }) => {
  try {
    const dataWithType: PostLoaderData = data;
    const { blogPost } = dataWithType;
    const imageURl = "https:" + blogPost.fields.blogPostSplash.fields.file.url;
    const webURL = "https://www.alissanguyen.dev" + location.pathname;
    const description = blogPost.fields.blogPostExcerpt.slice(0, 190) + "... ";
    const title = blogPost.fields.blogPostTitle;
    const keywords =
      blogPost.fields.blogPostKeywords +
      ", alissa nguyen, tam nguyen, seattle, frontend engineer";
    const publishedDate = blogPost.sys.createdAt;
    const updatedDate = blogPost.sys.updatedAt;
    return {
      title: blogPost.fields.blogPostTitle,
      keywords: keywords,
      image: imageURl,
      "og:url": webURL,
      "og:image": imageURl,
      "og:title": title,
      "og:site_name": "Alissa Nguyen's Blog",
      "og:type": "article",
      "og:description": description,
      "article:published_time": publishedDate,
      "article:modified_time": updatedDate,
      "article:publisher": "https://twitter.com/alissang_dev",
      "twitter:card": imageURl ? "summary_large_image" : "summary",
      "twitter:creator": "@alissa_nguyen14",
      "twitter:site": "@alissa_nguyen14",
      "twitter:title": title,
      "twitter:description": description,
      "twitter:image": imageURl,
      "twitter:alt": title,
      "twitter:url": webURL,
      "og:image:width": "1200",
      "og:image:height": "630",
      author: "Alissa Nguyen"
    };
  } catch (e) {
    console.error(e);
    /**
     * If we hit this catch block it's almost definitely because the user
     * is hitting a blog post that doesn't exist.
     */
    const emptyMeta: HtmlMetaDescriptor = {};
    return emptyMeta;
  }
};

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.slug) {
    throw new Error("Missing slug in params.");
  }

  try {
    const [blogPost, { blogPosts, contentfulTags }] = await Promise.all([
      getContentfulBlogPostBySlug(params.slug),
      getPostsAndTags()
    ]);

    return {
      blogPost,
      blogPosts,
      contentfulTags
    };
  } catch (e) {
    console.error(e);

    throw new Response(undefined, { status: 404 });
  }
};

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: styles
    },
    ...BlockQuoteStyles(),
    ...ImageMediaStyles(),
    ...CodeBlockStyles(),
    ...ProgressBarStyles()
  ];
};

const Post: React.FC = ({}) => {
  const { blogPost, blogPosts } = useLoaderData<PostLoaderData>();

  const { theme } = useTheme();

  // $$TODO: another error in the typings for this library.
  const BlogPostBody = documentToReactComponents(
    blogPost.fields.bodyRichText as any,
    options
  );

  const updatedDate = new Date(blogPost.sys.updatedAt).toDateString();
  const subUpdatedDate = updatedDate.substring(updatedDate.indexOf(" ") + 1);
  const publishedDate = new Date(blogPost.sys.createdAt).toDateString();
  const subPublishedDate = publishedDate.substring(
    updatedDate.indexOf(" ") + 1
  );

  const tagsToFindRelatedPostsFor = blogPost.metadata.tags;

  // Only suggest three other blogPosts, TODO: Question -- Should we decide to
  // give three random suggestions or the first three in this array?
  const blogPostWithAtLeastOneSharedTag = blogPosts.items
    .filter((post) => {
      return (
        post.sys.id !== blogPost.sys.id &&
        tagsToFindRelatedPostsFor.some((selectedTag) => {
          return post.metadata.tags.some(
            (tag) => tag.sys.id === selectedTag.sys.id
          );
        })
      );
    })
    .slice(0, 3);
  return (
    <>
      <FloatingHeader
        postSlug={blogPost.fields.blogPostSlug}
        postTitle={blogPost.fields.blogPostTitle}
      />

      <div className="text-post-bodyText">
        <div className={`${fixedWidthLayoutClasses} flex flex-col xl:mb-10`}>
          <a
            href="/blog"
            className="go-back-btn inline-flex border-none items-center justify-start text-xl mb-10 hover:text-post-bodyTextLg duration-100 ease-in w-fit"
          >
            <img
              src={
                theme === SupportedTheme.DARK
                  ? "/svg/arrow.svg"
                  : "/svg/arrowDark.svg"
              }
              className="go-back-arrow w-6 rounded-full mr-2 hover:text-post-bodyTextLg"
              alt="go back"
            />
            Go back
          </a>
          <h1 className="BlogPost__Title text-4xl text-post-bodyTextLg xs:text-5xl font-bold leading-relaxed">
            {blogPost.fields.blogPostTitle}
          </h1>
          <div className="w-full flex flex-col custom2:flex-row custom2:justify-between custom2:items-center mt-2 mx-auto max-w-[700px]">
            <p className="BlogPost__DatePublish text-xl mb-2 custom2:mb-0">
              Published on {subPublishedDate}
            </p>
            <p className="BlogPost__DatePublish text-xl">
              Last updated on {subUpdatedDate}
            </p>
          </div>
        </div>
        <img
          src={"https://" + blogPost.fields.blogPostSplash.fields.file.url}
          className="BlogPost__SplashImage m-auto mt-10 xl:mt-0 xl:mb-20"
          alt="cover image for post"
        />
        <div
          className={`BlogPost text-post-bodyText ${fixedWidthLayoutClasses}  mb-20`}
        >
          <div className="BlogPost__BodyWrapper mt-10">{BlogPostBody}</div>
          <div className="flex flex-col lg:flex-row lg:justify-between my-16">
            <div className="text-base mb-16 lg:mb-0">
              <span className="text-lg font-medium">Tags:</span>{" "}
              {blogPost.metadata.tags.map((tag) => (
                <TagBadge tag={tag} theme={theme} />
              ))}
            </div>
          </div>
          <AuthorSection />
        </div>
        <hr></hr>
        {blogPostWithAtLeastOneSharedTag.length > 0 && (
          <RelatedPostsSection relatedPosts={blogPostWithAtLeastOneSharedTag} />
        )}
        <hr></hr>
      </div>
    </>
  );
};

export default Post;

interface TagProps {
  tag: TagLink;
  theme: SupportedTheme;
}
const TagBadge: React.FC<TagProps> = (props) => {
  const tagName = tagIdsToDisplayNames[props.tag.sys.id];

  return (
    <>
      {props.theme === SupportedTheme.LIGHT ? (
        <div className="tag-badge bg-gray-600 before:bg-gray-600 hover:bg-gray-900 before:hover:bg-gray-900 text-gray-200 hover:text-white inline-flex items-center">
          {tagName}
        </div>
      ) : (
        <div className="tag-badge tag-dark bg-gray-300 before:bg-gray-300 before:hover:bg-white hover:bg-white text-gray-700 hover:text-black inline-flex items-center">
          {tagName}
        </div>
      )}
    </>
  );
};
