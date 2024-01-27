import { atom } from 'recoil';

interface verifyOtpProps {
	type: string;
	email: string;
	otp?: string;
}
export const verifyOtpState = atom({
	key: 'verifyOtpState',
	default: {} as verifyOtpProps,
});
