import React, {useEffect, useRef, useState} from 'react';
import {
    Row,
    Button,
    Card,
    CardBody,
    Col,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Table
} from 'reactstrap';
import {Form, Input, Select, Spin} from "antd";
import classNames from "classnames";
import axios from '../../../shared/axiosConfig'
import withErrorHandler from "../../../shared/components/withErrorHandler";
import { GujWords } from '../../../translations/resources'
import useFocus from '../../../shared/hooks/use-focus-hook'
import useCtrlEnter from "../../../shared/hooks/ctrl-enter-hook";
import DSelect from "../../../shared/components/form/DSelect";
import notify from "../../../shared/components/notification/notification";

const { Option } = Select;

const Medication = ({ onSubmit, onClose, encId }) => {
    const [modalMedications, setModalMedications] = useState(true);
    const [freqCodes, setFreqCodes] = useState([]);
    const [drugs, setDrugs] = useState([]);
    const [query, setQuery] = useState();
    const [addingDrug, setAddingDrug] = useState(false);
    const [savingMedications, setSavingMedications] = useState(false);
    const [medications, setMedications] = useState([]);
    const [brandNameRef, setBrandNameFocus] = useFocus()
    const [form] = Form.useForm();

    const okRef = useRef(null)
    useCtrlEnter(okRef);

    const validateAndSaveMedication = () => {
        if (!medications || medications.length === 0) {
            onClose();
            return;
        }
        if (medications.findIndex(m => m.deleted || m.medId === 0) > -1) {
            saveMedication();
        } else {
            onClose();
        }
    }

    const saveMedication = async () => {
        setSavingMedications(true);
        const res = await axios.post('medication/save', { encId: encId, medications: medications });
        setSavingMedications(false);
        if (res && res.data) {
            form.resetFields();
            onClose();
        }
    };
    const onReset = () => {
        setAddingDrug(false);
        form.resetFields();
    };

    const modalMedicationsClasses = classNames({
        'appointment-and-registration': true,
        'ltr-support': true,
        'medication': true
    });

    const toggleModalMedications = () => {
        setModalMedications(prevState => !prevState);
    }

    const fetchFreqCodes = async () => {
        const res = await axios.get('/getFrequencyCodes')
        if(res){ setFreqCodes(res.data); }
    }

    const fetchDrugs = async (query) => {
        if (query) {
            const res = await axios.get(`/getDrugs/${query}`);
            if(res){
                if (res.data.length === 0) {
                    res.data.push({"brandName": `${query}`, isNew: true, id: -1 * Math.random() });
                }
                setDrugs(res.data);
            }
        } else {
            setDrugs([]);
        }
    }
    const handleChange = query => {
        setQuery(query);
    };

    useEffect(() => {
        fetchFreqCodes();
    }, [])

    const getMedications = async (encId) => {
        const res = await axios.get(`medication/get/${encId}` );
        if (res && res.data) {
            setMedications(res.data);
        }
    }

    const deleteMedication = (medId, index) => {
        let indexToBeDeleted  = medId === 0 ? index : medications.findIndex(medication => medication.medId === medId);
        const updatedMedications = [...medications];
        if (medId === 0) {
            updatedMedications.splice(index, 1);
        } else {
            updatedMedications[indexToBeDeleted] = {...updatedMedications[indexToBeDeleted], deleted: true };
        }
        setMedications(updatedMedications);
    }

    useEffect(() => {
        getMedications(encId);
    }, [])

    const saveDrug = async (drugName) => {
        const res = await axios.post(`/saveDrug/`, { drugName: drugName });
        if (res) {
            return res.data;
        } else {
            return -1;
        }
    }

    const addMedication = async (medication) => {
        setAddingDrug(true);
        let addedDrugId = -1;
        let isNewDrug = medication.drugId.value < 0 && medication.drugId.label != "";
        let brandName = medication.drugId.label;
        if (isNewDrug) {
            addedDrugId = await saveDrug(brandName);
            medication.drugId = { value: addedDrugId, label: brandName };
        }
        if (isNewDrug && addedDrugId === -1) {
            setAddingDrug(false);
            notify('e', 'Something went wrong while adding new drug.')
            return;
        }

        if (!medication.drugId || !medication.drugId.value || !medication.freqCodeId || !medication.duration) {
            setAddingDrug(false);
            return;
        }
        let freqCode = freqCodes.find(freqCode => freqCode.id === medication.freqCodeId);
        setMedications(medications.concat({
            ...(!isNewDrug ? drugs.find(drug => drug.id === medication.drugId.value): { id: addedDrugId, brandName: brandName}),
            freqCode: freqCode.code,
            freqCodeId: medication.freqCodeId,
            duration: medication.duration,
            medId: 0 // For newly added medication,
        }));
        onReset();
        setBrandNameFocus();
    }

    let medicationTable = "";
    if (medications.length > 0) {
        medicationTable = (
            <Table striped responsive>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Brand Name</th>
                    <th>Frequency</th>
                    <th>Duration</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {medications.filter(medication => !medication['deleted']).map((medication, index) => {
                    return (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{medication.brandName}</td>
                            <td className="gj-fnt-14">{GujWords['freqCodes'][medication.freqCode]}</td>
                            <td>{medication.duration} Days</td>
                            <td>
                                <button onClick={() => deleteMedication(medication.medId, index)}
                                        className="close button-tooltip">
                                    <span className="lnr lnr-trash"/>
                                </button>
                            </td>
                        </tr>
                    )
                })}
                </tbody>
            </Table>
        )
    }

    return (
        <Modal
            backdrop="static"
            keyboard={false}
            isOpen={modalMedications}
            toggle={toggleModalMedications}
            className={modalMedicationsClasses}
        >
            <ModalHeader>Add Medications</ModalHeader>
            <ModalBody>
                <Col md={12} lg={12} className="nopadding">
                    <Card>
                        <CardBody>
                            <Form form={form} name="appointment-registration" onFinish={addMedication}
                                  initialValues={{"sex": "male"}}
                                  className="form">
                                <div className="form__form-group">
                                    <Row>
                                        <Col md={6} lg={6}>
                                            <span className="form__form-group-label">BrandName</span>
                                            <div className="form__form-group-field">
                                                <Form.Item name="drugId">

                                                    <DSelect
                                                        value={query}
                                                        placeholder="Search Drug"
                                                        fetchOptions={fetchDrugs}
                                                        onChange={handleChange}
                                                    >
                                                        {
                                                            drugs.map((drug, index) => {
                                                                return (
                                                                    <Option key={index} value={drug.id}
                                                                            label={drug.brandName}>
                                                                        {drug.brandName}
                                                                    </Option>
                                                                );
                                                            })
                                                        }
                                                    </DSelect>
                                                </Form.Item>
                                            </div>
                                        </Col>
                                        <Col md={3} lg={3}>
                                            <span className="form__form-group-label">Frequency</span>
                                            <div className="form__form-group-field">
                                                <Form.Item name="freqCodeId">
                                                    <Select
                                                        showSearch
                                                        placeholder="Select Frequency"
                                                        optionFilterProp="children"
                                                        filterOption={(input, option) => option.children.replaceAll('-', '').toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                    >
                                                        {
                                                            freqCodes.map((freqCode, index) => {
                                                                return (
                                                                    <Option key={index} value={freqCode.id}
                                                                            label={freqCode.code}>
                                                                        {freqCode.code}
                                                                    </Option>
                                                                );
                                                            })
                                                        }

                                                    </Select>
                                                </Form.Item>
                                            </div>
                                        </Col>
                                        <Col md={2} lg={2}>
                                            <span className="form__form-group-label">Duration (Days)</span>
                                            <div className="form__form-group-field">
                                                <Form.Item name="duration">
                                                    <Input type="Number" maxLength="3" minLength="1"/>
                                                </Form.Item>
                                            </div>
                                        </Col>
                                        <Col md={1} lg={1} className="nopadding">
                                            <button disabled={addingDrug} className="btn btn-xs btn-primary add-button" type="submit">
                                                { addingDrug ? <Spin size="small" /> : 'Add' }
                                            </button>
                                        </Col>
                                    </Row>
                                </div>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
                <Col md={12} lg={12} className="nopadding">
                    <Card>
                        <CardBody>
                            {medicationTable}
                        </CardBody>
                    </Card>
                </Col>
            </ModalBody>
            <ModalFooter>
                <Button disabled={savingMedications} color="primary" form="medication" type="submit" onClick={validateAndSaveMedication}
                        ref={okRef}>
                        { savingMedications ? <Spin size="small" /> : 'OK' }
                </Button>
                <Button color="secondary" onClick={onClose}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>

    );
}
export default withErrorHandler(Medication, axios);
