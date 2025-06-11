<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="规则名称" prop="ruleName">
              <el-input v-model="queryParams.ruleName" placeholder="请输入规则名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="严重级别" prop="severity">
              <el-input v-model="queryParams.severity" placeholder="请输入严重级别" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['security:rule:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['security:rule:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['security:rule:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['security:rule:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="ruleList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="规则ID" align="center" prop="ruleId" v-if="true" />
        <el-table-column label="规则名称" align="center" prop="ruleName" />
        <el-table-column label="规则" align="center" prop="ruleExpression" />
        <el-table-column label="严重级别" align="center" prop="severity" />
        <el-table-column label="警报消息" align="center" prop="alertMessage" />
        <el-table-column label="是否启用" align="center" prop="isActive" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['security:rule:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['security:rule:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改安全检查规则对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="规则名称" prop="ruleName">
          <el-input v-model="form.ruleName" placeholder="请输入规则名称" />
        </el-form-item>
        <el-form-item label="规则" prop="ruleExpression">
            <el-input v-model="form.ruleExpression" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="严重级别" prop="severity">
          <el-input v-model="form.severity" placeholder="请输入严重级别" />
        </el-form-item>
        <el-form-item label="警报消息" prop="alertMessage">
          <el-input v-model="form.alertMessage" placeholder="请输入警报消息" />
        </el-form-item>
        <el-form-item label="是否启用" prop="isActive">
          <el-input v-model="form.isActive" placeholder="请输入是否启用" />
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker clearable
            v-model="form.createTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择创建时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Rule" lang="ts">
import { listRule, getRule, delRule, addRule, updateRule } from '@/api/security/rule';
import { RuleVO, RuleQuery, RuleForm } from '@/api/security/rule/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const ruleList = ref<RuleVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const ruleFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: RuleForm = {
  ruleId: undefined,
  ruleName: undefined,
  ruleExpression: undefined,
  severity: undefined,
  alertMessage: undefined,
  isActive: undefined,
  createTime: undefined
}
const data = reactive<PageData<RuleForm, RuleQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    ruleName: undefined,
    severity: undefined,
    params: {
    }
  },
  rules: {
    ruleName: [
      { required: true, message: "规则名称不能为空", trigger: "blur" }
    ],
    ruleExpression: [
      { required: true, message: "规则不能为空", trigger: "blur" }
    ],
    severity: [
      { required: true, message: "严重级别不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询安全检查规则列表 */
const getList = async () => {
  loading.value = true;
  const res = await listRule(queryParams.value);
  ruleList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  ruleFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: RuleVO[]) => {
  ids.value = selection.map(item => item.ruleId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加安全检查规则";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: RuleVO) => {
  reset();
  const _ruleId = row?.ruleId || ids.value[0]
  const res = await getRule(_ruleId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改安全检查规则";
}

/** 提交按钮 */
const submitForm = () => {
  ruleFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.ruleId) {
        await updateRule(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addRule(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: RuleVO) => {
  const _ruleIds = row?.ruleId || ids.value;
  await proxy?.$modal.confirm('是否确认删除安全检查规则编号为"' + _ruleIds + '"的数据项？').finally(() => loading.value = false);
  await delRule(_ruleIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('security/rule/export', {
    ...queryParams.value
  }, `rule_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
