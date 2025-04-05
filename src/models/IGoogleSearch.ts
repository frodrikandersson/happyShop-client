export interface IGoogleSearch {
    context: {
        title: string,
    },
    items: [IGoogleSearchItem],
    kind: string,
    queries: IGoogleSearchQueries,
    searchInformation: IGoogleSearchInformation,
    url: IGoogleSearchUrl
}

export interface IGoogleSearchQueries {
    nextPage: [INextPage],
    request: [IRequest]
}

export interface IGoogleSearchItem {
    displayLink: string,
    formattedUrl: string,
    htmlFormattedUrl: string,
    htmlSnippet: string,
    htmlTitle: string,
    kind: string,
    link: string,
    pagemap: IGoogleSearchPagemap,
    snippet: string,
    title: string
}

export interface IGoogleSearchInformation {
    formattedSearchTime: string,
    formattedTotalResults: string,
    searchTime: number,
    totalResults: string
}

export interface IGoogleSearchUrl {
    type: string,
    template: string
}

export interface INextPage {
    count: number,
    startIndex: number,
    title: string
}

export interface IRequest {
    count: number,
    cx: string,
    searchTerms: string,
    startIndex: number,
    title: string
}

export interface IGoogleSearchError {
    code: number,
    message: string,
    errors: [IGoogleSearchErrorDetails]
}

export interface IGoogleSearchErrorDetails {
    domain: string,
    reason: string,
    message: string,
    locationType: string,
    location: string
}

export interface IGoogleSearchPagemap {
    cse_image: [ICSEImage],
    cse_thumbnail: [ICSEThumbnail],
    metatags: [IMetatags],
}

export interface ICSEThumbnail {
    src: string,
    width: string,
    height: string
}

export interface IMetatags {
    "og:image"?: string,
    "og:type"?: string,
    "og:title"?: string,
    "og:description"?: string,
    "og:url"?: string,
    "twitter:card"?: string,
    "twitter:title"?: string,
    "twitter:description"?: string,
    "twitter:image"?: string
}

export interface ICSEImage {
    src: string,
    width: string,
    height: string
}