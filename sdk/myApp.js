
import axios from "axios";

class Myapp {
  constructor(disptach, headersObj ={}) {
    this.version ='1.0.0'
    this.dispatch = dispatch;
    this.requiredHeaders = 'name,lastname';
    this.optionalHeaders = 'token';
    this.name = "Myapp";
    if(this.requiredHeaders){
      this.requiredHeaders.split(',').forEach(header => {
        if (Object.keys(headersObj).indexOf(header) < 0) {
          throw Error("All required header to initiate not passed");
        }
      });
    }
    this.configs = {
      baseURL: "https://vitwit.com",
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
    operationName,
    isFormData,
    method,
    _data,
    _url,
    _params = {},
    transformResponse,
    _pathParams = [],
    headerConfigs = {}
  }) {
    this.dispatch({
      type:operationName + 'Res',
      payload:{
        loading:true
      }
    })
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
        this.dispatch({
          type: operationName + "Res",
          payload:{
            loading:false,
            data:resObj.data,
            error:null
          }
        })
        resolve(obj);
      } catch (error) {
        if (error.response) {
          obj.error = error.response.data;
        } else if (error.request) {
          obj.error = error.request;
        } else {
          obj.error = error.message;
        }
        this.dispatch({
          type: operationName + "Res",
          payload:{
            loading:false,
            error:obj.error,
            data:null
          }
        })
        resolve(obj);
      }
    });
  }

  // --utils method for sdk class
  setHeader(key, value) {
    // Set optional header
    this.configs.header[key] = value;
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

    
  addPet({ _params,_pathParams,..._data } = {}) {
    return this.fetchApi({
      operationName:'addPet',
      method: "POST",
      _url: '/pet',
       _data,
      _params,
    });
  }
  
  
  updatePet({ _params,_pathParams,..._data } = {}) {
    return this.fetchApi({
      operationName:'updatePet',
      method: "PUT",
      _url: '/pet',
       _data,
      _params,
    });
  }
  
  
  findPetsByStatus({ _params,_pathParams } = {}) {
    return this.fetchApi({
      operationName:'findPetsByStatus',
      method: "GET",
      _url: '/pet/findByStatus',
      _params,
    });
  }
  
  
  findPetsByTags({ _params,_pathParams } = {}) {
    return this.fetchApi({
      operationName:'findPetsByTags',
      method: "GET",
      _url: '/pet/findByTags',
      _params,
    });
  }
  
  
  getPetById({ _params,_pathParams } = {}) {
    return this.fetchApi({
      operationName:'getPetById',
      method: "GET",
      _url: '/pet/{petId}',
      _params,
      _pathParams,
    });
  }
  
  
  updatePetWithForm({ _params,_pathParams,..._data } = {}) {
    return this.fetchApi({
      operationName:'updatePetWithForm',
      method: "POST",
      _url: '/pet/{petId}',
       _data,
      _params,
      _pathParams,
    });
  }
  
  
  deletePet({ _params,_pathParams } = {}) {
    return this.fetchApi({
      operationName:'deletePet',
      method: "DELETE",
      _url: '/pet/{petId}',
      _params,
      _pathParams,
    });
  }
  
  
  uploadFile({ _params,_pathParams,..._data } = {}) {
    return this.fetchApi({
      operationName:'uploadFile',
      method: "POST",
      isFormData: true,
      _url: '/pet/{petId}/uploadImage',
       _data,
      _params,
      _pathParams,
    });
  }
  
  
  getInventory({ _params,_pathParams } = {}) {
    return this.fetchApi({
      operationName:'getInventory',
      method: "GET",
      _url: '/store/inventory',
      _params,
    });
  }
  
  
  placeOrder({ _params,_pathParams,..._data } = {}) {
    return this.fetchApi({
      operationName:'placeOrder',
      method: "POST",
      _url: '/store/order',
       _data,
      _params,
    });
  }
  
  
  getOrderById({ _params,_pathParams } = {}) {
    return this.fetchApi({
      operationName:'getOrderById',
      method: "GET",
      _url: '/store/order/{orderId}',
      _params,
      _pathParams,
    });
  }
  
  
  deleteOrder({ _params,_pathParams } = {}) {
    return this.fetchApi({
      operationName:'deleteOrder',
      method: "DELETE",
      _url: '/store/order/{orderId}',
      _params,
      _pathParams,
    });
  }
  
  
  createUser({ _params,_pathParams,..._data } = {}) {
    return this.fetchApi({
      operationName:'createUser',
      method: "POST",
      _url: '/user',
       _data,
      _params,
    });
  }
  
  
  createUsersWithArrayInput({ _params,_pathParams,..._data } = {}) {
    return this.fetchApi({
      operationName:'createUsersWithArrayInput',
      method: "POST",
      _url: '/user/createWithArray',
       _data,
      _params,
    });
  }
  
  
  createUsersWithListInput({ _params,_pathParams,..._data } = {}) {
    return this.fetchApi({
      operationName:'createUsersWithListInput',
      method: "POST",
      _url: '/user/createWithList',
       _data,
      _params,
    });
  }
  
  
  loginUser({ _params,_pathParams } = {}) {
    return this.fetchApi({
      operationName:'loginUser',
      method: "GET",
      _url: '/user/login',
      _params,
    });
  }
  
  
  logoutUser({ _params,_pathParams } = {}) {
    return this.fetchApi({
      operationName:'logoutUser',
      method: "GET",
      _url: '/user/logout',
      _params,
    });
  }
  
  
  getUserByName({ _params,_pathParams } = {}) {
    return this.fetchApi({
      operationName:'getUserByName',
      method: "GET",
      _url: '/user/{username}',
      _params,
      _pathParams,
    });
  }
  
  
  updateUser({ _params,_pathParams,..._data } = {}) {
    return this.fetchApi({
      operationName:'updateUser',
      method: "PUT",
      _url: '/user/{username}',
       _data,
      _params,
      _pathParams,
    });
  }
  
  
  deleteUser({ _params,_pathParams } = {}) {
    return this.fetchApi({
      operationName:'deleteUser',
      method: "DELETE",
      _url: '/user/{username}',
      _params,
      _pathParams,
    });
  }
  
  
}
