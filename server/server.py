from flask import Flask, jsonify, request
import os
import psycopg2
from dotenv import load_dotenv
import requests
from utils import fetch_and_insert_data
# loads variables from .env file into environment
load_dotenv()
conn = psycopg2.connect(
        host=os.environ.get("DB_HOST"),
        database=os.environ.get("DB_NAME"),
        user=os.environ.get("DB_USER"),
        password=os.environ.get("DB_PASS"),
        port=os.environ.get("DB_PORT")
    )
# app instance
app = Flask(__name__)

# endpoints
# Get All cats
@app.route('/api/cats', methods=['GET'])
def get_cats():
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM cats')
    columns = [x[0] for x in cursor.description]
    cats = cursor.fetchall()
    json_data=[]
    for result in cats:
        json_data.append(dict(zip(columns,result)))
    cursor.close()
    conn.close()
    
    return jsonify(json_data)

# Post a new cat in favourite
@app.route('/api/cats', methods=['POST'])
def get_cats():
    d_cat_data= request.form.to_dict()
    id_cat= d_cat_data.id
    
    cursor = conn.cursor()
    cursor.execute(f'UPDATE cats SET favourite = TRUE WHERE id = {id_cat};')
    cursor.execute('''
                INSERT INTO cats (id, width, height, url, favourite) VALUES (%s, %s, %s, %s, %s)
            ''', (cat['id'], cat['width'], cat['height'], cat['url'], False))
        conn.commit()
    cursor.close()
    conn.close()
    
    return jsonify(json_data)

# run app
with app.app_context():
    fetch_and_insert_data()

if __name__ == "__main__":
    app.run(debug=False, port=8080)



•	GET /cats to retrieve all cat data.
•	POST /cats to add a new cat to favorites.
•	GET /cats/:id to retrieve a specific cat's details.
•	PUT /cats/:id to update a specific cat's details.
•	DELETE /cats/:id to remove a cat from favorites.
•	The back-end should also include an endpoint or function to fetch 100 random cats from TheCatAPI and store their data in the PostgreSQL database upon initial application setup.
