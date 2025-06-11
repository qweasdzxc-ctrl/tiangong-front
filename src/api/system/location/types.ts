export interface LocationVO {
  /**
   * 位置id
   */
  locationId: string | number;

  /**
   * 用户ID
   */
  userId: string | number;

  /**
   * 位置名称
   */
  name: string;

  /**
   * 位置类型
   */
  type: string;

  /**
   * 父位置ID
   */
  parentId: string | number;

}

export interface LocationForm extends BaseEntity {
  /**
   * 位置id
   */
  locationId?: string | number;

  /**
   * 用户ID
   */
  userId?: string | number;

  /**
   * 位置名称
   */
  name?: string;

  /**
   * 位置类型
   */
  type?: string;

  /**
   * 父位置ID
   */
  parentId?: string | number;

}

export interface LocationQuery extends PageQuery {

  /**
   * 用户ID
   */
  userId?: string | number;

  /**
   * 位置名称
   */
  name?: string;

  /**
   * 位置类型
   */
  type?: string;

  /**
   * 父位置ID
   */
  parentId?: string | number;

    /**
     * 日期范围参数
     */
    params?: any;
}



