import axios from '@/libs/api.request'
import config from '@/config'
const { basicAuth } = config

export const login = ({ userName, password }) => {
  const data = {
    username: userName,
    password,
    grant_type: 'password',
    scope: 'all'
  }
  let formData = new URLSearchParams();
  for(let key in data){
    formData.append(key,data[key])
  }
  return axios.request({
    url: '/auth/oauth/token',
    data: formData,
    method: 'post',
    auth: basicAuth,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: '/auth/web/user/info',
    params: {
      token
    },
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}
