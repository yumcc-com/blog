const COS = require('cos-nodejs-sdk-v5');
const Archiver = require('archiver');
const { SecretId, SecretKey, Bucket, Region, FileKey, FilePath, DirPath } = require('./config.js');
const Fs = require('fs');

(async () => {
  // 初始化COS实例
  const cos = new COS({
    SecretId,
    SecretKey
  });

  const upload = () => {
    // 上传文件对象
    cos.putObject({
      Bucket, // 存储桶的名称
      Region, // 存储桶所在地域
      Key: FileKey, // 对象在存储桶中的唯一标识
      Body: Fs.createReadStream(FilePath), // 上传的文件路径(和压缩后的文件路径一致)
      onProgress: (progressData) => {
        console.log(JSON.stringify(progressData))
      }
    }, async (err, data) => {
      if (data.statusCode === 200) {
        await Fs.unlinkSync(FilePath)
        console.log(`✔文件上传成功~`)
      } else {
        console.log(err)
      }
    })
  }

  const output = Fs.createWriteStream(FilePath); // 压缩后的文件路径(和上传的文件路径一致)
  const archive = Archiver('zip', {
    zlib: { level: 9 }
  });

  output.on('close', () => {
    console.log(archive.pointer() + ' total bytes')
    console.log('Archiver has been finalized and the output file descriptor has closed.')
    console.log(`✔文件压缩完成~`)
    upload()
  });

  output.on('end', () => {
    console.log('Data has been drained')
  });

  archive.on('warning', (err) => {
    if (err.code === 'ENOENT') {
      // log warning
    } else {
      // throw error
      throw err
    }
  });
  
  archive.on('error', (err) => {
    throw err
  });
  
  archive.pipe(output);

  archive.directory(DirPath, false);

  archive.finalize();
})()