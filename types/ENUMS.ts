// types/ENUMS.ts
export enum ROLES {
  SUPERADMIN = 'superadmin', // used in verifyPermissions
  ADMIN = 'admin',
  SUPER_ADMIN = 'Admin',
  COMPANY_ADMIN = 'Company Admin',
  SITE_ADMIN = 'Site Admin',
  SITE_USER = 'Staff User',
  GUEST = 'Guest',
}

export enum APPS {
  PORTAL = 'Portal',
  TRAINING = 'Training',
  POLICIES_AND_PROCEDURES = 'Policies and Procedures',
  INSPECTIONS = 'Inspections',
  CONTRACTORS = 'Contractors',
  HAZARDS = 'Hazards',
  FORMS = 'Forms',
}

export enum CompanyQueryTypes {
  ALL = 'all',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
}

export enum EmailVariableType {
  USER_FIELD = 'user_field',
  COMPANY_FIELD = 'company_field',
  BRANDING_FIELD = 'branding_field',
  SITE_FIELD = 'site_field',
  USER_INPUT = 'user_input',
  RUNTIME_VARIABLE = 'runtime_variable',
}

export enum EmailTemplateType {
  COMPANY_ADMIN_INVITATION = 'company-admin-invite.tsx',
  COMPANY_ADMIN_REMOVAL = 'company-admin-removed.tsx',
  CONTACT_ADMIN = 'contact-admin.tsx',
  PASSWORD_RESET_CODE_EMAIL = 'password-reset-code-email.tsx',
}

export default {
  ROLES,
  CompanyQueryTypes,
  EmailVariableType,
  EmailTemplateType,
};
