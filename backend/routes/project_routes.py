from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from models import db, Project, ProjectMember, User
from utils.decorators import role_required
from models import UserRole

project_bp = Blueprint("projects", __name__)

@project_bp.route("/", methods=["POST"])
@jwt_required()
@role_required(UserRole.ADMIN.value)
def create_project():
    data = request.get_json()

    title = data.get("title")
    description = data.get("description")

    if not title:
        return jsonify({"message": "Title is required"}), 400

    user_id = int(get_jwt_identity())

    project = Project(
        title=title,
        description=description,
        created_by=user_id
    )

    db.session.add(project)
    db.session.commit()

    return jsonify({
        "message": "Project created successfully",
        "project": project.to_dict()
    }), 201

@project_bp.route("/", methods=["GET"])
@jwt_required()
def get_projects():
    user_id = int(get_jwt_identity())

    created_projects = Project.query.filter_by(created_by=user_id).all()

    memberships = ProjectMember.query.filter_by(user_id=user_id).all()

    member_project_ids = [m.project_id for m in memberships]

    member_projects = []

    if member_project_ids:
        member_projects = Project.query.filter(
            Project.id.in_(member_project_ids)
        ).all()

    all_projects = {
        project.id: project
        for project in created_projects + member_projects
    }

    return jsonify({
        "projects": [
            project.to_dict()
            for project in all_projects.values()
        ]
    }), 200

@project_bp.route("/<int:project_id>/members", methods=["POST"])
@jwt_required()
@role_required(UserRole.ADMIN.value)
def add_project_member(project_id):
    data = request.get_json()

    user_id = data.get("user_id")

    if not user_id:
        return jsonify({
            "message": "user_id is required"
        }), 400

    project = Project.query.get(project_id)

    if not project:
        return jsonify({
            "message": "Project not found"
        }), 404

    user = User.query.get(user_id)

    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    existing_member = ProjectMember.query.filter_by(
        project_id=project_id,
        user_id=user_id
    ).first()

    if existing_member:
        return jsonify({
            "message": "User already a project member"
        }), 400

    project_member = ProjectMember(
        project_id=project_id,
        user_id=user_id
    )

    db.session.add(project_member)
    db.session.commit()

    return jsonify({
        "message": "Member added successfully"
    }), 201