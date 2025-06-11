<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="设备名称" prop="deviceName">
              <el-input v-model="queryParams.deviceName" placeholder="请输入设备名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="设备类型" prop="deviceType">
              <el-input v-model="queryParams.deviceType" placeholder="请输入设备类型" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="当前状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="请选择当前状态" clearable >
                <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="设备所在位置ID" prop="locationId">
              <el-input v-model="queryParams.locationId" placeholder="请输入设备所在位置ID" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['sensor:device:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['sensor:device:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['sensor:device:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['sensor:device:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="deviceList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="设备唯一标识符" align="center" prop="deviceId" v-if="true" />
        <el-table-column label="设备名称" align="center" prop="deviceName" />
        <el-table-column label="设备类型" align="center" prop="deviceType" />
        <el-table-column label="当前状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="sys_normal_disable" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column label="固件版本" align="center" prop="firmwareVersion" />
        <el-table-column label="MAC地址" align="center" prop="macAddress" />
        <el-table-column label="用户ID" align="center" prop="bindUserId" />
        <el-table-column label="设备所在位置ID" align="center" prop="locationId" />
        <el-table-column label="最后活跃时间" align="center" prop="lastActiveTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.lastActiveTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['sensor:device:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['sensor:device:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改智能家居设备信息对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="deviceFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="form.deviceName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="设备类型" prop="deviceType">
          <el-input v-model="form.deviceType" placeholder="请输入设备类型" />
        </el-form-item>
        <el-form-item label="当前状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in sys_normal_disable"
              :key="dict.value"
              :value="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="固件版本" prop="firmwareVersion">
          <el-input v-model="form.firmwareVersion" placeholder="请输入固件版本" />
        </el-form-item>
        <el-form-item label="MAC地址" prop="macAddress">
          <el-input v-model="form.macAddress" placeholder="请输入MAC地址" />
        </el-form-item>
        <el-form-item label="用户ID" prop="bindUserId">
          <el-input v-model="form.bindUserId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="设备所在位置ID" prop="locationId">
          <el-input v-model="form.locationId" placeholder="请输入设备所在位置ID" />
        </el-form-item>
        <el-form-item label="最后活跃时间" prop="lastActiveTime">
          <el-date-picker clearable
            v-model="form.lastActiveTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择最后活跃时间">
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

<script setup name="Device" lang="ts">
import { listDevice, getDevice, delDevice, addDevice, updateDevice } from '@/api/sensor/device';
import { DeviceVO, DeviceQuery, DeviceForm } from '@/api/sensor/device/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { sys_normal_disable } = toRefs<any>(proxy?.useDict('sys_normal_disable'));

const deviceList = ref<DeviceVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const deviceFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: DeviceForm = {
  deviceId: undefined,
  deviceName: undefined,
  deviceType: undefined,
  status: undefined,
  firmwareVersion: undefined,
  macAddress: undefined,
  bindUserId: undefined,
  locationId: undefined,
  lastActiveTime: undefined,
}
const data = reactive<PageData<DeviceForm, DeviceQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deviceName: undefined,
    deviceType: undefined,
    status: undefined,
    locationId: undefined,
    params: {
    }
  },
  rules: {
    deviceId: [
      { required: true, message: "设备唯一标识符不能为空", trigger: "blur" }
    ],
    deviceName: [
      { required: true, message: "设备名称不能为空", trigger: "blur" }
    ],
    deviceType: [
      { required: true, message: "设备类型不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "当前状态不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询智能家居设备信息列表 */
const getList = async () => {
  loading.value = true;
  const res = await listDevice(queryParams.value);
  deviceList.value = res.rows;
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
  deviceFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: DeviceVO[]) => {
  ids.value = selection.map(item => item.deviceId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加智能家居设备信息";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: DeviceVO) => {
  reset();
  const _deviceId = row?.deviceId || ids.value[0]
  const res = await getDevice(_deviceId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改智能家居设备信息";
}

/** 提交按钮 */
const submitForm = () => {
  deviceFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.deviceId) {
        await updateDevice(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addDevice(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: DeviceVO) => {
  const _deviceIds = row?.deviceId || ids.value;
  await proxy?.$modal.confirm('是否确认删除智能家居设备信息编号为"' + _deviceIds + '"的数据项？').finally(() => loading.value = false);
  await delDevice(_deviceIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('sensor/device/export', {
    ...queryParams.value
  }, `device_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
