import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { ActionVO, ActionForm, ActionQuery } from '@/api/system/action/types';

/**
 * 查询场景动作列表
 * @param query
 * @returns {*}
 */

export const listAction = (query?: ActionQuery): AxiosPromise<ActionVO[]> => {
  return request({
    url: '/system/action/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询场景动作详细
 * @param actionId
 */
export const getAction = (actionId: string | number): AxiosPromise<ActionVO> => {
  return request({
    url: '/system/action/' + actionId,
    method: 'get'
  });
};

/**
 * 新增场景动作
 * @param data
 */
export const addAction = (data: ActionForm) => {
  return request({
    url: '/system/action',
    method: 'post',
    data: data
  });
};

/**
 * 修改场景动作
 * @param data
 */
export const updateAction = (data: ActionForm) => {
  return request({
    url: '/system/action',
    method: 'put',
    data: data
  });
};

/**
 * 删除场景动作
 * @param actionId
 */
export const delAction = (actionId: string | number | Array<string | number>) => {
  return request({
    url: '/system/action/' + actionId,
    method: 'delete'
  });
};
