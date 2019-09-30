
import axios from "axios";


export default class Mysdk {
  constructor( headersObj ={}) {
    this.version ='1.0.0'
    this.requiredHeaders = '';
    this.optionalHeaders = '';
    this.name = "mysdk";

    if(this.requiredHeaders){
      this.requiredHeaders.split(',').forEach(header => {
        if (Object.keys(headersObj).indexOf(header) < 0) {
          throw Error("All required header to initiate not passed");
        }
      });
    }

    this.configs = {
      baseURL: "localhost.com",
      headers: {
        ...headersObj,
      }
    }

    const instance = axios.create({
      ...this.configs
    });

    // get authorization on every request
    instance.interceptors.request.use(
      configs => {
        if(this.optionalHeaders){
          this.optionalHeaders.split(',').forEach(header => {
            this.configs.headers[header] = this.getHeader(header);
          });
        }
        configs.headers = this.configs.headers
        configs.baseURL = this.configs.baseURL

        return configs
      },
      error => Promise.reject(error)
    );

    this.axiosInstance = instance;
  }
  
  fetchApi({
    isFormData,
    method,
    data = {},
    _url,
    transformResponse
  }) {
    const { _params = {}, _pathParams = {}, ..._data } = data;
    // eslint-disable-next-line
    return new Promise(async resolve => {
      const obj = {
        error: null,
        data: null
      };

      let data = _data;

      if (isFormData) {
        const formdata = new FormData();
        Object.entries(_data).forEach(arr => {
          formdata.append(arr[0], arr[1]);
        });
        data = formdata;
      }
      let url = _url;
      if (Object.keys(_pathParams).length) {
        Object.entries(_pathParams).forEach(
          arr => (url = url.replace("{" + arr[0] + "}", arr[1]))
        );
      }
      try {
        const resObj = await this.axiosInstance({
          url,
          method,
          data,
          ...(transformResponse ? { transformResponse } : {}),
          ...(Object.keys(_params).length ? { params: _params } : {}),
          ...(isFormData
            ? {
                headers: {
                  "Content-Type": "multipart/form-data"
                }
              }
            : {})
        });
        obj.data = resObj.data;
        resolve(obj);
      } catch (error) {
        if (error.response) {
          obj.error = error.response.data;
        } else if (error.request) {
          obj.error = error.request;
        } else {
          obj.error = error.message;
        }
        resolve(obj);
      }
    });
  }
  // intercept response
  interceptResponse(cb) {
    // just want to make user provide one callback,so mergin to callbacks
    const cb1 = r => cb(r);
    const cb2 = e => cb(undefined, e);
    this.axiosInstance.interceptors.response.use(cb1, cb2);
  }

  interceptRequest(cb) {
    // first we need to eject the callback we are already using

    this.axiosInstance.interceptors.request.eject(this.requestInterceptor);
    const cb1 = c => cb(c, undefined);
    const cb2 = e => cb(undefined, e);
    this.requestInterceptor = this.axiosInstance.interceptors.request.use(
      cb1,
      cb2
    );
  }


  // utils method for sdk class
  setHeader(key, value) {
    // Set optional header
    this.configs.header[key] = value;

    // storing in local storage to retrieve after reloads
    // if you are managing refresh token and just storing token in memory
    // than instead of using set Headers, just use interceptRequest and interceptResponse methods
    window.localStorage.setItem(key, value);
  }

  // eslint-disable-next-line
  getHeader(key) {
    //Get header method
    //Helps to check if the required header is present or not
    return window.localStorage.getItem(key);
  }
  
  // --utils method for sdk class
  clearHeader(key) {
    // Clear optional header
    this.configs.header[key] = '';
    window.localStorage.removeItem(key);
  }

  setBaseUrl(url) {
    //Set BaseUrl
    //Helps when we require to change the base url, without modifying the sdk code

    this.configs = {
      ...this.configs,
      baseURL: url
    };
  }
  // ------All api method----

    
  addPet(data) {
    return this.fetchApi({
      operationName:'addPet',
      method: "POST",
      _url: '/pet',
       data,
    });
  }
  
  
  updatePet(data) {
    return this.fetchApi({
      operationName:'updatePet',
      method: "PUT",
      _url: '/pet',
       data,
    });
  }
  
  
  findPetsByStatus(data) {
    return this.fetchApi({
      operationName:'findPetsByStatus',
      method: "GET",
      _url: '/pet/findByStatus',
       data,
    });
  }
  
  
  findPetsByTags(data) {
    return this.fetchApi({
      operationName:'findPetsByTags',
      method: "GET",
      _url: '/pet/findByTags',
       data,
    });
  }
  
  
  getPetById(data) {
    return this.fetchApi({
      operationName:'getPetById',
      method: "GET",
      _url: '/pet/{petId}',
       data,
    });
  }
  
  
  updatePetWithForm(data) {
    return this.fetchApi({
      operationName:'updatePetWithForm',
      method: "POST",
      _url: '/pet/{petId}',
       data,
    });
  }
  
  
  deletePet(data) {
    return this.fetchApi({
      operationName:'deletePet',
      method: "DELETE",
      _url: '/pet/{petId}',
       data,
    });
  }
  
  
  uploadFile(data) {
    return this.fetchApi({
      operationName:'uploadFile',
      method: "POST",
      isFormData: true,
      _url: '/pet/{petId}/uploadImage',
       data,
    });
  }
  
  
  getInventory(data) {
    return this.fetchApi({
      operationName:'getInventory',
      method: "GET",
      _url: '/store/inventory',
       data,
    });
  }
  
  
  placeOrder(data) {
    return this.fetchApi({
      operationName:'placeOrder',
      method: "POST",
      _url: '/store/order',
       data,
    });
  }
  
  
  getOrderById(data) {
    return this.fetchApi({
      operationName:'getOrderById',
      method: "GET",
      _url: '/store/order/{orderId}',
       data,
    });
  }
  
  
  deleteOrder(data) {
    return this.fetchApi({
      operationName:'deleteOrder',
      method: "DELETE",
      _url: '/store/order/{orderId}',
       data,
    });
  }
  
  
  createUser(data) {
    return this.fetchApi({
      operationName:'createUser',
      method: "POST",
      _url: '/user',
       data,
    });
  }
  
  
  createUsersWithArrayInput(data) {
    return this.fetchApi({
      operationName:'createUsersWithArrayInput',
      method: "POST",
      _url: '/user/createWithArray',
       data,
    });
  }
  
  
  createUsersWithListInput(data) {
    return this.fetchApi({
      operationName:'createUsersWithListInput',
      method: "POST",
      _url: '/user/createWithList',
       data,
    });
  }
  
  
  loginUser(data) {
    return this.fetchApi({
      operationName:'loginUser',
      method: "GET",
      _url: '/user/login',
       data,
    });
  }
  
  
  logoutUser(data) {
    return this.fetchApi({
      operationName:'logoutUser',
      method: "GET",
      _url: '/user/logout',
       data,
    });
  }
  
  
  getUserByName(data) {
    return this.fetchApi({
      operationName:'getUserByName',
      method: "GET",
      _url: '/user/{username}',
       data,
    });
  }
  
  
  updateUser(data) {
    return this.fetchApi({
      operationName:'updateUser',
      method: "PUT",
      _url: '/user/{username}',
       data,
    });
  }
  
  
  deleteUser(data) {
    return this.fetchApi({
      operationName:'deleteUser',
      method: "DELETE",
      _url: '/user/{username}',
       data,
    });
  }
  
  
}
