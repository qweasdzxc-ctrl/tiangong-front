import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { ScoreDetailVO, ScoreDetailForm, ScoreDetailQuery } from '@/api/security/scoreDetail/types';

/**
 * 查询安全评分明细列表
 * @param query
 * @returns {*}
 */

export const listScoreDetail = (query?: ScoreDetailQuery): AxiosPromise<ScoreDetailVO[]> => {
  return request({
    url: '/security/scoreDetail/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询安全评分明细详细
 * @param detailId
 */
export const getScoreDetail = (detailId: string | number): AxiosPromise<ScoreDetailVO> => {
  return request({
    url: '/security/scoreDetail/' + detailId,
    method: 'get'
  });
};

/**
 * 新增安全评分明细
 * @param data
 */
export const addScoreDetail = (data: ScoreDetailForm) => {
  return request({
    url: '/security/scoreDetail',
    method: 'post',
    data: data
  });
};

/**
 * 修改安全评分明细
 * @param data
 */
export const updateScoreDetail = (data: ScoreDetailForm) => {
  return request({
    url: '/security/scoreDetail',
    method: 'put',
    data: data
  });
};

/**
 * 删除安全评分明细
 * @param detailId
 */
export const delScoreDetail = (detailId: string | number | Array<string | number>) => {
  return request({
    url: '/security/scoreDetail/' + detailId,
    method: 'delete'
  });
};
