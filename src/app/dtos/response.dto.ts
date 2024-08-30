export class ResponseDto<T = unknown> {
  status: 'success' | 'error';

  data?: T;

  error?: {
    code: number;
    message: string;
    data: unknown;
    timestampIso: string;
    method: string;
    path: string;
    referer: string;
  };

  pagination?: {
    page: number;
    limit: number;
  }
}
