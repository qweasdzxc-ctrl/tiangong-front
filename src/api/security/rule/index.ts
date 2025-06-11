import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { RuleVO, RuleForm, RuleQuery } from '@/api/security/rule/types';

/**
 * 查询安全检查规则列表
 * @param query
 * @returns {*}
 */

export const listRule = (query?: RuleQuery): AxiosPromise<RuleVO[]> => {
  return request({
    url: '/security/rule/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询安全检查规则详细
 * @param ruleId
 */
export const getRule = (ruleId: string | number): AxiosPromise<RuleVO> => {
  return request({
    url: '/security/rule/' + ruleId,
    method: 'get'
  });
};

/**
 * 新增安全检查规则
 * @param data
 */
export const addRule = (data: RuleForm) => {
  return request({
    url: '/security/rule',
    method: 'post',
    data: data
  });
};

/**
 * 修改安全检查规则
 * @param data
 */
export const updateRule = (data: RuleForm) => {
  return request({
    url: '/security/rule',
    method: 'put',
    data: data
  });
};

/**
 * 删除安全检查规则
 * @param ruleId
 */
export const delRule = (ruleId: string | number | Array<string | number>) => {
  return request({
    url: '/security/rule/' + ruleId,
    method: 'delete'
  });
};
