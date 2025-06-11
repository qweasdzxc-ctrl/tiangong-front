import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { LogVO, LogForm, LogQuery } from '@/api/sensor/log/types';

/**
 * 查询设备控制操作日志列表
 * @param query
 * @returns {*}
 */

export const listLog = (query?: LogQuery): AxiosPromise<LogVO[]> => {
  return request({
    url: '/sensor/log/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询设备控制操作日志详细
 * @param controlId
 */
export const getLog = (controlId: string | number): AxiosPromise<LogVO> => {
  return request({
    url: '/sensor/log/' + controlId,
    method: 'get'
  });
};

/**
 * 新增设备控制操作日志
 * @param data
 */
export const addLog = (data: LogForm) => {
  return request({
    url: '/sensor/log',
    method: 'post',
    data: data
  });
};

/**
 * 修改设备控制操作日志
 * @param data
 */
export const updateLog = (data: LogForm) => {
  return request({
    url: '/sensor/log',
    method: 'put',
    data: data
  });
};

/**
 * 删除设备控制操作日志
 * @param controlId
 */
export const delLog = (controlId: string | number | Array<string | number>) => {
  return request({
    url: '/sensor/log/' + controlId,
    method: 'delete'
  });
};
