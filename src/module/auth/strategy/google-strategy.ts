import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URL,
      scope: ['email', 'profile'],
    });
  }
  async validate(profile: any, done: VerifyCallback) {
    const { id, name, emails, photos } = profile;
    const user = {
      id,
      email: emails[0].value,
      name: name.givenName,
      avartar: photos[0].value,
    };
    done(null, user);
  }
}
