import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { ScoreVO, ScoreForm, ScoreQuery } from '@/api/security/score/types';

/**
 * 查询设备安全评分列表
 * @param query
 * @returns {*}
 */

export const listScore = (query?: ScoreQuery): AxiosPromise<ScoreVO[]> => {
  return request({
    url: '/security/score/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询设备安全评分详细
 * @param ratingId
 */
export const getScore = (ratingId: string | number): AxiosPromise<ScoreVO> => {
  return request({
    url: '/security/score/' + ratingId,
    method: 'get'
  });
};

/**
 * 新增设备安全评分
 * @param data
 */
export const addScore = (data: ScoreForm) => {
  return request({
    url: '/security/score',
    method: 'post',
    data: data
  });
};

/**
 * 修改设备安全评分
 * @param data
 */
export const updateScore = (data: ScoreForm) => {
  return request({
    url: '/security/score',
    method: 'put',
    data: data
  });
};

/**
 * 删除设备安全评分
 * @param ratingId
 */
export const delScore = (ratingId: string | number | Array<string | number>) => {
  return request({
    url: '/security/score/' + ratingId,
    method: 'delete'
  });
};
