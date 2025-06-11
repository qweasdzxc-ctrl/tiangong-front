import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { DataVO, DataForm, DataQuery } from '@/api/sensor/data/types';

/**
 * 查询设备传感器数据记录列表
 * @param query
 * @returns {*}
 */

export const listData = (query?: DataQuery): AxiosPromise<DataVO[]> => {
  return request({
    url: '/sensor/data/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询设备传感器数据记录详细
 * @param sensorId
 */
export const getData = (sensorId: string | number): AxiosPromise<DataVO> => {
  return request({
    url: '/sensor/data/' + sensorId,
    method: 'get'
  });
};

/**
 * 新增设备传感器数据记录
 * @param data
 */
export const addData = (data: DataForm) => {
  return request({
    url: '/sensor/data',
    method: 'post',
    data: data
  });
};

/**
 * 修改设备传感器数据记录
 * @param data
 */
export const updateData = (data: DataForm) => {
  return request({
    url: '/sensor/data',
    method: 'put',
    data: data
  });
};

/**
 * 删除设备传感器数据记录
 * @param sensorId
 */
export const delData = (sensorId: string | number | Array<string | number>) => {
  return request({
    url: '/sensor/data/' + sensorId,
    method: 'delete'
  });
};
