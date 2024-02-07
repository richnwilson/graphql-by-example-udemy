import { toast } from 'react-toastify'

const common = {
    displayMessage: (level, errorMsg) => {
        let msg = '';
        switch (true) {
            case /.*Firebase.*auth\/too-many-requests.*/.test(errorMsg):
                msg = 'Error 403. Too many authentication requests';
                break;            
            case /.*Firebase.*auth.*/.test(errorMsg):
                msg = 'Error 400. Authentication error';
                break;
            default:
                msg = `${errorMsg} -- Please contact ibmaot@us.ibm.com for help.`
                break;

        }
        return toast[level](msg);
    },
    convertObjtoGraphQLMutation: (obj) => {
        return JSON.stringify(obj).replace(/"([^"]+)":/g, '$1:')
    }    
}

export default common;
