<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="设备ID" prop="deviceId">
              <el-input v-model="queryParams.deviceId" placeholder="请输入设备ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="门状态" prop="doorStatus">
              <el-select v-model="queryParams.doorStatus" placeholder="请选择门状态" clearable >
                <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value"/>
              </el-select>
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['sensor:data:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['sensor:data:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['sensor:data:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['sensor:data:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="传感器ID" align="center" prop="sensorId" v-if="true" />
        <el-table-column label="设备ID" align="center" prop="deviceId" />
        <el-table-column label="温度值" align="center" prop="temperature" />
        <el-table-column label="湿度值" align="center" prop="humidity" />
        <el-table-column label="二氧化碳浓度" align="center" prop="co2Level" />
        <el-table-column label="功耗" align="center" prop="powerConsumption" />
        <el-table-column label="门状态" align="center" prop="doorStatus">
          <template #default="scope">
            <dict-tag :options="sys_normal_disable" :value="scope.row.doorStatus"/>
          </template>
        </el-table-column>
        <el-table-column label="电池" align="center" prop="batteryLevel" />
        <el-table-column label="采集时间" align="center" prop="collectTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.collectTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['sensor:data:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['sensor:data:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改设备传感器数据记录对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="dataFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备ID" prop="deviceId">
          <el-input v-model="form.deviceId" placeholder="请输入设备ID" />
        </el-form-item>
        <el-form-item label="温度值" prop="temperature">
          <el-input v-model="form.temperature" placeholder="请输入温度值" />
        </el-form-item>
        <el-form-item label="湿度值" prop="humidity">
          <el-input v-model="form.humidity" placeholder="请输入湿度值" />
        </el-form-item>
        <el-form-item label="二氧化碳浓度" prop="co2Level">
          <el-input v-model="form.co2Level" placeholder="请输入二氧化碳浓度" />
        </el-form-item>
        <el-form-item label="功耗" prop="powerConsumption">
          <el-input v-model="form.powerConsumption" placeholder="请输入功耗" />
        </el-form-item>
        <el-form-item label="门状态" prop="doorStatus">
          <el-radio-group v-model="form.doorStatus">
            <el-radio
              v-for="dict in sys_normal_disable"
              :key="dict.value"
              :value="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="电池" prop="batteryLevel">
          <el-input v-model="form.batteryLevel" placeholder="请输入电池" />
        </el-form-item>
        <el-form-item label="采集时间" prop="collectTime">
          <el-date-picker clearable
            v-model="form.collectTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择采集时间">
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

<script setup name="Data" lang="ts">
import { listData, getData, delData, addData, updateData } from '@/api/sensor/data';
import { DataVO, DataQuery, DataForm } from '@/api/sensor/data/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { sys_normal_disable } = toRefs<any>(proxy?.useDict('sys_normal_disable'));

const dataList = ref<DataVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const dataFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: DataForm = {
  sensorId: undefined,
  deviceId: undefined,
  temperature: undefined,
  humidity: undefined,
  co2Level: undefined,
  powerConsumption: undefined,
  doorStatus: undefined,
  batteryLevel: undefined,
  collectTime: undefined
}
const data = reactive<PageData<DataForm, DataQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deviceId: undefined,
    doorStatus: undefined,
    params: {
    }
  },
  rules: {
    sensorId: [
      { required: true, message: "传感器ID不能为空", trigger: "blur" }
    ],
    deviceId: [
      { required: true, message: "设备ID不能为空", trigger: "blur" }
    ],
    collectTime: [
      { required: true, message: "采集时间不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询设备传感器数据记录列表 */
const getList = async () => {
  loading.value = true;
  const res = await listData(queryParams.value);
  dataList.value = res.rows;
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
  dataFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: DataVO[]) => {
  ids.value = selection.map(item => item.sensorId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加设备传感器数据记录";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: DataVO) => {
  reset();
  const _sensorId = row?.sensorId || ids.value[0]
  const res = await getData(_sensorId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改设备传感器数据记录";
}

/** 提交按钮 */
const submitForm = () => {
  dataFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.sensorId) {
        await updateData(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addData(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: DataVO) => {
  const _sensorIds = row?.sensorId || ids.value;
  await proxy?.$modal.confirm('是否确认删除设备传感器数据记录编号为"' + _sensorIds + '"的数据项？').finally(() => loading.value = false);
  await delData(_sensorIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('sensor/data/export', {
    ...queryParams.value
  }, `data_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
