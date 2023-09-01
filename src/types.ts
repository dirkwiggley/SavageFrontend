export interface UserInterface {
    id: number;
    login: string;
    password?: string;
    nickname: string;
    email: string;
    roles: Array<string>;
    campaignid?: number;
    campaignname?: string;
    locale: string;
    active: boolean;
    resetpwd?: boolean;
    refreshtoken?: string;
  }