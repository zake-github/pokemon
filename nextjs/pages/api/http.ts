import axios from 'axios';
import { createContext } from 'react';

const baseOrigin = 'http://127.0.0.1:3000';
export const baseUrl = baseOrigin + '/v1';
let http = axios.create({
    timeout: 1000 * 60 * 3
})
http.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
http.interceptors.request.use(
    (config) => {
        return config
    },
    (error) => {
        return Promise.resolve({ success: false, data: error })
    }
)
http.interceptors.response.use(
    (res):Promise<any> => {
        if (res.status === 200 || res.status === 201) {
            let result = res.data
            if (result && result.success) {
                return Promise.resolve(result)
            } else {
                return Promise.resolve({
                    status: 400,
                    data: result
                })
            }
        } else {
            return Promise.resolve({
                success: false,
                response: res
            })
        }
    },
    // 请求失败
    (error) => {
        const { response } = error
        return Promise.resolve({
            success: false,
            response
        })
    }
)
export const basicData = () => http(`${baseUrl}/basic_data`);
export const getDetail = (id: string) => http(`${baseUrl}/detail/${id}`);
export const random = (limit?: number) => http(`${baseUrl}/random${limit ? `?limit=${limit}` : ''}`);

export const basicUrl = (url: string) => {
    return baseOrigin + '/play/resources/pokedex' + url;
}

export default http