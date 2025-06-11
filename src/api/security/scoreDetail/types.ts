export interface ScoreDetailVO {
  /**
   * 评分明细ID
   */
  detailId: string | number;

  /**
   * 关联评分
   */
  ratingId: string | number;

  /**
   * 评分项ID
   */
  itemId: string | number;

  /**
   * 该项得分
   */
  score: number;

  /**
   * 评分原因
   */
  reason: string;

}

export interface ScoreDetailForm extends BaseEntity {
  /**
   * 评分明细ID
   */
  detailId?: string | number;

  /**
   * 关联评分
   */
  ratingId?: string | number;

  /**
   * 评分项ID
   */
  itemId?: string | number;

  /**
   * 该项得分
   */
  score?: number;

  /**
   * 评分原因
   */
  reason?: string;

}

export interface ScoreDetailQuery extends PageQuery {

  /**
   * 关联评分
   */
  ratingId?: string | number;

  /**
   * 评分项ID
   */
  itemId?: string | number;

    /**
     * 日期范围参数
     */
    params?: any;
}



