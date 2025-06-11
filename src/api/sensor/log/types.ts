export interface LogVO {
  /**
   * 控制ID
   */
  controlId: string | number;

  /**
   * 设备ID
   */
  deviceId: string | number;

  /**
   * 用户ID
   */
  userId: string | number;

  /**
   * 操作类型
   */
  action: string;

  /**
   * 操作结果
   */
  result: string;

  /**
   * 操作执行时间
   */
  actionTime: string;

  /**
   * 操作参数
   */
  actionParams: string;

  /**
   * 关联会话ID
   */
  sessionId: string | number;

  /**
   * 风险等级
   */
  riskLevel: string;

}

export interface LogForm extends BaseEntity {
  /**
   * 控制ID
   */
  controlId?: string | number;

  /**
   * 设备ID
   */
  deviceId?: string | number;

  /**
   * 用户ID
   */
  userId?: string | number;

  /**
   * 操作类型
   */
  action?: string;

  /**
   * 操作结果
   */
  result?: string;

  /**
   * 操作执行时间
   */
  actionTime?: string;

  /**
   * 操作参数
   */
  actionParams?: string;

  /**
   * 关联会话ID
   */
  sessionId?: string | number;

  /**
   * 风险等级
   */
  riskLevel?: string;

}

export interface LogQuery extends PageQuery {

  /**
   * 设备ID
   */
  deviceId?: string | number;

  /**
   * 操作类型
   */
  action?: string;

  /**
   * 操作执行时间
   */
  actionTime?: string;

  /**
   * 操作参数
   */
  actionParams?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



