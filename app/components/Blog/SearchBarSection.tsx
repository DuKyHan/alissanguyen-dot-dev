import * as React from "react";
import { DocumentTextIcon } from "@heroicons/react/outline";
import BlogIndexDecoration from "./BlogIndexDecoration";

interface Props {
  search: string;
  setSearch: (input: string) => void;
  count: number;
}

const SearchBarSection: React.FC<Props> = (props) => {
  return (
    <div className="BlogPage__Header__Wrapper mt-10 mb-16 xl:mb-20 flex custom2:grid custom2:grid-cols-4 text-blog-lgText">
      <div className="custom2:col-span-3 sm:col-span-2 ">
        <p className="BlogPage__SubHeader mb-5 text-5xl font-medium leading-snug">
          Find educational resources for React, Remix and more.
        </p>
        <p className="BlogPage__SubHeader mb-10 leading-normal text-post-bodyText text-3xl font-normal">
          Tag along with me as I explore new tech and share my learning along
          the way!
        </p>
        <div className="post-search-bar-input-wrapper mt-1 relative flex flex-row h-16 rounded-2xl border shadow-sm border-blog-border items-center px-3 max-w-lg">
          <input
            type="text"
            name="Search blog posts"
            id="blog-post-search-bar"
            value={props.search}
            onChange={(e) => {
              props.setSearch(e.target.value);
            }}
            className="focus:ring-none bg-transparent focus:outline-none active:ring-none block w-full pl-7 focus:appearance-none pr-12 text-lg border-blog-border rounded-md"
            placeholder="Search posts"
          />
          <div className="absolute inset-y-0 right-10 pl-3 flex items-center pointer-events-none">
            <span className="mr-2">
              <DocumentTextIcon className="h-5 w-5" />
            </span>
            <p className="text-sm opacity-80">{props.count}</p>
          </div>
        </div>
      </div>
      <BlogIndexDecoration />
    </div>
  );
};

export default SearchBarSection;
