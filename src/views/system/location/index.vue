<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="用户ID" prop="userId">
              <el-input v-model="queryParams.userId" placeholder="请输入用户ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="位置名称" prop="name">
              <el-input v-model="queryParams.name" placeholder="请输入位置名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="位置类型" prop="type">
              <el-input v-model="queryParams.type" placeholder="请输入位置类型" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="父位置ID" prop="parentId">
              <el-input v-model="queryParams.parentId" placeholder="请输入父位置ID" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:location:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['system:location:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['system:location:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['system:location:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="locationList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="位置id" align="center" prop="locationId" v-if="true" />
        <el-table-column label="用户ID" align="center" prop="userId" />
        <el-table-column label="位置名称" align="center" prop="name" />
        <el-table-column label="位置类型" align="center" prop="type" />
        <el-table-column label="父位置ID" align="center" prop="parentId" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:location:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:location:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改用户房屋位置对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="locationFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="位置名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入位置名称" />
        </el-form-item>
        <el-form-item label="位置类型" prop="type">
          <el-input v-model="form.type" placeholder="请输入位置类型" />
        </el-form-item>
        <el-form-item label="父位置ID" prop="parentId">
          <el-input v-model="form.parentId" placeholder="请输入父位置ID" />
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

<script setup name="Location" lang="ts">
import { listLocation, getLocation, delLocation, addLocation, updateLocation } from '@/api/system/location';
import { LocationVO, LocationQuery, LocationForm } from '@/api/system/location/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const locationList = ref<LocationVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const locationFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: LocationForm = {
  locationId: undefined,
  userId: undefined,
  name: undefined,
  type: undefined,
  parentId: undefined,
}
const data = reactive<PageData<LocationForm, LocationQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userId: undefined,
    name: undefined,
    type: undefined,
    parentId: undefined,
    params: {
    }
  },
  rules: {
    locationId: [
      { required: true, message: "位置id不能为空", trigger: "blur" }
    ],
    userId: [
      { required: true, message: "用户ID不能为空", trigger: "blur" }
    ],
    name: [
      { required: true, message: "位置名称不能为空", trigger: "blur" }
    ],
    type: [
      { required: true, message: "位置类型不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询用户房屋位置列表 */
const getList = async () => {
  loading.value = true;
  const res = await listLocation(queryParams.value);
  locationList.value = res.rows;
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
  locationFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: LocationVO[]) => {
  ids.value = selection.map(item => item.locationId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加用户房屋位置";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: LocationVO) => {
  reset();
  const _locationId = row?.locationId || ids.value[0]
  const res = await getLocation(_locationId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改用户房屋位置";
}

/** 提交按钮 */
const submitForm = () => {
  locationFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.locationId) {
        await updateLocation(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addLocation(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: LocationVO) => {
  const _locationIds = row?.locationId || ids.value;
  await proxy?.$modal.confirm('是否确认删除用户房屋位置编号为"' + _locationIds + '"的数据项？').finally(() => loading.value = false);
  await delLocation(_locationIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('system/location/export', {
    ...queryParams.value
  }, `location_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
