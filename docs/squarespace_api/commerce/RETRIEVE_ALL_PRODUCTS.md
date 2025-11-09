## Endpoint: Retrieve All Products

### **Core Function**
Fetches a paginated list of all products (e.g., `PHYSICAL`, `DIGITAL`) available on a merchant's site.

### **Request Details**
* **Method:** `GET`
* **URL:** `https://api.squarespace.com/{api-version}/commerce/products`

### **Authentication**
* **Required:** Yes
* **Method:** Bearer Token
* **Header:** `Authorization: Bearer YOUR_API_KEY_OR_OAUTH_TOKEN`

### **Query Parameters**
* `modifiedAfter` (string):
    * **Condition:** Conditional. Must be used with `modifiedBefore`. Cannot be used with `cursor`.
    * **Description:** ISO 8601 UTC timestamp. Filters for products modified *after* this time.
* `modifiedBefore` (string):
    * **Condition:** Conditional. Must be used with `modifiedAfter`. Cannot be used with `cursor`.
    * **Description:** ISO 8601 UTC timestamp. Filters for products modified *before* this time.
* `type` (string):
    * **Condition:** Required if *not* using `cursor`. Cannot be used with `cursor`.
    * **Description:** Comma-separated list of product types to retrieve.
    * **Values:** `PHYSICAL`, `DIGITAL`.
* `cursor` (string):
    * **Condition:** Conditional. Cannot be used with `modifiedAfter`, `modifiedBefore`, or `type`.
    * **Description:** The `pagination.nextPageCursor` value from a previous response to fetch the next page of results.

### **Successful Response (200 OK)**
Returns a JSON object with two top-level keys:

1.  `products` (array):
    * An array of `Product` objects (max 50 per page).
    * **Key fields per product:** `id`, `type`, `storePageId`, `name`, `description` (HTML), `url`, `variants` (array of variants including `sku`, `pricing`, `stock`), `images` (array).
2.  `pagination` (object):
    * An object containing pagination metadata.
    * `hasNextPage` (boolean): `true` if more results are available.
    * `nextPageCursor` (string): The cursor value to use for the next request.
    * `nextPageUrl` (string): A pre-constructed URL for the next page request.

### **Common Errors**
* `400 BAD REQUEST`:
    * **Reason:** Invalid parameter combination (e.g., using `cursor` with date filters).
    * **Reason:** Invalid or missing date parameters (e.g., `modifiedAfter` without `modifiedBefore`).
    * **Reason:** Invalid `cursor` value.