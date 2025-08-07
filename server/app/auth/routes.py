from flask import Blueprint, request, jsonify
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

    if not utente or not utente.check_password(password):
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

@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    nome = data.get('nome')
    sesso = data.get('sesso')  # opzionale, ma nel modello ce l’hai

    if not email or not password or not nome or not sesso:
        return jsonify({'message': 'Campi mancanti'}), 400

    # Controlla se utente già esiste
    if Utenti.query.filter_by(email=email).first():
        return jsonify({'message': 'Utente già registrato'}), 400

    nuovo_utente = Utenti(
        email=email,
        password=password,
        nome=nome,
        sesso=sesso
    )

    db.session.add(nuovo_utente)
    db.session.commit()

    return jsonify({'message': 'Registrazione avvenuta con successo!'}), 201