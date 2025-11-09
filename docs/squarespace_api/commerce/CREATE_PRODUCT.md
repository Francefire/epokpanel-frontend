## Endpoint: Create a Product

### **Core Function**
Creates a new physical product with at least one variant.

### **Request Details**
* **Method:** `POST`
* **URL:** `https://api.squarespace.com/{api-version}/commerce/products`

### **Authentication**
* **Required:** Yes
* **Method:** Bearer Token
* **Header:** `Authorization: Bearer YOUR_API_KEY_OR_OAUTH_TOKEN`
* **Header:** `Content-Type: application/json`

### **Request Body (JSON)**
A JSON object representing the product to be created.

**Key Required Fields:**
* `type` (string): The product type. Must be set to `PHYSICAL`.
* `storePageId` (string): The ID of the Store Page to add the product to.
* `variants` (array): An array of at least one variant object.
    * **Inside `variants` object:**
        * `sku` (string): A unique SKU for the variant.
        * `pricing` (object):
            * `basePrice` (object):
                * `currency` (string): ISO 4217 currency code (e.g., `USD`).
                * `value` (string): Monetary amount.

**Key Optional Fields:**
* `name` (string): Product name.
* `description` (string): HTML description of the product.
* `urlSlug` (string): URL-friendly identifier.
* `isVisible` (boolean): Whether the product is available for purchase (defaults to `false`).
* `variantAttributes` (array): List of attributes (e.g., "Flavor").
* `stock` (object): Stock levels for a variant (e.g., `quantity`, `unlimited`).
* `shippingMeasurements` (object): Weight and dimensions for a variant.

### **Successful Response (201 CREATED)**
Returns the full JSON object for the newly created `Product`, including its generated `id`, `variants`, and other details.

### **Common Errors**
* `400 BAD REQUEST`:
    * **Reason:** The request body does not conform to the required specification (e.g., missing required fields).
* `405 METHOD NOT ALLOWED`:
    * **Reason:** The product type specified is not `PHYSICAL`.
* `409 CONFLICT`:
    * **Reason:** A conflict occurred, such as:
        * `CURRENCY_MISMATCH`: A specified currency does not match the store's currency.
        * `URL_SLUG_IN_USE`: The provided `urlSlug` is already taken.
        * `STORE_PAGE_PRODUCT_LIMIT_REACHED`: The Store Page has reached its product limit.