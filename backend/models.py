from flask_sqlalchemy import SQLAlchemy
from enum import Enum
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class UserRole(Enum):
    ADMIN = "admin"
    MEMBER = "member"

class User(db.Model):
    __tablename__ = "users"
    
    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False)

    email = db.Column(db.String(250), unique=True, nullable=False)

    password_hash = db.Column(db.String(250), nullable=False)

    role = db.Column(db.Enum(UserRole), nullable=False, index=True)

    is_active = db.Column(db.Boolean, default=True, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def set_password(self, password: str) -> None:
        if not password:
            raise ValueError("Password cannot be empty.")
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password: str) -> bool:
        if not self.password_hash:
            return False
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role.value,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat()
        }
    
    def __repr__(self):
        return f"<User {self.email} role={self.role.value}>"

class Project(db.Model):
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(250), nullable=False)

    description = db.Column(db.Text, nullable=True)

    created_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    creater = db.relationship("User", backref=db.backref("projects", lazy=True))

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "created_by": self.created_by,
            "created_at": self.created_at.isoformat()
        }

    def __repr__(self):
        return f"<Project {self.title}>"
    
class ProjectMember(db.Model):
    __tablename__ = "project_members"

    id = db.Column(db.Integer, primary_key=True)

    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"), nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    joined_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    user = db.relationship("User", backref=db.backref("project_memberships", lazy=True))

    project = db.relationship("Project", backref=db.backref("members", lazy=True))

    __table_args__ = (
        db.UniqueConstraint('project_id', 'user_id', name='unique_project_member'),
    )

    def __repr__(self):
        return f"<ProjectMember project_id={self.project_id} user_id={self.user_id}>"
    
class TaskStatus(Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"

class TaskPriority(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class Task(db.Model):
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(250), nullable=False)

    description = db.Column(db.Text, nullable=True)

    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"), nullable=False)

    assigned_to = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)

    status = db.Column(db.Enum(TaskStatus), default=TaskStatus.TODO, nullable=False)

    priority = db.Column(db.Enum(TaskPriority), default=TaskPriority.MEDIUM, nullable=False)

    due_date = db.Column(db.DateTime, nullable=True)

    submission_url = db.Column(db.String(500), nullable=True)

    created_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    project = db.relationship("Project", backref=db.backref("tasks", lazy=True))

    assigned_user = db.relationship("User", foreign_keys=[assigned_to], backref=db.backref("assigned_tasks", lazy=True))

    creator = db.relationship("User", foreign_keys=[created_by], backref=db.backref("created_tasks", lazy=True))

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "project_id": self.project_id,
            "assigned_to": self.assigned_to,
            "assigned_user_name":
                self.assigned_user.name
                if self.assigned_user
                else None,
            "status": self.status.value,
            "priority": self.priority.value,
            "due_date":
                self.due_date.isoformat()
                if self.due_date
                else None,
            "submission_url": self.submission_url,
            "created_by": self.created_by,
            "created_at":
                self.created_at.isoformat(),
        }

    def __repr__(self):
        return f"<Task {self.title} status={self.status.value} priority={self.priority.value}>"