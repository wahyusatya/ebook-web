from flask import Blueprint
from api.database.db_endpoint import database_endpoints
from api.book.endpoint import book_endpoint  

api = Blueprint('api', __name__)
api.register_blueprint(database_endpoints, url_prefix='/database')
api.register_blueprint(book_endpoint, url_prefix='/book') 
