export interface DeviceVO {
  /**
   * 设备唯一标识符
   */
  deviceId: string | number;

  /**
   * 设备名称
   */
  deviceName: string;

  /**
   * 设备类型
   */
  deviceType: string;

  /**
   * 当前状态
   */
  status: string;

  /**
   * 固件版本
   */
  firmwareVersion: string;

  /**
   * MAC地址
   */
  macAddress: string;

  /**
   * 用户ID
   */
  bindUserId: string | number;

  /**
   * 设备所在位置ID
   */
  locationId: string | number;

  /**
   * 最后活跃时间
   */
  lastActiveTime: string;

}

export interface DeviceForm extends BaseEntity {
  /**
   * 设备唯一标识符
   */
  deviceId?: string | number;

  /**
   * 设备名称
   */
  deviceName?: string;

  /**
   * 设备类型
   */
  deviceType?: string;

  /**
   * 当前状态
   */
  status?: string;

  /**
   * 固件版本
   */
  firmwareVersion?: string;

  /**
   * MAC地址
   */
  macAddress?: string;

  /**
   * 用户ID
   */
  bindUserId?: string | number;

  /**
   * 设备所在位置ID
   */
  locationId?: string | number;

  /**
   * 最后活跃时间
   */
  lastActiveTime?: string;

}

export interface DeviceQuery extends PageQuery {

  /**
   * 设备名称
   */
  deviceName?: string;

  /**
   * 设备类型
   */
  deviceType?: string;

  /**
   * 当前状态
   */
  status?: string;

  /**
   * 设备所在位置ID
   */
  locationId?: string | number;

    /**
     * 日期范围参数
     */
    params?: any;
}



