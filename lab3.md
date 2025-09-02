# Lab Day 4: Validation & File Upload Refactor

In this lab, you will enhance your Express + MongoDB server by adding **data validation** using Joi and implementing **file upload** functionality, including a **refactor to middleware** and support for **CDN image upload**.

---

## Objectives

### 1. **Apply Joi Validation**  
- Install and use Joi to validate incoming request data (e.g. for user creation and post creation).
- Create two schemas:
  - One for full validation (used in `POST`)
  - One for partial validation (used in `PATCH` or `PUT`)


### 2. **Create Reusable Validation joi Middleware**


### 3. **File Upload to Server Folder**

- Use `multer` to handle single photo uploads (e.g. for user  and post ).
- Upload images to a folder like `/uploads`, then store the file path in MongoDB.


### 4. **CDN Upload Integration (e.g. ImageKit)**

- Use SDK (like `imagekit`) to upload the file directly to the CDN, not to your server.
- Skip storing the file locally.
- Refactor the upload middleware to send the buffer to the CDN and get back the image URL.


## Additional Notes

- Use `.env` for CDN credentials
- Keep all middleware modular and reusable
- Store final image URLs in MongoDB

---

### BONUS

- Validate image types and sizes 
- Validate password confirm mast match password
- change validation error message