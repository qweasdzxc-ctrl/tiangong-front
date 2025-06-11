export interface NotificationVO {
  /**
   * 通知ID
   */
  notificationId: string | number;

  /**
   * 接收用户ID
   */
  userId: string | number;

  /**
   * 通标题
   */
  title: string;

  /**
   * 通知内容
   */
  content: string;

  /**
   * 通知类型
   */
  type: string;

  /**
   * 通知状态
   */
  status: string;

  /**
   * 发送时间
   */
  sendTime: string;

  /**
   * 关联I
   */
  relatedId: string | number;

}

export interface NotificationForm extends BaseEntity {
  /**
   * 通知ID
   */
  notificationId?: string | number;

  /**
   * 接收用户ID
   */
  userId?: string | number;

  /**
   * 通标题
   */
  title?: string;

  /**
   * 通知内容
   */
  content?: string;

  /**
   * 通知类型
   */
  type?: string;

  /**
   * 通知状态
   */
  status?: string;

  /**
   * 发送时间
   */
  sendTime?: string;

  /**
   * 关联I
   */
  relatedId?: string | number;

}

export interface NotificationQuery extends PageQuery {

  /**
   * 接收用户ID
   */
  userId?: string | number;

  /**
   * 通标题
   */
  title?: string;

  /**
   * 通知类型
   */
  type?: string;

  /**
   * 发送时间
   */
  sendTime?: string;

  /**
   * 关联I
   */
  relatedId?: string | number;

    /**
     * 日期范围参数
     */
    params?: any;
}



