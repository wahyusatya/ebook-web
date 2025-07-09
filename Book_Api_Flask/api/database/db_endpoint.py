from flask import Blueprint, jsonify
from api.database.database import get_connection
import mysql.connector

database_endpoints = Blueprint('database_endpoints', __name__)

# @database_endpoints.route('/tables', methods=['GET'])
# def get_table():
#     try:
#         conn = get_connection()
#         cursor = conn.cursor()
#         cursor.execute("SHOW TABLES")
#         tables = cursor.fetchall()
#         cursor.close()
#         conn.close()
#         return jsonify({"tables": [table[0] for table in tables]}), 200
#     except mysql.connector.Error as e:
#         return jsonify({"error": str(e)}), 500

@database_endpoints.route('/connection', methods =  ['GET'])
def connection():
    try:
        conn = get_connection()
        conn.close()
        return jsonify({"{+} Status": "Connection successful"}), 200
    except mysql.connector.Error as e:
        return jsonify({"{-} Error": str(e)}), 500
    
