import axios from "axios";
import {UserProps} from "../../utils/interface";
import {reqType, service, serviceRoute} from "../../utils/enum";

export const _props = {
  session: window.localStorage.getItem("session"),
  _db: function (model: service) {
    const query = (
      service: serviceRoute,
      _data: any,
      _req: reqType,
      _params?: string | number
    ): Promise<any> => {
      return new Promise((resolve, reject) => {
        if (!_params) _params = "";
        switch (_req) {
          case reqType.get:
            axios
              .get(`${model}${service}/` + _params, {
                headers: {session: this.session},
              })
              .then((response: {data: {data: any}}) => {
                resolve(response.data.data);
              })
              .catch((reason: any) => {
                reject(reason?.response?.data);
              });
            break;
          case reqType.post:
            axios
              .post(`${model}${service}/` + _params, _data, {
                headers: {session: this.session},
              })
              .then(response => {
                resolve(response.data.data);
              })
              .catch(reason => {
                reject(reason?.response?.data);
              });
            break;
          case reqType.put:
            axios
              .put(`${model}${service}/` + _params, _data, {
                headers: {session: this.session},
              })
              .then(response => {
                resolve(response.data.data);
              })
              .catch(reason => {
                reject(reason?.response?.data);
              });
            break;
          case reqType.delete:
            axios
              .delete(`${model}${service}/` + _params, {
                headers: {session: this.session},
              })
              .then(response => {
                resolve(response.data.data);
              })
              .catch(reason => {
                reject(reason?.response?.data);
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
    const validateSession = () => {
      if (window.localStorage.getItem("session")) {
        this.session = window.localStorage.getItem("session");
      }
      return new Promise((resolve, reject) => {
        if (!this.session) {
          reject("Session not available");
        } else {
          this._db(service.authentication)
            .query(serviceRoute.session, {}, reqType.get)
            .then((response: any) => {
              resolve(response);
            })
            .catch((reason: any) => {
              reject(reason?.response);
            });
        }
      });
    };

    const get = (): Promise<UserProps> => {
      return new Promise((resolve, reject) => {
        this._db(service.authentication)
          .query(serviceRoute.user, {}, reqType.get)
          .then(function (response) {
            resolve(response.data);
          })
          .catch(function (reasons) {
            reject(reasons);
          });
      });
    };

    return {validateSession, get};
  },
};
