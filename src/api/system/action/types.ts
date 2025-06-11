export interface ActionVO {
  /**
   * 动作ID
   */
  actionId: string | number;

  /**
   * 场景ID
   */
  sceneId: string | number;

  /**
   * 目标设备ID
   */
  deviceId: string | number;

  /**
   * 动作类型
   */
  actionType: string;

  /**
   * 动作参数JSON
   */
  actionParams: string;

  /**
   * 执行顺序
   */
  executeOrder: number;

}

export interface ActionForm extends BaseEntity {
  /**
   * 动作ID
   */
  actionId?: string | number;

  /**
   * 场景ID
   */
  sceneId?: string | number;

  /**
   * 目标设备ID
   */
  deviceId?: string | number;

  /**
   * 动作类型
   */
  actionType?: string;

  /**
   * 动作参数JSON
   */
  actionParams?: string;

  /**
   * 执行顺序
   */
  executeOrder?: number;

}

export interface ActionQuery extends PageQuery {

  /**
   * 场景ID
   */
  sceneId?: string | number;

  /**
   * 目标设备ID
   */
  deviceId?: string | number;

  /**
   * 动作类型
   */
  actionType?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



