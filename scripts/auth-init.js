const msalConfig = {
  auth: {
    clientId: '8c729dca-8729-4284-a2fc-f36e4405f93c', // your Entra ID app's Client ID
    authority: 'https://login.microsoftonline.com/fa7b1b5a-7b34-4387-94ae-d2c178decee1', // your Tenant ID
    redirectUri: window.location.origin,
  },
};

// Create the MSAL client application instance
const msalInstance = new msal.PublicClientApplication(msalConfig);

async function ensureSignedIn() {
  // Check if we already have a logged-in account
  let accounts = msalInstance.getAllAccounts();

  if (accounts.length === 0) {
    // No active session: trigger Azure AD login (no extra Graph scopes)
    await msalInstance.loginRedirect();
    return; // browser will redirect away
  }

  const account = accounts[0];
  const claims = account.idTokenClaims || {};

  // Expose the current user globally so blocks can read it
  window._user = {
    id: claims.oid,
    name: claims.name,
    email: claims.preferred_username || claims.email,
    roles: claims.roles || [],
  };
}

// Handle the redirect back from Azure AD, then make sure we have a signed-in user
msalInstance
  .handleRedirectPromise()
  .then(() => ensureSignedIn())
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('MSAL error', err);
  });

