import * as React from "react";
import { UserInterface } from "../types";

// export interface UserInfo {
//     id: number;
//     login: string;
//     nickname: string;
//     email: string;
//     roles: string[];
//     locale: string;
//     active: boolean;
//     resetpwd: boolean;
//     refreshtoken?: string;
// };

export const instanceofUserInfo = (x: any): boolean => {
    if (x.id && x.login && x.nickname && x.email && x.roles)
        return true;
    else return false;
}


export const refreshTokenIsString = (refreshToken: string | undefined): refreshToken is string => {
    return typeof refreshToken === "string";
}

/*
export interface UserInterface {
    id: number;
    login: string;
    password?: string;
    nickname: string;
    email: string;
    roles: string;
    locale: string;
    active: number;
    resetpwd?: number;
    refreshtoken?: string;
  }
*/
export const convertToUserInfo = (x: any): UserInterface => {
    let newUserInfo: UserInterface =
    {
        id: x.id,
        login: x.login,
        nickname: x.nickname,
        email: x.email,
        roles: x.roles,
        campaignid: x.campaignid,
        campaignname: x.campaignname,
        locale: x.locale,
        active: x.active,
        resetpwd: x.resetpwd,
        refreshtoken: x.refreshtoken
    };
    return newUserInfo;
}

export const defaultUserInfo: UserInterface = {
    id: 0,
    login: "nobody",
    nickname: "nobody",
    email: "default@default.com",
    roles: [],
    campaignid: undefined,
    campaignname: undefined,
    locale: "enUS",
    active: false,
    resetpwd: false,
    refreshtoken: "",
}

export const useAuthStore = (initial: UserInterface) => React.useState<UserInterface | null>(initial);
export type UseAuthStoreType = ReturnType<typeof useAuthStore>;
export type AuthStoreType = UseAuthStoreType[0];
export type SetAuthStoreType = UseAuthStoreType[1];

const AuthContext = React.createContext<UseAuthStoreType | null>(null);

export const useAuthContext = () => React.useContext(AuthContext)!;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => (
    <AuthContext.Provider value={useAuthStore(defaultUserInfo)}>
        {children}
    </AuthContext.Provider>
);



