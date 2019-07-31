import { get, post } from '@/utils/request';

export async function query(keyword, page, pageSize) {
    return get(encodeURI(`/api/ganbare/acheron/role?keyword=${keyword}&page=${page}&pageSize=${pageSize}`));
}

export async function add(name) {
    return post('/api/ganbare/acheron/role', { name });
}

export async function remove(id) {
    return post(`/api/ganbare/acheron/role/${id}`, {}, 'DELETE');
}

export async function update(id, data) {
    return post(`/api/ganbare/acheron/role/${id}`, data, 'PUT');
}

export async function exportCfg() {
    return get(`/api/ganbare/acheron/role/export`);
}