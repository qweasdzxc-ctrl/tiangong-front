import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { SceneVO, SceneForm, SceneQuery } from '@/api/system/scene/types';

/**
 * 查询自动化场景列表
 * @param query
 * @returns {*}
 */

export const listScene = (query?: SceneQuery): AxiosPromise<SceneVO[]> => {
  return request({
    url: '/system/scene/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询自动化场景详细
 * @param sceneId
 */
export const getScene = (sceneId: string | number): AxiosPromise<SceneVO> => {
  return request({
    url: '/system/scene/' + sceneId,
    method: 'get'
  });
};

/**
 * 新增自动化场景
 * @param data
 */
export const addScene = (data: SceneForm) => {
  return request({
    url: '/system/scene',
    method: 'post',
    data: data
  });
};

/**
 * 修改自动化场景
 * @param data
 */
export const updateScene = (data: SceneForm) => {
  return request({
    url: '/system/scene',
    method: 'put',
    data: data
  });
};

/**
 * 删除自动化场景
 * @param sceneId
 */
export const delScene = (sceneId: string | number | Array<string | number>) => {
  return request({
    url: '/system/scene/' + sceneId,
    method: 'delete'
  });
};
