<template>
  <div id="app">
    <div class="upload-area" @dragover.prevent @drop="handleDrop">
      Drop files here
    </div>
    <progress v-show="loading" :value="progress" max="100">{{ progress }}</progress>
    <button @click="mergeVideos" v-show="files.length > 0 && !loading">Merge Videos</button>
  </div>
</template>

<script>
import axios from 'axios';


export default {
  data(){
    return{
      loading:false,
      progress: 0,
      files:[]
    }
  },
  methods: {
    handleDrop(event) {
      event.preventDefault();
      const files = event.dataTransfer.files;
      this.files.push(...files);
    },
    async uploadFiles() {
      const formData = new FormData();
      for (let file of this.files) {
        formData.append('files', file);
      }
      this.loading = true;
      try {
        const response = await axios.post('http://localhost:3000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: ProgressEvent => {
            this.progress = parseInt(Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100));
          }
        });
        console.log(response.data);
      } catch (error) {
        console.error('Upload Error', error);
      }
      this.loading = false;
    },
    mergeVideos() {
      if (this.files.length > 0) {
        this.uploadFiles();
      } else {
        console.error('No files to merge');
      }
    }
  }
}
</script>

<style>
.upload-area {
  border: 2px dashed #ccc;
  padding: 20px;
  text-align: center;
}
</style>
