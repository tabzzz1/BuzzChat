import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios"

// 创建一个 Axios 实例
const httpInstance: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000/api", // 设置接口基地址
  timeout: 10000, // 设置超时时间，单位毫秒
})

// 请求拦截器
httpInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 检查并设置默认 headers，确保不为 undefined
    config.headers = config.headers || {}
    // 在这里可以对 config 进行其他修改，例如添加公共请求头等
    // config.headers.Authorization = 'Bearer token';
    return config
  },
  (error: AxiosError) => {
    // 处理请求错误
    return Promise.reject(error)
  }
)

// 响应拦截器
httpInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做些什么
    return response.data
  },
  (error: AxiosError) => {
    // 处理响应错误
    return Promise.reject(error)
  }
)

export { httpInstance as http }