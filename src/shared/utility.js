import moment from "moment";

export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

export const getTimeInClientTimeZone = date => {
    if(!date){
        return "INVALID_DATETIME";
    }
    const convertedDateTime = moment(new Date(`${date} UTC`));
    return convertedDateTime.isValid() ? convertedDateTime.format('DD/MM/YYYY') : "INVALID_DATETIME";
}