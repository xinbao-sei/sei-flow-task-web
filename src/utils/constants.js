/*
 * @Author: Eason
 * @Date: 2020-02-21 18:03:16
 * @Last Modified by: Eason
 * @Last Modified time: 2021-12-27 16:10:58
 */
import { formatMessage } from 'umi-plugin-react/locale';
import { base } from '../../public/app.config.json';

/** 服务接口基地址，默认是当前站点的域名地址 */
const BASE_DOMAIN = '/';

/** 网关地址 */
const GATEWAY = 'api-gateway';

/**
 * 非生产环境下是使用mocker开发，还是与真实后台开发或联调
 * 注：
 *    yarn start 使用真实后台开发或联调
 *    yarn start:mock 使用mocker数据模拟
 */
const getServerPath = () => {
  if (process.env.NODE_ENV !== 'production') {
    if (process.env.MOCK === 'yes') {
      return '/mocker.api';
    }
    return '/api-gateway';
  }
  return `${BASE_DOMAIN}${GATEWAY}`;
};

/** 项目的站点基地址 */
const APP_BASE = base;

/** 站点的地址，用于获取本站点的静态资源如json文件，xls数据导入模板等等 */
const LOCAL_PATH = process.env.NODE_ENV !== 'production' ? '..' : `../${APP_BASE}`;

const SERVER_PATH = getServerPath();

const LOGIN_STATUS = {
  SUCCESS: 'success',
  MULTI_TENANT: 'multiTenant',
  CAPTCHA_ERROR: 'captchaError',
  FROZEN: 'frozen',
  LOCKED: 'locked',
  FAILURE: 'failure',
};

/** 业务模块功能项示例 */
const APP_MODULE_BTN_KEY = {
  CREATE: `${APP_BASE}_CREATE`,
  EDIT: `${APP_BASE}_EDIT`,
  DELETE: `${APP_BASE}_DELETE`,
};

/** 工作事项操作枚举 */
const TASK_WORK_ACTION = {
  TODO: 'todo',
  VIEW_ORDER: 'View_Order',
  FLOW_HISTORY: 'Flow_History',
  FLOW_REVOKE: 'Flow_Revoke',
  FLOW_END: 'Flow_End',
  FLOW_URGE: 'Flow_Urge',
};

/** 流程状态枚举 */
const FLOW_STATUS = {
  COMPLETED: 'COMPLETED',
  IN_APPROVAL: 'IN_APPROVAL',
  ABORT: 'ABORT',
};

const PRIORITY = {
  '1': {
    lang: { id: 'flowtask_000000', defaultMessage: '驳回' },
    color: 'magenta',
  },
  '2': {
    lang: { id: 'flowtask_000001', defaultMessage: '撤回' },
    color: 'volcano',
  },
  '3': {
    lang: { id: 'flowtask_000002', defaultMessage: '加急' },
    color: 'red',
  },
  '4': {
    lang: { id: 'flowtask_0000020', defaultMessage: '标注' },
    color: 'blue',
  },
};
const WARNINGSTATUS = {
  normal: {
    title: formatMessage({ id: 'flowtask_000003', defaultMessage: '正常' }),
    lang: { id: 'flowtask_000003', defaultMessage: '正常' },
    color: 'green',
  },
  warning: {
    lang: { id: 'flowtask_000004', defaultMessage: '预警' },
    color: 'volcano',
  },
  timeout: {
    lang: { id: 'flowtask_000005', defaultMessage: '超时' },
    color: 'red',
  },
};

export default {
  APP_BASE,
  LOCAL_PATH,
  SERVER_PATH,
  APP_MODULE_BTN_KEY,
  LOGIN_STATUS,
  TASK_WORK_ACTION,
  FLOW_STATUS,
  PRIORITY,
  WARNINGSTATUS,
};
