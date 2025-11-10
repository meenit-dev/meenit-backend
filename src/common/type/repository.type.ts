export interface RequestParams {
  url: string;
  headers?: Record<string, string>;
}

export interface GetRequestParams extends RequestParams {
  params?: Record<string, any>;
}

export interface PostRequestParams extends RequestParams {
  body: any;
}
