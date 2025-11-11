import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { SignUpRequestDto } from '../../auth/dto/auth.dto';
import { User } from '../entity/user.entity';
import { PutUserInfoBodyDto } from '../dto/user.dto';
import { SsoProvider, UserPayload } from 'src/module/auth/type/auth.type';
import { NotFoundError, SignupFailedError } from '@common/error';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserById(id: string) {
    return this.userRepository.findOneById(id);
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findOneByEmail(email);
  }

  async getUserByProviderAndProviderId(
    provider: SsoProvider,
    providerId: string,
  ) {
    return this.userRepository.findOneByProviderAndProviderId(
      provider,
      providerId,
    );
  }

  async createUser(signUpRequest: SignUpRequestDto) {
    if (await this.userRepository.findOneByEmail(signUpRequest.email)) {
      throw new SignupFailedError();
    }

    return this.userRepository.save(User.of(signUpRequest));
  }

  async updateUserInfo({ id }: UserPayload, body: PutUserInfoBodyDto) {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new NotFoundError();
    }

    await this.userRepository.save(user.update(body));
  }
}
