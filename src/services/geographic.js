import { get } from '@/utils/request';

export async function queryProvince() {
    return get('/api/geographic/province');
}

export async function queryCity(province) {
    return get(`/api/geographic/city/${province}`);
}
