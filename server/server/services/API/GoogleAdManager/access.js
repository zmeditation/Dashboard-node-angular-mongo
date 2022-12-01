const { GAM } = require("./gam");
const { auth } = require("google-auth-library");
const keys = {
  type: "service_account",
  project_id: "wmgoauth",
  private_key_id: "d734f46255700029ff569eb1203ecf9ff8cf9707",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQChO3//4HAb/JDS\nUdVYq4UNKCQloK9cs+xY8DkLTTMsC2ZzCVDxOUsaN1w7UXX7Z+urZ+u7tLL9lXFh\ne9LmFmaF3hFnexJf16T+JAfcltnRbi2FTHkN0U/4E32X22c9OuNKIhEq9uc8SChC\nPXf55mZzP+F8LXFXEDCmyzb0Pc5/ayNutIFEBl1ze6ztXwQE3wmgcl9zdztr8qg7\n5p1g1r9R19ykISZYRXlIUGk1v6yNKbY7AnZF3qMY6xBa07IHK8yu4DQnhWZuOeSJ\nysb1BHoaoH+Awr0em7+NMlKJJErzk2EkQnzmrmAJbzAWy3hb0AVsFQ9CMN0mqS+5\n6QtOj9itAgMBAAECggEAJaCz9OStbU6igr8P5hdzX/huBS0Mt/sSjcgUXAeaiW0o\nrfCu5/kJxrbESuCuQuvEE5bXbFFV03oQwaIq/EEekJ/cmnSdu2nhiuEgR5IaB/cp\nXvpTpw6iFeCAl1PgMmk/mbG9JXSFTyt838amLRdg8gUmy7r0QFAaNpbm/pW9Dz20\nBMrMkjRdOlE14oVEKMWgXIQuIi1nk0G7fcmWG2ELPO2WJXcphUiEngk0jnYLQJsQ\n9CiFcpicgoTh/AeKXnL8q/Oxzkds+v90IDl1uIXN090LsYjKkPgOhr0Q5ECD/JUJ\nepLdE7gBDWE0m5JTS4SzM2zqduBPpeGYgU3+CijICQKBgQDXQbAlTia0u9ZmlrQE\nunH3VheRkBkgwXC7e6I4pfjjat9YKnRGwIJVvcmpv5t8ess8EvvPl0JJvE8BTiyu\nPZHdnc3QRAADX3rZDAE/Yxfpv8KjjzhMzbyXwQf/xhPquRx0Xi5axY7YpuDxaoYp\nl8yuyfI/fyHobixRFrAi+Rv6lQKBgQC/wA6khuhTf4dx1g1qnvwTo78KQVufbFNj\nwIeME6uoAdrE33xo0GxTbDvlIZjiVbmROtO8ulnujCjCts/1Ay1t4rbyi5KfRvYP\nU1SXkUM0jLa99e0jwdZHxBIxkM5iHBftvQ4xbSP8JCg4TtVQNS5uKQ2RqgOcjAt/\nkIWmDcr3uQKBgQCwifIiFl9OOQOU7aJEgnj3hgccXdcN8zg2uyYHWa+vLDZyg5cL\nc9Uw5s9exYOK6taFtXgKAB7ghG0zP98LI/nejQ5/8VUlbwg8vEjFqMqy7Y9/PvXI\nn689spWR4uzww9KfaaKQ1Zfa/bpcpKXVtOasr3lbNDQmAT2dX4Mjm7SjpQKBgQCc\nP4jvAktwNrwMw8q89f4cltLGLYnWd7Pf1fPd7e1zgsdco2vCEQwkUk7gICdvT0Fe\nGVyOLh+4JZfVSphcY5FyOEqxi5AXoABDbrjApQrpWDxUwH/TIlFUu23D2+aAxbmt\n7N8S4YdwH5pyf7KMoDlMZMF8z9gPiYKZGQ/+xsB8aQKBgGaijkKE+e1nsRsFXx0s\nfZHP8PSSY6+R7ArxGGRiyqkNljaNpg4oBG7Dc7vkMBDo2qv9WPVMbvYRG57tRFwY\nJAjJiZ+iPNUJ3mGdJDFfVkwwMrAM/s1aNNvJBAghRg0fnkysA+6TxqU1zftpbBb6\n5wTi0WIeyiWMefgYwlpLhW+3\n-----END PRIVATE KEY-----\n",
  client_email: "wmgoath@wmgoauth.iam.gserviceaccount.com",
  client_id: "108471929897834505609",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/wmgoath%40wmgoauth.iam.gserviceaccount.com"
};

exports.Access = class extends GAM {
  constructor(service) {
    super();
    this.service = service;
  }
  async createAccess() {
    const client = auth.fromJSON(keys);
    client.scopes = ["https://www.googleapis.com/auth/dfp"];
    await client.authorize();
    const gam = new GAM({ networkCode: "112081842", apiVersion: 'v202111' });
    const serv = await gam.getService(this.service);
    serv.setToken(client.credentials.access_token);

    return serv;
  }
};
