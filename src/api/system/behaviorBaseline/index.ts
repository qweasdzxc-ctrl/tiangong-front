import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { BehaviorBaselineVO, BehaviorBaselineForm, BehaviorBaselineQuery } from '@/api/system/behaviorBaseline/types';

/**
 * 查询用户行为基线列表
 * @param query
 * @returns {*}
 */

export const listBehaviorBaseline = (query?: BehaviorBaselineQuery): AxiosPromise<BehaviorBaselineVO[]> => {
  return request({
    url: '/system/behaviorBaseline/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询用户行为基线详细
 * @param baselineId
 */
export const getBehaviorBaseline = (baselineId: string | number): AxiosPromise<BehaviorBaselineVO> => {
  return request({
    url: '/system/behaviorBaseline/' + baselineId,
    method: 'get'
  });
};

/**
 * 新增用户行为基线
 * @param data
 */
export const addBehaviorBaseline = (data: BehaviorBaselineForm) => {
  return request({
    url: '/system/behaviorBaseline',
    method: 'post',
    data: data
  });
};

/**
 * 修改用户行为基线
 * @param data
 */
export const updateBehaviorBaseline = (data: BehaviorBaselineForm) => {
  return request({
    url: '/system/behaviorBaseline',
    method: 'put',
    data: data
  });
};

/**
 * 删除用户行为基线
 * @param baselineId
 */
export const delBehaviorBaseline = (baselineId: string | number | Array<string | number>) => {
  return request({
    url: '/system/behaviorBaseline/' + baselineId,
    method: 'delete'
  });
};
