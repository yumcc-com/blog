const [ SecretId, SecretKey, Bucket, Region, FileKey, FilePath, DirPath, githubClientId, githubClientSecret ] = [
  '', // 腾讯云SecretId
  '', // 腾讯云SecretKey
  'yumcc-blog-1251014862', // 存储桶的名称Bucket
  'ap-hongkong', // 存储桶所在地域Region
  'blog.zip', // 对象在存储桶中的唯一标识FileKey
  __dirname + '/blog.zip' , // __dirname + 上传的文件路径(和压缩后的文件路径一致)FilePath
  __dirname + '/docs/.vitepress/dist/', // __dirname + 本地需要压缩的文件目录DirPath
]

module.exports = { SecretId, SecretKey, Bucket, Region, FileKey, FilePath, DirPath, githubClientId, githubClientSecret }