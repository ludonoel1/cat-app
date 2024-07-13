from flask import Flask, jsonify, request
from dotenv import load_dotenv
from flask_cors import CORS, cross_origin
from utils import fetch_and_insert_data, get_db_connection
from psycopg2.extras import DictCursor
from flask_swagger_ui import get_swaggerui_blueprint
import os

# loads variables from .env file into environment
load_dotenv()
SWAGGER_URL = '/api/swagger'  # URL for exposing Swagger UI (without trailing '/')

# app instance
app = Flask(__name__)
CORS(app)
    
# endpoints
# get cats by searchterm and page: 
@app.route('/api/cats', methods=['GET'])
def get_paginated_filtered_cats():
    try:
        # Get parameters from the request
        search_term = request.args.get('searchTerm', '')
        page = int(request.args.get('page', 1))
        # Calculate offset for pagination
        results_per_page = 10
        offset = (page - 1) * results_per_page
        conn = get_db_connection()
        cursor = conn.cursor()
        # Create the SQL request
        if search_term:
            query = ''' SELECT * FROM cats WHERE name ILIKE %s ORDER BY id LIMIT %s OFFSET %s'''
            search_pattern = f'%{search_term}%'
            cursor.execute(query, (search_pattern, results_per_page, offset))
        else:
            query = '''SELECT * FROM cats ORDER BY id LIMIT %s OFFSET %s'''
            cursor.execute(query, (results_per_page, offset))
        columns = [x[0] for x in cursor.description]
        cats = cursor.fetchall()
        json_data = [dict(zip(columns, result)) for result in cats]
        cursor.close()
        conn.close()
        return jsonify(json_data)
    except KeyError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get All cats  UNUSED
#@app.route('/api/cats', methods=['GET'])
#def get_all_cats():
   # try:
   #     conn = get_db_connection()
   #     cursor = conn.cursor()
   #     cursor.execute('SELECT * FROM cats')
   #     columns = [x[0] for x in cursor.description]
   #     cats = cursor.fetchall()
   #     json_data=[]
   #     for result in cats:
   #         json_data.append(dict(zip(columns,result)))
   #     cursor.close()
   #     conn.close()
   #     return jsonify(json_data)
   # except KeyError as e :
   #     return jsonify({"error": str(e)}), 400
   # except Exception as e :
   #     return jsonify({"error": str(e)}), 500

# Get all favourite cats
@app.route('/api/favouritecats', methods=['GET'])
def get_favouritecats():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM favouritecats')
        columns = [x[0] for x in cursor.description]
        cats = cursor.fetchall()
        json_data=[]
        for result in cats:
            json_data.append(dict(zip(columns,result)))
        cursor.close()
        conn.close()
        return jsonify(json_data)
    except KeyError as e :
        return jsonify({"error": str(e)}), 400
    except Exception as e :
        return jsonify({"error": str(e)}), 500

# Post a new cat in favourite
@app.route('/api/cats', methods=['POST'])
def post_favourite_cat():
    try:
        conn = get_db_connection()
        cat= request.get_json()
        cursor = conn.cursor()
        create_sql = """
        INSERT INTO favouritecats (id, width, height, url, favourite, name, description) VALUES (%s, %s, %s, %s, %s, %s, %s);
        """
        print(cat)
        cursor.execute( create_sql,(cat['id'], cat['width'], cat['height'], cat['url'], True, cat['name'], cat['description']))
        cursor.execute(f'''UPDATE cats SET favourite = TRUE WHERE id = '{cat["id"]}';''')
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Updated cat favourite status'}), 200
    except KeyError as e :
        return jsonify({"error": str(e)}), 400
    except Exception as e :
        return jsonify({"error": str(e)}), 500

# get details from a cat id
@app.route('/api/cats/<string:id>', methods=['GET'])
def get_cat_by_id(id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(f"SELECT * FROM cats WHERE id='{id}'")
        column_names = [desc[0] for desc in cursor.description]
        cat_details = cursor.fetchone()
        json_data = dict(zip(column_names,cat_details))
        cursor.close()
        conn.close()
        return jsonify(json_data)
    except KeyError as e :
        return jsonify({"error": str(e)}), 400
    except Exception as e :
        return jsonify({"error": str(e)}), 500

# update cat details from a cat id
@app.route('/api/cats/<string:id>', methods=['PUT'])
def update_cat(id):
    try:
        conn = get_db_connection()
        cat= request.get_json()
        cursor = conn.cursor()
        update_sql = """
        UPDATE cats
        SET id=%s,width=%s,height=%s,url=%s,favourite=%s,name=%s,description=%s
        WHERE id=%s;
        """
        update_favourite_sql = """
        UPDATE favouritecats
        SET id=%s,width=%s,height=%s,url=%s,favourite=%s,name=%s,description=%s
        WHERE id=%s;
        """
        cursor.execute(update_sql,(cat['id'], cat['width'], cat['height'], cat['url'], cat['favourite'], cat['name'], cat['description'], id))
        cursor.execute(update_favourite_sql,(cat['id'], cat['width'], cat['height'], cat['url'], cat['favourite'], cat['name'], cat['description'], id))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Updated cat favourite successfully'}), 200
    except KeyError as e :
        return jsonify({"error": str(e)}), 400
    except Exception as e :
        return jsonify({"error": str(e)}), 500

# delete a cat from favourite by cat id
@app.route('/api/cats/<string:id>', methods=['DELETE'])
def delete_favourite_cat(id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        print(id)
        cursor.execute(f"DELETE FROM favouritecats WHERE id='{id}';")
        cursor.execute(f"UPDATE cats SET favourite = FALSE WHERE id = '{id}';")
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Favourite Cat deleted successfully'}), 200
    except KeyError as e :
        return jsonify({"error": str(e)}), 400
    except Exception as e :
        return jsonify({"error": str(e)}), 500


# run app
with app.app_context():
    conn = get_db_connection()
    fetch_and_insert_data(conn)

# Call factory function to create our blueprint
swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    "/static/swagger.json",
    config={
        'app_name': "Oh my cat Swagger"
    },
)

app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

if __name__ == "__main__":
    app.run(debug=False, port=8080)





