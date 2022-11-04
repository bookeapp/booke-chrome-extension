import Errors from "const/Errors";
import { objectToQueryString } from "utils";


const REQUEST_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH"
};

export default class RestApi {  
  apiUrl = null;
  
  constructor(apiUrl = "", token) {
    this.apiUrl = apiUrl;
    this.token = token;
  }

  async get(path, urlParams) {
    const response = await this.makeRequest(RestApi.REQUEST_METHODS.GET, path, urlParams);

    return response;
  }

  async put(path, urlParams, payload, binary) {
    const response = await this.makeRequest(RestApi.REQUEST_METHODS.PUT, path, urlParams, payload, binary);

    return response;
  }

  async post(path, urlParams, payload, binary) {
    const response = await this.makeRequest(RestApi.REQUEST_METHODS.POST, path, urlParams, payload, binary);

    return response;
  }

  async patch(path, urlParams, payload) {
    const response = await this.makeRequest(RestApi.REQUEST_METHODS.PATCH, path, urlParams, payload);

    return response;
  }

  async delete(path, urlParams, payload) {
    const response = await this.makeRequest(RestApi.REQUEST_METHODS.DELETE, path, urlParams, payload);

    return response;
  }

  async makeRequest(method, path, urlParams, payload) {
    try {
      const searchString = urlParams ? objectToQueryString(urlParams) : null;
      
      const response = await fetch(
        `${this.apiUrl}${path}${searchString ? `?${searchString}` : ""}`,
        {
          method,
          headers: { 
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );
      
      if (response.status === Constants.HTTP_STATUSES.UNAUTHORIZED) throw Errors.SESSION_EXPIRED;
        
      if (response.ok) {        
        return response.json();
      } else {
        throw Errors.REQUEST_ERROR;
      }
    } catch (error) {
      throw Errors.REQUEST_ERROR;
    }
  }
}
