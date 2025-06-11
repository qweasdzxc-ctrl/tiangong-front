import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { ScoreItemVO, ScoreItemForm, ScoreItemQuery } from '@/api/security/scoreItem/types';

/**
 * 查询安全评分项定义列表
 * @param query
 * @returns {*}
 */

export const listScoreItem = (query?: ScoreItemQuery): AxiosPromise<ScoreItemVO[]> => {
  return request({
    url: '/security/scoreItem/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询安全评分项定义详细
 * @param itemId
 */
export const getScoreItem = (itemId: string | number): AxiosPromise<ScoreItemVO> => {
  return request({
    url: '/security/scoreItem/' + itemId,
    method: 'get'
  });
};

/**
 * 新增安全评分项定义
 * @param data
 */
export const addScoreItem = (data: ScoreItemForm) => {
  return request({
    url: '/security/scoreItem',
    method: 'post',
    data: data
  });
};

/**
 * 修改安全评分项定义
 * @param data
 */
export const updateScoreItem = (data: ScoreItemForm) => {
  return request({
    url: '/security/scoreItem',
    method: 'put',
    data: data
  });
};

/**
 * 删除安全评分项定义
 * @param itemId
 */
export const delScoreItem = (itemId: string | number | Array<string | number>) => {
  return request({
    url: '/security/scoreItem/' + itemId,
    method: 'delete'
  });
};
