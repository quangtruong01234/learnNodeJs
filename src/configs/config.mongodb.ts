'use strict'

//lv0
// const config = {
//     app:{
//         port: 3000
//     },
//     db:{
//         host:'127.0.0.1',
//         port:27017,
//         name:'db'
//     }
// }

//lv1

interface AppConfig {
    port: number;
}

interface DBConfig {
    host: string;
    port: number;
    name: string;
}

interface EnvironmentConfig {
    app: AppConfig;
    db: DBConfig;
}

interface Config {
    dev: EnvironmentConfig;
    pro: EnvironmentConfig;
}

const dev: EnvironmentConfig = {
    app: {
        port: parseInt(process.env.DEV_APP_PORT || '3052', 10),
    },
    db: {
        host: process.env.DEV_DB_HOST || '127.0.0.1',
        port: parseInt(process.env.DEV_DB_PORT || '27017', 10),
        name: process.env.DEV_DB_NAME || 'shopDev',
    },
};
const pro: EnvironmentConfig = {
    app: {
        port: parseInt(process.env.PRO_APP_PORT || '3000', 10),
    },
    db: {
        host: process.env.PRO_DB_HOST || '127.0.0.1',
        port: parseInt(process.env.PRO_DB_PORT || '27017', 10),
        name: process.env.PRO_DB_NAME || 'shopPro',
    },
};
const config: Config = { dev, pro };
const env: keyof Config = (process.env.NODE_ENV as keyof Config)||'dev'
// console.log(config[env],env)
export default config[env];
