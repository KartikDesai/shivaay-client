import { notification } from 'antd';
const notify = (type, message) => {
    let notificationType = "info";
    let defaultMessage;
    switch (type) {
        case "s" || "S":
            notificationType = "success"
            defaultMessage = "Successful."
            break;
        case "i" || "I":
            notificationType = "info"
            defaultMessage = "Information."
            break;
        case "w" || "W":
            notificationType = "warning"
            defaultMessage = "Attention!"
            break;
        case "e" || "E":
            notificationType = "error"
            defaultMessage = "Error!"
            break;

    }
    defaultMessage = message && message.trim() !== "" ? message : defaultMessage;
    notification[notificationType]({
        message: 'Notification',
        description: defaultMessage,
    });
};

export default notify;