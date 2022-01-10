const axios = require('axios');
const { from } = require('rxjs');

const request = axios.create({
  baseURL: 'https://wxtestapplet.gac-nio.com',
  timeout: 30000,
  headers: {
    'Authorization': 'Basic YXBwLWNsaWVudDphcHBjbGllbnRzZWNyZXQhMTIz',
    'Content-Type': 'application/json;charset=UTF-8',
    'device-id': '066A1D4E-8338-4879-9F77-8110340D924C',
    'version': '1.0.0'
  },
});
//这里演示登录的例子

let getToken$ = (phone) => {
  return request.request({
    method: 'POST',
    url: '/auth/mobile/token',
    params: {
      mobile: phone,
      code: '6666',
      'grant-type': 'mobile',
      scope: 'server',
      userSource: 7
    }
  })
} 

from(getToken$('13180808080')).subscribe({
  next: rep => {
    console.log(rep.data)
  },
  error: err => {
    console.log(err)
  }
})

// TODO

// 1、查看文章详情  文章id 7111 测试环境
// 2、点赞文章     文章id 7111 测试环境

// 获取ugc详情 community/ugc/front/v2.2/getUgcById
// 需要自己到APP抓包完成