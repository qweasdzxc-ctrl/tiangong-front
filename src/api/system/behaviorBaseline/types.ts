export interface BehaviorBaselineVO {
  /**
   * 基线ID
   */
  baselineId: string | number;

  /**
   * 用户ID
   */
  userId: string | number;

  /**
   * 设备类型
   */
  deviceType: string;

  /**
   * 操作频率
   */
  normalFrequency: string;

  /**
   * 使用模式
   */
  protocolPattern: string;

}

export interface BehaviorBaselineForm extends BaseEntity {
  /**
   * 基线ID
   */
  baselineId?: string | number;

  /**
   * 用户ID
   */
  userId?: string | number;

  /**
   * 设备类型
   */
  deviceType?: string;

  /**
   * 操作频率
   */
  normalFrequency?: string;

  /**
   * 使用模式
   */
  protocolPattern?: string;

  /**
   * 基线更新时间
   */
  updateTime?: string;

}

export interface BehaviorBaselineQuery extends PageQuery {

  /**
   * 用户ID
   */
  userId?: string | number;

  /**
   * 设备类型
   */
  deviceType?: string;

  /**
   * 操作频率
   */
  normalFrequency?: string;

  /**
   * 使用模式
   */
  protocolPattern?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



