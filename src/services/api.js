import { stringify } from 'qs';
import { get, post } from '@/utils/request';

export async function queryProjectNotice() {
    return get('/api/project/notice');
}

export async function queryActivities() {
    return get('/api/activities');
}

export async function queryRule(params) {
    return get(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
    return post('/api/rule', {
        method: 'POST',
        body: {
            ...params,
            method: 'delete',
        },
    });
}

export async function addRule(params) {
    return post('/api/rule', {
        method: 'POST',
        body: {
            ...params,
            method: 'post',
        },
    });
}

export async function updateRule(params = {}) {
    return post(`/api/rule?${stringify(params.query)}`, {
        method: 'POST',
        body: {
            ...params.body,
            method: 'update',
        },
    });
}

export async function fakeSubmitForm(params) {
    return post('/api/forms', {
        method: 'POST',
        body: params,
    });
}

export async function fakeChartData() {
    return get('/api/fake_chart_data');
}

export async function queryTags() {
    return get('/api/tags');
}

export async function queryBasicProfile(id) {
    return get(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
    return get('/api/profile/advanced');
}

export async function queryFakeList(params) {
    return get(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
    const { count = 5, ...restParams } = params;
    return post(`/api/fake_list?count=${count}`, {
        method: 'POST',
        body: {
            ...restParams,
            method: 'delete',
        },
    });
}

export async function addFakeList(params) {
    const { count = 5, ...restParams } = params;
    return post(`/api/fake_list?count=${count}`, {
        method: 'POST',
        body: {
            ...restParams,
            method: 'post',
        },
    });
}

export async function updateFakeList(params) {
    const { count = 5, ...restParams } = params;
    return post(`/api/fake_list?count=${count}`, {
        method: 'POST',
        body: {
            ...restParams,
            method: 'update',
        },
    });
}

export async function fakeAccountLogin(params) {
    return post('/api/login/account', {
        method: 'POST',
        body: params,
    });
}

export async function fakeRegister(params) {
    return post('/api/register', {
        method: 'POST',
        body: params,
    });
}

export async function queryNotices(params = {}) {
    return get(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
    return get(`/api/captcha?mobile=${mobile}`);
}
