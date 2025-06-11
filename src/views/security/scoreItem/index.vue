<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="评分项名称" prop="itemName">
              <el-input v-model="queryParams.itemName" placeholder="请输入评分项名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="评分项描述" prop="description">
              <el-input v-model="queryParams.description" placeholder="请输入评分项描述" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="权重" prop="weight">
              <el-input v-model="queryParams.weight" placeholder="请输入权重" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="是否启用" prop="isActive">
              <el-input v-model="queryParams.isActive" placeholder="请输入是否启用" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['security:scoreItem:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['security:scoreItem:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['security:scoreItem:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['security:scoreItem:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="scoreItemList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="评分项ID" align="center" prop="itemId" v-if="true" />
        <el-table-column label="评分项名称" align="center" prop="itemName" />
        <el-table-column label="评分项描述" align="center" prop="description" />
        <el-table-column label="权重" align="center" prop="weight" />
        <el-table-column label="是否启用" align="center" prop="isActive" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['security:scoreItem:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['security:scoreItem:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改安全评分项定义对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="scoreItemFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="评分项名称" prop="itemName">
          <el-input v-model="form.itemName" placeholder="请输入评分项名称" />
        </el-form-item>
        <el-form-item label="评分项描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入评分项描述" />
        </el-form-item>
        <el-form-item label="权重" prop="weight">
          <el-input v-model="form.weight" placeholder="请输入权重" />
        </el-form-item>
        <el-form-item label="是否启用" prop="isActive">
          <el-input v-model="form.isActive" placeholder="请输入是否启用" />
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

<script setup name="ScoreItem" lang="ts">
import { listScoreItem, getScoreItem, delScoreItem, addScoreItem, updateScoreItem } from '@/api/security/scoreItem';
import { ScoreItemVO, ScoreItemQuery, ScoreItemForm } from '@/api/security/scoreItem/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const scoreItemList = ref<ScoreItemVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const scoreItemFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: ScoreItemForm = {
  itemId: undefined,
  itemName: undefined,
  description: undefined,
  weight: undefined,
  isActive: undefined,
}
const data = reactive<PageData<ScoreItemForm, ScoreItemQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    itemName: undefined,
    description: undefined,
    weight: undefined,
    isActive: undefined,
    params: {
    }
  },
  rules: {
    itemId: [
      { required: true, message: "评分项ID不能为空", trigger: "blur" }
    ],
    itemName: [
      { required: true, message: "评分项名称不能为空", trigger: "blur" }
    ],
    weight: [
      { required: true, message: "权重不能为空", trigger: "blur" }
    ],
    isActive: [
      { required: true, message: "是否启用不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询安全评分项定义列表 */
const getList = async () => {
  loading.value = true;
  const res = await listScoreItem(queryParams.value);
  scoreItemList.value = res.rows;
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
  scoreItemFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: ScoreItemVO[]) => {
  ids.value = selection.map(item => item.itemId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加安全评分项定义";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: ScoreItemVO) => {
  reset();
  const _itemId = row?.itemId || ids.value[0]
  const res = await getScoreItem(_itemId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改安全评分项定义";
}

/** 提交按钮 */
const submitForm = () => {
  scoreItemFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.itemId) {
        await updateScoreItem(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addScoreItem(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: ScoreItemVO) => {
  const _itemIds = row?.itemId || ids.value;
  await proxy?.$modal.confirm('是否确认删除安全评分项定义编号为"' + _itemIds + '"的数据项？').finally(() => loading.value = false);
  await delScoreItem(_itemIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('security/scoreItem/export', {
    ...queryParams.value
  }, `scoreItem_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
