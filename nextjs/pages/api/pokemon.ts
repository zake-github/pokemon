import axios, { AxiosInstance , AxiosResponse} from 'axios'
import http, { baseUrl } from './http'

interface response {
    success: boolean,
    data: any,
}
export class PokemonService {
    client: AxiosInstance
    constructor() {
        this.client = http
    }

    /**
     * 获取宝可梦所有基础数据
     * @returns
     */
    public async basicData(): Promise<AxiosResponse<any, any> | null> {
        try {
            const res = await this.client.get(`${baseUrl}/basic_data`)
            return res
        } catch (error) {
            return null
        }
    }
    /**
         * 获取随机宝可梦
         * @returns
         */
    public async random(limit?: number): Promise<AxiosResponse<any, any> | null> {
        try {
            const res = await this.client.get(`${baseUrl}/random${limit ? `?limit=${limit}` : ''}`)
            return res
        } catch (error) {
            return null
        }
    }
    /**
     * 获取随机宝详情
     * @returns
     */
    public async getDetail(id: string): Promise<AxiosResponse<any, any> | null> {
        try {
            const res = await this.client.get(`${baseUrl}/detail/${id}`)
            return res
        } catch (error) {
            return null
        }
    }
    /**
     * 获取宝可梦
     * @returns
     */
    public async getPokemons(params: any): Promise<AxiosResponse<any, any> | null> {
        try {
            const res = await this.client(`${baseUrl}/search`, {
                method: 'post',
                data: params
            })
            return res
        } catch (error) {
            return null
        }
    }

}

const pokemonService = new PokemonService()
export default pokemonService
