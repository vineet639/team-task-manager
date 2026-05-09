import os
from dotenv import load_dotenv

load_dotenv()

database_url = os.getenv("DATABASE_URL")

class Config:
    SQLALCHEMY_DATABASE_URI = database_url

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SECRET_KEY = os.getenv("SECRET_KEY")

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")