# server/app/__init__.py

from flask import Flask, app
from flask_cors import CORS
from .models import db
from .routes import main
from .auth.routes import auth
from .utenti.routes import utenti

def create_app():
    # Crea l'app Flask
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'  # O PostgreSQL se vuoi già
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    CORS(app)

    app.register_blueprint(main)
    app.register_blueprint(auth, url_prefix='/auth')
    app.register_blueprint(utenti, url_prefix='/utenti')

    return app
