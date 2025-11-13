import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import axios from 'axios';
import * as crypto from 'crypto';
import { Request } from 'express';
import { SsoProvider, SsoUserPayload } from '../type/auth.type';

@Injectable()
export class XStrategy extends PassportStrategy(Strategy, 'x') {
  constructor() {
    super();
  }

  async validate(req: Request): Promise<any> {
    const { code, state, name, redirect, failedRedirect } = req.query;

    // 1) 로그인 초기 요청
    if (!code) {
      const codeVerifier = crypto.randomBytes(32).toString('base64');

      const state = { codeVerifier, name, redirect, failedRedirect };

      const authorizeUrl = new URL('https://twitter.com/i/oauth2/authorize');
      authorizeUrl.searchParams.set('response_type', 'code');
      authorizeUrl.searchParams.set('client_id', process.env.X_CLIENT_ID);
      authorizeUrl.searchParams.set('redirect_uri', process.env.X_REDIRECT_URI);
      authorizeUrl.searchParams.set(
        'scope',
        'tweet.read users.read offline.access',
      );
      authorizeUrl.searchParams.set(
        'state',
        encodeURIComponent(JSON.stringify(state)),
      );
      authorizeUrl.searchParams.set('code_challenge', codeVerifier);
      authorizeUrl.searchParams.set('code_challenge_method', 'plain');

      return { redirect: authorizeUrl.toString() };
    }

    // 2) Callback 요청 → state 검증
    const decoded: { codeVerifier: string; name?: string; redirect: string } =
      JSON.parse(decodeURIComponent(state as string));
    const codeVerifier = decoded.codeVerifier;

    // 3) Token 교환
    const tokenRes = await axios.post(
      'https://api.x.com/2/oauth2/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.X_CLIENT_ID,
        redirect_uri: process.env.X_REDIRECT_URI,
        code: code as string,
        code_verifier: codeVerifier,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    const { access_token } = tokenRes.data;

    // 4) 사용자 정보 조회
    const profileRes = await axios.get(
      'https://api.x.com/2/users/me?user.fields=id,name,profile_image_url',
      { headers: { Authorization: `Bearer ${access_token}` } },
    );

    const profile = profileRes.data.data;

    return {
      provider: SsoProvider.X,
      id: profile.id,
      name: profile.name,
      avatar: profile.profile_image_url,
      email: profile.email ?? '',
    } as SsoUserPayload;
  }
}
