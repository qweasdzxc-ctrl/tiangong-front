import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { NotificationVO, NotificationForm, NotificationQuery } from '@/api/system/notification/types';

/**
 * 查询用户通知记录列表
 * @param query
 * @returns {*}
 */

export const listNotification = (query?: NotificationQuery): AxiosPromise<NotificationVO[]> => {
  return request({
    url: '/system/notification/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询用户通知记录详细
 * @param notificationId
 */
export const getNotification = (notificationId: string | number): AxiosPromise<NotificationVO> => {
  return request({
    url: '/system/notification/' + notificationId,
    method: 'get'
  });
};

/**
 * 新增用户通知记录
 * @param data
 */
export const addNotification = (data: NotificationForm) => {
  return request({
    url: '/system/notification',
    method: 'post',
    data: data
  });
};

/**
 * 修改用户通知记录
 * @param data
 */
export const updateNotification = (data: NotificationForm) => {
  return request({
    url: '/system/notification',
    method: 'put',
    data: data
  });
};

/**
 * 删除用户通知记录
 * @param notificationId
 */
export const delNotification = (notificationId: string | number | Array<string | number>) => {
  return request({
    url: '/system/notification/' + notificationId,
    method: 'delete'
  });
};
