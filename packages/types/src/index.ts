export type Role = 'admin' | 'teacher' | 'staff';

export interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: string;
}
