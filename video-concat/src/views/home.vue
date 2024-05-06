<template>
  <div id="app">
    <div class="upload-area" @dragover.prevent @drop="handleDrop">
      Drop files here
    </div>
    <progress v-show="loading" :value="progress" max="100">{{ progress }}</progress>
  </div>
</template>

<script>
import axios from 'axios';


export default {
  data(){
    return{
      loading:false,
      progress: 0
    }
  },
  methods:{
    handleDrop(event){
      const files = event.dataTransfer.files;
      this.uploadFiles(files);
    },
    async uploadFiles(files){
      const formData = new FormData();
      for(let i = 0; i< files.length; i++){
        formData.append('files', files[i]);
      }
      this.loading = true;

      try{
        const response = await axios.post('http://localhost:3000/upload', formData, {
          headers:{
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: ProgressEvent => {
            this.progress = parseInt(Math.round((ProgressEvent.loaded/ ProgressEvent.total)*100));
          }
        });
        console.log(response.data);
      }catch{
        console.error('Upload Error', error);
      }
      this.loading = false
    }
    
  },
  components: {
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
