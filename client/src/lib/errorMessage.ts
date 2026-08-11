import axios from 'axios';
import type { TFunction } from 'i18next';

export function getApiErrorMessage(error: unknown, t: TFunction): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    if (status === 409) {
      return t('errors.conflict');
    }
    if (status === 404) {
      return t('errors.notFound');
    }
  }

  return t('errors.generic');
}
