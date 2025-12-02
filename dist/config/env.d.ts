export declare const config: {
    port: number;
    nodeEnv: string;
    mongodbUri: string;
    jwtAccessSecret: string;
    jwtRefreshSecret: string;
    jwtAccessExpiry: string;
    jwtRefreshExpiry: string;
    smtp: {
        host: string;
        port: number;
        user: string | undefined;
        pass: string | undefined;
        from: string;
    };
    cloudinary: {
        cloudName: string | undefined;
        apiKey: string | undefined;
        apiSecret: string | undefined;
    };
    midtrans: {
        serverKey: string | undefined;
        clientKey: string | undefined;
        environment: string;
    };
    google: {
        clientId: string | undefined;
        clientSecret: string | undefined;
        callbackUrl: string | undefined;
    };
    googleDrive: {
        folderId: string | undefined;
        serviceAccountKey: string | undefined;
    };
    corsOrigin: string[];
    admin: {
        email: string | undefined;
        password: string | undefined;
    };
    apiDocs: {
        enabled: boolean;
        path: string;
    };
};
export default config;
//# sourceMappingURL=env.d.ts.map