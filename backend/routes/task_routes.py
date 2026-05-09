from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

from models import (
    db,
    Task,
    Project,
    ProjectMember,
    User,
    UserRole,
    TaskStatus,
    TaskPriority
)

from utils.decorators import role_required

task_bp = Blueprint("tasks", __name__)

from datetime import datetime

@task_bp.route("/", methods=["POST"])
@jwt_required()
@role_required(UserRole.ADMIN.value)
def create_task():

    data = request.get_json()

    title = data.get("title")

    description = data.get("description")

    project_id = data.get("project_id")

    assigned_to = data.get("assigned_to")

    priority = data.get(
        "priority",
        "medium"
    )

    due_date = data.get("due_date")

    if not title or not project_id:
        return jsonify({
            "message":
            "title and project_id are required"
        }), 400

    project = Project.query.get(project_id)

    if not project:
        return jsonify({
            "message":
            "Project not found"
        }), 404

    assigned_user = None

    if assigned_to:

        assigned_user = User.query.get(
            assigned_to
        )

        if not assigned_user:
            return jsonify({
                "message":
                "Assigned user not found"
            }), 404

        membership = (
            ProjectMember.query.filter_by(
                project_id=project_id,
                user_id=assigned_to
            ).first()
        )

        if not membership:
            return jsonify({
                "message":
                "User is not a project member"
            }), 400

    try:

        task_priority = TaskPriority(
            priority
        )

    except ValueError:

        return jsonify({
            "message":
            "Invalid priority"
        }), 400

    parsed_due_date = None

    if due_date:
        try:

            parsed_due_date = (
                datetime.fromisoformat(
                    due_date
                )
            )

        except ValueError:

            return jsonify({
                "message":
                "Invalid due date format"
            }), 400

    task = Task(
        title=title,
        description=description,
        project_id=project_id,
        assigned_to=assigned_to,
        priority=task_priority,
        due_date=parsed_due_date,
        created_by=int(
            get_jwt_identity()
        )
    )

    db.session.add(task)

    db.session.commit()

    return jsonify({
        "message":
        "Task created successfully",

        "task":
        task.to_dict()
    }), 201

@task_bp.route("/", methods=["GET"])
@jwt_required()
def get_tasks():
    user_id = int(get_jwt_identity())

    claims = get_jwt()

    role = claims.get("role")

    if role == UserRole.ADMIN.value:
        tasks = Task.query.all()
    else:
        tasks = Task.query.filter_by(
            assigned_to=user_id
        ).all()

    return jsonify({
        "tasks": [
            task.to_dict()
            for task in tasks
        ]
    }), 200

@task_bp.route("/<int:task_id>/status", methods=["PUT"])
@jwt_required()
def update_task_status(task_id):
    task = Task.query.get(task_id)

    if not task:
        return jsonify({
            "message": "Task not found"
        }), 404

    user_id = int(get_jwt_identity())

    claims = get_jwt()

    role = claims.get("role")

    if (
        role != UserRole.ADMIN.value
        and task.assigned_to != user_id
    ):
        return jsonify({
            "message": "Not authorized"
        }), 403

    data = request.get_json()

    status = data.get("status")
    submission_url = data.get(
        "submission_url"
    )

    if status == "done":
        task.submission_url = submission_url
    else:
        task.submission_url = None

    try:
        task.status = TaskStatus(status)
    except ValueError:
        return jsonify({
            "message": "Invalid status"
        }), 400

    db.session.commit()

    return jsonify({
        "message": "Task status updated",
        "task": task.to_dict()
    }), 200