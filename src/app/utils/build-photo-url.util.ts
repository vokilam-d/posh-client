import { environment } from '../../environments/environment';

export const buildPhotoUrl = (photoUrl: string): string => `${environment.uploadedHost}${photoUrl}`;
