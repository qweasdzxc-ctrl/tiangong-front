<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="API令牌" prop="token">
              <el-input v-model="queryParams.token" placeholder="请输入API令牌" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="过期时间" prop="expireTime">
              <el-date-picker clearable
                v-model="queryParams.expireTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择过期时间"
              />
            </el-form-item>
            <el-form-item label="用户代理" prop="userAgent">
              <el-input v-model="queryParams.userAgent" placeholder="请输入用户代理" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:token:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['system:token:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['system:token:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['system:token:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="tokenList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="令牌ID" align="center" prop="tokenId" v-if="true" />
        <el-table-column label="用户ID" align="center" prop="userId" />
        <el-table-column label="API令牌" align="center" prop="token" />
        <el-table-column label="过期时间" align="center" prop="expireTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.expireTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最后使用时间" align="center" prop="lastUsedTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.lastUsedTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="IP地址" align="center" prop="ipAddress" />
        <el-table-column label="用户代理" align="center" prop="userAgent" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:token:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:token:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改API访问令牌对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="tokenFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="API令牌" prop="token">
          <el-input v-model="form.token" placeholder="请输入API令牌" />
        </el-form-item>
        <el-form-item label="过期时间" prop="expireTime">
          <el-date-picker clearable
            v-model="form.expireTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择过期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker clearable
            v-model="form.createTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="最后使用时间" prop="lastUsedTime">
          <el-date-picker clearable
            v-model="form.lastUsedTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择最后使用时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="IP地址" prop="ipAddress">
          <el-input v-model="form.ipAddress" placeholder="请输入IP地址" />
        </el-form-item>
        <el-form-item label="用户代理" prop="userAgent">
          <el-input v-model="form.userAgent" placeholder="请输入用户代理" />
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

<script setup name="Token" lang="ts">
import { listToken, getToken, delToken, addToken, updateToken } from '@/api/system/token';
import { TokenVO, TokenQuery, TokenForm } from '@/api/system/token/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const tokenList = ref<TokenVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const tokenFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: TokenForm = {
  tokenId: undefined,
  userId: undefined,
  token: undefined,
  expireTime: undefined,
  createTime: undefined,
  lastUsedTime: undefined,
  ipAddress: undefined,
  userAgent: undefined
}
const data = reactive<PageData<TokenForm, TokenQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    token: undefined,
    expireTime: undefined,
    userAgent: undefined,
    params: {
    }
  },
  rules: {
    tokenId: [
      { required: true, message: "令牌ID不能为空", trigger: "blur" }
    ],
    userId: [
      { required: true, message: "用户ID不能为空", trigger: "blur" }
    ],
    token: [
      { required: true, message: "API令牌不能为空", trigger: "blur" }
    ],
    expireTime: [
      { required: true, message: "过期时间不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询API访问令牌列表 */
const getList = async () => {
  loading.value = true;
  const res = await listToken(queryParams.value);
  tokenList.value = res.rows;
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
  tokenFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: TokenVO[]) => {
  ids.value = selection.map(item => item.tokenId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加API访问令牌";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: TokenVO) => {
  reset();
  const _tokenId = row?.tokenId || ids.value[0]
  const res = await getToken(_tokenId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改API访问令牌";
}

/** 提交按钮 */
const submitForm = () => {
  tokenFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.tokenId) {
        await updateToken(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addToken(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: TokenVO) => {
  const _tokenIds = row?.tokenId || ids.value;
  await proxy?.$modal.confirm('是否确认删除API访问令牌编号为"' + _tokenIds + '"的数据项？').finally(() => loading.value = false);
  await delToken(_tokenIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('system/token/export', {
    ...queryParams.value
  }, `token_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
