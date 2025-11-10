export interface UserPayload {
  id: string;
  name: string;
  email: string;
}

export interface GoogleUserPayload {
  id: string;
  name: string;
  email: string;
  avartar: string;
}

export interface ExternalKeyPayload {
  key: string;
  groupId: string;
}

export interface AdminUserPayload {
  sub: string;
  name: string;
  email: string;
  iat: number;
  exp: number;
}

export enum AuthRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  USER = 'user',
}

export enum AuthType {
  USER = 'user',
  ADMIN = 'admin',
  REFRESH = 'refresh',
  ADMIN_REFRESH = 'admin-refresh',
  API_KEY = 'api-key',
}

export const getJwtAccessSecret = () => {
  return process.env.JWT_SECRET || 'development';
};

export const getJwtRefreshSecret = () => {
  return process.env.JWT_REFRESH_SECRET || 'refresh-development';
};

export const getJwtAccessExpiration = (): number => {
  return Number(process.env.JWT_EXPIRATION || 60 * 60 * 24);
};

export const getJwtRefreshExpiration = (): number => {
  return Number(process.env.JWT_REFRESH_EXPIRATION || 60 * 60 * 24 * 7);
};
