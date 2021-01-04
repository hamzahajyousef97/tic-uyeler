export interface Roles {
    editor?: boolean;
    admin?: boolean;
}


export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    emailVerified: boolean;
    admin: boolean;
}
