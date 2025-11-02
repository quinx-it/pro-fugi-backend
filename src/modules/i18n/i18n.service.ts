import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import * as i18next from 'i18next';
import { TOptions } from 'i18next';

import { FALLBACK_LNG } from '@/modules/i18n/constants';
import { CookieName } from '@/shared';

@Injectable({ scope: Scope.REQUEST })
export class I18NService {
  constructor(@Inject(REQUEST) private readonly request: Request) {
    const { cookies } = this.request;

    if (CookieName.LANGUAGE in cookies) {
      const language = cookies[CookieName.LANGUAGE];
      i18next.changeLanguage(language);
    } else {
      i18next.changeLanguage(FALLBACK_LNG);
    }
  }

  get(key: string, options?: Record<string, TOptions>): string {
    return i18next.t(key, options) || '';
  }
}
