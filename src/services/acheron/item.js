import { get, post } from '@/utils/request';

export async function query(keyword, page, pageSize) {
    return get(encodeURI(`/api/ganbare/acheron/item?keyword=${keyword}&page=${page}&pageSize=${pageSize}`));
}

export async function add(name) {
    return post('/api/ganbare/acheron/item', { name });
}

export async function remove(id) {
    return post(`/api/ganbare/acheron/item/${id}`, {}, 'DELETE');
}

export async function update(id, data) {
    return post(`/api/ganbare/acheron/item/${id}`, data, 'PUT');
}

export async function exportCfg() {
    return get(`/api/ganbare/acheron/item/export`);
}