import { get, post } from '@/utils/request';

export async function query() {
    return get('/api/users');
}

export async function queryCurrent() {
    return get('/api/admin/user/currentUser');
}

export async function accountLogin(name, password) {
    return post('/api/admin/user/login', {
        name,
        password,
    });
}
