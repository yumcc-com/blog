const COS = require('cos-nodejs-sdk-v5');
const Archiver = require('archiver');
const {
  SecretId,
  SecretKey,
  Bucket,
  Region,
  FileKey,
  FilePath,
  DirPath
} = require('./config.js');
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

  const deleteAll = (prefix) => {
    return new Promise((res, rej) => {
      const deleteFolder = (marker) => {
        cos.getBucket({
          Bucket,
          Region,
          Prefix: prefix,
          Marker: marker,
          MaxKeys: 1000,
        }, function (listError, listResult) {
          if (listError) {
            console.log('list error:', listError);
            rej(listError)
          }
          var nextMarker = listResult.NextMarker;
          var objects = listResult.Contents.map(function (item) {
            return {
              Key: item.Key
            }
          });
          cos.deleteMultipleObject({
            Bucket,
            Region,
            Objects: objects,
          }, function (delError, deleteResult) {
            if (delError) {
              console.log('delete error', delError);
              console.log('delete stop');
              rej(delError)
            } else {
              console.log('delete result', deleteResult);
              if (listResult.IsTruncated === 'true') deleteFolder(nextMarker);
              else res();
            }
          });
        });
      }

      deleteFolder()
    })
  }

  const getPrefix = () => {
    return new Promise((res, rej) => {
      cos.getBucket({
        Bucket,
        Region,
        Delimiter: '/',
      }, async function (err, data) {
        if (data.CommonPrefixes) {
          const arr = data.CommonPrefixes.map(item => item.Prefix)

          function find(str) {
            return str >= 'image/';
          }
          arr.splice(arr.findIndex(find), 1)
          const promises = arr.map(item => deleteAll(item))
          console.log(promises)
          Promise.all(promises).then((result) => {
            console.log(result) //['成功了', 'success']
            res()
          }).catch((error) => {
            console.log(error)
            rej(error)
          })
        }
      })
    })
  }

  const output = Fs.createWriteStream(FilePath); // 压缩后的文件路径(和上传的文件路径一致)
  const archive = Archiver('zip', {
    zlib: {
      level: 9
    }
  });

  output.on('close', async () => {
    console.log(archive.pointer() + ' total bytes')
    console.log('Archiver has been finalized and the output file descriptor has closed.')
    console.log(`✔文件压缩完成~`)
    console.log('开始删除线上资源')
    await getPrefix()
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