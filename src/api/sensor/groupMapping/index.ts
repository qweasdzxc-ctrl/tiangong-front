import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { GroupMappingVO, GroupMappingForm, GroupMappingQuery } from '@/api/sensor/groupMapping/types';

/**
 * 查询设备与分组关联列表
 * @param query
 * @returns {*}
 */

export const listGroupMapping = (query?: GroupMappingQuery): AxiosPromise<GroupMappingVO[]> => {
  return request({
    url: '/sensor/groupMapping/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询设备与分组关联详细
 * @param mappingId
 */
export const getGroupMapping = (mappingId: string | number): AxiosPromise<GroupMappingVO> => {
  return request({
    url: '/sensor/groupMapping/' + mappingId,
    method: 'get'
  });
};

/**
 * 新增设备与分组关联
 * @param data
 */
export const addGroupMapping = (data: GroupMappingForm) => {
  return request({
    url: '/sensor/groupMapping',
    method: 'post',
    data: data
  });
};

/**
 * 修改设备与分组关联
 * @param data
 */
export const updateGroupMapping = (data: GroupMappingForm) => {
  return request({
    url: '/sensor/groupMapping',
    method: 'put',
    data: data
  });
};

/**
 * 删除设备与分组关联
 * @param mappingId
 */
export const delGroupMapping = (mappingId: string | number | Array<string | number>) => {
  return request({
    url: '/sensor/groupMapping/' + mappingId,
    method: 'delete'
  });
};
