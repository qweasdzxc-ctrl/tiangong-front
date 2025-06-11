import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { LocationVO, LocationForm, LocationQuery } from '@/api/system/location/types';

/**
 * 查询用户房屋位置列表
 * @param query
 * @returns {*}
 */

export const listLocation = (query?: LocationQuery): AxiosPromise<LocationVO[]> => {
  return request({
    url: '/system/location/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询用户房屋位置详细
 * @param locationId
 */
export const getLocation = (locationId: string | number): AxiosPromise<LocationVO> => {
  return request({
    url: '/system/location/' + locationId,
    method: 'get'
  });
};

/**
 * 新增用户房屋位置
 * @param data
 */
export const addLocation = (data: LocationForm) => {
  return request({
    url: '/system/location',
    method: 'post',
    data: data
  });
};

/**
 * 修改用户房屋位置
 * @param data
 */
export const updateLocation = (data: LocationForm) => {
  return request({
    url: '/system/location',
    method: 'put',
    data: data
  });
};

/**
 * 删除用户房屋位置
 * @param locationId
 */
export const delLocation = (locationId: string | number | Array<string | number>) => {
  return request({
    url: '/system/location/' + locationId,
    method: 'delete'
  });
};
