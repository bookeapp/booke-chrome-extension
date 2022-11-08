import { createAuth0Client as createAuthZeroClient } from "@auth0/auth0-spa-js";

class AuthZeroApi {
  client = null;

  domain = null;

  audience = null;

  clientId = null;

  redirectUrl = null;

  constructor(domain, audience, clientId) {
    this.domain = domain;
    this.audience = audience;
    this.clientId = clientId;
    this.redirectUrl = window.location.origin;
  }

  async getClient() {
    if (!this.client) {
      this.client = await createAuthZeroClient({
        domain: this.domain,
        clientId: this.clientId,
        cacheLocation: "localstorage",
        authorizationParams: {
          audience: this.audience,
          redirect_uri: this.redirectUrl
        }
      });
    }

    return this.client;
  }

  async getAuthToken(callbackState) {
    try {
      const client = await this.getClient();

      const token = await client.getTokenSilently({ ignoreCache: !callbackState });

      if (!token) return null;

      const payload = JSON.parse(atob(token.split(".")[1]));

      if (!payload || !Array.isArray(payload.aud) || !payload.aud.includes(this.audience)) return null;

      return token;
    } catch (error) {
      return null;
    }
  }

  async getUserInfo() {
    try {
      const client = await this.getClient();

      const userInfo = await client.getUser();

      return userInfo;
    } catch (error) {
      return null;
    }
  }

  async loginWithRedirect(appState) {
    try {
      const client = await this.getClient();

      await client.loginWithRedirect(appState ? { appState } : {});

      return true;
    } catch (error) {
      return false;
    }
  }

  async logoutUser() {
    try {
      const client = await this.getClient();

      await client.logout({ returnTo: this.redirectUrl });

      return true;
    } catch (error) {
      return false;
    }
  }

  async handleRedirectCallback() {
    try {
      const client = await this.getClient();

      const callbackResult = await client.handleRedirectCallback();

      return callbackResult;
    } catch (error) {
      return null;
    }
  }
}

export default new AuthZeroApi(
  process.env.AUTH_DOMAIN,
  process.env.AUTH_AUDIENCE,
  process.env.AUTH_CLIENT_ID
);
