<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="场景ID" prop="sceneId">
              <el-input v-model="queryParams.sceneId" placeholder="请输入场景ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="目标设备ID" prop="deviceId">
              <el-input v-model="queryParams.deviceId" placeholder="请输入目标设备ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="动作类型" prop="actionType">
              <el-input v-model="queryParams.actionType" placeholder="请输入动作类型" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:action:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['system:action:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['system:action:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['system:action:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="actionList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="动作ID" align="center" prop="actionId" v-if="true" />
        <el-table-column label="场景ID" align="center" prop="sceneId" />
        <el-table-column label="目标设备ID" align="center" prop="deviceId" />
        <el-table-column label="动作类型" align="center" prop="actionType" />
        <el-table-column label="动作参数JSON" align="center" prop="actionParams" />
        <el-table-column label="执行顺序" align="center" prop="executeOrder" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:action:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:action:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改场景动作对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="actionFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="场景ID" prop="sceneId">
          <el-input v-model="form.sceneId" placeholder="请输入场景ID" />
        </el-form-item>
        <el-form-item label="目标设备ID" prop="deviceId">
          <el-input v-model="form.deviceId" placeholder="请输入目标设备ID" />
        </el-form-item>
        <el-form-item label="动作类型" prop="actionType">
          <el-input v-model="form.actionType" placeholder="请输入动作类型" />
        </el-form-item>
        <el-form-item label="执行顺序" prop="executeOrder">
          <el-input v-model="form.executeOrder" placeholder="请输入执行顺序" />
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

<script setup name="Action" lang="ts">
import { listAction, getAction, delAction, addAction, updateAction } from '@/api/system/action';
import { ActionVO, ActionQuery, ActionForm } from '@/api/system/action/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const actionList = ref<ActionVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const actionFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: ActionForm = {
  actionId: undefined,
  sceneId: undefined,
  deviceId: undefined,
  actionType: undefined,
  actionParams: undefined,
  executeOrder: undefined
}
const data = reactive<PageData<ActionForm, ActionQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    sceneId: undefined,
    deviceId: undefined,
    actionType: undefined,
    params: {
    }
  },
  rules: {
    actionId: [
      { required: true, message: "动作ID不能为空", trigger: "blur" }
    ],
    sceneId: [
      { required: true, message: "场景ID不能为空", trigger: "blur" }
    ],
    deviceId: [
      { required: true, message: "目标设备ID不能为空", trigger: "blur" }
    ],
    actionType: [
      { required: true, message: "动作类型不能为空", trigger: "blur" }
    ],
    executeOrder: [
      { required: true, message: "执行顺序不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询场景动作列表 */
const getList = async () => {
  loading.value = true;
  const res = await listAction(queryParams.value);
  actionList.value = res.rows;
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
  actionFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: ActionVO[]) => {
  ids.value = selection.map(item => item.actionId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加场景动作";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: ActionVO) => {
  reset();
  const _actionId = row?.actionId || ids.value[0]
  const res = await getAction(_actionId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改场景动作";
}

/** 提交按钮 */
const submitForm = () => {
  actionFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.actionId) {
        await updateAction(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addAction(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: ActionVO) => {
  const _actionIds = row?.actionId || ids.value;
  await proxy?.$modal.confirm('是否确认删除场景动作编号为"' + _actionIds + '"的数据项？').finally(() => loading.value = false);
  await delAction(_actionIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('system/action/export', {
    ...queryParams.value
  }, `action_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
