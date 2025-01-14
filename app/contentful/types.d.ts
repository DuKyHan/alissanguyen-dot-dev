import { Asset, RichTextContent } from "contentful";

export interface ContentfulBlogPost {
  blogPostTitle: string; //Short text
  blogPostSplash: Asset;
  blogPostSlug: string; //Short text
  blogPostExcerpt: string; //Long text
  bodyRichText: RichTextContent;
  isVisibleInProduction: boolean;
  blogPostKeywords: string; //Short text
  blogPostReferences: string; //Long text, currently not being used
}

export interface ContentfulQuote {
  quoteDescription: string; //Long text
  author: string; //Short text
}

export interface ContentfulCodeBlock {
  codeText: string; //Long text
  codeBlockMetadata: null; //JSON Object, currently not being used, will be use for highlighting custom line(s) of codes later
  shouldDisplayLineNumber: boolean;
  fileName: string | undefined;
}

export interface ContentfulVideo {
  rawHtmlMarkup: string; //Long text
  videoTitle: string; //Short text, currently unused in display
}

export interface ContentfulStickyNote {
  stickyColor: string; //Short text
  stickyTitle: string; //Short text
  stickyBodyRichText: RichTextContent; //Rich text
  shouldDisplayTitle: boolean;
}
export interface ContentfulGif {
  gifMarkup: string; //Long text
  gifName: string; //Short text, currently unused in display
}

export interface ContentfulIllustration {
  illustrationName: string; //Short text
  lightIllustration: Asset;
  darkIllustration: Asset;
}
