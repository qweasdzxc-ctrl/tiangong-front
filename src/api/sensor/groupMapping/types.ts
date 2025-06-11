export interface GroupMappingVO {
  /**
   * 映射ID
   */
  mappingId: string | number;

  /**
   * 设备ID
   */
  deviceId: string | number;

  /**
   * 分组ID
   */
  groupId: string | number;

}

export interface GroupMappingForm extends BaseEntity {
  /**
   * 映射ID
   */
  mappingId?: string | number;

  /**
   * 设备ID
   */
  deviceId?: string | number;

  /**
   * 分组ID
   */
  groupId?: string | number;

}

export interface GroupMappingQuery extends PageQuery {

  /**
   * 设备ID
   */
  deviceId?: string | number;

  /**
   * 分组ID
   */
  groupId?: string | number;

    /**
     * 日期范围参数
     */
    params?: any;
}



