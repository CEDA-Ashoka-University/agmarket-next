import axios from "axios";

export const checkUserInList = async ({email}) => {
    var data = JSON.stringify({
        "email": email
    });
    
    var config = {
        method: 'post',
        url: process.env.NEXT_PUBLIC_USER_CHECK,
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };
      
    return await axios(config);
}

export const addUserToList = async ({email, firstname, organization=""}) => {
    var data = JSON.stringify({
        "email": email,
        "firstname": firstname
        // "organization": organization
    });
    var config = {
        method: 'post',
        url: process.env.NEXT_PUBLIC_USER_CREATE,
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };
      
    return await axios(config);
}