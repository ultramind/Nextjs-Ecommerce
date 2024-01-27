import { atom } from 'recoil';

interface AuthStateProps {
    isLoggedIn: boolean;
    emailVerified?: boolean;
    userLoggedOut?: boolean;
}

export const AuthState = atom({
    key: 'authState',
    default: { isLoggedIn: false, userLoggedOut: false, emailVerified: false } as AuthStateProps
});