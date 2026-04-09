## ADDED Requirements

### Requirement: HTTPS-only access with HTTP redirect

The system SHALL be reachable only via HTTPS. Plain HTTP requests SHALL be redirected to the HTTPS equivalent with HTTP status 301.

#### Scenario: HTTP request is redirected

- **WHEN** `curl -I http://gelassenheitundlebensfreude.de/` is executed
- **THEN** the response status is 301 and the `Location` header points to an `https://` URL on the same host

### Requirement: Modern TLS

The system SHALL serve HTTPS with TLS 1.3, with TLS 1.2 as the minimum supported version.

#### Scenario: SSL Labs grade A

- **WHEN** an SSL Labs or testssl.sh scan is run against the site
- **THEN** the result is at least grade A and lists TLS 1.3 as supported

### Requirement: No cookies

The system SHALL NOT set any HTTP cookies — first-party or third-party — on any response.

#### Scenario: No Set-Cookie, no document.cookie

- **WHEN** every page type is loaded in a browser and inspected
- **THEN** no response contains a `Set-Cookie` header and `document.cookie` evaluates to an empty string

### Requirement: No third-party network requests

The system SHALL NOT load any resource (script, stylesheet, font, image, iframe, tracking pixel, XHR, or any other request) from a domain other than `gelassenheitundlebensfreude.de`.

#### Scenario: DevTools network panel shows only first-party requests

- **WHEN** any public page is loaded with a cleared cache
- **THEN** every request in the Network panel targets `gelassenheitundlebensfreude.de` and no other domain

### Requirement: Security response headers

The system SHOULD set the following security response headers on every HTML response:

- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `Content-Security-Policy` restricted to `'self'` for all directives except as required by inline per-article header-image styles; `script-src 'none'`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` that disables unused browser features (camera, microphone, geolocation, payment, USB, sensors)

#### Scenario: Security scanner grade A

- **WHEN** the site is scanned by Mozilla Observatory or securityheaders.com
- **THEN** the overall grade is at least A

### Requirement: GDPR data minimisation

The system SHALL process no personal data beyond what is technically required to deliver an HTTP response. No analytics, tracking, fingerprinting, or third-party processors SHALL be employed.

#### Scenario: Privacy policy can be written without cookie or tracking sections

- **WHEN** the owner drafts the Datenschutzerklärung against the deployed site's behaviour
- **THEN** the draft requires no section covering cookies, CDN resources, third-party services or tracking technologies

### Requirement: Client-log IP anonymisation

The Caddy access log SHALL anonymise the client IP address (e.g. by dropping or zeroing the last IPv4 octet / last 80 bits of IPv6) so that retained logs contain no full client IPs.

#### Scenario: Logs contain no full client IPs

- **WHEN** the production access log is sampled
- **THEN** no entry contains a full client IPv4 or IPv6 address
