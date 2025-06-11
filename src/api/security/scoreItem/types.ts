export interface ScoreItemVO {
  /**
   * 评分项ID
   */
  itemId: string | number;

  /**
   * 评分项名称
   */
  itemName: string;

  /**
   * 评分项描述
   */
  description: string;

  /**
   * 权重
   */
  weight: number;

  /**
   * 是否启用
   */
  isActive: number;

}

export interface ScoreItemForm extends BaseEntity {
  /**
   * 评分项ID
   */
  itemId?: string | number;

  /**
   * 评分项名称
   */
  itemName?: string;

  /**
   * 评分项描述
   */
  description?: string;

  /**
   * 权重
   */
  weight?: number;

  /**
   * 是否启用
   */
  isActive?: number;

}

export interface ScoreItemQuery extends PageQuery {

  /**
   * 评分项名称
   */
  itemName?: string;

  /**
   * 评分项描述
   */
  description?: string;

  /**
   * 权重
   */
  weight?: number;

  /**
   * 是否启用
   */
  isActive?: number;

    /**
     * 日期范围参数
     */
    params?: any;
}



