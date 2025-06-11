import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { OperationAlertVO, OperationAlertForm, OperationAlertQuery } from '@/api/security/operationAlert/types';

/**
 * 查询异常操作告警列表
 * @param query
 * @returns {*}
 */

export const listOperationAlert = (query?: OperationAlertQuery): AxiosPromise<OperationAlertVO[]> => {
  return request({
    url: '/security/operationAlert/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询异常操作告警详细
 * @param alertId
 */
export const getOperationAlert = (alertId: string | number): AxiosPromise<OperationAlertVO> => {
  return request({
    url: '/security/operationAlert/' + alertId,
    method: 'get'
  });
};

/**
 * 新增异常操作告警
 * @param data
 */
export const addOperationAlert = (data: OperationAlertForm) => {
  return request({
    url: '/security/operationAlert',
    method: 'post',
    data: data
  });
};

/**
 * 修改异常操作告警
 * @param data
 */
export const updateOperationAlert = (data: OperationAlertForm) => {
  return request({
    url: '/security/operationAlert',
    method: 'put',
    data: data
  });
};

/**
 * 删除异常操作告警
 * @param alertId
 */
export const delOperationAlert = (alertId: string | number | Array<string | number>) => {
  return request({
    url: '/security/operationAlert/' + alertId,
    method: 'delete'
  });
};
