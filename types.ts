import { Signal } from "@preact/signals";

export interface ArcXivResultFeedLink {
  "@title"?: string;
  "@href": string;
  "@rel": string;
  "@type": string;
  "#text": string | null;
}

export interface ArcXivResultFeedTitle {
  "@type": string;
  "#text": string;
}

export interface ArcXivEntryAuthor {
  name: string;
}

export interface ArcXivResultEntry {
  id: string;
  updated: string;
  published: string;
  title: string;
  summary: string;
  author: ArcXivEntryAuthor | ArcXivEntryAuthor[];
  "arxiv:journal_ref"?: {
    "@xmlns:arxiv": string;
    "#text": string;
  };
  link: ArcXivResultFeedLink[] | ArcXivResultFeedLink; // Depending on how many links there can be
  "arxiv:comment"?: {
    "@xmlns:arxiv": string;
    "#text": string;
  };
  "arxiv:doi"?: {
    "@xmlns:arxiv": string;
    "#text": string;
  };
  "arxiv:primary_category": {
    "@xmlns:arxiv": string;
    "@term": string;
    "@scheme": string;
    "#text": null;
  };
  category: {
    "@term": string;
    "@scheme": string;
    "#text": null;
  }[] | {
    "@term": string;
    "@scheme": string;
    "#text": null;
  };
}

export interface ArcXivResultFeed {
  "@xmlns": string;
  link: ArcXivResultFeedLink;
  title: ArcXivResultFeedTitle;
  id: string;
  updated: string;
  "opensearch:totalResults": {
    "@xmlns:opensearch": string;
    "#text": number;
  };
  "opensearch:startIndex": {
    "@xmlns:opensearch": string;
    "#text": number;
  };
  "opensearch:itemsPerPage": {
    "@xmlns:opensearch": string;
    "#text": number;
  };
  entry: ArcXivResultEntry[] | ArcXivResultEntry; // Depending on how many entries there can be
}

export interface ArcXivResultXML {
  xml: {
    "@version": number;
    "@encoding": string;
  };
  feed: ArcXivResultFeed;
}

export interface RelevantSource {
  sourceTitle: string;
  sourceAuthors: string;
  sourceLink: string;
  sourceSummary: string;
  sourcePublishDate: string;
  relevance: number;
}

export interface RelevantSourcesWithText extends RelevantSource {
  sourceText: string
}

export interface TopicInputProps {
    relevantSources: Signal<RelevantSource[]>,
    angle: Signal<string>
}

export interface SourceTableProps {
    relevantSources: Signal<RelevantSource[]>
    angle: Signal<string>,
    literatureReviewResults: Signal<string[]>
}

export interface LiteratureReviewProps {
  literatureReviewResults: Signal<string[]>
}