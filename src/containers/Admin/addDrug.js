import React, {useEffect} from 'react';
import {Button, Card, CardBody, Col, ModalBody, ModalFooter, ModalHeader,} from 'reactstrap';
import { Form, Input, Select} from "antd";
import axios from "../../shared/axiosConfig";
import useFocus from "../../shared/hooks/use-focus-hook";
import notify from "../../shared/components/notification/notification";


const { Option } = Select;
const { TextArea } = Input;

const addDrug = ({ onClose }) => {

    const [fnameRef, setFnameFocus] = useFocus();
    const [form] = Form.useForm();

    useEffect(() => {
        setFnameFocus();
    }, [])

    const saveDrug = values => {
        const drug = {
            // TODO: Code Refactor
            "brandName": values.brandName,
            "content" : values.content,
            "company" : values.company,
            "code": values.code,
            "generic": values.generic,
            "type": values.type,
        }

        axios.post('createDrug', drug)
            .then(res => {
                form.resetFields();
                onClose(res);
                notify('s', 'Drug has been added successfully.')
            })
    }

    return (
        <>
            <ModalHeader>Add Drug</ModalHeader>
            <ModalBody>
                <Col md={12} lg={12} className="nopadding">
                    <Card>
                        <CardBody>
                            <Form form={form} name="add-drug" onFinish={saveDrug} className="form">
                                <div className="form__half"></div>
                                <div className="form__half mr-4">
                                    <div className="form__form-group">
                                        <span className="form__form-group-label">Brand Name</span>
                                        <div className="form__form-group-field">
                                            <Form.Item
                                                name="brandName"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please input brand name!',
                                                        whitespace: true,
                                                    },
                                                ]}
                                            >
                                                <Input ref={fnameRef}/>
                                            </Form.Item>
                                        </div>
                                        <span className="form__form-group-label">Content</span>
                                        <div className="form__form-group-field">
                                            <Form.Item
                                                name="content"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please input content!',
                                                        whitespace: true,
                                                    },
                                                ]}
                                            >
                                                <TextArea />
                                            </Form.Item>
                                        </div>
                                        <span className="form__form-group-label">Company Name</span>
                                        <div className="form__form-group-field">
                                            <Form.Item
                                                name="company"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please input company name!',
                                                        whitespace: true,
                                                    },
                                                ]}
                                            >

                                                <Input/>
                                            </Form.Item>
                                        </div>
                                    </div>


                                </div>

                                <div className="form__half">

                                    <div className="form__form-group">
                                        <span className="form__form-group-label">Code</span>
                                        <div className="form__form-group-field">
                                            <Form.Item
                                                name="code"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please input code!',
                                                        whitespace: true,
                                                    },
                                                ]}

                                            >
                                                <Input/>
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <div className="form__form-group">
                                        <span className="form__form-group-label">Generic</span>
                                        <div className="form__form-group-field">
                                            <Form.Item name="generic" >
                                                <Input/>
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <div className="form__form-group">
                                        <span className="form__form-group-label">Type</span>
                                        <div className="form__form-group-field">
                                            <Form.Item name="type">
                                            <Select

                                                placeholder="Select a Drug Type"
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                                >
                                                <Option value="syrup">Syrup</Option>
                                                <Option value="tab">Tab</Option>
                                            </Select>
                                            </Form.Item>
                                        </div>
                                    </div>

                                </div>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </ModalBody>
            <ModalFooter>
                <Button form="add-drug" type="submit"  color="primary">
                    OK
                </Button>
                <Button color="secondary"  onClick = {() => onClose(true)}>
                    Cancel
                </Button>
            </ModalFooter>
        </>

    )
}
export default addDrug;
