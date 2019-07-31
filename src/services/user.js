import { get, post } from '@/utils/request';

export async function query() {
    return get('/api/users');
}

export async function queryCurrent() {
    return get('/api/ganbare/user/currentUser');
}

export async function accountLogin(name, password) {
    return post('/api/ganbare/user/login', {
        name,
        password,
    });
}
