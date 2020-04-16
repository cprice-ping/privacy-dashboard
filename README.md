# PingDirectory Privacy Dashboard

## Overview

The PingDirectory Privacy Dashboard is an example app that can be used
for organizations to capture consent from users, and for users to
review, update, and revoke consents previously given to the organization.

## Install and Configure the Privacy Dashboard

To use the PingDirectory Privacy Dashboard you must
1. Configure the PingDirectory Consent Service
1. Build and deploy this Privacy Dashboard webapp
1. Configure PingFederate so that users of the Privacy Dashboard can access the Consent Service

### Configure PingDirectory Consent API

Follow the steps in the
[PingDirectory Consent documentation](https://docs.pingidentity.com/bundle/pingdirectory-80/page/anv1564011487180.html)
to configure the Consent API on your PingDirectory server.

Remember your choices for these configuration items, as they will be needed later:
* Unprivileged OAuth scope on the Consent Service
* Identity Mapper `match-attribute` (the LDAP attributes used to search for the user)
* Access Token Validator `subject-claim-name` (the Access Token attribute used to search for the user)
 
### Prerequisites to build the Privacy Dashboard

You will need the following things properly installed on your computer 
in order to build and deploy the Privacy Dashboard.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
* [Yarn](https://yarnpkg.com/)
* [Ember CLI](https://ember-cli.com/)

### Build the Privacy Dashboard from source

Get the code if you haven't already:
* `git clone <repository-url>`

Customize for your environment:
* Copy `.env-example` to `.env` and customize.

> _Note:_ Make sure `OAUTH2_SCOPES` includes the unprivileged OAuth
> scopes you configured in your PingDirectory Consent Service earlier.

> _Note:_ If you plan to deploy the webapp to PingDirectory, it's best
> to match `PD_HOST_PORT` to the PingDirectory host and port you will use
> in your browser. Otherwise you will need to configure CORS
> for the PingDirectory Consent Service. 

Compile:
1. `cd ds-privacy-dashboard`
1. `git pull`
1. `yarn`
1. `ember build --environment production`

### Deploy to PingDirectory

You can deploy the webapp to any webserver. Follow these steps
if you want to deploy it to your PingDirectory server.

1. Copy the contents of the `dist` folder to a new folder under `PingDirectory/webapps`.
1. Configure a Web App Extension pointing to the directory.
1. Configure the HTTP(S) Connection Handler to use the new Web App Extension.
1. Restart the HTTP(S) Connection Handler for the changes to take effect.

For example, if you copied the contents of `dist` to `PingDirectory/webapps/privacy-dashboard`
then you would configure the server like this:

```bash
dsconfig -n create-web-application-extension 
    --extension-name "Privacy Dashboard"  \
    --set base-context-path:/privacy-dashboard  \
    --set document-root-directory:webapps/privacy-dashboard
dsconfig -n set-connection-handler-prop \
    --handler-name "HTTPS Connection Handler"  \
    --add "web-application-extension:Privacy Dashboard"
dsconfig -n set-connection-handler-prop \
    --handler-name "HTTPS Connection Handler"  \
    --set enabled:false  
dsconfig -n set-connection-handler-prop \
    --handler-name "HTTPS Connection Handler"  \
    --set enabled:true  
```

### Configure PingFederate

PingFederate must be configured with an OAuth Client as follows:
* Client ID is `privacy-dashboard`
* Redirect URI is the root URL to where you deployed the webapp, ending with a slash
* Supported scopes must at least contain those in `.env`
* `Implicit` grant type
* Access token contains the right attribute value to match a user in PingDirectory 

For example, if you copied the contents of `dist` to `PingDirectory/webapps/privacy-dashboard`
on the PingDirectory server at `https://pd.example.com:8443/console`,
then PingFederate would be configured with Redirect URI 
`https://pd.example.com:8443/privacy-dashboard/`.

Additionally, if the Identity Mapper you created in PingDirectory earlier is configured to search 
LDAP by `entryUUID`, and the Access Token Validator is configured with the `subject-claim-name`
of `sub`, then the Access Token Manager configured for the OAuth Client in PingFederate
must provide a `sub` attribute whose value originates from the user's LDAP `entryUUID`.

## Using the Privacy Dashboard

### Configure a Consent Definition and Localization

Before you capture your first consent you must configure PingDirectory with
a consent definition (i.e. a type of consent) and a consent localization
(i.e. the language to use in a prompt for consent.)

Let's define a consent which a user would give to their mobile service provider
authorizing the provider to share their account call history with partners
in order for the partners to analyze the data and recommend any plan changes:

```bash
dsconfig -n create-consent-definition \
    --definition-name share-call-history \
    --set "display-name:Share Call History"
dsconfig -n create-consent-definition-localization \
    --definition-name share-call-history \
    --localization-name en-US \
    --set version:1.0 \
    --set "title-text:Share your call history" \
    --set "data-text:Your call history including date and time, phone numbers, and durations" \
    --set "purpose-text:Our partners analyze this data to recommend alternate plans to better suit your usage"
```

### Capture your first consent

Now, acting as a user, open a browser to your Privacy Dashboard webapp
to prompt and capture consent. For example 
`https://pd.example.com:8443/privacy-dashboard/#/share-call-history/new`

### Review your consent(s)

After indicating 'Yes' or 'No', you are redirected to the Privacy Dashboard at
`https://pd.example.com:8443/privacy-dashboard/`

## Customizing Fine-Grained Consents

You may have noticed that the `share-call-history` consent includes
custom UI elements to capture the minimum duration of calls that a user
is willing to share. 

This is called a "fine-grained consent"--i.e. when a user's consent is more than
just a "yes" or "no" answer, but can be qualified with use-case-specific thresholds
and permissions.

### Building custom UI for fine grained consents

1. Add an html file to `/assets/fine-grained-consents` with the file name matching the consent definition unique ID (aka `definition-name` in dsconfig).
2. Include `iframe.css`, `iframe.js` in the head of the document.
3. Ensure your `body` element has the `id` of `consent-container`. For example: `<body id="consent-container">`
4. Define the handler that gets called with the existing fine-grained consent detail data when the page loads:   
```javascript
<script type="text/javascript">
    App.onInitialize(function(consentDetails) {
      // set your consent controls
    });
</script>
```
5. Set up your form controls necessary for the fine-grained consent detail data.
Attach events so that when the user modifies their fine-grained consent permissions
your code is triggered to save the fine-grained consent detail data:
```javascript
window.App.saveConsentDetails(consentDetails)
```
where `consentDetails` is an object or array to store in the `data` attribute of the consent record.

## Developer

Want to extend the Privacy Dashboard beyond just customizing the UI for fine-grained
consents? Follow these steps to run the Privacy Dashboard in dev mode.

### Prerequisites

Install these prerequites on your computer (same as up above).

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
* [Yarn](https://yarnpkg.com/)
* [Ember CLI](https://ember-cli.com/)

### Running in dev mode

* Copy `.env-example` to `.env` and customize.
* `yarn`
* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Extending the Ember app

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Copy the contents of the `dist` folder to a folder on your webserver.
Ensure that the webserver is configured to serve `index.html` by default.

## Further Reading / Useful Links

* [ember.js](https://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
