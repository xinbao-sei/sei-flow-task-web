import { utils, message } from 'suid';
import { formatMessage } from 'umi-plugin-react/locale';
import {
  getWorkTodoViewTypeList,
  getBatchWorkTodoViewTypeList,
  getBatchNextNodeList,
  submitBatch,
} from './service';

const { pathMatchRegexp, dvaModel } = utils;
const { modelExtend, model } = dvaModel;

const blankViewType = {
  businessModeId: null,
  businessModelName: formatMessage({ id: 'flowtask_000010', defaultMessage: '暂无待办事项' }),
  count: 0,
};

export default modelExtend(model, {
  namespace: 'taskWorkTodo',

  state: {
    viewTypeData: [],
    currentViewType: null,
    batchNextNodes: [],
    showBatchModal: false,
    showFilter: false,
    filterData: {},
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/task/workTodo', location.pathname)) {
          const { currentViewTypeId } = location.query;
          dispatch({
            type: 'getWorkTodoViewTypeList',
            payload: {
              batchApproval: false,
              queryViewTypeId: currentViewTypeId,
            },
          });
        }
      });
    },
  },
  effects: {
    *getWorkTodoViewTypeList({ payload }, { call, put }) {
      const { batchApproval, queryViewTypeId } = payload;
      let re;
      if (batchApproval) {
        re = yield call(getBatchWorkTodoViewTypeList, { batchApproval });
        blankViewType.businessModelName = formatMessage({
          id: 'flowtask_000011',
          defaultMessage: '暂无可批量处理的待办事项',
        });
      } else {
        re = yield call(getWorkTodoViewTypeList);
        blankViewType.businessModelName = formatMessage({
          id: 'flowtask_000010',
          defaultMessage: '暂无待办事项',
        });
      }
      if (re.success) {
        const viewTypeData = [...re.data];
        let count = 0;
        viewTypeData.forEach(m => (count += m.count));
        if (viewTypeData.length > 1) {
          viewTypeData.unshift({
            businessModeId: null,
            businessModelName: formatMessage({
              id: 'flowtask_000012',
              defaultMessage: '全部待办事项',
            }),
            count,
          });
        }
        let currentViewType = viewTypeData.length > 0 ? viewTypeData[0] : blankViewType;
        if (queryViewTypeId && viewTypeData.length > 0) {
          viewTypeData.forEach(v => {
            if (v.businessModeId === queryViewTypeId) {
              currentViewType = v;
            }
          });
        }
        yield put({
          type: 'updateState',
          payload: {
            viewTypeData,
            currentViewType,
          },
        });
      } else {
        message.destroy();
        message.error(re.message);
      }
    },
    *getBatchNextNodeList({ payload }, { call, put }) {
      const re = yield call(getBatchNextNodeList, payload);
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            batchNextNodes: re.data,
            showBatchModal: true,
          },
        });
      } else {
        message.destroy();
        message.error(re.message);
      }
    },
    *submitBatch({ payload, callback }, { call, put }) {
      const re = yield call(submitBatch, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'flowtask_000013', defaultMessage: '处理成功' }));
        yield put({
          type: 'updateState',
          payload: {
            batchNextNodes: [],
            showBatchModal: false,
          },
        });
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
  },
});
