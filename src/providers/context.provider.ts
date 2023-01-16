import { UserEntity } from '@/features/user/entities/user.entity';
import { getValue, setValue } from 'express-ctx';

export class ContextProvider {
  private static readonly nameSpace = 'request';

  private static readonly authUserKey = 'user_key';

  private static get<T>(key: string): T | undefined {
    return getValue<T>(ContextProvider.getKeyWithNamespace(key));
  }

  private static set(key: string, value: any): void {
    setValue(ContextProvider.getKeyWithNamespace(key), value);
  }

  private static getKeyWithNamespace(key: string): string {
    return `${ContextProvider.nameSpace}.${key}`;
  }

  static setAuthUser(user: UserEntity): void {
    ContextProvider.set(ContextProvider.authUserKey, user);
  }

  // static getAuthUser(): UserEntity | undefined {
  //   return ContextProvider.get<UserEntity>(ContextProvider.authUserKey);
  // }
}
