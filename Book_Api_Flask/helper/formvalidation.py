from flask import request, jsonify
from werkzeug.exceptions import BadRequest

def get_upload_file(required_fields):
    """Get the uploaded file from the request"""
    data = {}
    for field in  required_fields:
        field_value =  request.form.get(field)
        if not field_value:
            err_message = jsonify({
                "{-} Error": f"Missing Required Field : {field}"
            })
            raise BadRequest(response = err_message)
        data[field] = field_value
    return data