const [ SecretId, SecretKey, Bucket, Region, FileKey, FilePath, DirPath, githubClientId, githubClientSecret ] = [
  '', // 腾讯云SecretId
  '', // 腾讯云SecretKey
  '', // 存储桶的名称Bucket
  '', // 存储桶所在地域Region
  '', // 对象在存储桶中的唯一标识FileKey
  '' , // 上传的文件路径(和压缩后的文件路径一致)FilePath
  '', // 本地需要压缩的文件目录
  '', // GitHub OAuth App ClientId
  '' // GitHub OAuth App ClientSecret
]

module.exports = { SecretId, SecretKey, Bucket, Region, FileKey, FilePath, DirPath, githubClientId, githubClientSecret }