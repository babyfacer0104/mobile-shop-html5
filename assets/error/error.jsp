<%@ page language="java" pageEncoding="UTF-8"
	contentType="text/html;charset=utf-8"%>
<%
	String path = request.getContextPath();
%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>请求有误</title>
<meta name="viewport"
	content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta content="telephone=no" name="format-detection">
<link href="${pageContext.request.contextPath}/mall/css/base.css"
	rel="stylesheet">
<link href="${pageContext.request.contextPath}/mall/css/style.css"
	rel="stylesheet">
</head>
<body class="body_bg">
	<div class="page-prompt bg align-center">
		<div class="inner">
			<p>请求数据有误,请检查数据！</p>
		</div>
	</div>
</body>
</html>
