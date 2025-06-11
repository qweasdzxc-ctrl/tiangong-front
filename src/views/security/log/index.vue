<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="产生警报的设备ID" prop="deviceId">
              <el-input v-model="queryParams.deviceId" placeholder="请输入产生警报的设备ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="警报类型" prop="alarmType">
              <el-input v-model="queryParams.alarmType" placeholder="请输入警报类型" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="严重级别" prop="severity">
              <el-input v-model="queryParams.severity" placeholder="请输入严重级别" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="处理状态" prop="handled">
              <el-input v-model="queryParams.handled" placeholder="请输入处理状态" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['security:log:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['security:log:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['security:log:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['security:log:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="logList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="警报日志唯一标识" align="center" prop="logId" v-if="true" />
        <el-table-column label="产生警报的设备ID" align="center" prop="deviceId" />
        <el-table-column label="规则ID" align="center" prop="ruleId" />
        <el-table-column label="警报类型" align="center" prop="alarmType" />
        <el-table-column label="警报详细" align="center" prop="message" />
        <el-table-column label="严重级别" align="center" prop="severity" />
        <el-table-column label="处理状态" align="center" prop="handled" />
        <el-table-column label="处理人ID" align="center" prop="handledBy" />
        <el-table-column label="处理时间" align="center" prop="handledTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.handledTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="处理备注" align="center" prop="handlingNotes" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['security:log:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['security:log:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改安全警报日志记录对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="logFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="产生警报的设备ID" prop="deviceId">
          <el-input v-model="form.deviceId" placeholder="请输入产生警报的设备ID" />
        </el-form-item>
        <el-form-item label="规则ID" prop="ruleId">
          <el-input v-model="form.ruleId" placeholder="请输入规则ID" />
        </el-form-item>
        <el-form-item label="警报类型" prop="alarmType">
          <el-input v-model="form.alarmType" placeholder="请输入警报类型" />
        </el-form-item>
        <el-form-item label="警报详细" prop="message">
            <el-input v-model="form.message" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="严重级别" prop="severity">
          <el-input v-model="form.severity" placeholder="请输入严重级别" />
        </el-form-item>
        <el-form-item label="处理状态" prop="handled">
          <el-input v-model="form.handled" placeholder="请输入处理状态" />
        </el-form-item>
        <el-form-item label="处理人ID" prop="handledBy">
          <el-input v-model="form.handledBy" placeholder="请输入处理人ID" />
        </el-form-item>
        <el-form-item label="处理时间" prop="handledTime">
          <el-date-picker clearable
            v-model="form.handledTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择处理时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="处理备注" prop="handlingNotes">
            <el-input v-model="form.handlingNotes" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="产生时间" prop="logTime">
          <el-date-picker clearable
            v-model="form.logTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择产生时间">
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

<script setup name="Log" lang="ts">
import { listLog, getLog, delLog, addLog, updateLog } from '@/api/security/log';
import { LogVO, LogQuery, LogForm } from '@/api/security/log/types';

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
  logId: undefined,
  deviceId: undefined,
  ruleId: undefined,
  alarmType: undefined,
  message: undefined,
  severity: undefined,
  handled: undefined,
  handledBy: undefined,
  handledTime: undefined,
  handlingNotes: undefined,
  logTime: undefined
}
const data = reactive<PageData<LogForm, LogQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deviceId: undefined,
    alarmType: undefined,
    severity: undefined,
    handled: undefined,
    params: {
    }
  },
  rules: {
    logId: [
      { required: true, message: "警报日志唯一标识不能为空", trigger: "blur" }
    ],
    deviceId: [
      { required: true, message: "产生警报的设备ID不能为空", trigger: "blur" }
    ],
    severity: [
      { required: true, message: "严重级别不能为空", trigger: "blur" }
    ],
    logTime: [
      { required: true, message: "产生时间不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询安全警报日志记录列表 */
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
  ids.value = selection.map(item => item.logId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加安全警报日志记录";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: LogVO) => {
  reset();
  const _logId = row?.logId || ids.value[0]
  const res = await getLog(_logId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改安全警报日志记录";
}

/** 提交按钮 */
const submitForm = () => {
  logFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.logId) {
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
  const _logIds = row?.logId || ids.value;
  await proxy?.$modal.confirm('是否确认删除安全警报日志记录编号为"' + _logIds + '"的数据项？').finally(() => loading.value = false);
  await delLog(_logIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('security/log/export', {
    ...queryParams.value
  }, `log_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
