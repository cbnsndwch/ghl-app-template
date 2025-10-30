import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import {
    buildUrl,
    extractParams,
    getAuthToken,
    RequestConfig
} from '../../utils/request-utils.js';

import * as Models from './models/businesses.js';

/**
 * Businesses Service
 * Documentation for business API
 */
export class Businesses {
    private client: AxiosInstance;

    constructor(httpClient: AxiosInstance) {
        this.client = httpClient;
    }

    /**
     * Update Business
     * Update Business
     */
    async updateBusiness(
        params: {
            businessId: string;
        },
        requestBody: Models.UpdateBusinessDto,
        options?: AxiosRequestConfig
    ): Promise<Models.UpdateBusinessResponseDto> {
        const paramDefs: Array<{ name: string; in: string }> = [
            { name: 'businessId', in: 'path' }
        ];
        const extracted = extractParams(params, paramDefs);
        const requirements: string[] = ['bearer'];

        const config: RequestConfig = {
            method: 'PUT',
            url: buildUrl('/businesses/{businessId}', extracted.path),
            params: extracted.query,
            headers: { ...extracted.header, ...options?.headers },
            data: requestBody,
            __secutiryRequirements: requirements,

            __pathParams: extracted.path,
            ...options
        };

        const authToken = await getAuthToken(
            this.client,
            requirements,
            config.headers || {},
            { ...(config.params || {}), ...config.__pathParams },
            requestBody
        );
        if (authToken) {
            config.headers = { ...config.headers, Authorization: authToken };
        }

        const response: AxiosResponse<Models.UpdateBusinessResponseDto> =
            await this.client.request(config);
        return response.data;
    }

    /**
     * Delete Business
     * Delete Business
     */
    async deleteBusiness(
        params: {
            businessId: string;
        },
        options?: AxiosRequestConfig
    ): Promise<Models.DeleteBusinessResponseDto> {
        const paramDefs: Array<{ name: string; in: string }> = [
            { name: 'businessId', in: 'path' }
        ];
        const extracted = extractParams(params, paramDefs);
        const requirements: string[] = ['bearer'];

        const config: RequestConfig = {
            method: 'DELETE',
            url: buildUrl('/businesses/{businessId}', extracted.path),
            params: extracted.query,
            headers: { ...extracted.header, ...options?.headers },

            __secutiryRequirements: requirements,

            __pathParams: extracted.path,
            ...options
        };

        const authToken = await getAuthToken(
            this.client,
            requirements,
            config.headers || {},
            { ...(config.params || {}), ...config.__pathParams },
            {}
        );
        if (authToken) {
            config.headers = { ...config.headers, Authorization: authToken };
        }

        const response: AxiosResponse<Models.DeleteBusinessResponseDto> =
            await this.client.request(config);
        return response.data;
    }

    /**
     * Get Business
     * Get Business
     */
    async getBusiness(
        params: {
            businessId: string;
        },
        options?: AxiosRequestConfig
    ): Promise<Models.GetBusinessByIdResponseDto> {
        const paramDefs: Array<{ name: string; in: string }> = [
            { name: 'businessId', in: 'path' }
        ];
        const extracted = extractParams(params, paramDefs);
        const requirements: string[] = ['bearer'];

        const config: RequestConfig = {
            method: 'GET',
            url: buildUrl('/businesses/{businessId}', extracted.path),
            params: extracted.query,
            headers: { ...extracted.header, ...options?.headers },

            __secutiryRequirements: requirements,

            __pathParams: extracted.path,
            ...options
        };

        const authToken = await getAuthToken(
            this.client,
            requirements,
            config.headers || {},
            { ...(config.params || {}), ...config.__pathParams },
            {}
        );
        if (authToken) {
            config.headers = { ...config.headers, Authorization: authToken };
        }

        const response: AxiosResponse<Models.GetBusinessByIdResponseDto> =
            await this.client.request(config);
        return response.data;
    }

    /**
     * Get Businesses by Location
     * Get Businesses by Location
     */
    async getBusinessesByLocation(
        params: {
            locationId: string;
        },
        options?: AxiosRequestConfig
    ): Promise<Models.GetBusinessByLocationResponseDto> {
        const paramDefs: Array<{ name: string; in: string }> = [
            { name: 'locationId', in: 'query' }
        ];
        const extracted = extractParams(params, paramDefs);
        const requirements: string[] = ['bearer'];

        const config: RequestConfig = {
            method: 'GET',
            url: buildUrl('/businesses/', extracted.path),
            params: extracted.query,
            headers: { ...extracted.header, ...options?.headers },

            __secutiryRequirements: requirements,

            __pathParams: extracted.path,
            ...options
        };

        const authToken = await getAuthToken(
            this.client,
            requirements,
            config.headers || {},
            { ...(config.params || {}), ...config.__pathParams },
            {}
        );
        if (authToken) {
            config.headers = { ...config.headers, Authorization: authToken };
        }

        const response: AxiosResponse<Models.GetBusinessByLocationResponseDto> =
            await this.client.request(config);
        return response.data;
    }

    /**
     * Create Business
     * Create Business
     */
    async createBusiness(
        requestBody: Models.CreateBusinessDto,
        options?: AxiosRequestConfig
    ): Promise<Models.UpdateBusinessResponseDto> {
        const paramDefs: Array<{ name: string; in: string }> = [];
        const extracted = extractParams(null, paramDefs);
        const requirements: string[] = ['bearer'];

        const config: RequestConfig = {
            method: 'POST',
            url: buildUrl('/businesses/', extracted.path),
            params: extracted.query,
            headers: { ...extracted.header, ...options?.headers },
            data: requestBody,
            __secutiryRequirements: requirements,

            __pathParams: extracted.path,
            ...options
        };

        const authToken = await getAuthToken(
            this.client,
            requirements,
            config.headers || {},
            { ...(config.params || {}), ...config.__pathParams },
            requestBody
        );
        if (authToken) {
            config.headers = { ...config.headers, Authorization: authToken };
        }

        const response: AxiosResponse<Models.UpdateBusinessResponseDto> =
            await this.client.request(config);
        return response.data;
    }
}

export default Businesses;
