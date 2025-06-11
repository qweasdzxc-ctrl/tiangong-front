export interface LogVO {
  /**
   * 警报日志唯一标识
   */
  logId: string | number;

  /**
   * 产生警报的设备ID
   */
  deviceId: string | number;

  /**
   * 规则ID
   */
  ruleId: string | number;

  /**
   * 警报类型
   */
  alarmType: string;

  /**
   * 警报详细
   */
  message: string;

  /**
   * 严重级别
   */
  severity: string;

  /**
   * 处理状态
   */
  handled: number;

  /**
   * 处理人ID
   */
  handledBy: string;

  /**
   * 处理时间
   */
  handledTime: string;

  /**
   * 处理备注
   */
  handlingNotes: string;

}

export interface LogForm extends BaseEntity {
  /**
   * 警报日志唯一标识
   */
  logId?: string | number;

  /**
   * 产生警报的设备ID
   */
  deviceId?: string | number;

  /**
   * 规则ID
   */
  ruleId?: string | number;

  /**
   * 警报类型
   */
  alarmType?: string;

  /**
   * 警报详细
   */
  message?: string;

  /**
   * 严重级别
   */
  severity?: string;

  /**
   * 处理状态
   */
  handled?: number;

  /**
   * 处理人ID
   */
  handledBy?: string;

  /**
   * 处理时间
   */
  handledTime?: string;

  /**
   * 处理备注
   */
  handlingNotes?: string;

  /**
   * 产生时间
   */
  logTime?: string;

}

export interface LogQuery extends PageQuery {

  /**
   * 产生警报的设备ID
   */
  deviceId?: string | number;

  /**
   * 警报类型
   */
  alarmType?: string;

  /**
   * 严重级别
   */
  severity?: string;

  /**
   * 处理状态
   */
  handled?: number;

    /**
     * 日期范围参数
     */
    params?: any;
}



