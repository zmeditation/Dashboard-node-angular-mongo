const tokens = require('./tokens.json')

function programmaticConfigRetriever(programmatic) {
  switch (programmatic) {
    case 'Amazon':
      return getAmazonConfig();
    case 'AppNexus':
      return getAppNexusConfig();
    case 'bRealTime':
      return getBRealTimeConfig();
    case 'DistrictM':
      return getDistrictMConfig();
    case 'Criteo':
      return getCriteoConfig();
    case 'E-Planning':
      return getEPlanningConfig();
    case 'Facebook':
      return getFacebookConfig();
    case 'Google Ad Manager WMG':
      return getGoogleAdManagerConfigWMG();
    case 'Google Ad Manager MRG':
      return getGoogleAdManagerConfigMRG();
    case 'Google Ad Manager HB':
      return getGoogleAdManagerConfigHB();
    case 'Google Ad Manager Commission':
      return getGoogleAdManagerConfigWMGForFee();
    case 'MyTarget':
      return getMyTargetConfig();
    case 'PubMatic':
      return getPubMaticConfig();
    case 'Rubicon' :
      return getRubiconConfig();
    case 'RTBHouse':
      return getRTBHouseConfig();
    case 'Teads':
      return getTeadsConfig();
    case 'Smart':
      return getSmartConfig();
    case 'Yandex':
      return getYandexConfig();
    case 'AdNet Media':
      return getAdnetConfig();
    case 'Lupon Media':
      return getLuponConfig();
    case 'MediaNet':
      return getMediaNetConfig();
    case 'Sharethrough':
      return getSharethroughConfig();
    case 'IndexExchange':
      return getIndexExchangeConfig();
    default:
      return null;
  }
}


function getAmazonConfig() {
  return {
    accessKeyId: tokens.AMAZON_API_ACCESS_KEY_ID,
    secretAccessKey: tokens.AMAZON_API_SECRET_ACCESS_KEY
  };
}

function getAppNexusConfig() {
  return {
    credentials: {
      login: tokens.APPNEXUS_LOGIN,
      password: tokens.APPNEXUS_PASS
    },
    reportID: '900831',
    programmatic: 'AppNexus'
  };
}

function getBRealTimeConfig() {
  return {
    credentials: {
      login: tokens.BREALTIME_LOGIN,
      password: tokens.BREALTIME_PASS
    },
    reportID: '703628',
    programmatic: 'bRealTime API'
  };
}

function getDistrictMConfig() {
  return {
    clientId: tokens.DISTRICTM_API_CLIENT_ID,
    clientSecret: tokens.DISTRICTM_API_CLIENT_SECRET
  };
}

function getCriteoConfig() {
  return {
    token: tokens.CRITEO_API_TOKEN
  };
}

function getFacebookConfig() {
  return {
    token: tokens.FACEBOOK_API_TOKEN,
    secret: tokens.FACEBOOK_API_SECRET
  };
}

function getGoogleAdManagerConfigWMG() {
  return {
    queryId: '10283110737',
    networkSettings: { networkCode: '112081842', apiVersion: 'v202111' },
    keys: {
      "type": "service_account",
      "project_id": "wmgoauth",
      "private_key_id": "d734f46255700029ff569eb1203ecf9ff8cf9707",
      "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQChO3//4HAb/JDS\nUdVYq4UNKCQloK9cs+xY8DkLTTMsC2ZzCVDxOUsaN1w7UXX7Z+urZ+u7tLL9lXFh\ne9LmFmaF3hFnexJf16T+JAfcltnRbi2FTHkN0U/4E32X22c9OuNKIhEq9uc8SChC\nPXf55mZzP+F8LXFXEDCmyzb0Pc5/ayNutIFEBl1ze6ztXwQE3wmgcl9zdztr8qg7\n5p1g1r9R19ykISZYRXlIUGk1v6yNKbY7AnZF3qMY6xBa07IHK8yu4DQnhWZuOeSJ\nysb1BHoaoH+Awr0em7+NMlKJJErzk2EkQnzmrmAJbzAWy3hb0AVsFQ9CMN0mqS+5\n6QtOj9itAgMBAAECggEAJaCz9OStbU6igr8P5hdzX/huBS0Mt/sSjcgUXAeaiW0o\nrfCu5/kJxrbESuCuQuvEE5bXbFFV03oQwaIq/EEekJ/cmnSdu2nhiuEgR5IaB/cp\nXvpTpw6iFeCAl1PgMmk/mbG9JXSFTyt838amLRdg8gUmy7r0QFAaNpbm/pW9Dz20\nBMrMkjRdOlE14oVEKMWgXIQuIi1nk0G7fcmWG2ELPO2WJXcphUiEngk0jnYLQJsQ\n9CiFcpicgoTh/AeKXnL8q/Oxzkds+v90IDl1uIXN090LsYjKkPgOhr0Q5ECD/JUJ\nepLdE7gBDWE0m5JTS4SzM2zqduBPpeGYgU3+CijICQKBgQDXQbAlTia0u9ZmlrQE\nunH3VheRkBkgwXC7e6I4pfjjat9YKnRGwIJVvcmpv5t8ess8EvvPl0JJvE8BTiyu\nPZHdnc3QRAADX3rZDAE/Yxfpv8KjjzhMzbyXwQf/xhPquRx0Xi5axY7YpuDxaoYp\nl8yuyfI/fyHobixRFrAi+Rv6lQKBgQC/wA6khuhTf4dx1g1qnvwTo78KQVufbFNj\nwIeME6uoAdrE33xo0GxTbDvlIZjiVbmROtO8ulnujCjCts/1Ay1t4rbyi5KfRvYP\nU1SXkUM0jLa99e0jwdZHxBIxkM5iHBftvQ4xbSP8JCg4TtVQNS5uKQ2RqgOcjAt/\nkIWmDcr3uQKBgQCwifIiFl9OOQOU7aJEgnj3hgccXdcN8zg2uyYHWa+vLDZyg5cL\nc9Uw5s9exYOK6taFtXgKAB7ghG0zP98LI/nejQ5/8VUlbwg8vEjFqMqy7Y9/PvXI\nn689spWR4uzww9KfaaKQ1Zfa/bpcpKXVtOasr3lbNDQmAT2dX4Mjm7SjpQKBgQCc\nP4jvAktwNrwMw8q89f4cltLGLYnWd7Pf1fPd7e1zgsdco2vCEQwkUk7gICdvT0Fe\nGVyOLh+4JZfVSphcY5FyOEqxi5AXoABDbrjApQrpWDxUwH/TIlFUu23D2+aAxbmt\n7N8S4YdwH5pyf7KMoDlMZMF8z9gPiYKZGQ/+xsB8aQKBgGaijkKE+e1nsRsFXx0s\nfZHP8PSSY6+R7ArxGGRiyqkNljaNpg4oBG7Dc7vkMBDo2qv9WPVMbvYRG57tRFwY\nJAjJiZ+iPNUJ3mGdJDFfVkwwMrAM/s1aNNvJBAghRg0fnkysA+6TxqU1zftpbBb6\n5wTi0WIeyiWMefgYwlpLhW+3\n-----END PRIVATE KEY-----\n",
      "client_email": "wmgoath@wmgoauth.iam.gserviceaccount.com",
      "client_id": "108471929897834505609",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/wmgoath%40wmgoauth.iam.gserviceaccount.com"
    }
  };
}

function getGoogleAdManagerConfigWMGForFee() {
  return {
    queryId: '11452463613',
    networkSettings: { networkCode: '112081842', apiVersion: 'v202111' },
    keys: {
      "type": "service_account",
      "project_id": "wmgoauth",
      "private_key_id": "d734f46255700029ff569eb1203ecf9ff8cf9707",
      "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQChO3//4HAb/JDS\nUdVYq4UNKCQloK9cs+xY8DkLTTMsC2ZzCVDxOUsaN1w7UXX7Z+urZ+u7tLL9lXFh\ne9LmFmaF3hFnexJf16T+JAfcltnRbi2FTHkN0U/4E32X22c9OuNKIhEq9uc8SChC\nPXf55mZzP+F8LXFXEDCmyzb0Pc5/ayNutIFEBl1ze6ztXwQE3wmgcl9zdztr8qg7\n5p1g1r9R19ykISZYRXlIUGk1v6yNKbY7AnZF3qMY6xBa07IHK8yu4DQnhWZuOeSJ\nysb1BHoaoH+Awr0em7+NMlKJJErzk2EkQnzmrmAJbzAWy3hb0AVsFQ9CMN0mqS+5\n6QtOj9itAgMBAAECggEAJaCz9OStbU6igr8P5hdzX/huBS0Mt/sSjcgUXAeaiW0o\nrfCu5/kJxrbESuCuQuvEE5bXbFFV03oQwaIq/EEekJ/cmnSdu2nhiuEgR5IaB/cp\nXvpTpw6iFeCAl1PgMmk/mbG9JXSFTyt838amLRdg8gUmy7r0QFAaNpbm/pW9Dz20\nBMrMkjRdOlE14oVEKMWgXIQuIi1nk0G7fcmWG2ELPO2WJXcphUiEngk0jnYLQJsQ\n9CiFcpicgoTh/AeKXnL8q/Oxzkds+v90IDl1uIXN090LsYjKkPgOhr0Q5ECD/JUJ\nepLdE7gBDWE0m5JTS4SzM2zqduBPpeGYgU3+CijICQKBgQDXQbAlTia0u9ZmlrQE\nunH3VheRkBkgwXC7e6I4pfjjat9YKnRGwIJVvcmpv5t8ess8EvvPl0JJvE8BTiyu\nPZHdnc3QRAADX3rZDAE/Yxfpv8KjjzhMzbyXwQf/xhPquRx0Xi5axY7YpuDxaoYp\nl8yuyfI/fyHobixRFrAi+Rv6lQKBgQC/wA6khuhTf4dx1g1qnvwTo78KQVufbFNj\nwIeME6uoAdrE33xo0GxTbDvlIZjiVbmROtO8ulnujCjCts/1Ay1t4rbyi5KfRvYP\nU1SXkUM0jLa99e0jwdZHxBIxkM5iHBftvQ4xbSP8JCg4TtVQNS5uKQ2RqgOcjAt/\nkIWmDcr3uQKBgQCwifIiFl9OOQOU7aJEgnj3hgccXdcN8zg2uyYHWa+vLDZyg5cL\nc9Uw5s9exYOK6taFtXgKAB7ghG0zP98LI/nejQ5/8VUlbwg8vEjFqMqy7Y9/PvXI\nn689spWR4uzww9KfaaKQ1Zfa/bpcpKXVtOasr3lbNDQmAT2dX4Mjm7SjpQKBgQCc\nP4jvAktwNrwMw8q89f4cltLGLYnWd7Pf1fPd7e1zgsdco2vCEQwkUk7gICdvT0Fe\nGVyOLh+4JZfVSphcY5FyOEqxi5AXoABDbrjApQrpWDxUwH/TIlFUu23D2+aAxbmt\n7N8S4YdwH5pyf7KMoDlMZMF8z9gPiYKZGQ/+xsB8aQKBgGaijkKE+e1nsRsFXx0s\nfZHP8PSSY6+R7ArxGGRiyqkNljaNpg4oBG7Dc7vkMBDo2qv9WPVMbvYRG57tRFwY\nJAjJiZ+iPNUJ3mGdJDFfVkwwMrAM/s1aNNvJBAghRg0fnkysA+6TxqU1zftpbBb6\n5wTi0WIeyiWMefgYwlpLhW+3\n-----END PRIVATE KEY-----\n",
      "client_email": "wmgoath@wmgoauth.iam.gserviceaccount.com",
      "client_id": "108471929897834505609",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/wmgoath%40wmgoauth.iam.gserviceaccount.com"
    }
  };
}

function getGoogleAdManagerConfigMRG() {
  return {
    queryId: '11150380051',
    networkSettings: {
      networkCode: '205338224',
      apiVersion: 'v202111'
    },
    keys: {
      "type": "service_account",
      "project_id": "wmgoauth",
      "private_key_id": "d734f46255700029ff569eb1203ecf9ff8cf9707",
      "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQChO3//4HAb/JDS\nUdVYq4UNKCQloK9cs+xY8DkLTTMsC2ZzCVDxOUsaN1w7UXX7Z+urZ+u7tLL9lXFh\ne9LmFmaF3hFnexJf16T+JAfcltnRbi2FTHkN0U/4E32X22c9OuNKIhEq9uc8SChC\nPXf55mZzP+F8LXFXEDCmyzb0Pc5/ayNutIFEBl1ze6ztXwQE3wmgcl9zdztr8qg7\n5p1g1r9R19ykISZYRXlIUGk1v6yNKbY7AnZF3qMY6xBa07IHK8yu4DQnhWZuOeSJ\nysb1BHoaoH+Awr0em7+NMlKJJErzk2EkQnzmrmAJbzAWy3hb0AVsFQ9CMN0mqS+5\n6QtOj9itAgMBAAECggEAJaCz9OStbU6igr8P5hdzX/huBS0Mt/sSjcgUXAeaiW0o\nrfCu5/kJxrbESuCuQuvEE5bXbFFV03oQwaIq/EEekJ/cmnSdu2nhiuEgR5IaB/cp\nXvpTpw6iFeCAl1PgMmk/mbG9JXSFTyt838amLRdg8gUmy7r0QFAaNpbm/pW9Dz20\nBMrMkjRdOlE14oVEKMWgXIQuIi1nk0G7fcmWG2ELPO2WJXcphUiEngk0jnYLQJsQ\n9CiFcpicgoTh/AeKXnL8q/Oxzkds+v90IDl1uIXN090LsYjKkPgOhr0Q5ECD/JUJ\nepLdE7gBDWE0m5JTS4SzM2zqduBPpeGYgU3+CijICQKBgQDXQbAlTia0u9ZmlrQE\nunH3VheRkBkgwXC7e6I4pfjjat9YKnRGwIJVvcmpv5t8ess8EvvPl0JJvE8BTiyu\nPZHdnc3QRAADX3rZDAE/Yxfpv8KjjzhMzbyXwQf/xhPquRx0Xi5axY7YpuDxaoYp\nl8yuyfI/fyHobixRFrAi+Rv6lQKBgQC/wA6khuhTf4dx1g1qnvwTo78KQVufbFNj\nwIeME6uoAdrE33xo0GxTbDvlIZjiVbmROtO8ulnujCjCts/1Ay1t4rbyi5KfRvYP\nU1SXkUM0jLa99e0jwdZHxBIxkM5iHBftvQ4xbSP8JCg4TtVQNS5uKQ2RqgOcjAt/\nkIWmDcr3uQKBgQCwifIiFl9OOQOU7aJEgnj3hgccXdcN8zg2uyYHWa+vLDZyg5cL\nc9Uw5s9exYOK6taFtXgKAB7ghG0zP98LI/nejQ5/8VUlbwg8vEjFqMqy7Y9/PvXI\nn689spWR4uzww9KfaaKQ1Zfa/bpcpKXVtOasr3lbNDQmAT2dX4Mjm7SjpQKBgQCc\nP4jvAktwNrwMw8q89f4cltLGLYnWd7Pf1fPd7e1zgsdco2vCEQwkUk7gICdvT0Fe\nGVyOLh+4JZfVSphcY5FyOEqxi5AXoABDbrjApQrpWDxUwH/TIlFUu23D2+aAxbmt\n7N8S4YdwH5pyf7KMoDlMZMF8z9gPiYKZGQ/+xsB8aQKBgGaijkKE+e1nsRsFXx0s\nfZHP8PSSY6+R7ArxGGRiyqkNljaNpg4oBG7Dc7vkMBDo2qv9WPVMbvYRG57tRFwY\nJAjJiZ+iPNUJ3mGdJDFfVkwwMrAM/s1aNNvJBAghRg0fnkysA+6TxqU1zftpbBb6\n5wTi0WIeyiWMefgYwlpLhW+3\n-----END PRIVATE KEY-----\n",
      "client_email": "wmgoath@wmgoauth.iam.gserviceaccount.com",
      "client_id": "108471929897834505609",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/wmgoath%40wmgoauth.iam.gserviceaccount.com"
    }
  };
}

function getGoogleAdManagerConfigHB() {
  return {
    queryId: '11152645168',
    networkSettings: {
      networkCode: '112081842',
      apiVersion: 'v202111'
    },
    keys: {
      "type": "service_account",
      "project_id": "wmgoauth",
      "private_key_id": "d734f46255700029ff569eb1203ecf9ff8cf9707",
      "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQChO3//4HAb/JDS\nUdVYq4UNKCQloK9cs+xY8DkLTTMsC2ZzCVDxOUsaN1w7UXX7Z+urZ+u7tLL9lXFh\ne9LmFmaF3hFnexJf16T+JAfcltnRbi2FTHkN0U/4E32X22c9OuNKIhEq9uc8SChC\nPXf55mZzP+F8LXFXEDCmyzb0Pc5/ayNutIFEBl1ze6ztXwQE3wmgcl9zdztr8qg7\n5p1g1r9R19ykISZYRXlIUGk1v6yNKbY7AnZF3qMY6xBa07IHK8yu4DQnhWZuOeSJ\nysb1BHoaoH+Awr0em7+NMlKJJErzk2EkQnzmrmAJbzAWy3hb0AVsFQ9CMN0mqS+5\n6QtOj9itAgMBAAECggEAJaCz9OStbU6igr8P5hdzX/huBS0Mt/sSjcgUXAeaiW0o\nrfCu5/kJxrbESuCuQuvEE5bXbFFV03oQwaIq/EEekJ/cmnSdu2nhiuEgR5IaB/cp\nXvpTpw6iFeCAl1PgMmk/mbG9JXSFTyt838amLRdg8gUmy7r0QFAaNpbm/pW9Dz20\nBMrMkjRdOlE14oVEKMWgXIQuIi1nk0G7fcmWG2ELPO2WJXcphUiEngk0jnYLQJsQ\n9CiFcpicgoTh/AeKXnL8q/Oxzkds+v90IDl1uIXN090LsYjKkPgOhr0Q5ECD/JUJ\nepLdE7gBDWE0m5JTS4SzM2zqduBPpeGYgU3+CijICQKBgQDXQbAlTia0u9ZmlrQE\nunH3VheRkBkgwXC7e6I4pfjjat9YKnRGwIJVvcmpv5t8ess8EvvPl0JJvE8BTiyu\nPZHdnc3QRAADX3rZDAE/Yxfpv8KjjzhMzbyXwQf/xhPquRx0Xi5axY7YpuDxaoYp\nl8yuyfI/fyHobixRFrAi+Rv6lQKBgQC/wA6khuhTf4dx1g1qnvwTo78KQVufbFNj\nwIeME6uoAdrE33xo0GxTbDvlIZjiVbmROtO8ulnujCjCts/1Ay1t4rbyi5KfRvYP\nU1SXkUM0jLa99e0jwdZHxBIxkM5iHBftvQ4xbSP8JCg4TtVQNS5uKQ2RqgOcjAt/\nkIWmDcr3uQKBgQCwifIiFl9OOQOU7aJEgnj3hgccXdcN8zg2uyYHWa+vLDZyg5cL\nc9Uw5s9exYOK6taFtXgKAB7ghG0zP98LI/nejQ5/8VUlbwg8vEjFqMqy7Y9/PvXI\nn689spWR4uzww9KfaaKQ1Zfa/bpcpKXVtOasr3lbNDQmAT2dX4Mjm7SjpQKBgQCc\nP4jvAktwNrwMw8q89f4cltLGLYnWd7Pf1fPd7e1zgsdco2vCEQwkUk7gICdvT0Fe\nGVyOLh+4JZfVSphcY5FyOEqxi5AXoABDbrjApQrpWDxUwH/TIlFUu23D2+aAxbmt\n7N8S4YdwH5pyf7KMoDlMZMF8z9gPiYKZGQ/+xsB8aQKBgGaijkKE+e1nsRsFXx0s\nfZHP8PSSY6+R7ArxGGRiyqkNljaNpg4oBG7Dc7vkMBDo2qv9WPVMbvYRG57tRFwY\nJAjJiZ+iPNUJ3mGdJDFfVkwwMrAM/s1aNNvJBAghRg0fnkysA+6TxqU1zftpbBb6\n5wTi0WIeyiWMefgYwlpLhW+3\n-----END PRIVATE KEY-----\n",
      "client_email": "wmgoath@wmgoauth.iam.gserviceaccount.com",
      "client_id": "108471929897834505609",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/wmgoath%40wmgoauth.iam.gserviceaccount.com"
    }
  };
}

function getPubMaticConfig() {
  return {
    token: tokens.PUBMATIC_API_TOKEN
  };
}

function getRubiconConfig() {
  return {
    token: tokens.RUBICON_API_TOKEN
  };
}

function getRTBHouseConfig() {
  return {
    "type": "service_account",
    "project_id": "rtb-house-api",
    "private_key_id": "7926f7fc2fe9d6ee3d1ca515edb92c29e6325c04",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCbgE2l4ZjkWIKD\nHdx5FKrb+CmJVzn3vTocHAo69Cf0+xc6PvaG7Z+w324OPVTZNANiIvQto8VsKiL7\nVj6r1JbmvI1vbPMkgEN+5eGmRJcFkqZcHAd1GsCCb3Euoia1z1EykVRsYr2IRnCe\nhn0n6QxpWQ9GpERNwsrMEW2STYkaqhfe7P1AVIcE/qnk75WVYWrhPaUFSkHfnrtp\nCOG1PBqrKjs0I2yJ86v+KD3iNcF2src8TAgS1fDdofOir59G5j8j5vsf/uAD1sID\n8pclQ2RlsRHiMBUZfvuawslihl1+B45yINjaNHGuHldQqwGRd/aZd7E9L4szGlNr\nuzLx0BadAgMBAAECggEAAKvMP1KFa+WGjqqi0xzyjdIjhRW3c35sEUdSXfsZbwu5\nsm/SIDacpqaYMtSImLVflwf/63CA/3IBG6ToJAAItK83TGCj01JVuDxQEyfJn7sI\ndRj5M+6tH62mceU+QIZIBe1YTW1xqZ8QM7GbOasI+YK/t6DUMKJjaKph7CyMfRfM\nGw0fWzmnhLCFjM9RZ0iI72uTOeQ4UONSqN3WU3M8NWq1zboreVDvLCPtG+aNExrm\nZV/rdrblVWX7Jr94mlrnVjCzmGZHPYxALorGYJejxliH84a3JTykNRVzb2aJ7jYL\nkt5jHlPkJyVF9yjHAOJbRxFAfP/eHFQjgR04NkWXcQKBgQDPUbsiFyhg+Z0RJMi0\nZfe9X6cj/CCivY8FOQil839oLDXtYZ0BY192Ax43/R2+9Sw1Q7e4l/2T3vF6EL3i\nv/+afQAD2Xq1c4wVBf0UlJ1AaGlA5ADVPIUQriED0g8NeuP3q1R+kkm4xWnxPODU\nWoKr2UTKq9VEjN5li59psBOyyQKBgQDAA7Xv9zrc3tfM8qgepGF8EQqHjYK9W2lG\nr3nMd8NXiz863xHtgGukMAz3HfjOK0J4q89w2Rr/WYVJFuMWcVKh2gHce5SiMp5+\naiks2VhrgegOfVrXg90BDARp1BKLOQQas4Y3im9XRdlB7umO0ncH/biB3wWyomNN\ncGymkWn7NQKBgQCP/CeHiaXVlAbt/SoXgCoLL/+ZEmZoIFbQPcgv2WlHJE1fzEeK\ny0VlZMz7/aNHGGfXpmxWm9jVdiUnrbDzZn1TAjWcdtKuas2DXGFkhcKhFOLk2nVp\no1qXNxhe2ujxZ8QkIq3QKjFhTlpB3RIY6bOPPpp0V9sKfPuIcuwILu2/YQKBgFtb\n6J7qVNluNeNPuWoK8E8llIr2a7RI4Ag/yYXdndXzbPxH0rHcHlsaebDCU/VUY+Yi\naSraQZwpLd+ewiGVfamAns4XBps91mdzf2/VYdqVDqKGRkiwduDepOLtgn03fZpu\nvHeEqIEvvLVARWQtA3GL6NPyFzXtSa44xZljKrfZAoGBAMP/oU+FzeYxmEsNQ8J+\nIrghLlFk1vinDan62mOYR4XVyQ5WBrSkT89CHkhJta6Kv/oxL2DywiJrc9NZJzuB\n3vOFUYt0FkAMu03xYimOC1d2fG0T3KunT21dnlRpZrnelyWzPX2oR2sQ1v5rzYR0\n+JKxDRZWosEAwNgUw4TzwbVi\n-----END PRIVATE KEY-----\n",
    "client_email": "api-for-wmg@rtb-house-api.iam.gserviceaccount.com",
    "client_id": "112733611720219580580",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/api-for-wmg%40rtb-house-api.iam.gserviceaccount.com"
  };
}

function getSmartConfig() {
  return {
    token: tokens.SMART_API_TOKEN
  }
}

function getYandexConfig() {
  return {
    token: tokens.YANDEX_API_TOKEN
  }
}

function getTeadsConfig() {
  return {
    token: `Bearer ${ tokens.TEADS_API_TOKEN }`,
    hostname: 'api.teads.tv',
    path: '/v1/analytics/custom/'
  }
}

function getMyTargetConfig() {
  return {
    token: `Bearer ${ tokens.MYTARGET_API_ACCESS }`,
    hostname: 'target.my.com',
    path: '/api/v2/statistics/partner/pads/day.json',
    pathForIds: '/api/v2/group_pads.json?limit=200'
  }
}

function getEPlanningConfig() {
  return {
    login: tokens.E_PLANNING_LOGIN,
    password: tokens.E_PLANNING_PASS,
    auth_token: tokens.E_PLANNING_TOKEN,
    hostname: 'admin.us.e-planning.net',
    path: '/admin/adnet/pub/stats/informe.html?intipo_id=5&informe_id=745&o=json'
  }
}

function getAdnetConfig() {
  return {
    "grant_type": "api_call",
    "client_id": tokens.ADNET_CLIENT_ID,
    "client_secret": tokens.ADNET_CLIENT_SECRET,
    "username": tokens.ADNET_LOGIN,
    "password": tokens.ADNET_PASSWORD
  }
}

function getLuponConfig() {
  return {
    token: tokens.LUPON_API_TOKEN
  }
}

function getMediaNetConfig () {
  return {
    login: tokens.MEDIANET_API_LOGIN,
    password: tokens.MEDIANET_API_PASSWORD
  }
}

function getSharethroughConfig () {
  return {
    token: tokens.SHARETHROUGH_API_BEARER_TOKEN
  }
}

function getIndexExchangeConfig () {
  return {
    username: tokens.INDEX_EXCHANGE_MAIL,
    password: tokens.INDEX_EXCHANGE_PASSWORD
  }
}

exports.programmaticConfigRetriever = programmaticConfigRetriever;
