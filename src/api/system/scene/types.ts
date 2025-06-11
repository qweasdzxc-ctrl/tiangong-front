export interface SceneVO {
  /**
   * 场景ID
   */
  sceneId: string | number;

  /**
   * 所属用户ID
   */
  userId: string | number;

  /**
   * 场景名称
   */
  sceneName: string;

  /**
   * 场景描述
   */
  description: string;

  /**
   * 是否启用
   */
  isActive: number;

  /**
   * 触发类型
   */
  triggerType: string;

  /**
   * 触发时间表达式
   */
  triggerTime: string;

}

export interface SceneForm extends BaseEntity {
  /**
   * 场景ID
   */
  sceneId?: string | number;

  /**
   * 所属用户ID
   */
  userId?: string | number;

  /**
   * 场景名称
   */
  sceneName?: string;

  /**
   * 场景描述
   */
  description?: string;

  /**
   * 是否启用
   */
  isActive?: number;

  /**
   * 触发类型
   */
  triggerType?: string;

  /**
   * 触发时间表达式
   */
  triggerTime?: string;

}

export interface SceneQuery extends PageQuery {

  /**
   * 所属用户ID
   */
  userId?: string | number;

  /**
   * 场景名称
   */
  sceneName?: string;

  /**
   * 触发类型
   */
  triggerType?: string;

  /**
   * 触发时间表达式
   */
  triggerTime?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



