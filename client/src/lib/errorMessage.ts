import axios from 'axios';
import type { TFunction } from 'i18next';

export function getApiErrorMessage(error: unknown, t: TFunction): string {
  if (axios.isAxiosError(error)) {
    const code = error.response?.data?.code;
    if (code === 'OVERLAP') {
      return t('errors.reservationOverlap');
    }
    if (code === 'DUPLICATE') {
      return t('errors.conflict');
    }
    if (code === 'NOT_FOUND') {
      return t('errors.notFound');
    }
  }

  return t('errors.generic');
}
