from flask import Blueprint, jsonify
from api.auth.endpoints import token_required, admin_required
from api.database.database import get_connection  # Make sure this import is correct

protected_data_endpoint = Blueprint('protected_data', __name__)

@protected_data_endpoint.route('/user', methods=['GET'])
@token_required
def user_data(current_user):
    return jsonify({
        'message': f'Hello {current_user["email"]}! This is protected user data.',
        'user': current_user
    }), 200

@protected_data_endpoint.route('/admin', methods=['GET'])
@token_required
@admin_required
def admin_data(current_user):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        # Select desired user info to return
        cursor.execute("SELECT id, email, role FROM users")
        users = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify({
            'message': f'Hello admin {current_user["email"]}! This is protected admin data.',
            'users': users
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
