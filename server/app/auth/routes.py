from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from werkzeug.security import generate_password_hash
import jwt
from datetime import datetime, timedelta
from ..models import db, Utenti
from ..config import SECRET_KEY  # assicurati di averlo nel file config

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    utente = Utenti.query.filter_by(email=email).first()

    if not utente or not check_password_hash(utente.password, password):
        return jsonify({'message': 'Credenziali non valide'}), 401

    # Crea token JWT
    payload = {
        'id': utente.id,
        'email': utente.email,
        'exp': datetime.utcnow() + timedelta(days=1)  # Scade tra 1 giorno
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

    return jsonify({
        'token': token,
        'nome': utente.nome,
        'foto': utente.foto
    }), 200
