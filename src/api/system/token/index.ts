import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { TokenVO, TokenForm, TokenQuery } from '@/api/system/token/types';

/**
 * 查询API访问令牌列表
 * @param query
 * @returns {*}
 */

export const listToken = (query?: TokenQuery): AxiosPromise<TokenVO[]> => {
  return request({
    url: '/system/token/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询API访问令牌详细
 * @param tokenId
 */
export const getToken = (tokenId: string | number): AxiosPromise<TokenVO> => {
  return request({
    url: '/system/token/' + tokenId,
    method: 'get'
  });
};

/**
 * 新增API访问令牌
 * @param data
 */
export const addToken = (data: TokenForm) => {
  return request({
    url: '/system/token',
    method: 'post',
    data: data
  });
};

/**
 * 修改API访问令牌
 * @param data
 */
export const updateToken = (data: TokenForm) => {
  return request({
    url: '/system/token',
    method: 'put',
    data: data
  });
};

/**
 * 删除API访问令牌
 * @param tokenId
 */
export const delToken = (tokenId: string | number | Array<string | number>) => {
  return request({
    url: '/system/token/' + tokenId,
    method: 'delete'
  });
};
