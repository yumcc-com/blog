import COS from 'cos-nodejs-sdk-v5'
import Globby from 'globby'
import archiver from 'archiver'
import { SecretId, SecretKey, Bucket, Region, FileKey, FilePath, DirPath } from './config.js'
import Fs from 'fs'
import Path from 'path'

(async () => {
  // 初始化COS实例
  const cos = new COS({
    SecretId,
    SecretKey
  })

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
      }
    })
  }

  // 获取本地文件目录树
  const localFilePath = async (path = DirPath) => {
    return new Promise(async (resolve) => {
      const paths = await Globby(path)
      resolve(paths)
    })
  }

  const paths = await localFilePath()

  const output = Fs.createWriteStream(FilePath) // 压缩后的文件路径(和上传的文件路径一致)
  const archive = archiver('zip', {
    zlib: { level: 9 }
  })

  output.on('close', () => {
    console.log(archive.pointer() + ' total bytes')
    console.log('archiver has been finalized and the output file descriptor has closed.')
    console.log(`✔文件压缩完成~`)
    upload()
  })

  output.on('end', () => {
    console.log('Data has been drained')
  })

  archive.on('warning', (err) => {
    if (err.code === 'ENOENT') {
      // log warning
    } else {
      // throw error
      throw err
    }
  })
  
  archive.on('error', (err) => {
    throw err
  })
  
  archive.pipe(output)

  for (let i of paths) {
    let p, rp
    p = rp = Path.join(__dirname, i).replace(/\\/g, '\/')
    archive.file(p, { name: rp.replace(Path.join(__dirname, DirPath).replace(/\\/g, '\/'), '') })
  }

  archive.finalize()
})()