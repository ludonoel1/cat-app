from flask import Flask, jsonify
from flask_cors import CORS
import os
import psycopg2
from dotenv import load_dotenv
import requests
# loads variables from .env file into environment
load_dotenv()

# app instance
app = Flask(__name__)
CORS(app)

# /api/home
@app.route("/api/home", methods=['GET'])
def return_home():
    return jsonify({
        'message': "Hello world!"
    })
    return requests.get('http://example.com').content

# Function to create the PostgreSQL table
def create_table():
    conn = psycopg2.connect(
        host=os.environ.get("DB_HOST"),
        database=os.environ.get("DB_NAME"),
        user=os.environ.get("DB_USER"),
        password=os.environ.get("DB_PASS"),
        port=os.environ.get("DB_PORT")
    )
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS cats (
            id VARCHAR(255),
            width VARCHAR(255),
            height VARCHAR(255) ,
            url VARCHAR(255),
            favourite BOOLEAN
        )
    ''')
    conn.commit()
    cursor.close()
    conn.close()

def check_and_create_table(self):
    cursor.execute(“SELECT name FROM sqlite_master WHERE type=‘table’ AND name=‘my_table’“)
    if not cursor.fetchone(): 
        create_database()

# Function to fetch data from the API and insert it into the table
def fetch_and_insert_data():
    response = requests.get(os.environ.get("API_URL"))
    cats = response.json()  # Assuming the API returns a JSON response

    conn = psycopg2.connect(
        host=os.environ.get("DB_HOST"),
        database=os.environ.get("DB_NAME"),
        user=os.environ.get("DB_USER"),
        password=os.environ.get("DB_PASS"),
        port=os.environ.get("DB_PORT")
    )
    cursor = conn.cursor()
    print('init cats')
    print(len(cats))
    for cat in cats:
        cursor.execute('''
            INSERT INTO cats (id, width, height, url, favourite) VALUES (%s, %s, %s, %s, %s)
        ''', (cat['id'], cat['width'], cat['height'], cat['url'], False))
    
    conn.commit()
    cursor.close()
    conn.close()

@app.route('/api/cats', methods=['GET'])
def get_cats():
    conn = psycopg2.connect(
        host=os.environ.get("DB_HOST"),
        database=os.environ.get("DB_NAME"),
        user=os.environ.get("DB_USER"),
        password=os.environ.get("DB_PASS"),
        port=os.environ.get("DB_PORT")
    )
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

with app.app_context():
    create_table()
    fetch_and_insert_data()

if __name__ == "__main__":
    app.run(debug=False, port=8080)