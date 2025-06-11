export interface RuleVO {
  /**
   * 规则ID
   */
  ruleId: string | number;

  /**
   * 规则名称
   */
  ruleName: string;

  /**
   * 规则
   */
  ruleExpression: string;

  /**
   * 严重级别
   */
  severity: string;

  /**
   * 警报消息
   */
  alertMessage: string;

  /**
   * 是否启用
   */
  isActive: number;

  /**
   * 创建时间
   */
  createTime: string;

}

export interface RuleForm extends BaseEntity {
  /**
   * 规则ID
   */
  ruleId?: string | number;

  /**
   * 规则名称
   */
  ruleName?: string;

  /**
   * 规则
   */
  ruleExpression?: string;

  /**
   * 严重级别
   */
  severity?: string;

  /**
   * 警报消息
   */
  alertMessage?: string;

  /**
   * 是否启用
   */
  isActive?: number;

  /**
   * 创建时间
   */
  createTime?: string;

}

export interface RuleQuery extends PageQuery {

  /**
   * 规则名称
   */
  ruleName?: string;

  /**
   * 严重级别
   */
  severity?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



