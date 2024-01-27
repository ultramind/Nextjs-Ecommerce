import { atom } from 'recoil';

export interface FilterStateProps {
    minPrice: number,
    maxPrice: number,
    brand: string,
    type: string,
    color: string,
}

export const FilterState = atom({
    key: 'filterState',
    default: {} as Partial<FilterStateProps>,
});