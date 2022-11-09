import { log, objectToQueryString } from "utils";
import authZeroApi from "./AuthZeroApi";

const REQUEST_ERROR = "requestError";

const REQUEST_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH"
};

const HTTP_STATUSES = {
  OK: 200, // eslint-disable-line no-magic-numbers
  UNAUTHORIZED: 401 // eslint-disable-line no-magic-numbers
};

class RestApi {
  apiUrl = null;

  constructor(apiUrl = "") {
    this.apiUrl = apiUrl;
  }

  setToken(token) {
    this.token = token;
  }

  async get(path, urlParams) {
    const response = await this.makeRequest(REQUEST_METHODS.GET, path, urlParams);

    return response;
  }

  async put(path, urlParams, payload, binary) {
    const response = await this.makeRequest(REQUEST_METHODS.PUT, path, urlParams, payload, binary);

    return response;
  }

  async post(path, urlParams, payload, binary) {
    const response = await this.makeRequest(REQUEST_METHODS.POST, path, urlParams, payload, binary);

    return response;
  }

  async patch(path, urlParams, payload) {
    const response = await this.makeRequest(REQUEST_METHODS.PATCH, path, urlParams, payload);

    return response;
  }

  async delete(path, urlParams, payload) {
    const response = await this.makeRequest(REQUEST_METHODS.DELETE, path, urlParams, payload);

    return response;
  }

  async makeRequest(method, path, urlParams, payload) {
    log("request", { method, path, urlParams, payload });

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

      if (response.status === HTTP_STATUSES.UNAUTHORIZED) {
        authZeroApi.logoutUser();

        return null;
      }

      if (response.ok) {
        const responseJson = await response.json();

        log("response", responseJson);

        return responseJson;
      }
      throw REQUEST_ERROR;
    } catch (error) {
      throw REQUEST_ERROR;
    }
  }
}

const restApi = new RestApi(process.env.MAIN_API_URL);

export default restApi;
