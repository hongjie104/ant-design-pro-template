import { get } from '@/utils/request';

export default async function queryError(code) {
    return get(`/api/${code}`);
}
