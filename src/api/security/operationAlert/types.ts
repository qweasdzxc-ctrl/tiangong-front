export interface OperationAlertVO {
  /**
   * 告警ID
   */
  alertId: string | number;

  /**
   * 会话ID
   */
  sessionId: string | number;

  /**
   * 用户ID
   */
  userId: string | number;

  /**
   * 设备ID
   */
  deviceId: string | number;

  /**
   * 告警类型
   */
  alertType: string;

  /**
   * 告警时间
   */
  alertTime: string;

  /**
   * 处理状态
   */
  handlingStatus: string;

}

export interface OperationAlertForm extends BaseEntity {
  /**
   * 告警ID
   */
  alertId?: string | number;

  /**
   * 会话ID
   */
  sessionId?: string | number;

  /**
   * 用户ID
   */
  userId?: string | number;

  /**
   * 设备ID
   */
  deviceId?: string | number;

  /**
   * 告警类型
   */
  alertType?: string;

  /**
   * 告警时间
   */
  alertTime?: string;

  /**
   * 处理状态
   */
  handlingStatus?: string;

}

export interface OperationAlertQuery extends PageQuery {

  /**
   * 设备ID
   */
  deviceId?: string | number;

  /**
   * 告警类型
   */
  alertType?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



