## Endpoint: Update a Product

### **Core Function**
Updates information for a specific physical product. This endpoint supports partial updates.
*(Note: This endpoint cannot be used to add/remove images or update variants; use their specific endpoints for those actions.)*

### **Request Details**
* **Method:** `POST`
* **URL:** `https://api.squarespace.com/{api-version}/commerce/products/{id}`

### **Authentication**
* **Required:** Yes
* **Method:** Bearer Token
* **Header:** `Authorization: Bearer YOUR_API_KEY_OR_OAUTH_TOKEN`
* **Header:** `Content-Type: application/json`

### **URL Parameters**
* `{api-version}` (string):
    * **Condition:** Required.
    * **Description:** The version of the API.
* `{id}` (string):
    * **Condition:** Required.
    * **Description:** The unique `id` of the `Product` to update.

### **Request Body (JSON)**
A JSON object containing the fields to be updated. Any optional fields may be omitted.

**Key Optional Fields:**
* `name` (string): Product name.
* `description` (string): HTML description of the product.
* `urlSlug` (string): URL-friendly identifier.
* `tags` (array of strings): Keywords for search.
* `isVisible` (boolean): Whether the product is available for purchase.
* `variantAttributes` (array of strings): List of attributes (e.g., "Color", "Size").
* `seoOptions` (object): SEO title and description.

### **Successful Response (200 OK)**
Returns the full JSON object for the `Product` that was just updated.

### **Common Errors**
* `400 BAD REQUEST`:
    * **Reason:** The request body does not conform to the required specification.
* `404 NOT FOUND`:
    * **Reason:** The `id` provided does not match an existing product.
* `405 METHOD NOT ALLOWED`:
    * **Reason:** The product requested is not a `PHYSICAL` product.
* `409 CONFLICT`:
    * **Reason:** A conflict occurred, such as the `URL_SLUG_IN_USE`.