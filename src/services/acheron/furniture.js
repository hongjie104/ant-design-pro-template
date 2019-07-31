import { get, post } from '@/utils/request';

export async function query(keyword, page, pageSize) {
    return get(encodeURI(`/api/ganbare/acheron/furniture?keyword=${keyword}&page=${page}&pageSize=${pageSize}`));
}

export async function add(name) {
    return post('/api/ganbare/acheron/furniture', { name });
}

export async function remove(id) {
    return post(`/api/ganbare/acheron/furniture/${id}`, {}, 'DELETE');
}

export async function update(id, data) {
    return post(`/api/ganbare/acheron/furniture/${id}`, data, 'PUT');
}

export async function show(id) {
    return get(`/api/ganbare/acheron/furniture/${id}`);
}

export async function exportCfg() {
    return get(`/api/ganbare/acheron/furniture/export`);
}