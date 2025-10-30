import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    AxiosError,
    InternalAxiosRequestConfig
} from 'axios';

import { Associations } from './resources/associations/associations.js';
import { Blogs } from './resources/blogs/blogs.js';
import { Businesses } from './resources/businesses/businesses.js';
import { Calendars } from './resources/calendars/calendars.js';
import { Campaigns } from './resources/campaigns/campaigns.js';
import { Companies } from './resources/companies/companies.js';
import { Contacts } from './resources/contacts/contacts.js';
import { Conversations } from './resources/conversations/conversations.js';
import { Courses } from './resources/courses/courses.js';
import { CustomFields } from './resources/custom-fields/custom-fields.js';
import { CustomMenus } from './resources/custom-menus/custom-menus.js';
import { EmailIsv } from './resources/email-isv/email-isv.js';
import { Emails } from './resources/emails/emails.js';
import { Forms } from './resources/forms/forms.js';
import { Funnels } from './resources/funnels/funnels.js';
import { Invoices } from './resources/invoices/invoices.js';
import { Links } from './resources/links/links.js';
import { Locations } from './resources/locations/locations.js';
import { Marketplace } from './resources/marketplace/marketplace.js';
import { Medias } from './resources/medias/medias.js';
import { Oauth } from './resources/oauth/oauth.js';
import { Objects } from './resources/objects/objects.js';
import { Opportunities } from './resources/opportunities/opportunities.js';
import { Payments } from './resources/payments/payments.js';
import { PhoneSystem } from './resources/phone-system/phone-system.js';
import { Products } from './resources/products/products.js';
import { Proposals } from './resources/proposals/proposals.js';
import { SaasApi } from './resources/saas-api/saas-api.js';
import { Snapshots } from './resources/snapshots/snapshots.js';
import { SocialMediaPosting } from './resources/social-media-posting/social-media-posting.js';
import { Store } from './resources/store/store.js';
import { Surveys } from './resources/surveys/surveys.js';
import { Users } from './resources/users/users.js';
import { VoiceAi } from './resources/voice-ai/voice-ai.js';
import { Workflows } from './resources/workflows/workflows.js';
import { Logger, LogLevelType } from './logging/index.js';
import {
    TokenProvider,
    HighLevelConfig,
    ValidConfig,
    RequestInterceptor,
    ResponseInterceptor
} from './types.js';
import { GHLError } from './errors.js';

// Extend AxiosRequestConfig to support retry tracking and security requirements
declare module 'axios' {
    interface AxiosRequestConfig {
        __isRetryRequest?: boolean;
        __securityRequirements?: string[];
        __preferredTokenType?: 'company' | 'location';
    }
}

/** HighLevel SDK Core Client */
export class HighLevel {
    private static readonly BASE_URL = 'https://services.leadconnectorhq.com';

    private config: Required<
        Omit<
            HighLevelConfig,
            | 'privateIntegrationToken'
            | 'agencyAccessToken'
            | 'locationAccessToken'
            | 'clientId'
            | 'clientSecret'
            | 'tokenProvider'
            | 'logLevel'
        >
    > & {
        privateIntegrationToken?: string;
        agencyAccessToken?: string;
        locationAccessToken?: string;
        clientId?: string;
        clientSecret?: string;
        tokenProvider?: TokenProvider;
        logLevel: LogLevelType;
    };

    private httpClient: AxiosInstance;
    private logger: Logger;

    // Service instances
    public associations!: Associations;
    public blogs!: Blogs;
    public businesses!: Businesses;
    public calendars!: Calendars;
    public campaigns!: Campaigns;
    public companies!: Companies;
    public contacts!: Contacts;
    public conversations!: Conversations;
    public courses!: Courses;
    public customFields!: CustomFields;
    public customMenus!: CustomMenus;
    public emailIsv!: EmailIsv;
    public emails!: Emails;
    public forms!: Forms;
    public funnels!: Funnels;
    public invoices!: Invoices;
    public links!: Links;
    public locations!: Locations;
    public marketplace!: Marketplace;
    public medias!: Medias;
    public oauth!: Oauth;
    public objects!: Objects;
    public opportunities!: Opportunities;
    public payments!: Payments;
    public phoneSystem!: PhoneSystem;
    public products!: Products;
    public proposals!: Proposals;
    public saasApi!: SaasApi;
    public snapshots!: Snapshots;
    public socialMediaPosting!: SocialMediaPosting;
    public store!: Store;
    public surveys!: Surveys;
    public users!: Users;
    public voiceAi!: VoiceAi;
    public workflows!: Workflows;

    constructor(config: ValidConfig) {
        // Validate configuration
        if (
            !config.privateIntegrationToken &&
            (!config.clientId || !config.clientSecret)
        ) {
            throw new GHLError(
                'Invalid configuration: Either provide privateIntegrationToken OR both clientId and clientSecret are required.'
            );
        }

        // Initialize logger FIRST
        this.logger = new Logger(config.logLevel || 'warn', 'GHL SDK Core');

        // Set default configuration
        this.config = {
            apiVersion: config.apiVersion || '2021-07-28',
            privateIntegrationToken: config.privateIntegrationToken,
            agencyAccessToken: config.agencyAccessToken,
            locationAccessToken: config.locationAccessToken,
            clientId: config.clientId,
            clientSecret: config.clientSecret,
            tokenProvider: config.tokenProvider,
            logLevel: config.logLevel || 'warn'
        };

        // Create HTTP client with base configuration
        this.httpClient = axios.create({
            baseURL: HighLevel.BASE_URL,
            timeout: 30000, // 30 seconds timeout
            headers: this.getDefaultHeaders()
        });

        // Inject reference to HighLevel instance for token selection
        (this.httpClient as any).__ghlInstance = this;

        // Setup default interceptors
        this.setupDefaultInterceptors();

        // Initialize services
        this.initializeServices();

        this.logger.info('HighLevel SDK Core initialized');
    }

    /**
     * Generate default headers for HTTP requests
     */
    private getDefaultHeaders(): Record<string, string> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            Version: this.config.apiVersion
        };

        // Priority 1: privateIntegrationToken (with Bearer prefix)
        if (this.config.privateIntegrationToken) {
            headers['Authorization'] =
                `Bearer ${this.config.privateIntegrationToken}`;
        }
        // Priority 2: agencyAccessToken (with Bearer prefix) - temporary token
        else if (this.config.agencyAccessToken) {
            headers['Authorization'] =
                `Bearer ${this.config.agencyAccessToken}`;
        }
        // Priority 3: locationAccessToken (with Bearer prefix) - temporary token
        else if (this.config.locationAccessToken) {
            headers['Authorization'] =
                `Bearer ${this.config.locationAccessToken}`;
        }
        // Priority 4: No default token - will be resolved per request with resourceId

        return headers;
    }

    /**
     * Get appropriate token for API requests
     * @param resourceId - Optional resourceId (companyId or locationId) for token provider lookup
     * @param preferredType - Preferred token type (company or location)
     * @returns Authorization header value or null
     */
    public async getAuthToken(
        resourceId?: string,
        preferredType?: 'company' | 'location'
    ): Promise<string | null> {
        // Priority 1: privateIntegrationToken
        if (this.config.privateIntegrationToken) {
            return `Bearer ${this.config.privateIntegrationToken}`;
        }

        // Priority 2: agencyAccessToken (temporary)
        if (this.config.agencyAccessToken) {
            return `Bearer ${this.config.agencyAccessToken}`;
        }

        // Priority 3: locationAccessToken (temporary)
        if (this.config.locationAccessToken) {
            return `Bearer ${this.config.locationAccessToken}`;
        }

        // Priority 4: Token provider based token (requires resourceId)
        if (resourceId && this.config.tokenProvider) {
            try {
                const type = preferredType || 'location';
                const token = await this.config.tokenProvider.getToken(
                    type,
                    resourceId
                );
                if (token) {
                    return `Bearer ${token}`;
                }
            } catch (error) {
                this.logger.warn(
                    `Failed to get token from provider for ${resourceId}:`,
                    error
                );
            }
        }

        return null;
    }

    /**
     * Setup default interceptors for authentication, logging, and error handling
     */
    private setupDefaultInterceptors(): void {
        // Request interceptor for authentication
        this.httpClient.interceptors.request.use(
            async (config: InternalAxiosRequestConfig) => {
                // Extract resourceId from request params or data
                const resourceId = this.extractResourceId(config);
                const preferredType = config.__preferredTokenType;

                // Try to get auth token
                const authToken = await this.getAuthToken(
                    resourceId,
                    preferredType
                );

                if (authToken) {
                    config.headers['Authorization'] = authToken;
                }

                this.logger.debug(
                    `${config.method?.toUpperCase()} ${config.url}`
                );
                return config;
            },
            (error: any) => {
                this.logger.error('Request interceptor error:', error);
                return Promise.reject(error);
            }
        );

        // Response interceptor for logging and error handling
        this.httpClient.interceptors.response.use(
            (response: AxiosResponse) => {
                this.logger.debug(
                    `Response ${response.status} from ${response.config.url}`
                );
                return response;
            },
            async (error: AxiosError) => {
                return this.handleResponseError(error);
            }
        );
    }

    /**
     * Extract resourceId from request configuration
     */
    private extractResourceId(config: AxiosRequestConfig): string | undefined {
        // Check params
        if (config.params) {
            if (config.params.locationId) return config.params.locationId;
            if (config.params.companyId) return config.params.companyId;
        }

        // Check data
        if (config.data) {
            if (config.data.locationId) return config.data.locationId;
            if (config.data.companyId) return config.data.companyId;
        }

        return undefined;
    }

    /**
     * Handle response errors with proper logging and retries
     */
    private async handleResponseError(error: AxiosError): Promise<any> {
        let ghlError: GHLError;

        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const statusCode = error.response.status;
            const errorMessage = this.extractErrorMessage(
                error.response.data,
                statusCode
            );

            ghlError = new GHLError(
                errorMessage,
                statusCode,
                error.response.data,
                error.config
            );

            // Handle rate limiting
            if (statusCode === 429) {
                const retryAfter = error.response.headers['retry-after'];
                this.logger.warn(`Rate limited. Retry after: ${retryAfter}`);
            }

            // Handle authentication errors
            if (statusCode === 401) {
                this.logger.error(
                    'Authentication failed. Check your credentials.'
                );
            }
        } else if (error.request) {
            // The request was made but no response was received
            ghlError = new GHLError(
                'Network error: No response received from server',
                undefined,
                undefined,
                error.config
            );
        } else {
            // Something happened in setting up the request
            ghlError = new GHLError(
                `Request setup error: ${error.message}`,
                undefined,
                undefined,
                error.config
            );
        }

        this.logger.error('Error:', ghlError);
        return Promise.reject(ghlError);
    }

    /**
     * Extract meaningful error message from API response
     */
    private extractErrorMessage(data: any, statusCode: number): string {
        if (typeof data === 'string') {
            return data;
        }

        if (data && typeof data === 'object') {
            // Try different common error message fields
            if (data.message) {
                return Array.isArray(data.message)
                    ? data.message.join(', ')
                    : data.message;
            }
            if (data.error) {
                return typeof data.error === 'string'
                    ? data.error
                    : JSON.stringify(data.error);
            }
            if (data.detail) {
                return data.detail;
            }
        }

        // Fallback to HTTP status messages
        const statusMessages: Record<number, string> = {
            400: 'Bad Request - Invalid request parameters',
            401: 'Unauthorized - Invalid or missing access token',
            403: 'Forbidden - Insufficient permissions',
            404: 'Not Found - Resource does not exist',
            422: 'Unprocessable Entity - Validation error',
            429: 'Too Many Requests - Rate limit exceeded',
            500: 'Internal Server Error',
            502: 'Bad Gateway',
            503: 'Service Unavailable',
            504: 'Gateway Timeout'
        };

        return statusMessages[statusCode] || `HTTP Error ${statusCode}`;
    }

    /**
     * Initialize all service instances with the shared HTTP client
     */
    private initializeServices(): void {
        this.associations = new Associations(this.httpClient);
        this.blogs = new Blogs(this.httpClient);
        this.businesses = new Businesses(this.httpClient);
        this.calendars = new Calendars(this.httpClient);
        this.campaigns = new Campaigns(this.httpClient);
        this.companies = new Companies(this.httpClient);
        this.contacts = new Contacts(this.httpClient);
        this.conversations = new Conversations(this.httpClient);
        this.courses = new Courses(this.httpClient);
        this.customFields = new CustomFields(this.httpClient);
        this.customMenus = new CustomMenus(this.httpClient);
        this.emailIsv = new EmailIsv(this.httpClient);
        this.emails = new Emails(this.httpClient);
        this.forms = new Forms(this.httpClient);
        this.funnels = new Funnels(this.httpClient);
        this.invoices = new Invoices(this.httpClient);
        this.links = new Links(this.httpClient);
        this.locations = new Locations(this.httpClient);
        this.marketplace = new Marketplace(this.httpClient);
        this.medias = new Medias(this.httpClient);
        this.oauth = new Oauth(this.httpClient, {
            baseUrl: HighLevel.BASE_URL
        });
        this.objects = new Objects(this.httpClient);
        this.opportunities = new Opportunities(this.httpClient);
        this.payments = new Payments(this.httpClient);
        this.phoneSystem = new PhoneSystem(this.httpClient);
        this.products = new Products(this.httpClient);
        this.proposals = new Proposals(this.httpClient);
        this.saasApi = new SaasApi(this.httpClient);
        this.snapshots = new Snapshots(this.httpClient);
        this.socialMediaPosting = new SocialMediaPosting(this.httpClient);
        this.store = new Store(this.httpClient);
        this.surveys = new Surveys(this.httpClient);
        this.users = new Users(this.httpClient);
        this.voiceAi = new VoiceAi(this.httpClient);
        this.workflows = new Workflows(this.httpClient);
    }

    /**
     * Add custom request interceptor
     */
    public addRequestInterceptor(interceptor: RequestInterceptor): number {
        return this.httpClient.interceptors.request.use(
            interceptor.onFulfilled,
            interceptor.onRejected
        );
    }

    /**
     * Add custom response interceptor
     */
    public addResponseInterceptor(interceptor: ResponseInterceptor): number {
        return this.httpClient.interceptors.response.use(
            interceptor.onFulfilled,
            interceptor.onRejected
        );
    }

    /**
     * Remove request interceptor
     */
    public removeRequestInterceptor(id: number): void {
        this.httpClient.interceptors.request.eject(id);
    }

    /**
     * Remove response interceptor
     */
    public removeResponseInterceptor(id: number): void {
        this.httpClient.interceptors.response.eject(id);
    }

    /**
     * Get the HTTP client instance (for advanced usage)
     */
    public getHttpClient(): AxiosInstance {
        return this.httpClient;
    }

    /**
     * Get the logger instance
     */
    public getLogger(): Logger {
        return this.logger;
    }

    /**
     * Set log level
     */
    public setLogLevel(level: LogLevelType): void {
        this.config.logLevel = level;
        this.logger.setLevel(level);
    }
}
