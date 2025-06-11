import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { LogVO, LogForm, LogQuery } from '@/api/security/log/types';

/**
 * 查询安全警报日志记录列表
 * @param query
 * @returns {*}
 */

export const listLog = (query?: LogQuery): AxiosPromise<LogVO[]> => {
  return request({
    url: '/security/log/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询安全警报日志记录详细
 * @param logId
 */
export const getLog = (logId: string | number): AxiosPromise<LogVO> => {
  return request({
    url: '/security/log/' + logId,
    method: 'get'
  });
};

/**
 * 新增安全警报日志记录
 * @param data
 */
export const addLog = (data: LogForm) => {
  return request({
    url: '/security/log',
    method: 'post',
    data: data
  });
};

/**
 * 修改安全警报日志记录
 * @param data
 */
export const updateLog = (data: LogForm) => {
  return request({
    url: '/security/log',
    method: 'put',
    data: data
  });
};

/**
 * 删除安全警报日志记录
 * @param logId
 */
export const delLog = (logId: string | number | Array<string | number>) => {
  return request({
    url: '/security/log/' + logId,
    method: 'delete'
  });
};
