import { atom } from 'recoil';
import { Business } from 'types/seller';

export const sellerBusinessState = atom({
    key: 'sellerBusinessState',
    default: null as Partial<Business | null>,
});