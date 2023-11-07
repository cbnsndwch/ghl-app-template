import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Axios, { AxiosInstance, Method } from 'axios';

import {
    IGhlCredentials,
    IGetAccessTokenResponse,
    GhlCredentialsManager
} from '@cbnsndwch/ghl-app-contracts';

import {
    HEADERS_VERSION_JULY_2021,
    TOKEN_GHL_CREDENTIALS_MANAGER
} from '../constants';

import { RequestOptions } from './ghl-request-options.contract';

@Injectable()
export class GhlApiClient {
    protected readonly GHL_API_DOMAIN: string;
    protected readonly GHL_CLIENT_ID: string;
    protected readonly GHL_CLIENT_SECRET: string;

    protected readonly http: AxiosInstance;

    protected readonly logger: Logger = new Logger(GhlApiClient.name);

    constructor(
        @Inject(TOKEN_GHL_CREDENTIALS_MANAGER)
        protected readonly credentialsService: GhlCredentialsManager,
        configService: ConfigService
    ) {
        this.GHL_API_DOMAIN = configService.get<string>('GHL_API_DOMAIN')!;
        this.GHL_CLIENT_ID = configService.get<string>('GHL_CLIENT_ID')!;
        this.GHL_CLIENT_SECRET =
            configService.get<string>('GHL_CLIENT_SECRET')!;

        this.http = Axios.create({
            baseURL: this.GHL_API_DOMAIN,
            headers: {
                'content-type': 'application/json'
            }
        });
    }

    //#region Raw HTTP Methods

    protected async request<TData = any>(
        method: Method,
        endpoint: string,
        credentials?: IGhlCredentials,
        { headers, retryCount, ...options }: RequestOptions = {}
    ) {
        let response = await this.http.request<TData>({
            ...options,
            method,
            url: endpoint,
            headers: {
                authorization: credentials
                    ? `Bearer ${credentials.accessToken}`
                    : undefined,
                ...headers
            },
            validateStatus: () => true
        });

        // retry once if the access token has expired
        if (response.status === 401 && credentials && !retryCount) {
            const newCredentials = await this.refreshAccessToken(credentials);

            response = await this.request<TData>(
                method,
                endpoint,
                newCredentials,
                {
                    ...options,
                    retryCount: 1
                }
            );
        }

        return response;
    }

    protected async get<TData = any>(
        endpoint: string,
        credentials?: IGhlCredentials,
        options: RequestOptions = {}
    ) {
        const response = await this.request<TData>(
            'GET',
            endpoint,
            credentials,
            options
        );

        return response;
    }

    protected async post<TData = any>(
        endpoint: string,
        credentials?: IGhlCredentials,
        data?: unknown,
        options: RequestOptions = {}
    ) {
        const response = await this.request<TData>(
            'POST',
            endpoint,
            credentials,
            {
                ...options,
                data
            }
        );

        return response;
    }

    protected async put<TData = any>(
        endpoint: string,
        credentials?: IGhlCredentials,
        data?: unknown,
        options: RequestOptions = {}
    ) {
        const response = await this.request<TData>(
            'PUT',
            endpoint,
            credentials,
            {
                ...options,
                data
            }
        );

        return response;
    }

    protected async patch<TData = any>(
        endpoint: string,
        credentials?: IGhlCredentials,
        data?: unknown,
        options: RequestOptions = {}
    ) {
        const response = await this.request<TData>(
            'PATCH',
            endpoint,
            credentials,
            {
                ...options,
                data
            }
        );

        return response;
    }

    protected async delete<TData = any>(
        endpoint: string,
        credentials?: IGhlCredentials,
        data?: unknown,
        options: RequestOptions = {}
    ) {
        const response = await this.request<TData>(
            'DELETE',
            endpoint,
            credentials,
            {
                ...options,
                data
            }
        );

        return response;
    }

    //#endregion Raw HTTP Methods

    //#region Auth

    /**
     * Exchange an authorization code or a refresh token for a location or
     * agency credentials set.
     *
     * @param data Input data
     */
    async getAndStoreAccessToken(code: string) {
        const body = new URLSearchParams({
            client_id: this.GHL_CLIENT_ID,
            client_secret: this.GHL_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code
        });

        const response = await this.post<IGetAccessTokenResponse>(
            `/oauth/token`,
            undefined,
            body,
            {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                }
            }
        );

        const credentials = await this.credentialsService.upsertCredentials(
            response.data
        );

        return credentials;
    }

    async refreshAccessToken(credentials: IGhlCredentials) {
        const { data } = await this.http.post(
            '/oauth/token',
            {
                client_id: process.env.GHL_APP_CLIENT_ID,
                client_secret: process.env.GHL_APP_CLIENT_SECRET,
                grant_type: 'refresh_token',
                refresh_token: credentials.refreshToken
            },
            {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                }
            }
        );

        const newCredentials =
            await this.credentialsService.upsertCredentials(data);

        return newCredentials;
    }

    /**
     * Generate location-level access tokens
     */
    async getLocationAccessToken(credentials: IGhlCredentials) {
        const formUrlEncoded = new URLSearchParams({
            companyId: credentials.companyId!,
            locationId: credentials.locationId!
        });

        const response = await this.post<IGetAccessTokenResponse>(
            `/oauth/locationToken`,
            credentials,
            formUrlEncoded,
            {
                headers: HEADERS_VERSION_JULY_2021
            }
        );

        return response.data;
    }

    //#endregion Auth
}
