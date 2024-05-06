const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const {exec} = require('child_process');

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        const uploadsDir = path.join(__dirname, 'uploads');
        if(!fs.existsSync(uploadsDir)){
            fs.mkdirSync(uploadsDir);
        }
        cb(null, uploadsDir);
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname+'-'+DataTransfer.now() + path.extname(file.originalname))
    }
});

const upload = multer({
    storage:storage
});

const app = express();

app.use(cors());

app.post('/upload', upload.array('files'), (req, res)=>{
    console.log(req.files);
    res.send({message:'Files uploaded succesfully'});
});

app.post('/merge', (req, res) => {
    const command = `ffmpeg -f concat -safe 0 -i <filelist.txt> -c copy output.mp4`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).send('Error merging videos');
      }
      res.send('Videos merged successfully');
    });
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});