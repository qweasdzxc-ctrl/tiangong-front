export interface DataVO {
  /**
   * 传感器ID
   */
  sensorId: string | number;

  /**
   * 设备ID
   */
  deviceId: string | number;

  /**
   * 温度值
   */
  temperature: number;

  /**
   * 湿度值
   */
  humidity: string | number;

  /**
   * 二氧化碳浓度
   */
  co2Level: number;

  /**
   * 功耗
   */
  powerConsumption: number;

  /**
   * 门状态
   */
  doorStatus: string;

  /**
   * 电池
   */
  batteryLevel: number;

  /**
   * 采集时间
   */
  collectTime: string;

}

export interface DataForm extends BaseEntity {
  /**
   * 传感器ID
   */
  sensorId?: string | number;

  /**
   * 设备ID
   */
  deviceId?: string | number;

  /**
   * 温度值
   */
  temperature?: number;

  /**
   * 湿度值
   */
  humidity?: string | number;

  /**
   * 二氧化碳浓度
   */
  co2Level?: number;

  /**
   * 功耗
   */
  powerConsumption?: number;

  /**
   * 门状态
   */
  doorStatus?: string;

  /**
   * 电池
   */
  batteryLevel?: number;

  /**
   * 采集时间
   */
  collectTime?: string;

}

export interface DataQuery extends PageQuery {

  /**
   * 设备ID
   */
  deviceId?: string | number;

  /**
   * 门状态
   */
  doorStatus?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



