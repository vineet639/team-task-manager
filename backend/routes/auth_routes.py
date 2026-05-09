from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

from models import db, User, UserRole

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "member")

    if not name or not email or not password:
        return jsonify({"message": "Name, email, and password are required"}), 400
    
    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({"message": "User with this email already exists"}), 400
    
    try:
        user_role = UserRole(role)
    except ValueError:
        return jsonify({"message": "Invalid role specified"}), 400
    
    user = User(
        name=name,
        email=email,
        role=user_role
    )

    user.set_password(password)

    db.session.add(user)
    db.session.commit()
    
    return jsonify({
        "message": "User registered successfully",
    }), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400
    
    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"message": "Invalid email or password"}), 401
    
    if not user.is_active:
        return jsonify({"message": "User account is inactive"}), 403
    
    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role.value}
    )

    return jsonify({
        "access_token": access_token,
        "user": user.to_dict()
    }), 200

@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = int(get_jwt_identity())

    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify(user.to_dict()), 200