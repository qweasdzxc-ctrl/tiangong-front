<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="用户ID" prop="userId">
              <el-input v-model="queryParams.userId" placeholder="请输入用户ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="设备类型" prop="deviceType">
              <el-input v-model="queryParams.deviceType" placeholder="请输入设备类型" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="操作频率" prop="normalFrequency">
              <el-input v-model="queryParams.normalFrequency" placeholder="请输入操作频率" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="使用模式" prop="protocolPattern">
              <el-input v-model="queryParams.protocolPattern" placeholder="请输入使用模式" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:behaviorBaseline:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['system:behaviorBaseline:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['system:behaviorBaseline:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['system:behaviorBaseline:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="behaviorBaselineList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="基线ID" align="center" prop="baselineId" v-if="true" />
        <el-table-column label="用户ID" align="center" prop="userId" />
        <el-table-column label="设备类型" align="center" prop="deviceType" />
        <el-table-column label="操作频率" align="center" prop="normalFrequency" />
        <el-table-column label="使用模式" align="center" prop="protocolPattern" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:behaviorBaseline:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:behaviorBaseline:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改用户行为基线对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="behaviorBaselineFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="设备类型" prop="deviceType">
          <el-input v-model="form.deviceType" placeholder="请输入设备类型" />
        </el-form-item>
        <el-form-item label="操作频率" prop="normalFrequency">
          <el-input v-model="form.normalFrequency" placeholder="请输入操作频率" />
        </el-form-item>
        <el-form-item label="使用模式" prop="protocolPattern">
          <el-input v-model="form.protocolPattern" placeholder="请输入使用模式" />
        </el-form-item>
        <el-form-item label="基线更新时间" prop="updateTime">
          <el-date-picker clearable
            v-model="form.updateTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择基线更新时间">
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

<script setup name="BehaviorBaseline" lang="ts">
import { listBehaviorBaseline, getBehaviorBaseline, delBehaviorBaseline, addBehaviorBaseline, updateBehaviorBaseline } from '@/api/system/behaviorBaseline';
import { BehaviorBaselineVO, BehaviorBaselineQuery, BehaviorBaselineForm } from '@/api/system/behaviorBaseline/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const behaviorBaselineList = ref<BehaviorBaselineVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const behaviorBaselineFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: BehaviorBaselineForm = {
  baselineId: undefined,
  userId: undefined,
  deviceType: undefined,
  normalFrequency: undefined,
  protocolPattern: undefined,
  updateTime: undefined
}
const data = reactive<PageData<BehaviorBaselineForm, BehaviorBaselineQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userId: undefined,
    deviceType: undefined,
    normalFrequency: undefined,
    protocolPattern: undefined,
    params: {
    }
  },
  rules: {
    baselineId: [
      { required: true, message: "基线ID不能为空", trigger: "blur" }
    ],
    userId: [
      { required: true, message: "用户ID不能为空", trigger: "blur" }
    ],
    deviceType: [
      { required: true, message: "设备类型不能为空", trigger: "blur" }
    ],
    normalFrequency: [
      { required: true, message: "操作频率不能为空", trigger: "blur" }
    ],
    protocolPattern: [
      { required: true, message: "使用模式不能为空", trigger: "blur" }
    ],
    updateTime: [
      { required: true, message: "基线更新时间不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询用户行为基线列表 */
const getList = async () => {
  loading.value = true;
  const res = await listBehaviorBaseline(queryParams.value);
  behaviorBaselineList.value = res.rows;
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
  behaviorBaselineFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: BehaviorBaselineVO[]) => {
  ids.value = selection.map(item => item.baselineId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加用户行为基线";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: BehaviorBaselineVO) => {
  reset();
  const _baselineId = row?.baselineId || ids.value[0]
  const res = await getBehaviorBaseline(_baselineId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改用户行为基线";
}

/** 提交按钮 */
const submitForm = () => {
  behaviorBaselineFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.baselineId) {
        await updateBehaviorBaseline(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addBehaviorBaseline(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: BehaviorBaselineVO) => {
  const _baselineIds = row?.baselineId || ids.value;
  await proxy?.$modal.confirm('是否确认删除用户行为基线编号为"' + _baselineIds + '"的数据项？').finally(() => loading.value = false);
  await delBehaviorBaseline(_baselineIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('system/behaviorBaseline/export', {
    ...queryParams.value
  }, `behaviorBaseline_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
