import axios from 'axios';
import Cookies from 'js-cookie';

import BackendUrls from '@api/urls';
import config from '@utils/config';

export const configOptions = () => {
    if (typeof window === 'undefined') return {};

    if (!Cookies.get(config.key.token)) return {};

    const accessToken = Cookies.get(config.key.token);

    if (!!accessToken) {
        return {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };
    }
    return {}
};

export const instance = axios.create({
    baseURL: BackendUrls.baseURl,
    // validateStatus: function (status) {
    //     return status !== 401
    // }
});
