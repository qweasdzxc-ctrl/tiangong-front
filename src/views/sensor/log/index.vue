<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="设备ID" prop="deviceId">
              <el-input v-model="queryParams.deviceId" placeholder="请输入设备ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="操作类型" prop="action">
              <el-input v-model="queryParams.action" placeholder="请输入操作类型" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="操作执行时间" prop="actionTime">
              <el-date-picker clearable
                v-model="queryParams.actionTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择操作执行时间"
              />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['sensor:log:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['sensor:log:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['sensor:log:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['sensor:log:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="logList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="控制ID" align="center" prop="controlId" v-if="true" />
        <el-table-column label="设备ID" align="center" prop="deviceId" />
        <el-table-column label="用户ID" align="center" prop="userId" />
        <el-table-column label="操作类型" align="center" prop="action" />
        <el-table-column label="操作结果" align="center" prop="result" />
        <el-table-column label="操作执行时间" align="center" prop="actionTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.actionTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作参数" align="center" prop="actionParams" />
        <el-table-column label="关联会话ID" align="center" prop="sessionId" />
        <el-table-column label="风险等级" align="center" prop="riskLevel" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['sensor:log:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['sensor:log:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改设备控制操作日志对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="logFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备ID" prop="deviceId">
          <el-input v-model="form.deviceId" placeholder="请输入设备ID" />
        </el-form-item>
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="操作类型" prop="action">
          <el-input v-model="form.action" placeholder="请输入操作类型" />
        </el-form-item>
        <el-form-item label="操作结果" prop="result">
          <el-input v-model="form.result" placeholder="请输入操作结果" />
        </el-form-item>
        <el-form-item label="操作执行时间" prop="actionTime">
          <el-date-picker clearable
            v-model="form.actionTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择操作执行时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="关联会话ID" prop="sessionId">
          <el-input v-model="form.sessionId" placeholder="请输入关联会话ID" />
        </el-form-item>
        <el-form-item label="风险等级" prop="riskLevel">
          <el-input v-model="form.riskLevel" placeholder="请输入风险等级" />
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

<script setup name="Log" lang="ts">
import { listLog, getLog, delLog, addLog, updateLog } from '@/api/sensor/log';
import { LogVO, LogQuery, LogForm } from '@/api/sensor/log/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const logList = ref<LogVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const logFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: LogForm = {
  controlId: undefined,
  deviceId: undefined,
  userId: undefined,
  action: undefined,
  result: undefined,
  actionTime: undefined,
  actionParams: undefined,
  sessionId: undefined,
  riskLevel: undefined
}
const data = reactive<PageData<LogForm, LogQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deviceId: undefined,
    action: undefined,
    actionTime: undefined,
    actionParams: undefined,
    params: {
    }
  },
  rules: {
    controlId: [
      { required: true, message: "控制ID不能为空", trigger: "blur" }
    ],
    deviceId: [
      { required: true, message: "设备ID不能为空", trigger: "blur" }
    ],
    userId: [
      { required: true, message: "用户ID不能为空", trigger: "blur" }
    ],
    action: [
      { required: true, message: "操作类型不能为空", trigger: "blur" }
    ],
    result: [
      { required: true, message: "操作结果不能为空", trigger: "blur" }
    ],
    actionTime: [
      { required: true, message: "操作执行时间不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询设备控制操作日志列表 */
const getList = async () => {
  loading.value = true;
  const res = await listLog(queryParams.value);
  logList.value = res.rows;
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
  logFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: LogVO[]) => {
  ids.value = selection.map(item => item.controlId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加设备控制操作日志";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: LogVO) => {
  reset();
  const _controlId = row?.controlId || ids.value[0]
  const res = await getLog(_controlId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改设备控制操作日志";
}

/** 提交按钮 */
const submitForm = () => {
  logFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.controlId) {
        await updateLog(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addLog(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: LogVO) => {
  const _controlIds = row?.controlId || ids.value;
  await proxy?.$modal.confirm('是否确认删除设备控制操作日志编号为"' + _controlIds + '"的数据项？').finally(() => loading.value = false);
  await delLog(_controlIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('sensor/log/export', {
    ...queryParams.value
  }, `log_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
