import React from 'react';
import {getTimeInClientTimeZone} from "../../../shared/utility";
import {Table} from "reactstrap";
const vitalsTable = ({capturedVitals, vitalsDictionary}) => {
    const getVitalValue = (date, vitalIdToMatch) => {
        const foundVital = capturedVitals[date].find( v => vitalIdToMatch == v.vitalid)
        return foundVital && foundVital.value ? foundVital.value : ''
    }
    return (
        <Table striped responsive bordered>
            <thead>
            <tr>
                <th>Vital</th>
                {capturedVitals && Object.keys(capturedVitals).map((date, i) => <th
                    key={i}>{getTimeInClientTimeZone(date)}</th>)}
            </tr>
            </thead>
            <tbody>
            {vitalsDictionary && vitalsDictionary.map(vital => {
                return (
                    <tr>
                        <td><strong>{vital.displayname}</strong></td>
                        {capturedVitals && Object.keys(capturedVitals).map((date, i) => {
                            return (
                                <td key={i}>{getVitalValue(date, vital.id)}</td>
                            )
                        })}
                    </tr>
                )
            })}
            </tbody>
        </Table>
    )
}
export default vitalsTable;