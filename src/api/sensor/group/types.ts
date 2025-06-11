export interface GroupVO {
  /**
   * 分组ID
   */
  groupId: string | number;

  /**
   * 所属用户
   */
  userId: string | number;

  /**
   * 分组名称
   */
  groupName: string;

  /**
   * 分组描述
   */
  description: string;

}

export interface GroupForm extends BaseEntity {
  /**
   * 分组ID
   */
  groupId?: string | number;

  /**
   * 所属用户
   */
  userId?: string | number;

  /**
   * 分组名称
   */
  groupName?: string;

  /**
   * 分组描述
   */
  description?: string;

}

export interface GroupQuery extends PageQuery {

  /**
   * 分组名称
   */
  groupName?: string;

  /**
   * 分组描述
   */
  description?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



