import {
    query,
    add,
    remove,
    update,
    show,
    exportCfg,
} from '@/services/acheron/furniture';
import fileDownload from 'react-file-download';

export default {
    namespace: 'acheronFurniture',

    state: {
        loading: false,
        listData: {
            list: [],
            pagination: {
                total: 0,
                current: 0,
            },
        },
        detail: null,
    },

    effects: {
        *fetch({ payload }, { call, put }) {
            const { page, pageSize, name } = payload || {};
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(query, name, page, pageSize);
            if (response.success) {
                yield put({
                    type: 'setList',
                    payload: response.data,
                });
            }
        },
        *add({ payload: { name }, callback }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(add, name);
            if (response.success) {
                yield put({
                    type: 'addToList',
                    payload: response.data.data,
                });
                callback && callback(true);
            } else {
                yield put({
                    type: 'changeLoading',
                    payload: false,
                });
                callback && callback(false, response.data);
            }
        },
        *delete({ payload: { id }, callback }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(remove, id);
            if (response.success) {
                yield put({
                    type: 'removeFromList',
                    payload: id,
                });
                callback && callback();
            }
        },
        *update({ payload, callback }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            yield call(update, payload.id, payload);
            yield put({
                type: 'setData',
                payload,
            });
            callback && callback();
        },
        *detail({ payload, callback }, { call, put }) {
            const response = yield call(show, payload.id);
            if (response.success) {
                yield put({
                    type: 'setDetail',
                    payload: response.data.data,
                });
                callback && callback(true);
            } else {
                callback && callback(false);
            }
        },
        *clearDetail(_, { put }) {
            yield put({
                type: 'setDetail',
                payload: null,
            });
        },
        *export(_, { call }) {
            const response = yield call(exportCfg);
            if (response.success) {
                fileDownload(response.data, 'furniture.json');
            }
        },
    },

    reducers: {
        setList(state, action) {
            return {
                ...state,
                listData: action.payload,
                loading: false,
            };
        },
        addToList(state, { payload }) {
            const list = [payload, ...state.listData.list];
            return {
                ...state,
                listData: {
                    list,
                    pagination: state.listData.pagination,
                },
                loading: false,
            };
        },
        removeFromList(state, { payload }) {
            const list = [...state.listData.list];
            for (let index = 0; index < list.length; index += 1) {
                if (list[index]._id === payload) {
                    list.splice(index, 1);
                    break;
                }
            }
            return {
                ...state,
                listData: {
                    list,
                    pagination: state.listData.pagination,
                },
                loading: false,
            };
        },
        changeLoading(state, { payload }) {
            return {
                ...state,
                loading: !!payload,
            };
        },
        setData(state, { payload }) {
            const list = [...state.listData.list];
            for (let index = 0; index < list.length; index += 1) {
                if (list[index]._id === payload.id) {
                    list[index] = {
                        ...list[index],
                        ...payload,
                    };
                    delete list[index].id;
                    break;
                }
            }
            return {
                ...state,
                listData: {
                    ...state.listData,
                    list,
                },
                loading: false,
            };
        },
        setDetail(state, { payload }) {
            return {
                ...state,
                detail: payload,
            };
        },
    },
};