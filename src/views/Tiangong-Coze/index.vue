<template>
  <div>
    <h1>上传文件并调用工作流</h1>
    <input type="file" @change="handleFileChange" />
    <button @click="uploadFile">上传并执行工作流</button>
    <div v-if="result">
      <h2>工作流执行结果：</h2>
      <pre>{{ result }}</pre>
    </div>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      file: null,
      result: null,
      error: null
    };
  },
  methods: {
    handleFileChange(event) {
      this.file = event.target.files[0];
      this.error = null; // 清除之前的错误
    },
    async uploadFile() {
      if (!this.file) {
        this.error = '请先选择一个文件！';
        return;
      }

      const formData = new FormData();
      formData.append('file', this.file);

      try {
        const response = await axios.post('http://localhost:8080/api/coze/run', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        this.result = response.data;
        this.error = null;
      } catch (error) {
        this.error = '上传失败: ' + (error.response?.data || error.message);
        this.result = null;
      }
    }
  }
};
</script>

<style>
.error-message {
  color: red;
  margin-top: 10px;
}
</style>
