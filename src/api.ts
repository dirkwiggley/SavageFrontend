import axios from "axios";
import CONFIG from "./config";
import { UserInterface } from "./types";
import { CampaignInterface } from "./components/EditCampaign";
import { DocumentListInterface, DocumentInterface } from "./components/TextEditor/EditDocMetaData";
// import { refreshTokenIsString } from "./components/AuthStore";

const axiosJWT = axios.create();

// axiosJWT.interceptors.request.use(
//   async (config) => {
//     let currentDate = new Date();
//     const aT: any = localStorage.getItem("accessToken");
//     const accessToken: string = ((aT !== null) ? aT : "");
//     const rT: any = localStorage.getItem("refreshToken");
//     const refreshToken = ((rT !== null) ? rT : "");
//     const decodedToken: any = jwt_decode(accessToken);
//     if (decodedToken.exp * 1000 < currentDate.getTime()) {
//       const data = await refreshToken(refreshToken);
//       localStorage.setItem("accessToken", data.accessToken);
//       localStorage.setItem("refreshToken", data.refreshToken);
//       if (config && config.headers) {
//         config.headers["authorization"] = "Bearer " + data.accessToken;
//       }
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export async function authHelper<T>(fn: () => Promise<T>): Promise<void | T> {

const SUCCESS: string = "SUCCESS";
const FAIL: string = "FAIL";

export async function authHelper(fn: () => any) {
  try {
    return await fn();
  } catch (error: any) {
    if (error.response.status === 401) {
      await API.refreshToken();
      return fn().catch(async (error: any) => {
        console.error(error);
        throw error;
      });
    }
  }
}

export interface RoleType {
  id: number;
  name: string;
}

export const isRole = (arg: any): arg is RoleType => {
  return (
    arg &&
    arg.id &&
    typeof arg.id === "number" &&
    arg.name &&
    typeof arg.name === "string"
  );
};

export const isUserInterface = (arg: any): arg is UserInterface => {
  return (
    arg &&
    arg.id &&
    typeof arg.id === "number" &&
    arg.login &&
    typeof arg.login === "string"
  );
};

export default class API {
  static accessToken = null;

  static loginApi = (login: String, pwd: String) => {
    return new Promise(function (resolve, reject) {
      axios
        .post(
          `${CONFIG.baseDbURL}/auth/`,
          { login: login, password: pwd },
          { withCredentials: true }
        )
        .then((response) => {
          if (response.data.error) {
            reject(response.data.error);
          } else {
            const user = { ...response.data };
            const roles = JSON.parse(user.roles);
            user.roles = roles;
            API.accessToken = user.accessToken;
            delete user.accessToken;
            resolve(user);
          }
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  };

  static logoutApi = (userId: number | undefined) => {
    if (!userId) return;
    API.accessToken = null;
    return new Promise(function (resolve, reject) {
      axios.delete(`${CONFIG.baseDbURL}/auth/logout/${userId}`).catch((err) => {
        console.error(err);
      });
    });
  };

  static refreshToken = async () => {
    const params = { accessToken: API.accessToken };
    return await axios.post(`${CONFIG.baseDbURL}/auth/refresh/`, params);
  };

  static getUsers = async () => {
    const response = await axios.get(`${CONFIG.baseDbURL}/users/`, {
      withCredentials: true,
    });
    if (!response.data.error) {
      return response?.data?.users;
    }
  };

  static getUser = async (userId: number) => {
    const response = await axios.get(`${CONFIG.baseDbURL}/users/id/${userId}`, {
      withCredentials: true,
    });
    if (!response?.data.error) {
      const user = response.data.user;
      const roles = JSON.parse(user.roles);
      user.roles = roles;
      return response.data.user;
    }
  };

  static getRoles = async () => {
    const response = await axios.get(`${CONFIG.baseDbURL}/roles/`, {
      withCredentials: true,
    });
    if (!response?.data.error) {
      return response?.data?.roles;
    }
  };

  static updateUser = async (userInfo: any) => {
    const response = await axios.post(
      `${CONFIG.baseDbURL}/users/update/`,
      { userInfo: userInfo },
      { withCredentials: true }
    );
    if (response.status === 204) {
      return SUCCESS;
    } else {
      return FAIL;
    }
  };

  static resetPassword = async (userId: string, newPassword: string) => {
    const userInfo = { id: userId, password: newPassword };
    const response = await axios.post(
      `${CONFIG.baseDbURL}/auth/resetpassword/`, userInfo, {
        withCredentials: true,
      });
      if (response.status === 204) {
        return SUCCESS;
      } else {
        return FAIL;
      }
  };

  static getTableData = async (tableName: string) => {
    const response = await axios.get(
      `${CONFIG.baseDbURL}/dbutils/tabledata/${tableName}`,
      {
        withCredentials: true,
      }
    );
    if (!response?.data.error) {
      return response.data;
    }
  };

  static getTables = async () => {
    const response = await axios.get(`${CONFIG.baseDbURL}/dbutils/tables`, {
      withCredentials: true,
    });
    if (!response?.data?.error) {
      return response.data;
    }
  };

  static updateElement = (
    tableName: string,
    id: string,
    column: string,
    value: string
  ) => {
    return axios.get(
      `${CONFIG.baseDbURL}/dbutils/updateelement/${tableName}/${id}/${column}/${value}`,
      { withCredentials: true }
    );
  };

  // const url = URL_PREFIX + `/createtable/${tableName}/${columnName}`;
  static createNewTable = (tableName: string, columnName: string) => {
    return axios.get(
      `${CONFIG.baseDbURL}/dbutils/createtable/${tableName}/${columnName}`,
      { withCredentials: true }
    );
  };

  // const url = URL_PREFIX + `/droptable/${tableName}`;
  static dropTable = (tableName: string) => {
    return axios.delete(`${CONFIG.baseDbURL}/dbutils/droptable/${tableName}`, {
      withCredentials: true,
    });
  };

  // const url = URL_PREFIX + `/rename/table/${oldTableName}/${newTableName}`;
  static renTable = (oldTableName: string, newTableName: string) => {
    return axios.get(
      `${CONFIG.baseDbURL}/dbutils/rename/table/${oldTableName}/${newTableName}`,
      { withCredentials: true }
    );
  };

  // const url = URL_PREFIX + `/createcolumn/${tableName}/${columnName}`;
  static createCol = (
    tableName: string,
    columnName: string,
    dataType: string
  ) => {
    return axios.get(
      `${CONFIG.baseDbURL}/dbutils/createcolumn/${tableName}/${columnName}/${dataType}`,
      { withCredentials: true }
    );
  };

  // const url = URL_PREFIX + `/rename/${tableName}/column/${oldColumnName}/${newColumnName}`;
  static renameCol = (
    tableName: string,
    oldColumnName: string,
    newColumnName: string
  ) => {
    return axios.get(
      `${CONFIG.baseDbURL}/dbutils/rename/${tableName}/column/${oldColumnName}/${newColumnName}`,
      { withCredentials: true }
    );
  };

  // const url = URL_PREFIX + `/insertrow/${currentSelection.tableName}`;
  static createNewRow = (tableName: string) => {
    return axios.get(`${CONFIG.baseDbURL}/dbutils/insertrow/${tableName}`, {
      withCredentials: true,
    });
  };

  // const url = URL_PREFIX + '/deleterow/:table/:id'
  static deleteRow = (tableName: string, rowId: string) => {
    return axios.delete(
      `${CONFIG.baseDbURL}/dbutils/deleterow/${tableName}/${rowId}`,
      {
        withCredentials: true,
      }
    );
  };

  //const url = URL_PREFIX + `/dropcolumn/${currentSelection.tableName}/${columnName}`;
  static dropCol = (tableName: string, columnName: string) => {
    return axios.delete(
      `${CONFIG.baseDbURL}/dbutils/dropcolumn/${tableName}/${columnName}`,
      { withCredentials: true }
    );
  };

  static getCampaignById = async (campaignId: number) => {
    return await axios.get(
      `${CONFIG.baseDbURL}/campaigns/id/${campaignId}`,
      { withCredentials: true }
    );
  }

  static getCampaignByName = async (campaignName: string) => {
    return await axios.get(
      `${CONFIG.baseDbURL}/campaigns/name/${campaignName}`,
      { withCredentials: true }
    );
  }

  static isCampaignInterface = (obj:any) : obj is CampaignInterface => {
    if (typeof obj.id === "number" &&
        typeof obj.name === "string" &&
        typeof obj.ownerid === "number" &&
        typeof obj.ownernickname === "string" &&
        typeof obj.hindrances === "number" && 
        typeof obj.attributes === "number" && 
        typeof obj.skills === "number")
          return true;
    else
      return false;
  }

  static isCampaignArray(obj: any): obj is Array<CampaignInterface> {
    if (obj && Array.isArray(obj) && (obj.length === 0 || API.isCampaignInterface(obj[0])))
      return true;
    return false;
  }

  static isDocumentInterface = (obj:any) : obj is DocumentInterface => {
    if (typeof obj.id === "number" &&
        typeof obj.ownerid === "number" &&
        typeof obj.campaignid === "number" &&
        typeof obj.title === "string")
          return true;
    else
      return false;
  }

  static isDocumentList(obj: any): obj is Array<DocumentListInterface> {
    if (obj && Array.isArray(obj) && (obj.length === 0 || API.isDocumentInterface(obj[0])))
      return true;
    return false;
  }

  static getCampaigns = async () => {
    try {
      const response = await axios.get(`${CONFIG.baseDbURL}/campaigns/`,
       { withCredentials: true }
      );
      if (!response?.data.error && this.isCampaignArray(response.data)) {
        return response.data;
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        await API.refreshToken();
        return (async (error: any) => {
          console.error(error);
          throw error;
        });
      }
    }
  }

  static createCampaign = async (campaignInfo: CampaignInterface) => {
    const response = await axios.post(
      `${CONFIG.baseDbURL}/campaigns/`,
      { campaignInfo: campaignInfo },
      { withCredentials: true }
    );
    if (response.status === 204) {
      return SUCCESS;
    } else {
      return FAIL;
    }
  };

  static updateCampaign = async (campaignInfo: CampaignInterface) => {
    const response = await axios.put(
      `${CONFIG.baseDbURL}/campaigns/`,
      { campaignInfo: campaignInfo },
      { withCredentials: true }
    );
    if (response.status === 204) {
      return SUCCESS;
    } else {
      return FAIL;
    }
  };

  static getDocumentsList = async (campaignId: number) => {
    const response = await axios.get(
      `${CONFIG.baseDbURL}/documents/campaign/${campaignId}`,
      { withCredentials: true }
    );
    if (!response?.data.error && this.isDocumentList(response.data)) {
      return response.data;
    }
    if (response.status === 204) {
      return SUCCESS;
    } else {
      return FAIL;
    }
  };

  static getDocument = async (documentId: number) => {
    const response = await axios.get(
      `${CONFIG.baseDbURL}/documents/id/${documentId}`,
      { withCredentials: true }
    );
    if (!response?.data.error && this.isDocumentInterface(response.data)) {
      return response.data;
    }
    if (response.status === 204) {
      return SUCCESS;
    } else {
      return FAIL;
    }
  };

  static createDocument = async (documentInfo: DocumentInterface) => {
    const response = await axios.post(
      `${CONFIG.baseDbURL}/documents/`,
      { documentInfo: documentInfo },
      { withCredentials: true }
    );
    if (response.status === 204) {
      return SUCCESS;
    } else {
      return FAIL;
    }
  };

  static updateDocument = async (documentInfo: DocumentInterface) => {
    const response = await axios.put(
      `${CONFIG.baseDbURL}/documents/`,
      { documentInfo: documentInfo },
      { withCredentials: true }
    );
    if (response.status === 204) {
      return SUCCESS;
    } else {
      return FAIL;
    }
  };

  static sendWSMsg = (fromUserId: number, toUserId: number, message: string) => {
    return axios.post(
      `${CONFIG.baseDbURL}/trackers/sendmessage`,
      { fromUserId: fromUserId, toUserId: toUserId, message: message },
      { withCredentials: true }
    );
  }

  static exportDB = () => {
    return axios.get(`${CONFIG.baseDbURL}/dbutils/export`, {
      withCredentials: true,
    });
  };
}
