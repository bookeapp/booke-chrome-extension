import RestApi from "./RestApi";

const STATS = "/stats";

const ACCOUNTS = "/accounts";

const CHECK = "/check";

class Api extends RestApi {
  fetchStats(code) {
    return this.get(`/${code}${STATS}`);
  }

  checkStatements({ accountId, transactions }) {
    return this.post(`${ACCOUNTS}/${accountId}${CHECK}`, null, {
      transactions: transactions.map(({ id, ...rest }) => btoa(JSON.stringify(rest)))
    });
  }
}

const api = new Api(process.env.MAIN_API_URL);

export default api;
