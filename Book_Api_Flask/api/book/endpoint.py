import os
from flask import Blueprint, jsonify, request, send_from_directory
from werkzeug.utils import secure_filename
from api.database.database import get_connection
import mysql.connector
from flasgger import swag_from
from datetime import datetime
import msgpack
from helper.formvalidation import get_upload_file
from api.auth.endpoints import token_required, admin_required
book_endpoint = Blueprint('book_endpoint', __name__)
upload_folder = "uploads"
os.makedirs(upload_folder, exist_ok=True)

def default_date_handler(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError("Type not serializable")

@book_endpoint.route('/booklist', methods=['GET'])
@token_required
def read_books(current_user):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM books")
        books = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify({"{+} Books": books}), 200
    except mysql.connector.Error as e:
        return jsonify({"{-} Error": str(e)}), 500

@book_endpoint.route('/upload', methods=['POST'])
@token_required
@admin_required
def upload_book(current_user):
    try:
        required = get_upload_file(["book_title", "book_author", "description", "genre"])

        if 'file' not in request.files or request.files['file'].filename == '':
            return jsonify({"{-} Error": "No file part in the request"}), 400

        file = request.files['file']
        filename = secure_filename(file.filename)
        file_path = os.path.join(upload_folder, filename)
        file.save(file_path)

        # Save book info + file path
        connection = get_connection()
        cursor = connection.cursor()
        insert_query = """
            INSERT INTO books (book_title, book_author, description, genre, file_path)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (
            required['book_title'],
            required['book_author'],
            required['description'],
            required['genre'],
            file_path
        ))
        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({"{+} Success": "Book uploaded successfully"}), 201

    except mysql.connector.Error as e:
        return jsonify({"{-} Error": str(e)}), 500


@book_endpoint.route('/download/<int:book_id>', methods=['GET'])
@token_required
def download_book(current_user, book_id):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT file_path FROM books WHERE book_id = %s", (book_id,))
        book = cursor.fetchone()
        cursor.close()
        conn.close()

        if not book:
            return jsonify({"{-} Error": "Book not found"}), 404

        file_path = book['file_path']
        if not os.path.exists(file_path):
            return jsonify({"{-} Error": "File does not exist"}), 404

        return send_from_directory(upload_folder, os.path.basename(file_path), as_attachment=True)

    except mysql.connector.Error as e:
        return jsonify({"{-} Error": str(e)}), 500
    
@book_endpoint.route('/delete/<int:book_id>', methods=['DELETE'])
@token_required
@admin_required

def delete_book(current_user, book_id):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT file_path FROM books WHERE book_id = %s", (book_id,))
        book = cursor.fetchone()
        if not book:
            return jsonify({"{-} Error": "Book does not exist"}), 404
        file_path = book[0]
        cursor.execute("DELETE FROM books WHERE book_id = %s", (book_id,))
        conn.commit()
        cursor.close()
        conn.close()
        if os.path.exists(file_path):
            os.remove(file_path)
            return jsonify({"{+} Success": "Book has been Deleted!"}), 200
        else:
            return jsonify({"{-} Error": "File does not exist"}), 404

    except mysql.connector.Error as e:
        return jsonify({"{-} Error": str(e)}), 500
@book_endpoint.route('/update/<int:book_id>', methods=['PUT'])
@token_required
@admin_required

def update_book(current_user, book_id):
    try:
        required = get_upload_file(["book_title", "book_author", "description", "genre"])

        file_path = None

        if 'file' in request.files and request.files['file'].filename != '':
            file = request.files['file']
            filename = secure_filename(file.filename)
            file_path = os.path.join(upload_folder, filename)
            file.save(file_path)

        conn = get_connection()
        cursor = conn.cursor()

        if file_path:
            # update file too
            update_query = """
                UPDATE books SET book_title = %s, book_author = %s, description = %s, genre = %s, file_path = %s
                WHERE book_id = %s
            """
            cursor.execute(update_query, (
                required['book_title'],
                required['book_author'],
                required['description'],
                required['genre'],
                file_path,
                book_id
            ))
        else:
            # update only text fields
            update_query = """
                UPDATE books SET book_title = %s, book_author = %s, description = %s, genre = %s
                WHERE book_id = %s
            """
            cursor.execute(update_query, (
                required['book_title'],
                required['book_author'],
                required['description'],
                required['genre'],
                book_id
            ))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"{+} Success": "Book updated successfully"}), 200

    except mysql.connector.Error as e:
        return jsonify({"{-} Error": str(e)}), 500