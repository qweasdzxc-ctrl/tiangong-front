<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="接收用户ID" prop="userId">
              <el-input v-model="queryParams.userId" placeholder="请输入接收用户ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="通标题" prop="title">
              <el-input v-model="queryParams.title" placeholder="请输入通标题" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="发送时间" prop="sendTime">
              <el-date-picker clearable
                v-model="queryParams.sendTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择发送时间"
              />
            </el-form-item>
            <el-form-item label="关联I" prop="relatedId">
              <el-input v-model="queryParams.relatedId" placeholder="请输入关联I" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:notification:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['system:notification:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['system:notification:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['system:notification:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="notificationList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="通知ID" align="center" prop="notificationId" v-if="true" />
        <el-table-column label="接收用户ID" align="center" prop="userId" />
        <el-table-column label="通标题" align="center" prop="title" />
        <el-table-column label="通知内容" align="center" prop="content" />
        <el-table-column label="通知类型" align="center" prop="type" />
        <el-table-column label="通知状态" align="center" prop="status" />
        <el-table-column label="发送时间" align="center" prop="sendTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.sendTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="关联I" align="center" prop="relatedId" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:notification:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:notification:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改用户通知记录对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="notificationFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="接收用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入接收用户ID" />
        </el-form-item>
        <el-form-item label="通标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入通标题" />
        </el-form-item>
        <el-form-item label="通知内容">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="发送时间" prop="sendTime">
          <el-date-picker clearable
            v-model="form.sendTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择发送时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="关联I" prop="relatedId">
          <el-input v-model="form.relatedId" placeholder="请输入关联I" />
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

<script setup name="Notification" lang="ts">
import { listNotification, getNotification, delNotification, addNotification, updateNotification } from '@/api/system/notification';
import { NotificationVO, NotificationQuery, NotificationForm } from '@/api/system/notification/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const notificationList = ref<NotificationVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const notificationFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: NotificationForm = {
  notificationId: undefined,
  userId: undefined,
  title: undefined,
  content: undefined,
  type: undefined,
  status: undefined,
  sendTime: undefined,
  relatedId: undefined
}
const data = reactive<PageData<NotificationForm, NotificationQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userId: undefined,
    title: undefined,
    type: undefined,
    sendTime: undefined,
    relatedId: undefined,
    params: {
    }
  },
  rules: {
    notificationId: [
      { required: true, message: "通知ID不能为空", trigger: "blur" }
    ],
    userId: [
      { required: true, message: "接收用户ID不能为空", trigger: "blur" }
    ],
    title: [
      { required: true, message: "通标题不能为空", trigger: "blur" }
    ],
    content: [
      { required: true, message: "通知内容不能为空", trigger: "blur" }
    ],
    type: [
      { required: true, message: "通知类型不能为空", trigger: "change" }
    ],
    status: [
      { required: true, message: "通知状态不能为空", trigger: "change" }
    ],
    sendTime: [
      { required: true, message: "发送时间不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询用户通知记录列表 */
const getList = async () => {
  loading.value = true;
  const res = await listNotification(queryParams.value);
  notificationList.value = res.rows;
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
  notificationFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: NotificationVO[]) => {
  ids.value = selection.map(item => item.notificationId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加用户通知记录";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: NotificationVO) => {
  reset();
  const _notificationId = row?.notificationId || ids.value[0]
  const res = await getNotification(_notificationId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改用户通知记录";
}

/** 提交按钮 */
const submitForm = () => {
  notificationFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.notificationId) {
        await updateNotification(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addNotification(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: NotificationVO) => {
  const _notificationIds = row?.notificationId || ids.value;
  await proxy?.$modal.confirm('是否确认删除用户通知记录编号为"' + _notificationIds + '"的数据项？').finally(() => loading.value = false);
  await delNotification(_notificationIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('system/notification/export', {
    ...queryParams.value
  }, `notification_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
