import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { PolicyVO, PolicyForm, PolicyQuery } from '@/api/sensor/policy/types';

/**
 * 查询设备权限策略列表
 * @param query
 * @returns {*}
 */

export const listPolicy = (query?: PolicyQuery): AxiosPromise<PolicyVO[]> => {
  return request({
    url: '/sensor/policy/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询设备权限策略详细
 * @param policyId
 */
export const getPolicy = (policyId: string | number): AxiosPromise<PolicyVO> => {
  return request({
    url: '/sensor/policy/' + policyId,
    method: 'get'
  });
};

/**
 * 新增设备权限策略
 * @param data
 */
export const addPolicy = (data: PolicyForm) => {
  return request({
    url: '/sensor/policy',
    method: 'post',
    data: data
  });
};

/**
 * 修改设备权限策略
 * @param data
 */
export const updatePolicy = (data: PolicyForm) => {
  return request({
    url: '/sensor/policy',
    method: 'put',
    data: data
  });
};

/**
 * 删除设备权限策略
 * @param policyId
 */
export const delPolicy = (policyId: string | number | Array<string | number>) => {
  return request({
    url: '/sensor/policy/' + policyId,
    method: 'delete'
  });
};
