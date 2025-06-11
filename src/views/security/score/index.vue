<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="设备ID" prop="deviceId">
              <el-input v-model="queryParams.deviceId" placeholder="请输入设备ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="总评分" prop="totalScore">
              <el-input v-model="queryParams.totalScore" placeholder="请输入总评分" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="评分时间" prop="ratingTime">
              <el-date-picker clearable
                v-model="queryParams.ratingTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择评分时间"
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['security:score:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['security:score:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['security:score:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['security:score:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="scoreList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="评分记录唯一标识" align="center" prop="ratingId" v-if="true" />
        <el-table-column label="设备ID" align="center" prop="deviceId" />
        <el-table-column label="总评分" align="center" prop="totalScore" />
        <el-table-column label="评分时间" align="center" prop="ratingTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.ratingTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['security:score:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['security:score:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改设备安全评分对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="scoreFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备ID" prop="deviceId">
          <el-input v-model="form.deviceId" placeholder="请输入设备ID" />
        </el-form-item>
        <el-form-item label="总评分" prop="totalScore">
          <el-input v-model="form.totalScore" placeholder="请输入总评分" />
        </el-form-item>
        <el-form-item label="评分时间" prop="ratingTime">
          <el-date-picker clearable
            v-model="form.ratingTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择评分时间">
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

<script setup name="Score" lang="ts">
import { listScore, getScore, delScore, addScore, updateScore } from '@/api/security/score';
import { ScoreVO, ScoreQuery, ScoreForm } from '@/api/security/score/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const scoreList = ref<ScoreVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const scoreFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: ScoreForm = {
  ratingId: undefined,
  deviceId: undefined,
  totalScore: undefined,
  ratingTime: undefined
}
const data = reactive<PageData<ScoreForm, ScoreQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deviceId: undefined,
    totalScore: undefined,
    ratingTime: undefined,
    params: {
    }
  },
  rules: {
    ratingId: [
      { required: true, message: "评分记录唯一标识不能为空", trigger: "blur" }
    ],
    deviceId: [
      { required: true, message: "设备ID不能为空", trigger: "blur" }
    ],
    ratingTime: [
      { required: true, message: "评分时间不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询设备安全评分列表 */
const getList = async () => {
  loading.value = true;
  const res = await listScore(queryParams.value);
  scoreList.value = res.rows;
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
  scoreFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: ScoreVO[]) => {
  ids.value = selection.map(item => item.ratingId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加设备安全评分";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: ScoreVO) => {
  reset();
  const _ratingId = row?.ratingId || ids.value[0]
  const res = await getScore(_ratingId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改设备安全评分";
}

/** 提交按钮 */
const submitForm = () => {
  scoreFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.ratingId) {
        await updateScore(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addScore(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: ScoreVO) => {
  const _ratingIds = row?.ratingId || ids.value;
  await proxy?.$modal.confirm('是否确认删除设备安全评分编号为"' + _ratingIds + '"的数据项？').finally(() => loading.value = false);
  await delScore(_ratingIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('security/score/export', {
    ...queryParams.value
  }, `score_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
