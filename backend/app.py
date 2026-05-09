from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from routes.auth_routes import auth_bp
from routes.project_routes import project_bp
from routes.dashboard_routes import dashboard_bp
from routes.task_routes import task_bp

from config import Config
from models import (
    db,
    User,
    Project,
    ProjectMember,
    Task
)


def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    db.init_app(app)

    CORS(
        app,
        resources={
        r"/api/*": {
            "origins": [
                "http://localhost:5173",
                "https://team-task-manager-38g28nsya-vineet639s-projects.vercel.app"
            ]
        }
    }
    )

    JWTManager(app)

    with app.app_context():
        db.create_all()

    app.register_blueprint(
        auth_bp,
        url_prefix="/api/auth"
    )

    app.register_blueprint(
        project_bp,
        url_prefix="/api/projects"
    )

    app.register_blueprint(
        dashboard_bp,
        url_prefix="/api/dashboard"
    )

    app.register_blueprint(
        task_bp,
        url_prefix="/api/tasks"
    )

    @app.route("/")
    def home():
        return {
            "message":
            "🚀 Team Task Manager API Running"
        }

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)