export interface TokenVO {
  /**
   * 令牌ID
   */
  tokenId: string | number;

  /**
   * 用户ID
   */
  userId: string | number;

  /**
   * API令牌
   */
  token: string;

  /**
   * 过期时间
   */
  expireTime: string;

  /**
   * 最后使用时间
   */
  lastUsedTime: string;

  /**
   * IP地址
   */
  ipAddress: string;

  /**
   * 用户代理
   */
  userAgent: string;

}

export interface TokenForm extends BaseEntity {
  /**
   * 令牌ID
   */
  tokenId?: string | number;

  /**
   * 用户ID
   */
  userId?: string | number;

  /**
   * API令牌
   */
  token?: string;

  /**
   * 过期时间
   */
  expireTime?: string;

  /**
   * 创建时间
   */
  createTime?: string;

  /**
   * 最后使用时间
   */
  lastUsedTime?: string;

  /**
   * IP地址
   */
  ipAddress?: string;

  /**
   * 用户代理
   */
  userAgent?: string;

}

export interface TokenQuery extends PageQuery {

  /**
   * API令牌
   */
  token?: string;

  /**
   * 过期时间
   */
  expireTime?: string;

  /**
   * 用户代理
   */
  userAgent?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



