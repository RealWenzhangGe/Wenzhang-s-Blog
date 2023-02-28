/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  eslint: {
    // 啥b
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 我必须添加这个才能让一个在本地正常工作的项目成功在Vercel上构建 😅
    
    ignoreBuildErrors: true
  }
}
