export enum AuthLoadingType {
  REGISTRATION = "registration",
  LOGIN = "login",
  GOOGLE = "google",
}

export enum ResponseStatusType {
  SUCCESS = "success",
  ERROR = "error",
}

export enum SpinnerColor {
  WHITE = "#ffffff",
  BLUE = "#2186e8",
}

export enum SpinnerSize {
  SMALL = "small",
  LARGE = "large",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export enum IdentificationType {
  NID = "NID",
  PASSPORT = "PASSPORT",
  DRIVING_LICENSE = "DRIVING_LICENSE",
  SOCIAL_SECURITY = "SOCIAL_SECURITY",
}

export enum IdentificationAndCertificateID {
  IDENTIFICATION_IMAGES = "identificationImages",
  EDUCATIONAL_CERTIFICATE = "educationalCertificate",
  EXPERIENCE_CERTIFICATE = "experienceCertificate",
  SKILL_CERTIFICATE = "skillCertificate",
  TRADE_LICENSE_CERTIFICATE = "tradeLicenseCertificate",
}

export enum CertificateType {
  EDUCATIONAL = "EDUCATIONAL",
  EXPERIENCE = "EXPERIENCE",
  SKILL = "SKILL",
}

export enum AccountReviewStatus {
  IN_PROGRESS = "IN_PROGRESS",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum NotificationType {
  ALL = "all",
  READ = "read",
  UNREAD = "unread",
}

export enum SortOrderType {
  ASC = "asc",
  DESC = "desc",
}

export enum AvatarType {
  USER = "USER",
  BUSINESS = "BUSINESS",
}

export interface ISelectOption {
  value: string;
  label: string;
}

export enum DocumentStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  DRAFT = "DRAFT",
}

export enum ContractStatus {
  DRAFT = "DRAFT",
  BIDDING = "BIDDING",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PAID = "PAID",
  INTERESTED = "INTERESTED",
  NOT_INTERESTED = "NOT_INTERESTED",
  RECRUITED = "RECRUITED",
  WORK_IN_PROGRESS = "WORK_IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export enum CheckoutStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PAID = "PAID",
}

export enum CommissionType {
  DOCUMENT_COMMISSION = "DOCUMENT_COMMISSION",
  SERVICE_COMMISSION = "SERVICE_COMMISSION",
  VAT = "VAT",
  PAY_AS_YOU_GO_PRICE_PER_CREDIT = "PAY_AS_YOU_GO_PRICE_PER_CREDIT",
  PAY_AS_YOU_GO_DEFAULT_CREDIT_SLIDER_VALUE = "PAY_AS_YOU_GO_DEFAULT_CREDIT_SLIDER_VALUE",
  PAY_AS_YOU_GO_CREDIT_VALIDITY_PERIOD = "PAY_AS_YOU_GO_CREDIT_VALIDITY_PERIOD",
  PAY_AS_YOU_GO_ENABLE_OR_DISABLE = "PAY_AS_YOU_GO_ENABLE_OR_DISABLE",
  PAY_AS_YOU_GO_MIN_CREDIT = "PAY_AS_YOU_GO_MIN_CREDIT",
  PAY_AS_YOU_GO_MAX_CREDIT = "PAY_AS_YOU_GO_MAX_CREDIT",
}

// ✅ Fully fixed — this enum had the syntax error before
export enum ServiceStatus {
  DRAFT = "DRAFT",
  BIDDING = "BIDDING",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PAID = "PAID",
}
