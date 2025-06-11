export interface PolicyVO {
  /**
   * 策略ID
   */
  policyId: string | number;

  /**
   * 用户ID
   */
  userId: string | number;

  /**
   * 设备ID
   */
  deviceId: string | number;

  /**
   * 操作集合
   */
  allowedOperations: string;

  /**
   * 开始时间
   */
  effectiveStartTime: string;

  /**
   * 结束时间
   */
  effectiveEndTime: string;

  /**
   * 优先级
   */
  priority: number;

  /**
   * 是否启用
   */
  isActive: number;

}

export interface PolicyForm extends BaseEntity {
  /**
   * 策略ID
   */
  policyId?: string | number;

  /**
   * 用户ID
   */
  userId?: string | number;

  /**
   * 设备ID
   */
  deviceId?: string | number;

  /**
   * 操作集合
   */
  allowedOperations?: string;

  /**
   * 开始时间
   */
  effectiveStartTime?: string;

  /**
   * 结束时间
   */
  effectiveEndTime?: string;

  /**
   * 优先级
   */
  priority?: number;

  /**
   * 是否启用
   */
  isActive?: number;

}

export interface PolicyQuery extends PageQuery {

  /**
   * 策略ID
   */
  policyId?: string | number;

  /**
   * 用户ID
   */
  userId?: string | number;

  /**
   * 操作集合
   */
  allowedOperations?: string;

  /**
   * 开始时间
   */
  effectiveStartTime?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



