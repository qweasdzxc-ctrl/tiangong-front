export interface ScoreVO {
  /**
   * 评分记录唯一标识
   */
  ratingId: string | number;

  /**
   * 设备ID
   */
  deviceId: string | number;

  /**
   * 总评分
   */
  totalScore: number;

  /**
   * 评分时间
   */
  ratingTime: string;

}

export interface ScoreForm extends BaseEntity {
  /**
   * 评分记录唯一标识
   */
  ratingId?: string | number;

  /**
   * 设备ID
   */
  deviceId?: string | number;

  /**
   * 总评分
   */
  totalScore?: number;

  /**
   * 评分时间
   */
  ratingTime?: string;

}

export interface ScoreQuery extends PageQuery {

  /**
   * 设备ID
   */
  deviceId?: string | number;

  /**
   * 总评分
   */
  totalScore?: number;

  /**
   * 评分时间
   */
  ratingTime?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



