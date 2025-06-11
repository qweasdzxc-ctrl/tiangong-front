<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="所属用户ID" prop="userId">
              <el-input v-model="queryParams.userId" placeholder="请输入所属用户ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="场景名称" prop="sceneName">
              <el-input v-model="queryParams.sceneName" placeholder="请输入场景名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="触发类型" prop="triggerType">
              <el-input v-model="queryParams.triggerType" placeholder="请输入触发类型" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="触发时间表达式" prop="triggerTime">
              <el-input v-model="queryParams.triggerTime" placeholder="请输入触发时间表达式" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:scene:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['system:scene:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['system:scene:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['system:scene:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="sceneList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="场景ID" align="center" prop="sceneId" v-if="true" />
        <el-table-column label="所属用户ID" align="center" prop="userId" />
        <el-table-column label="场景名称" align="center" prop="sceneName" />
        <el-table-column label="场景描述" align="center" prop="description" />
        <el-table-column label="是否启用" align="center" prop="isActive" />
        <el-table-column label="触发类型" align="center" prop="triggerType" />
        <el-table-column label="触发时间表达式" align="center" prop="triggerTime" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:scene:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:scene:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改自动化场景对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="sceneFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入所属用户ID" />
        </el-form-item>
        <el-form-item label="场景名称" prop="sceneName">
          <el-input v-model="form.sceneName" placeholder="请输入场景名称" />
        </el-form-item>
        <el-form-item label="场景描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入场景描述" />
        </el-form-item>
        <el-form-item label="是否启用" prop="isActive">
          <el-input v-model="form.isActive" placeholder="请输入是否启用" />
        </el-form-item>
        <el-form-item label="触发类型" prop="triggerType">
          <el-input v-model="form.triggerType" placeholder="请输入触发类型" />
        </el-form-item>
        <el-form-item label="触发时间表达式" prop="triggerTime">
          <el-input v-model="form.triggerTime" placeholder="请输入触发时间表达式" />
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

<script setup name="Scene" lang="ts">
import { listScene, getScene, delScene, addScene, updateScene } from '@/api/system/scene';
import { SceneVO, SceneQuery, SceneForm } from '@/api/system/scene/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const sceneList = ref<SceneVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const sceneFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: SceneForm = {
  sceneId: undefined,
  userId: undefined,
  sceneName: undefined,
  description: undefined,
  isActive: undefined,
  triggerType: undefined,
  triggerTime: undefined,
}
const data = reactive<PageData<SceneForm, SceneQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userId: undefined,
    sceneName: undefined,
    triggerType: undefined,
    triggerTime: undefined,
    params: {
    }
  },
  rules: {
    sceneId: [
      { required: true, message: "场景ID不能为空", trigger: "blur" }
    ],
    userId: [
      { required: true, message: "所属用户ID不能为空", trigger: "blur" }
    ],
    sceneName: [
      { required: true, message: "场景名称不能为空", trigger: "blur" }
    ],
    description: [
      { required: true, message: "场景描述不能为空", trigger: "blur" }
    ],
    isActive: [
      { required: true, message: "是否启用不能为空", trigger: "blur" }
    ],
    triggerType: [
      { required: true, message: "触发类型不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询自动化场景列表 */
const getList = async () => {
  loading.value = true;
  const res = await listScene(queryParams.value);
  sceneList.value = res.rows;
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
  sceneFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: SceneVO[]) => {
  ids.value = selection.map(item => item.sceneId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加自动化场景";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: SceneVO) => {
  reset();
  const _sceneId = row?.sceneId || ids.value[0]
  const res = await getScene(_sceneId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改自动化场景";
}

/** 提交按钮 */
const submitForm = () => {
  sceneFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.sceneId) {
        await updateScene(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addScene(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: SceneVO) => {
  const _sceneIds = row?.sceneId || ids.value;
  await proxy?.$modal.confirm('是否确认删除自动化场景编号为"' + _sceneIds + '"的数据项？').finally(() => loading.value = false);
  await delScene(_sceneIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('system/scene/export', {
    ...queryParams.value
  }, `scene_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
