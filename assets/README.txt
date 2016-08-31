入口有两个（注：需要用到两个参数tikct=b076af01a9ff4cf4b1ddc47940b47837&goodsType=2）：
	一个是index.html这个是状态为物料和买POS的入口
	另一个是home.html这个是状态为租机的入口

webapp 前端项目根目录
assets 放所有前端的样式和script代码

script > app放各模块代码
app > common 放所有项目的公共代码 码的不好 时间问题没细迁
app > 其他模块涉及到js都是自身html页面所需
app > nav 放模块的地址

script > vendor放第三方开源代码
script > js 老js代码 因Jsp迁移到最新H5项目上 时间紧迫就统一放在这里
build-tools 是js压缩代码 不放到部署服务器上

其他的mall、WEB-INF、3g都是老JSP代码
