from flask import Flask, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from flasgger import Swagger
from api import api  # now works cleanly
from api.book.endpoint import book_endpoint
from api.database.db_endpoint import database_endpoints  
from api.auth.endpoints import auth_endpoint
from api.data_protected.endpoints import protected_data_endpoint
import os
import datetime
from config import config  # ADDED: Import config

load_dotenv()

app = Flask(__name__)

# CORS Configuration - Allow all origins for development
CORS(app, 
     origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"],
     supports_credentials=True)

Swagger(app)

# JWT Configuration - FIXED: Use config properly
app.config['SECRET_KEY'] = config.SECRET_KEY
app.config['JWT_SECRET_KEY'] = config.JWT_SECRET_KEY
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = config.JWT_ACCESS_TOKEN_EXPIRES

@app.route('/')
def home():
    return "Hello and welcome to the Book API :3"

app.register_blueprint(protected_data_endpoint, url_prefix='/protected')
app.register_blueprint(auth_endpoint, url_prefix='/api/auth')
app.register_blueprint(api, url_prefix='/api')
app.register_blueprint(book_endpoint, url_prefix='/api/book')
app.register_blueprint(database_endpoints, url_prefix='/database')

# Default Route for the API

# This route is for showing the book files from the upload directory, uncomment if you want to use it.
# @app.route('/uploads/<path:filename>')
# def serve_book_file(filename):
#     """Serve book files from the upload directory."""
#     return send_from_directory('uploads', filename)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)  # ADDED host and port explicitlyapi