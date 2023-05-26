export interface UserInterface {
    id: number;
    login: string;
    password?: string;
    nickname: string;
    email: string;
    roles: Array<string>;
    locale: string;
    active: boolean;
    resetpwd?: boolean;
    refreshtoken?: string;
  }