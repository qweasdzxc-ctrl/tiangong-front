<template>
  <div class="container">

    <h1>上传文件并调用工作流</h1>

    <div class="upload-group">
      <input type="file" @change="handleFileChange" />
      <button @click="uploadFile">上传并执行工作流</button>
    </div>

    <div v-if="result" class="result-container">
      <h2>工作流执行结果：</h2>
      {{ result }}
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
        console.log('工作流执行结果:', this.result);

        this.error = null;
      } catch (error) {
        this.error = '上传失败: ' + (error.response?.data || error.message);
        this.result = null;
      }
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
}

input[type="file"] {
  display: block;
  margin: 0 auto 15px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  max-width: 400px;
}

button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #369d6e;
}

.error-message {
  color: red;
  margin-top: 15px;
  font-size: 14px;
  word-break: break-word;
}

.result-container {
  margin-top: 20px;
  padding: 15px;
  background-color: #eef7f1;
  border-left: 4px solid #42b983;
  font-size: 14px;
  white-space: pre-wrap;
  word-wrap: break-word;
}
.upload-group {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.upload-group input[type="file"] {
  flex: 1;
  max-width: none;
  border-radius: 4px 0 0 4px;
  border-right: none;
}

.upload-group button {
  border-radius: 0 4px 4px 0;
  white-space: nowrap;
}
</style>