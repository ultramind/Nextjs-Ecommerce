import { atom } from 'recoil';
import { User } from 'types/user';

export const userState = atom({
    key: 'userState',
    default: {} as Partial<User>,
});