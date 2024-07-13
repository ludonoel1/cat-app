import psycopg2
import os
import requests

# Function to fetch data from the API and insert it into the table
def fetch_and_insert_data(conn):
    cursor = conn.cursor()
    cursor.execute('SELECT count(*) FROM cats')
    nb_cats= cursor.fetchone()
    if nb_cats[0] == 0 : 
        response = requests.get(os.environ.get("API_URL"))
        cats = response.json()  # Assuming the API returns a JSON response
        cursor = conn.cursor()
        for cat in cats:
            cursor.execute('''
                INSERT INTO cats (id, width, height, url, favourite,name, description) VALUES (%s, %s, %s, %s, %s, %s, %s)
            ''', (cat['id'], cat['width'], cat['height'], cat['url'], False, cat['breeds'][0]['name'], cat['breeds'][0]['description']))
        conn.commit()
        cursor.close()

# Set connection to the database
def get_db_connection():
    conn = psycopg2.connect(
            host=os.environ.get("DB_HOST"),
            database=os.environ.get("DB_NAME"),
            user=os.environ.get("DB_USER"),
            password=os.environ.get("DB_PASS"),
            port=os.environ.get("DB_PORT")
    )
    return conn