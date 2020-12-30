import React, { useState } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import styled from 'styled-components';
import TWzipcode from 'react-twzipcode';
import QRCode from 'react-qr-code';

const FormItem = Form.Item;

const flex = {
  display: 'flex',
  justifyContent: 'center',
  padding: '5em 2em',
};

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
};

function QRcode({ form }) {
  const [county, setCounty] = useState('台北市');
  const [district, setDistrict] = useState('中正區');
  const [zipcode, setZipcode] = useState('100');

  const [QRcodeValue, setQRcodeValue] = useState();

  const { validateFields, getFieldDecorator } = form;

  const handleSubmit = () => {
    validateFields((err, values) => {
      if (err) {
        return;
      }

      const param = {
        name: values.name,
        ic: values.ic,
        addr: {
          county: values.county,
          district: values.district,
          village: values.village,
          address: values.address,
        },
      };

      setQRcodeValue(param);
    });
  };

  return (
    <Flex>
      {QRcodeValue ? (
        <div style={flex}>
          <QRCode value={JSON.stringify(QRcodeValue)} />
        </div>
      ) : (
        <Form layout="vertical" hideRequiredMark>
          <FormItem label="Name">
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: 'this field is required',
                },
              ],
            })(<Input placeholder="Name" />)}
          </FormItem>
          <FormItem label="Passport Number">
            {getFieldDecorator('ic', {
              rules: [
                {
                  required: true,
                  message: 'this field is required',
                },
              ],
            })(<Input placeholder="Passport Number" />)}
          </FormItem>
          <FormItem label="Address">
            <Row gutter={16}>
              <Col span={12}>
                <FormItem label="" colon={false}>
                  {getFieldDecorator('county')(<Input placeholder="County" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="" colon={false}>
                  {getFieldDecorator('district')(<Input placeholder="District" />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="" colon={false}>
                  {getFieldDecorator('village')(<Input placeholder="Village" />)}
                </FormItem>
              </Col>
              <Col span={18}>
                <FormItem label="" colon={false}>
                  {getFieldDecorator('address', {
                    rules: [
                      {
                        required: true,
                        message: 'this field is required',
                      },
                    ],
                  })(<Input placeholder="address" />)}
                </FormItem>
              </Col>
            </Row>
          </FormItem>

          <Button type="primary" block onClick={handleSubmit}>
            Send
          </Button>
        </Form>
      )}
    </Flex>
  );
}

const Flex = styled.div`
  background-color: rgb(121, 171, 229, 0.5);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 0.375rem 0.75rem;

  .form-control {
    display: inline-block;
    width: auto;
    vertical-align: middle;
    height: 34px;

    font-size: 14px;
    padding: 6px 12px;
    line-height: 1.42857143;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }

  .county-sel,
  .district-sel,
  .zipcode {
    display: inline-block;
    margin-right: 5px;
  }

  @media only screen and (max-width: 420px) {
    .county-sel,
    .district-sel {
      display: inline-block;
      margin-right: 5px;
      width: 47%;
    }
    .zipcode {
      display: block;
      width: 47%;
      margin-top: 5px;
    }
  }

  .ant-form-item {
    margin-bottom: 10px;
  }
`;

export default Form.create()(QRcode);
