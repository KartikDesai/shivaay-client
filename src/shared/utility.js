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

export const stringFormat = (str, arr) => {
    return arr.length > 1
        ? stringFormat(str.replace('{}', arr[0]), arr.slice(1))
        : (arr[0] && str.replace('{}', arr[0])) || str
}

export const getTabletCount = (duration, freqCode) => {
    let splittedFreqCode = freqCode.split("-");
    let oneDayRequirement = splittedFreqCode.reduce((a, b) => isNumeric(b)? Number(a) + Number(b) : Number(a) , 0);
    return isNumeric(duration) ? Math.ceil( oneDayRequirement * duration ) : -1 ;
};

export const isNumeric = (str) => {
    if(typeof str == "number") return true;
    if (typeof str != "string") return false // we only process strings!
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

/* string is blank, null or undefined */
export const isBlank = (str) => {
    return (!str || /^\s*$/.test(str) || str.length === 0 || !str.trim());
}