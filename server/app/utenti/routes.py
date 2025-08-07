from flask import Blueprint, request, jsonify
import jwt
import os
import time
from werkzeug.utils import secure_filename
from flask import send_from_directory
from ..models import db, Utenti
from ..config import SECRET_KEY

utenti = Blueprint('utenti', __name__)

# Configurazione upload
UPLOAD_FOLDER = 'uploads/foto-profilo'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@utenti.route('/upload-foto-profilo', methods=['POST'])
def upload_foto_profilo():
    # Verifica autenticazione
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Token mancante'}), 401
    
    try:
        # Decodifica JWT per ottenere user_id
        token = token.replace('Bearer ', '')
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user_id = payload['id']
        
        if 'file' not in request.files:
            return jsonify({'error': 'Nessun file selezionato'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'Nessun file selezionato'}), 400
        
        if file and allowed_file(file.filename):
            # Crea nome file unico
            filename = f"user_{user_id}_{int(time.time())}.{file.filename.rsplit('.', 1)[1].lower()}"
            filename = secure_filename(filename)
            
            # Assicurati che la cartella esista
            os.makedirs(UPLOAD_FOLDER, exist_ok=True)
            
            # Salva file
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(file_path)
            
            # Aggiorna database
            utente = Utenti.query.get(user_id)
            if not utente:
                return jsonify({'error': 'Utente non trovato'}), 404
                
            utente.foto = f"/utenti/uploads/profile_pictures/{filename}"
            db.session.commit()
            
            return jsonify({
                'message': 'Foto caricata con successo',
                'foto_url': utente.foto
            }), 200
        else:
            return jsonify({'error': 'Tipo di file non consentito'}), 400
            
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token scaduto'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Token non valido'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint per servire le immagini
@utenti.route('/uploads/profile_pictures/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@utenti.route('/profilo', methods=['GET'])
def get_profilo():
    # Verifica autenticazione
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Token mancante'}), 401
    
    try:
        # Decodifica JWT per ottenere user_id
        token = token.replace('Bearer ', '')
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user_id = payload['id']
        
        utente = Utenti.query.get(user_id)
        if not utente:
            return jsonify({'error': 'Utente non trovato'}), 404
            
        return jsonify({
            'id': utente.id,
            'nome': utente.nome,
            'email': utente.email,
            'sesso': utente.sesso,
            'foto': utente.foto,
            'data_registrazione': utente.data_registrazione.isoformat() if utente.data_registrazione else None
        }), 200
        
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token scaduto'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Token non valido'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@utenti.route('/profilo', methods=['PUT'])
def update_profilo():
    # Verifica autenticazione
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Token mancante'}), 401
    
    try:
        # Decodifica JWT per ottenere user_id
        token = token.replace('Bearer ', '')
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user_id = payload['id']
        
        utente = Utenti.query.get(user_id)
        if not utente:
            return jsonify({'error': 'Utente non trovato'}), 404
            
        data = request.get_json()
        
        # Aggiorna i campi se forniti
        if 'nome' in data:
            utente.nome = data['nome']
        if 'sesso' in data and data['sesso'] in ['M', 'F', 'A']:
            utente.sesso = data['sesso']
            
        db.session.commit()
        
        return jsonify({
            'message': 'Profilo aggiornato con successo',
            'nome': utente.nome,
            'sesso': utente.sesso,
            'foto': utente.foto
        }), 200
        
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token scaduto'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Token non valido'}), 401
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
