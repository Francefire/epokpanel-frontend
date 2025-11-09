## Endpoint: Retrieve Specific Products

### **Core Function**
Fetches one or more specific products (up to 50) by their unique IDs.

### **Request Details**
* **Method:** `GET`
* **URL:** `https://api.squarespace.com/{api-version}/commerce/products/{ids}`

### **Authentication**
* **Required:** Yes
* **Method:** Bearer Token
* **Header:** `Authorization: Bearer YOUR_API_KEY_OR_OAUTH_TOKEN`

### **URL Parameters**
* `{api-version}` (string):
    * **Condition:** Required.
    * **Description:** The version of the API (e.g., "1.1").
* `{ids}` (string):
    * **Condition:** Required.
    * **Description:** A single `id` or a comma-separated list of product `id`s to retrieve (e.g., "id1,id2,id3").

### **Successful Response (200 OK)**
Returns a JSON object with a single top-level key:

1.  `products` (array):
    * An array containing the full `Product` objects for each of the requested IDs.
    * **Key fields per product:** `id`, `type`, `storePageId`, `name`, `description` (HTML), `url`, `variants` (array), `images` (array).

*(Note: Unlike "Retrieve All Products", this endpoint does not return a `pagination` object, as it directly fetches specific resources.)*

### **Common Errors**
* `400 BAD REQUEST`:
    * **Reason:** The `{ids}` parameter specifies more than 50 products.
* `404 NOT FOUND`:
    * **Reason:** One or more of the `id`s provided in the request were not found.