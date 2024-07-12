# Function to fetch data from the API and insert it into the table
def fetch_and_insert_data():
    cursor = conn.cursor()
    cursor.execute('SELECT count(*) FROM cats')
    nb_cats= cursor.fetchone()
    if nb_cats[0] == 0 : 
        response = requests.get(os.environ.get("API_URL"))
        cats = response.json()  # Assuming the API returns a JSON response
        cursor = conn.cursor()
        for cat in cats:
            cursor.execute('''
                INSERT INTO cats (id, width, height, url, favourite) VALUES (%s, %s, %s, %s, %s)
            ''', (cat['id'], cat['width'], cat['height'], cat['url'], False))
        conn.commit()
        cursor.close()