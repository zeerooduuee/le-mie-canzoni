from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
import jwt
from datetime import datetime, timedelta
from ..models import db, Utenti
from ..config import SECRET_KEY

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email e password sono richiesti'}), 400

    utente = Utenti.query.filter_by(email=email).first()

    if not utente or not utente.check_password(password):
        return jsonify({'message': 'Credenziali non valide'}), 401

    # Crea token JWT con informazioni utente
    payload = {
        'id': utente.id,
        'email': utente.email,
        'nome': utente.nome,
        'exp': datetime.utcnow() + timedelta(days=1)  # Scade tra 1 giorno
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

    return jsonify({
        'token': token,
        'nome': utente.nome,
        'foto': utente.foto,
        'message': 'Login effettuato con successo'
    }), 200

@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    nome = data.get('nome')
    sesso = data.get('sesso')  # opzionale, ma nel modello ce l’hai

    # Validazione dei campi
    if not email or not password or not nome or not sesso:
        return jsonify({'message': 'Tutti i campi sono richiesti'}), 400
    
    # Validazione email
    if '@' not in email or '.' not in email:
        return jsonify({'message': 'Email non valida'}), 400
    
    # Validazione password
    if len(password) < 6:
        return jsonify({'message': 'La password deve essere di almeno 6 caratteri'}), 400
    
    # Validazione sesso
    if sesso not in ['M', 'F', 'A']:
        return jsonify({'message': 'Sesso non valido'}), 400

    # Controlla se utente già esiste
    if Utenti.query.filter_by(email=email).first():
        return jsonify({'message': 'Un utente con questa email è già registrato'}), 400

    try:
        nuovo_utente = Utenti(
            email=email,
            password=password,  # Il modello dovrebbe gestire l'hashing
            nome=nome,
            sesso=sesso
        )

        db.session.add(nuovo_utente)
        db.session.commit()

        return jsonify({
            'message': 'Registrazione completata con successo! Ora puoi effettuare il login.',
            'success': True
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Errore durante la registrazione. Riprova più tardi.'}), 500