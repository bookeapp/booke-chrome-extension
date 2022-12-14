import RestApi from "./RestApi";

const STATS = "/stats";

const ACCOUNTS = "/accounts";

const CHECK = "/check";

const RECONCILE = "/reconcile";

class Api extends RestApi {
  fetchStats(code) {
    return this.get(`/${code}${STATS}`);
  }

  checkStatements({ accountId, transactions }) {
    return this.post(`${ACCOUNTS}/${accountId}${CHECK}`, null, {
      transactions: transactions.map(({ hash }) => hash)
    });
  }

  reconcileStatements({ accountId, transactions }) {
    return this.post(`${ACCOUNTS}/${accountId}${RECONCILE}`, null, {
      transactions: transactions.map(({ hash }) => hash)
    });
  }
}

const api = new Api(process.env.MAIN_API_URL);

export default api;
