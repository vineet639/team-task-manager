from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

from models import Task, UserRole, TaskStatus

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/stats", methods=["GET"])
@jwt_required()
def dashboard_stats():
    user_id = int(get_jwt_identity())

    claims = get_jwt()

    role = claims.get("role")

    if role == UserRole.ADMIN.value:
        tasks = Task.query.all()
    else:
        tasks = Task.query.filter_by(
            assigned_to=user_id
        ).all()

    total_tasks = len(tasks)

    completed_tasks = len([
        task for task in tasks
        if task.status == TaskStatus.DONE
    ])

    pending_tasks = len([
        task for task in tasks
        if task.status != TaskStatus.DONE
    ])

    progress = (
        int((completed_tasks / total_tasks) * 100)
        if total_tasks > 0 else 0
    )

    return jsonify({
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "pending_tasks": pending_tasks,
        "progress": progress
    }), 200

