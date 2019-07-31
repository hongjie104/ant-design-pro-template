import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { Message } from 'antd';
import { /* fakeAccountLogin, */ getFakeCaptcha } from '@/services/api';
import { accountLogin } from '@/services/user';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
    namespace: 'login',

    state: {
        status: undefined,
    },

    effects: {
        *login({ payload, callback }, { call, put }) {
            const response = yield call(accountLogin, payload.userName, payload.password);
            yield put({
                type: 'changeLoginStatus',
                payload: response,
            });
            // Login successfully
            if (response.success) {
                localStorage.setItem('id', response.data.id);
                localStorage.setItem('name', response.data.name);
                localStorage.setItem('token', response.data.token);
                reloadAuthorized();
                const urlParams = new URL(window.location.href);
                const params = getPageQuery();
                let { redirect } = params;
                if (redirect) {
                    const redirectUrlParams = new URL(redirect);
                    if (redirectUrlParams.origin === urlParams.origin) {
                        redirect = redirect.substr(urlParams.origin.length);
                        if (redirect.match(/^\/.*#/)) {
                            redirect = redirect.substr(redirect.indexOf('#') + 1);
                        }
                    } else {
                        window.location.href = redirect;
                        return;
                    }
                }
                yield put(routerRedux.replace(redirect || '/'));
            } else {
                Message.error(response.data.msg);
                callback && callback(false);
            }
        },

        *getCaptcha({ payload }, { call }) {
            yield call(getFakeCaptcha, payload);
        },

        *logout(_, { put }) {
            yield put({
                type: 'changeLoginStatus',
                payload: {
                    data: {
                        // status: false,
                        currentAuthority: 'guest',
                    }
                },
            });
            reloadAuthorized();
            localStorage.removeItem('id');
            localStorage.removeItem('name');
            localStorage.removeItem('token');
            yield put(
                routerRedux.push({
                    pathname: '/user/login',
                    search: stringify({
                        redirect: window.location.href,
                    }),
                })
            );
        },
    },

    reducers: {
        changeLoginStatus(state, { payload }) {
            setAuthority(payload.data.currentAuthority);
            return {
                ...state,
                // status: payload.status,
                type: payload.type,
            };
        },
    },
};
