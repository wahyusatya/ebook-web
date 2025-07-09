from flask import Blueprint, request, jsonify, current_app as app
from werkzeug.security import generate_password_hash, check_password_hash
from api.database.database import get_connection
import jwt
import datetime
from functools import wraps

auth_endpoint = Blueprint('auth', __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            conn = get_connection()
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM users WHERE email = %s", (data['email'],))
            current_user = cursor.fetchone()
            cursor.close()
            conn.close()
            if not current_user:
                return jsonify({'message': 'User not found!'}), 401
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(current_user, *args, **kwargs):
        if current_user['role'] != 'admin':
            return jsonify({'message': 'Admin access required!'}), 403
        return f(current_user, *args, **kwargs)
    return decorated

@auth_endpoint.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Email and password required!'}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    # Check if user already exists
    cursor.execute("SELECT * FROM users WHERE email = %s", (data['email'],))
    if cursor.fetchone():
        return jsonify({'message': 'User already exists!'}), 400

    # Check if this is the first user
    cursor.execute("SELECT COUNT(*) AS user_count FROM users")
    user_count = cursor.fetchone()['user_count']

    role = data.get('role', 'user')
    if role == 'admin' and user_count > 0:
        # Only allow admin creation if an admin is already logged in
        if 'Authorization' not in request.headers:
            return jsonify({'message': 'Admin creation requires admin privileges!'}), 403
        token = request.headers['Authorization'].split(" ")[1]
        try:
            token_data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            cursor.execute("SELECT * FROM users WHERE email = %s", (token_data['email'],))
            requester = cursor.fetchone()
            if not requester or requester['role'] != 'admin':
                return jsonify({'message': 'Admin creation requires admin privileges!'}), 403
        except:
            return jsonify({'message': 'Invalid token!'}), 401

    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')

    cursor.execute(
        "INSERT INTO users (email, password, role) VALUES (%s, %s, %s)",
        (data['email'], hashed_password, role)
    )
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'message': 'User registered successfully!'}), 201

@auth_endpoint.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Email and password required!'}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email = %s", (data['email'],))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not user or not check_password_hash(user['password'], data['password']):
        return jsonify({'message': 'Email or password is invalid'}), 401

    token = jwt.encode({
        'email': user['email'],
        'role': user['role'],
        'exp': datetime.datetime.utcnow() + app.config['JWT_ACCESS_TOKEN_EXPIRES']
    }, app.config['SECRET_KEY'])

    return jsonify({
        'token': token,
        'user': {
            'id': user['id'],
            'email': user['email'],
            'role': user['role']
        }
    }), 200
