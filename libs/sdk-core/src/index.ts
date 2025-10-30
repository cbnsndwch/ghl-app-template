// Main client
export { HighLevel } from './HighLevel.js';

// Types and interfaces
export type {
    HighLevelConfig,
    TokenProvider,
    ValidConfig,
    RequestInterceptor,
    ResponseInterceptor
} from './types.js';

// Error classes
export { GHLError } from './errors.js';

// Constants
export { UserType, type UserTypeValue } from './constants/index.js';

// Logging
export {
    Logger,
    LogLevel,
    type LogLevelType,
    type LogLevelString
} from './logging/index.js';

// Individual resource exports for tree-shaking
export { Associations } from './resources/associations/associations.js';
export { Blogs } from './resources/blogs/blogs.js';
export { Businesses } from './resources/businesses/businesses.js';
export { Calendars } from './resources/calendars/calendars.js';
export { Campaigns } from './resources/campaigns/campaigns.js';
export { Companies } from './resources/companies/companies.js';
export { Contacts } from './resources/contacts/contacts.js';
export { Conversations } from './resources/conversations/conversations.js';
export { Courses } from './resources/courses/courses.js';
export { CustomFields } from './resources/custom-fields/custom-fields.js';
export { CustomMenus } from './resources/custom-menus/custom-menus.js';
export { EmailIsv } from './resources/email-isv/email-isv.js';
export { Emails } from './resources/emails/emails.js';
export { Forms } from './resources/forms/forms.js';
export { Funnels } from './resources/funnels/funnels.js';
export { Invoices } from './resources/invoices/invoices.js';
export { Links } from './resources/links/links.js';
export { Locations } from './resources/locations/locations.js';
export { Marketplace } from './resources/marketplace/marketplace.js';
export { Medias } from './resources/medias/medias.js';
export { Oauth } from './resources/oauth/oauth.js';
export { Objects } from './resources/objects/objects.js';
export { Opportunities } from './resources/opportunities/opportunities.js';
export { Payments } from './resources/payments/payments.js';
export { PhoneSystem } from './resources/phone-system/phone-system.js';
export { Products } from './resources/products/products.js';
export { Proposals } from './resources/proposals/proposals.js';
export { SaasApi } from './resources/saas-api/saas-api.js';
export { Snapshots } from './resources/snapshots/snapshots.js';
export { SocialMediaPosting } from './resources/social-media-posting/social-media-posting.js';
export { Store } from './resources/store/store.js';
export { Surveys } from './resources/surveys/surveys.js';
export { Users } from './resources/users/users.js';
export { VoiceAi } from './resources/voice-ai/voice-ai.js';
export { Workflows } from './resources/workflows/workflows.js';

// Default export
export { HighLevel as default } from './HighLevel.js';
