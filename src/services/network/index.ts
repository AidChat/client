import axios from "axios";

export const _props = {
    session: window.localStorage.getItem('session'),
    _db: function (model: service) {
        const query = (
            service: serviceRoute ,
            _params: any,
            _req: reqType
        ): Promise<any> => {
            return new Promise((resolve, reject) => {
                switch (_req) {
                    case reqType.get:
                        axios.get(model + service, {headers: {session: this.session}})
                            .then((response) => {
                                resolve(response.data.data);
                            })
                            .catch((reason) => {
                                reject(reason);
                            });
                        break;
                    case reqType.post:
                        axios.post(model + service, _params, {headers: {session: this.session}})
                            .then((response) => {
                                resolve(response.data.data.data);
                            })
                            .catch((reason) => {
                                console.error(reason);
                                reject(reason);
                            });
                        break;
                    case reqType.put:
                        axios.put(model + service, _params, {headers: {session: this.session}})
                            .then((response) => {
                                resolve(response.data.data.data);
                            })
                            .catch((reason) => {
                                console.error(reason);
                                reject(reason);
                            });
                        break;
                    case reqType.delete:
                        axios.delete(model + service, {headers: {session: this.session}})
                            .then((response) => {
                                resolve(response.data.data.data);
                            })
                            .catch((reason) => {
                                console.error(reason);
                                reject(reason);
                            });
                        break;
                    default:
                        reject("Invalid request type");
                }
            });
        };
        return {query};
    },
    _user: function () {
        const   validateSession = () => {
            if (window.localStorage.getItem('session')) {
                this.session = window.localStorage.getItem('session');
            }
            return new Promise((resolve, reject) => {
                if (!this.session) {
                    reject("Session not available");
                } else {
                    this._db(service.authentication).query(serviceRoute.session, {}, reqType.get)
                        .then((response: any) => {
                            resolve(response);
                        })
                        .catch((reason: any) => {
                            reject(reason.response);
                        });
                }
            });
        };
        return {validateSession};
    },
};

export enum reqType {
    get = "GET",
    post = "POST",
    put = "PUT",
    delete = 'DELETE'
}

export enum serviceRoute {
    login = '/auth/login',
    register = '/auth/register',
    session = '/auth/session',
    group= '/group'
}



export enum service {
    authentication = 'http://127.0.0.1:8999/v1',
    group = 'http://127.0.0.1:8901/v1',
    messaging = 'http://127.0.0.1:8900/v1'
}
