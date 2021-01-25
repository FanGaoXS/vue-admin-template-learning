import axios from 'axios'

/**
 * 本地axios实例
 * @param config
 * @returns {AxiosPromise}
 */
export function localRequest(config) {
  // 创建axios实例对象，配置baseUrl和timeout
  let axiosInstance = axios.create({
    baseURL: '//localhost:8090',
    timeout: 5000
  });
  // axios的request拦截器
  axiosInstance.interceptors.request.use(config=>{
    // console.log('axios的request拦截器成功->',config);
    return config;
  }, error => {
    console.log('axios的request拦截器错误->',error);
    throw error;
  })
  // axios的response拦截器
  axiosInstance.interceptors.response.use(response=>{
    // console.log('axios的response拦截器成功->',response);
    return response.data;
  },error => {
    console.log('axios的response拦截器错误->',error);
    throw error;
  })
  return axiosInstance(config);
}
