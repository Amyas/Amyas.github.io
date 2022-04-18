# Questions

## 在什么场景下会发起options请求

CORS跨域，非简单请求，不是get、post、head、有自定义header头的、content-type是application/json的，常见的有put，delete

## 介绍 https cors 介绍一下

跨域资源共享，分为简单请求和非简单请求，通过cors头配置可以实现跨域

## 浏览器缓存机制

强缓存：走本地
expires、cache-control

协商缓存：走服务器在判断
last-modified、etag

## last-modified和etag有什么区别，分别的适用场景是什么

last-modified只要文件有改动就会更新时间，

etag只有内容发生变化才会变化，内容唯一id

## 请求头的host，origin，refer的区别是什么

host：域名+端口（dns解析相关）
origin：协议+域名+端口（cors跨域相关）
refer：协议+域名+端口+路径+参数（注意，不包含 hash值）（防盗链识别来源）

## 强缓存和协商缓存谁的优先级谁高，区别是什么，强缓存和服务器有通讯么，没有通讯的话有状态码么，状态码是谁返回的，缓存是存到了哪里

强缓存优先级高，

区别是强缓存走本地，协商缓存走服务器

强缓存不和服务器通信，返回200ok，浏览器返回的，缓存存到缓存或本地

## cookie都有哪些属性

name/value/expires/max-age/http-only/path/domain/secure/same-site

## samesite作用是什么

控制跨域是否携带cookie

## cookie和storage的区别是什么

cookie存储空间小4k，可原生设置销毁时间，默认携带在http请求中
storage存储空间大5m，localStorage不清理缓存永久有效，sessionStorage关闭浏览器失效，

## SameSite 有哪几个值

三个值：

1. **Strict**仅允许一方请求携带cookie，即浏览器将只发送相同站点请求的cookie，即当前网页url与请求目标url完全一致。
2. **Lax**允许部分第三方请求携带cookie。
3. **None**无论是否跨站都会发送cookie（Secure必须是true）。

none，可以跨域携带cookie（secure必须是true）
strict：网页url必须与请求目标url完全一致
lax：允许部分第三方请求写到cookie

chrome80后默认lax

## 跨域是否允许携带cookie，如果希望携带cookie需要如何做

使用https，cookie设置same-site:none（因为same-site必须https，设置cookie.Secure）

配置cors

## 了解 JSON Web Token 么

jtw根据用户信息生成一个token返回给用户

用户请求在headers里添加：Authorization: Bearer <token>

服务端根据用户传递的token进行校验解密出用户信息进行判断，

jtw可以设置有效时常。