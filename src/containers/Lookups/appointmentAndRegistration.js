import React, {useEffect,  useState} from 'react';
import {Button, Card, CardBody, Col, ModalBody, ModalFooter, ModalHeader,} from 'reactstrap';
import { Form, Input, Radio, Select} from "antd";
import DSelect from "../../shared/components/form/DSelect";
import axios from "../../shared/axiosConfig";


const { Option } = Select;

const AppointmentAndRegistration = ({ modelClose, chiefComplaints, doctors}) => {
    const [searchPatientQuery, setSearchPatientQuery] = useState();
    const [patients, setPatients] = useState([]);
    const [initialValue] = useState({"sex": "M"});
    const [appointmentForm] = Form.useForm();
    const [savingAppointment, setSavingAppointment] = useState(false);

    const fetchPatients = async (query) => {
        if (query) {
            const res = await axios.get(`/getPatients/${query}`);
            if(res){ setPatients(res.data); }
        } else {
            setPatients([]);
        }
    }

    const createEnc = async values => {
        setSavingAppointment(true);
        const encData = {
            "encData": {
                "chiefcomplaints": values.chiefcomplaint && values.chiefcomplaint.length > 0 ? values.chiefcomplaint.join('\n') : '',
                "doctorId": values.concerneddoctor,
                "refby": values.refby

            },
            "patient": {
                "id": values.id && values.id > 0 ? values.id : -1,
                "fname": values.fname,
                "lname": values.lname,
                "age": values.age,
                "sex": values.sex === "M" ? "M" : "F",
                "phone": values.phone,
                "address": values.address1
            }
        }

        const res = await axios.post('createEncounter', encData);
        setSavingAppointment(false);
        if (res) {
            modelClose();
        }
    }

    const handleChange = query => {
        setSearchPatientQuery(query);
    };

    const populatePatientDetail = (patient) => {
        console.log("patient: " + patient.value); // id
        let patientIndex = patients.findIndex(p => p.id === patient.value);
        let selectedPatient = patientIndex > -1 ? patients[patientIndex] : null;
        if (selectedPatient != null) {
            appointmentForm.setFieldsValue(selectedPatient);
        }
    }

    useEffect(() => {
        // setFnameFocus();
    }, [])

    return (
        <>
            <ModalHeader>Create Appointment</ModalHeader>
            <ModalBody>
                <Col md={12} lg={12} className="nopadding">
                <Card>
                    <CardBody>
                        <Form form={appointmentForm} name="appointment-registration" onFinish={createEnc} initialValues={initialValue}
                              className="form">
                            <div className="form__half mr-4">
                                <Form.Item name="id">
                                    <DSelect
                                        showArrow={false}
                                        value={searchPatientQuery}
                                        placeholder="Search Existing Patient"
                                        fetchOptions={fetchPatients}
                                        onChange={handleChange}
                                        onSelect={populatePatientDetail}
                                        allowClear
                                        notFoundContent="No Patient Found!"
                                        onClear={ () => appointmentForm.resetFields() }
                                    >
                                        {
                                            patients.map((patient, index) => {
                                                return (
                                                    <Option key={index} value={patient.id}
                                                            label={patient.fname}>
                                                        {patient.fname}
                                                    </Option>
                                                );
                                            })
                                        }
                                    </DSelect>
                                </Form.Item>
                                <div className="form__form-group">
                                    <span className="form__form-group-label">First Name</span>
                                    <div className="form__form-group-field">
                                        <Form.Item
                                            name="fname"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input first name!',
                                                    whitespace: true,
                                                },
                                            ]}
                                        >
                                            <Input/>
                                        </Form.Item>
                                    </div>
                                </div>
                                <div className="form__form-group">
                                    <span className="form__form-group-label">Middle Name</span>
                                    <div className="form__form-group-field">
                                        <Form.Item
                                            name="mname"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input middle name!',
                                                    whitespace: true,
                                                },
                                            ]}
                                        >
                                            <Input/>
                                        </Form.Item>
                                    </div>
                                </div>
                                <div className="form__form-group">
                                    <span className="form__form-group-label">Surname</span>
                                    <div className="form__form-group-field">
                                        <Form.Item
                                            name="lname"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input surname!',
                                                    whitespace: true,
                                                },
                                            ]}
                                        >
                                            <Input/>
                                        </Form.Item>
                                    </div>
                                </div>
                                {/*<div className="form__form-group">
                                    <span className="form__form-group-label">Date of Birth</span>
                                    <div className="form__form-group-field">
                                        <Form.Item name="dob" {...config}>
                                            <DatePicker format="DD/MM/YYYY"/>
                                        </Form.Item>
                                    </div>
                                </div>*/}
                                <div className="form__form-group">
                                    <span className="form__form-group-label">Age</span>
                                    <div className="form__form-group-field">
                                        <Form.Item name="age"
                                                   rules={[
                                                       {
                                                           pattern: /^(?:\d*)$/,
                                                           message: "Value should contain just positive number",

                                                       }
                                                   ]}
                                        >
                                            <Input type="Number" maxLength="3" minLength="1"/>
                                        </Form.Item>
                                    </div>
                                </div>
                                <div className="form__form-group">
                                    <span className="form__form-group-label">Phone Number</span>
                                    <div className="form__form-group-field">
                                        <Form.Item name="phone"
                                                   rules={[
                                                       {
                                                           pattern: /^(?:\d*)$/,
                                                           message: "Value should contain just positive number",

                                                       }
                                                   ]}
                                        >
                                            <Input maxLength = "10" minLength="10"/>
                                        </Form.Item>
                                    </div>
                                </div>
                            </div>

                            <div className="form__half">
                                <div className="form__form-group">
                                    <div className="form__form-group-field">
                                        <Form.Item name="sex">
                                            <Radio.Group>
                                                <Radio value="M">Male</Radio>
                                                <Radio value="F">Female</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                    </div>
                                </div>
                                <div className="form__form-group">
                                    <span className="form__form-group-label">Chief Complaints</span>
                                    <div className="form__form-group-field">
                                        <Form.Item name="chiefcomplaint">
                                            <Select
                                                mode="multiple"
                                                style={{width: '100%'}}
                                                placeholder="Select Chief Complaint"
                                                optionLabelProp="label"
                                            >
                                                {chiefComplaints.map((chiefComplaint, index) => {
                                                    return (
                                                        <Option key={index} value={chiefComplaint.name} label={chiefComplaint.name}>
                                                            <div className="demo-option-label-item">
                                                                { chiefComplaint.name }
                                                            </div>
                                                        </Option>
                                                    )
                                                } )}
                                            </Select>
                                        </Form.Item>
                                    </div>
                                </div>
    
                                <div className="form__form-group">
                                    <span className="form__form-group-label">Doctor</span>
                                    <div className="form__form-group-field">
                                        <Form.Item name="concerneddoctor"
                                                   rules={[
                                                       {
                                                           required: true,
                                                           message: 'Please input doctor!',
                                                       },
                                                   ]}

                                        >
                                            <Select
                                                showSearch
                                                placeholder="Select a Doctor"
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                { doctors.map((doctor, index) => <Option key={index} value={doctor.id}>{`Dr. ${doctor.fname}, ${doctor.lname}`}</Option>)}
                                            </Select>
                                        </Form.Item>
                                    </div>
                                </div>
    
                                <div className="form__form-group">
                                    <span className="form__form-group-label">Ref. By</span>
                                    <div className="form__form-group-field">
                                        <Form.Item name="refby" >
                                            <Input/>
                                        </Form.Item>
                                    </div>
                                </div>
    
                                <div className="form__form-group">
                                    <span className="form__form-group-label">Address</span>
                                    <div className="form__form-group-field">
                                        <Form.Item name="address1" >
                                            <Input/>
                                        </Form.Item>
                                    </div>
                                </div>
                                <Form.Item name="patientId" >
                                    <Input type="hidden"/>
                                </Form.Item>
                            </div>
                        </Form>
                    </CardBody>
                </Card>
            </Col>
            </ModalBody>
            <ModalFooter>
                <Button form="appointment-registration" type="submit"  color="primary" disabled={savingAppointment}>
                    OK
                </Button>
                <Button color="secondary"  onClick = {modelClose}>
                    Cancel
                </Button>
            </ModalFooter>
        </>
        
    )
}
export default AppointmentAndRegistration;
