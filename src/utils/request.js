import axios from 'axios';

// 创建一个axios实例
export const request = axios.create({
    baseURL: 'http://47.103.204.224:20088/api'
        // baseURL: process.env.NODE_ENV === 'development' ?
        //     'http://localhost:20088/api' : 'http://47.103.204.224:20088/api'
})

export default request;