import React, { PureComponent } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { get, omit, isEqual } from 'lodash';
import { Drawer, Form, Button, Input, Radio } from 'antd';
import { ScrollBar, ScopeDatePicker } from 'suid';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './index.less';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

@Form.create()
class FilterView extends PureComponent {
  static propTypes = {
    showFilter: PropTypes.bool,
    filterData: PropTypes.object,
    onFilterSubmit: PropTypes.func,
    onCloseFilter: PropTypes.func,
    onResetFilter: PropTypes.func,
  };

  static defaultProps = {
    showFilter: false,
  };

  constructor(props) {
    super(props);
    const { filterData } = props;
    this.state = {
      filterData,
    };
  }

  componentDidUpdate(preProps) {
    const { filterData } = this.props;
    if (!isEqual(preProps.filterData, filterData)) {
      this.setState({
        filterData,
      });
    }
  }

  handlerFilter = e => {
    if (e) {
      e.preventDefault();
    }
    const { filterData } = this.state;
    const { form, onFilterSubmit } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      Object.assign(filterData, omit(formData, ['actEndTime']));
      const [startDate, endDate] = formData.actEndTime;
      filterData.startDate = startDate;
      filterData.endDate = endDate;
      onFilterSubmit(filterData);
    });
  };

  handlerReset = () => {
    this.setState({
      filterData: {},
    });
  };

  handlerClose = () => {
    const { onCloseFilter } = this.props;
    if (onCloseFilter) {
      onCloseFilter();
    }
  };

  getFields() {
    const { filterData } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const scopeDatePickerProps = {
      format: 'YYYY-MM-DD',
    };
    return (
      <>
        <FormItem label={formatMessage({ id: 'flowtask_000015', defaultMessage: '单据编号' })}>
          {getFieldDecorator('businessCode', {
            initialValue: get(filterData, 'businessCode', null),
          })(
            <Input
              allowClear
              placeholder={formatMessage({
                id: 'flowtask_000030',
                defaultMessage: '单据编号关键字',
              })}
            />,
          )}
        </FormItem>
        <FormItem label={formatMessage({ id: 'flowtask_000032', defaultMessage: '任务名称' })}>
          {getFieldDecorator('flowTaskName', {
            initialValue: get(filterData, 'flowTaskName', null),
          })(
            <Input
              allowClear
              placeholder={formatMessage({
                id: 'flowtask_000033',
                defaultMessage: '任务名称关键字',
              })}
            />,
          )}
        </FormItem>
        <FormItem label={formatMessage({ id: 'flowtask_000016', defaultMessage: '流程名称' })}>
          {getFieldDecorator('flowName', {
            initialValue: get(filterData, 'flowName', null),
          })(
            <Input
              allowClear
              placeholder={formatMessage({
                id: 'flowtask_000117',
                defaultMessage: '流程名称关键字',
              })}
            />,
          )}
        </FormItem>
        <FormItem label={formatMessage({ id: 'flowtask_000017', defaultMessage: '单据说明' })}>
          {getFieldDecorator('businessModelRemark', {
            initialValue: get(filterData, 'businessModelRemark', null),
          })(
            <Input
              allowClear
              placeholder={formatMessage({
                id: 'flowtask_000031',
                defaultMessage: '单据说明关键字',
              })}
            />,
          )}
        </FormItem>
        <FormItem label={formatMessage({ id: 'flowtask_000118', defaultMessage: '任务类型' })}>
          {getFieldDecorator('taskStatus', {
            initialValue: get(filterData, 'taskStatus', 'ALL'),
          })(
            <Radio.Group>
              <Radio.Button value="ALL">全部</Radio.Button>
              <Radio.Button value="VIRTUAL">虚拟</Radio.Button>
              <Radio.Button value="NOVIRTUAL">非虚拟</Radio.Button>
            </Radio.Group>,
          )}
        </FormItem>
        <FormItem label={formatMessage({ id: 'flowtask_000049', defaultMessage: '办理时间' })}>
          {getFieldDecorator('actEndTime', {
            initialValue: [get(filterData, 'startDate'), get(filterData, 'endDate')],
          })(<ScopeDatePicker {...scopeDatePickerProps} />)}
        </FormItem>
      </>
    );
  }

  render() {
    const { showFilter } = this.props;
    return (
      <Drawer
        width={320}
        destroyOnClose
        getContainer={false}
        placement="right"
        visible={showFilter}
        title={formatMessage({ id: 'flowtask_000027', defaultMessage: '过滤' })}
        className={cls(styles['filter-box'])}
        onClose={this.handlerClose}
        style={{ position: 'absolute' }}
      >
        <ScrollBar>
          <div className={cls('content')}>
            <Form {...formItemLayout} layout="vertical">
              {this.getFields()}
            </Form>
          </div>
        </ScrollBar>
        <div className="footer">
          <Button onClick={this.handlerReset}>
            {formatMessage({ id: 'flowtask_000034', defaultMessage: '重置' })}
          </Button>
          <Button type="primary" onClick={e => this.handlerFilter(e)}>
            {formatMessage({ id: 'flowtask_000035', defaultMessage: '确定' })}
          </Button>
        </div>
      </Drawer>
    );
  }
}

export default FilterView;
