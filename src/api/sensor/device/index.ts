import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { DeviceVO, DeviceForm, DeviceQuery } from '@/api/sensor/device/types';

/**
 * 查询智能家居设备信息列表
 * @param query
 * @returns {*}
 */

export const listDevice = (query?: DeviceQuery): AxiosPromise<DeviceVO[]> => {
  return request({
    url: '/sensor/device/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询智能家居设备信息详细
 * @param deviceId
 */
export const getDevice = (deviceId: string | number): AxiosPromise<DeviceVO> => {
  return request({
    url: '/sensor/device/' + deviceId,
    method: 'get'
  });
};

/**
 * 新增智能家居设备信息
 * @param data
 */
export const addDevice = (data: DeviceForm) => {
  return request({
    url: '/sensor/device',
    method: 'post',
    data: data
  });
};

/**
 * 修改智能家居设备信息
 * @param data
 */
export const updateDevice = (data: DeviceForm) => {
  return request({
    url: '/sensor/device',
    method: 'put',
    data: data
  });
};

/**
 * 删除智能家居设备信息
 * @param deviceId
 */
export const delDevice = (deviceId: string | number | Array<string | number>) => {
  return request({
    url: '/sensor/device/' + deviceId,
    method: 'delete'
  });
};
