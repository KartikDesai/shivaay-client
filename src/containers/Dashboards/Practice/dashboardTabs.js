import React, {useEffect, useState} from "react";
import {Nav, NavItem, NavLink, TabContent, TabPane} from 'reactstrap';
import classnames from 'classnames';
import {Form, Input, List} from "antd";
import Medication from "./medications";
import axios from "../../../shared/axiosConfig";
import ChiefComplaint from "./chiefComplaints";
import Remarks from "./remarks";
import Vitals from "./vitals";
import {GujWords} from "../../../translations/resources";
import {connect} from "react-redux";
import VitalsTable from './vitalsTable'
import {getTabletCount, stringFormat, isBlank, isNumeric, getFreqCodeLabel} from "../../../shared/utility";

const dashboardTabs = ({ encId, user, patientId }) => {
    const [followupDays,setFollowupDays] = useState(0   );

    const [activeTab, setActiveTab] = useState(1);
    const [medicationModel, setMedicationModel] = useState(false);
    const [chiefComplaintModel, setChiefComplaintModel] = useState(false);
    const [remarksModel, setRemarksModel] = useState(false);
    const [vitalsModel, setVitalsModel] = useState(false);
    const [medications, setMedications] = useState(false);
    const [chiefComplaints, setChiefComplaints] = useState(false);
    const [remarks, setRemarks] = useState([]);
    const [vitals, setVitals] = useState({});

    const [form] = Form.useForm();
    const [pnSectionAccess, setPnSectionAccess] = useState(false);

    /* this is for force update */
    const [value, setValue] = useState(0); // integer state
    function forceUpdate(){
        setValue(value => value + 1); // update the state to force render
    }
    /* try to avoid this pattern*/

    const getMedications = async (encId) => {
        const res = await axios.get(`medication/get/${encId}` );
        if (res) {
            setMedications(res.data);
        }
    }

    const getChiefComplaints = async (encId) => {
        const res = await axios.get(`chiefComplaint/get/${encId}` );
        if (res) {
            setChiefComplaints(res.data);
        }
    }
    const getRemarks = async (encId) => {
        const res = await axios.get(`/getRemarks/${encId}` );
        if (res) {
            setRemarks(res.data);
        }
    }

    useEffect(() => {
        getMedications(encId);
        getChiefComplaints(encId);
        getRemarks(encId);
    }, [value])

    const toggle = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };

    useEffect(() => {
        // TODO: check performance of number of calling
        // TODO: change the way permission checking happening
        if (!user.userInfo || !user.userInfo.roles || !user.userInfo.roles.length === 0) {
            return;
        }
        if (user.userInfo.roles.find( r => r.name === "DOCTOR")) {
            setPnSectionAccess(true);
        }
    }, [user]);


    const onFollowupBlur = () =>{
        saveFollowupDays(form.getFieldValue("days"))
    }

    const saveFollowupDays = async (days) => {
        if(!isNumeric(days) || days <= 0){
            updateFollowupDayInInput(0);
        }
        const res = await axios.post('saveAdvice', { encId: encId, followupAfter : days });
        if (res && res.data) {
            updateFollowupDayInInput(days);
        }
    }
    const updateFollowupDayInInput = days => {
        setFollowupDays(days);
        form.setFieldsValue({"days": days});
    };

    const getFollowupDaysByEncId = async (encId) => {
        const res = await axios.get(`/getAdvice/${encId}` );
        if (res && res.data) {
            updateFollowupDayInInput(res.data)
        }
    }

    useEffect(()=> {
            getFollowupDaysByEncId(encId);
    },[]);

    const onSubmit = () => {
        closeModalMedications();
        forceUpdate();
    }
    
    const openModalMedications = () => {
        setMedicationModel(true);
    }

    const closeModalMedications = () => {
        setMedicationModel(false);
        forceUpdate();
    }

    const openModalChiefComplaint = () => {
        setChiefComplaintModel(true);
    }

    const closeModalChiefComplaint = () => {
        setChiefComplaintModel(false);
        forceUpdate();
    }

    const openModalRemarks = () => {
        setRemarksModel(true);
    }
    const closeModalRemarks = () => {
        setRemarksModel(false);
        forceUpdate();
    }

    const openModalVitals = () => {
        setVitalsModel(true);
    }
    const closeModalVitals = () => {
        setVitalsModel(false);
        forceUpdate();
    }

    useEffect(() => {
        toggle('medical-summary');     
    }, [])

    const getVitalsByPatientId = async (patientId) => {
        const res = await axios.get(`/getVitals/${patientId}` );
        if (res) {
            setVitals(res.data);
        }
    }

    const vitalClasses = ['patient-dashboard-vitals'];
    if (!vitals || !vitals.capturedVitals || Object.keys(vitals.capturedVitals).length === 0) {
        vitalClasses.push('hide-in-print');
    }

    const chiefComplaintClasses = [];
    if (isBlank(chiefComplaints)) {
        chiefComplaintClasses.push('hide-in-print');
    }

    const medicationsClasses = [];
    if (!medications || medications.length === 0) {
        medicationsClasses.push('hide-in-print');
    }

    const remarksClasses = [];
    if (!remarks || remarks.length === 0) {
        remarksClasses.push('hide-in-print');
    }

    const followupClasses = ['advice-followup-print'];
    if (!followupDays || followupDays <= 0) {
        followupClasses.push('hide-in-print');
    }

    useEffect(() => {
        getVitalsByPatientId(patientId);
    }, []);
    return (
        <div className="tabs tabs--justify tabs--bordered-top">
            <div className="tabs__wrap">
                <Nav tabs className="dashboard-navs">
                    <NavItem>
                        <NavLink
                            className={classnames({active: activeTab === 'medical-summary'})}
                            onClick={() => {
                                toggle('medical-summary');
                            }}
                        >
                            Medical Summary
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({active: activeTab === 'past-visits'})}
                            onClick={() => {
                                toggle('past-visits');
                            }}
                        >
                            Past Visits
                        </NavLink>
                    </NavItem>
                </Nav>
                    <TabContent activeTab={activeTab}>
                        <TabPane tabId='medical-summary' className="p-3 nopadtop">
                            <List className="nopadding">
                                <List.Item className={chiefComplaintClasses.join(' ')}>
                                    <div className="col-sm-12">
                                        <div className="col-sm-12 nopadding section-header">
                                            { pnSectionAccess ?
                                            <div><strong><span onClick={openModalChiefComplaint}>C/O - Diagnosis</span></strong></div>
                                                :<div><strong><span>C/O - Diagnosis</span></strong></div> }
                                            {/*<div>25/02/2021</div>*/}
                                        </div>
                                        <div className="col-sm-12 nopadding ml-2">
                                            { chiefComplaints }
                                        </div>
                                    </div>
                                    { chiefComplaintModel && <ChiefComplaint onClose={closeModalChiefComplaint} onSubmit={onSubmit} encId={ encId }/> }
                                </List.Item>

                                <List.Item className={medicationsClasses.join(' ')}>
                                    <div className="col-sm-12 section-medications">
                                        <div className="col-sm-12 nopadding section-header">
                                            <div><strong>
                                                <i className="fnt16 rx-symbol fas fa-prescription"></i>
                                            { pnSectionAccess ?
                                                <span onClick={openModalMedications}> <span className="medication-label"> Medications</span></span>
                                                : <span> Medications</span> }
                                            </strong></div>
                                            {/*<div>25/02/2021</div>*/}
                                        </div>
                                        <div className="col-sm-12 nopadding ml-2">
                                            { medications && medications.length > 0 ? medications.map((medication, index) => {
                                                return (
                                                    <div className="border-lightest pt-2">
                                                        <div className="col-sm-12 nopadding medications" key={`${index}`}>
                                                            <div><strong>{ index+1 }. </strong></div>
                                                            <div className="brandname bold-text">{  medication.brandName } </div>
                                                            <div className="gj-fnt-14">
                                                                { `${GujWords['freqCodes'][medication.freqCode]} `}
                                                                { medication.freqCode !== "SOS" ? `${ medication.duration } ${GujWords['days']}`: ''}
                                                                <>
                                                                    <span className="freqCodes"
                                                                          dangerouslySetInnerHTML={{ __html:  medication.freqCode !== "SOS" ? `${ getFreqCodeLabel(medication.freqCode)}` : ''  }} />
                                                                </>
                                                            </div>
                                                            <div className="text-right">
                                                                { `(${ getTabletCount(medication.duration, medication.freqCode) })` }
                                                            </div>
                                                        </div>

                                                        { medication && medication.children && medication.children.length > 0 ? medication.children.map((childMedication, cIndex) => {
                                                            return (
                                                                <div className="col-sm-12 nopadding medications" key={`${index}-${cIndex}`}>
                                                                    <div></div>
                                                                    <div></div>
                                                                    <div className="gj-fnt-14">
                                                                        { childMedication.freqCode !== "SOS" ? `${GujWords['afterthat']}`: ''}
                                                                        {` ${GujWords['freqCodes'][childMedication.freqCode]} `}
                                                                        { childMedication.freqCode !== "SOS" ? `${ childMedication.duration } ${GujWords['days']}`: ''}
                                                                        <>
                                                                            <span className="freqCodes"
                                                                            dangerouslySetInnerHTML={{ __html:  childMedication.freqCode !== "SOS" ? `${ getFreqCodeLabel(childMedication.freqCode)}` : ''  }} />
                                                                        </>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        { `(${ getTabletCount(childMedication.duration, childMedication.freqCode) })` }
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                        ): ''}
                                                    </div>)
                                            }): ''}
                                        </div>
                                    </div>
                                    { medicationModel && <Medication onClose={closeModalMedications} onSubmit={onSubmit} encId={ encId }/> }
                                </List.Item>

                                <List.Item className={vitalClasses.join(' ')} >
                                    <div className="col-sm-12">
                                        <div className="col-sm-12 nopadding section-header">
                                            { pnSectionAccess ?
                                                <div><strong><span onClick={openModalVitals}>Vitals</span></strong></div>
                                                :<div><strong><span>Vitals</span></strong></div> }
                                        </div>
                                        <div className="col-sm-12 nopadding ml-2">
                                            { vitals && vitals.capturedVitals && vitals.vitalsDictionary && Object.keys(vitals.capturedVitals).length > 0 &&
                                                <VitalsTable
                                                    capturedVitals={vitals.capturedVitals}
                                                    vitalsDictionary={vitals.vitalsDictionary}
                                                /> }
                                        </div>
                                    </div>
                                    { vitalsModel && <Vitals onClose={closeModalVitals} onSubmit={onSubmit} patientId={ patientId }/> }
                                </List.Item>

                                <List.Item className={remarksClasses.join(' ')}>
                                    <div className="col-sm-12">
                                        <div className="col-sm-12 nopadding section-header">
                                            <div><strong>
                                            { pnSectionAccess ?
                                                <span onClick={openModalRemarks}>Advice</span>
                                                :<span>Advice</span> }
                                            </strong></div>
                                        </div>
                                        <div className="col-sm-12 nopadding ml-2">
                                            <ul>
                                            { remarks && remarks.length > 0 ? remarks.map((remark, i) => {
                                                return (
                                                    <li>
                                                        { remark && remark.trim() !== "" ?
                                                            <div className="col-sm-12 nopadding">
                                                                {remark}
                                                            </div>

                                                            : ''}
                                                    </li>
                                                )
                                            }): ''}
                                            </ul>
                                        </div>
                                    </div>
                                    { remarksModel && <Remarks onClose={closeModalRemarks} onSubmit={onSubmit} encId={ encId }/> }
                                </List.Item>

                                <List.Item>
                                <div className="col-sm-12">
                                    <div className="col-sm-12 nopadleft advice-followup">
                                            <div>Follow up after:</div>
                                            <div>
                                                <Form form={form} name="folloup" onBlur={onFollowupBlur}  >
                                                    <Form.Item name="days"
                                                            rules={[ {
                                                                    pattern: /^(?:\d*)$/,
                                                                    message: "Value should contain just positive number",
                                                                }
                                                            ]}>
                                                        <Input maxLength="2" />
                                                        </Form.Item>
                                                    </Form>
                                            </div>
                                    </div>
                                    <div className={followupClasses.join(' ')}>
                                        {` ${stringFormat(GujWords['followUp'], [followupDays])}` }
                                    </div>
                                </div>
                            </List.Item>
                            </List>
                        </TabPane>
                        <TabPane tabId='past-visits' className="p-3">
                            <p>Coming Soon..
                            </p>
                        </TabPane>
                    </TabContent>
            </div>
        </div>
    );
};
export default connect(state => {
    return {
        user: state.user
    }})(dashboardTabs);