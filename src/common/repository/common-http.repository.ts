import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import { GetRequestParams, PostRequestParams } from '@common/type';

@Injectable()
export class CommonHttpRepository {
  async getRequest({ url, headers, params }: GetRequestParams) {
    const config: AxiosRequestConfig = {
      headers,
      params,
    };
    const response = await axios.get(url, config);
    return response.data;
  }

  async postRequest({ url, headers, body }: PostRequestParams) {
    const config: AxiosRequestConfig = {
      headers,
    };
    const response = await axios.post(url, body, config);
    return response.data;
  }
}
