# server/app/__init__.py

from flask import Flask, send_from_directory
from flask_cors import CORS
import os
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

    # Route per servire i file statici delle foto profilo
    @app.route('/uploads/foto-profilo/<filename>')
    def uploaded_file(filename):
        uploads_folder = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'uploads', 'foto-profilo')
        return send_from_directory(uploads_folder, filename)

    app.register_blueprint(main)
    app.register_blueprint(auth, url_prefix='/auth')
    app.register_blueprint(utenti, url_prefix='/utenti')

    return app
