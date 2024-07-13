# React-Python Oh my cat ! 🐱

Welcome to the React-Python Oh my Cat! This application allows users to view, search, update and manage their favorite cats.
It's built using React for the frontend and python Flask for the backend and a postgres database.

## Getting Started 🚀

### Prerequisites:

- Node.js and npm installed on your machine.
- Python3 and Flask installed on your machine or you can activate an environment (https://flask.palletsprojects.com/en/3.0.x/installation/)
- psql and postgres installed on your machine.

### Setting Up:

1. **Verify you have psql installed**:
    ```bash
    psql --version
    ```
2. **Install psql (if not already installed)**:
    ```bash
    brew doctor
    brew update
    brew install libpq
    brew link --force libpq
    ```

3. **Clone the Repository**:
   ```bash
   git clone https://github.com/ludonoel1/cat-app.git
   cd cat-app
   ```

4. **Create your database**:

   - Run the script create_database.sql:
     ```bash
     psql -U POSTGRES_USERNAME -f create_database.sql
     ```
   - Please verify that your databse has been created
   
5. **Setting up your backend**:

   - Put your own value in file '.env':
     -  DB_USER = DB_USERNAME
        DB_PASS = DB_USER_PASSWORD
        DB_PORT = PORT

   - **Run server**:
     - You can run this: 
     ```bash
       make run
       ```
     - or this: 
     ```bash
       npm run server
       ```

6. **Setting up the Frontend**:

   - Navigate to the frontend directory:
     ```bash
     cd client
     ```

   - Install the necessary packages:
     ```bash
     npm install
     ```

   - Start the frontend development server:
     ```bash
     npm run dev
     ```
     or
      ```bash
     cd ..
     npm run client
     ```
