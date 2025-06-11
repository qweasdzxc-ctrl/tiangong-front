<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="关联评分" prop="ratingId">
              <el-input v-model="queryParams.ratingId" placeholder="请输入关联评分" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="评分项ID" prop="itemId">
              <el-input v-model="queryParams.itemId" placeholder="请输入评分项ID" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['security:scoreDetail:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['security:scoreDetail:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['security:scoreDetail:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['security:scoreDetail:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="scoreDetailList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="评分明细ID" align="center" prop="detailId" v-if="true" />
        <el-table-column label="关联评分" align="center" prop="ratingId" />
        <el-table-column label="评分项ID" align="center" prop="itemId" />
        <el-table-column label="该项得分" align="center" prop="score" />
        <el-table-column label="评分原因" align="center" prop="reason" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['security:scoreDetail:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['security:scoreDetail:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改安全评分明细对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="scoreDetailFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="关联评分" prop="ratingId">
          <el-input v-model="form.ratingId" placeholder="请输入关联评分" />
        </el-form-item>
        <el-form-item label="评分项ID" prop="itemId">
          <el-input v-model="form.itemId" placeholder="请输入评分项ID" />
        </el-form-item>
        <el-form-item label="该项得分" prop="score">
          <el-input v-model="form.score" placeholder="请输入该项得分" />
        </el-form-item>
        <el-form-item label="评分原因" prop="reason">
          <el-input v-model="form.reason" placeholder="请输入评分原因" />
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

<script setup name="ScoreDetail" lang="ts">
import { listScoreDetail, getScoreDetail, delScoreDetail, addScoreDetail, updateScoreDetail } from '@/api/security/scoreDetail';
import { ScoreDetailVO, ScoreDetailQuery, ScoreDetailForm } from '@/api/security/scoreDetail/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const scoreDetailList = ref<ScoreDetailVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const scoreDetailFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: ScoreDetailForm = {
  detailId: undefined,
  ratingId: undefined,
  itemId: undefined,
  score: undefined,
  reason: undefined
}
const data = reactive<PageData<ScoreDetailForm, ScoreDetailQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    ratingId: undefined,
    itemId: undefined,
    params: {
    }
  },
  rules: {
    ratingId: [
      { required: true, message: "关联评分不能为空", trigger: "blur" }
    ],
    itemId: [
      { required: true, message: "评分项ID不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询安全评分明细列表 */
const getList = async () => {
  loading.value = true;
  const res = await listScoreDetail(queryParams.value);
  scoreDetailList.value = res.rows;
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
  scoreDetailFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: ScoreDetailVO[]) => {
  ids.value = selection.map(item => item.detailId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加安全评分明细";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: ScoreDetailVO) => {
  reset();
  const _detailId = row?.detailId || ids.value[0]
  const res = await getScoreDetail(_detailId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改安全评分明细";
}

/** 提交按钮 */
const submitForm = () => {
  scoreDetailFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.detailId) {
        await updateScoreDetail(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addScoreDetail(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: ScoreDetailVO) => {
  const _detailIds = row?.detailId || ids.value;
  await proxy?.$modal.confirm('是否确认删除安全评分明细编号为"' + _detailIds + '"的数据项？').finally(() => loading.value = false);
  await delScoreDetail(_detailIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('security/scoreDetail/export', {
    ...queryParams.value
  }, `scoreDetail_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
