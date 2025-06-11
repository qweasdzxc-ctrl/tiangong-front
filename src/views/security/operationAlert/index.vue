<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="设备ID" prop="deviceId">
              <el-input v-model="queryParams.deviceId" placeholder="请输入设备ID" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['security:operationAlert:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['security:operationAlert:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['security:operationAlert:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['security:operationAlert:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="operationAlertList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="告警ID" align="center" prop="alertId" v-if="true" />
        <el-table-column label="会话ID" align="center" prop="sessionId" />
        <el-table-column label="用户ID" align="center" prop="userId" />
        <el-table-column label="设备ID" align="center" prop="deviceId" />
        <el-table-column label="告警类型" align="center" prop="alertType" />
        <el-table-column label="告警时间" align="center" prop="alertTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.alertTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="处理状态" align="center" prop="handlingStatus" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['security:operationAlert:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['security:operationAlert:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改异常操作告警对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="operationAlertFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="会话ID" prop="sessionId">
          <el-input v-model="form.sessionId" placeholder="请输入会话ID" />
        </el-form-item>
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="设备ID" prop="deviceId">
          <el-input v-model="form.deviceId" placeholder="请输入设备ID" />
        </el-form-item>
        <el-form-item label="告警时间" prop="alertTime">
          <el-date-picker clearable
            v-model="form.alertTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择告警时间">
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

<script setup name="OperationAlert" lang="ts">
import { listOperationAlert, getOperationAlert, delOperationAlert, addOperationAlert, updateOperationAlert } from '@/api/security/operationAlert';
import { OperationAlertVO, OperationAlertQuery, OperationAlertForm } from '@/api/security/operationAlert/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const operationAlertList = ref<OperationAlertVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const operationAlertFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: OperationAlertForm = {
  alertId: undefined,
  sessionId: undefined,
  userId: undefined,
  deviceId: undefined,
  alertType: undefined,
  alertTime: undefined,
  handlingStatus: undefined
}
const data = reactive<PageData<OperationAlertForm, OperationAlertQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deviceId: undefined,
    alertType: undefined,
    params: {
    }
  },
  rules: {
    alertId: [
      { required: true, message: "告警ID不能为空", trigger: "blur" }
    ],
    userId: [
      { required: true, message: "用户ID不能为空", trigger: "blur" }
    ],
    deviceId: [
      { required: true, message: "设备ID不能为空", trigger: "blur" }
    ],
    alertType: [
      { required: true, message: "告警类型不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询异常操作告警列表 */
const getList = async () => {
  loading.value = true;
  const res = await listOperationAlert(queryParams.value);
  operationAlertList.value = res.rows;
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
  operationAlertFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: OperationAlertVO[]) => {
  ids.value = selection.map(item => item.alertId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加异常操作告警";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: OperationAlertVO) => {
  reset();
  const _alertId = row?.alertId || ids.value[0]
  const res = await getOperationAlert(_alertId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改异常操作告警";
}

/** 提交按钮 */
const submitForm = () => {
  operationAlertFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.alertId) {
        await updateOperationAlert(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addOperationAlert(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: OperationAlertVO) => {
  const _alertIds = row?.alertId || ids.value;
  await proxy?.$modal.confirm('是否确认删除异常操作告警编号为"' + _alertIds + '"的数据项？').finally(() => loading.value = false);
  await delOperationAlert(_alertIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('security/operationAlert/export', {
    ...queryParams.value
  }, `operationAlert_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
