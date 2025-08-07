from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class Utenti(db.Model):
    __tablename__ = 'utenti'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    nome = db.Column(db.String(100), nullable=False)
    foto = db.Column(db.String(255))
    sesso = db.Column(db.String(1), nullable=False)  # 'm' o 'f'
    data_creazione = db.Column(db.Date, default=datetime.utcnow)

    playlist = db.relationship('Playlist', backref='utente', lazy=True)

    # Password "finta" per gestione sicura
    @property
    def password(self):
        raise AttributeError("La password non può essere letta.")

    @password.setter
    def password(self, plain_password):
        self._password = generate_password_hash(plain_password)

    def check_password(self, plain_password):
        return check_password_hash(self._password, plain_password)

class Playlist(db.Model):
    __tablename__ = 'playlist'

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(255), nullable=False)
    copertina = db.Column(db.String(255))
    utente = db.Column(db.Integer, db.ForeignKey('utenti.id'), nullable=False)

    playlist_canzoni = db.relationship('PlaylistCanzoni', backref='playlist', lazy=True)

class Canzoni(db.Model):
    __tablename__ = 'canzoni'

    spotify_id = db.Column(db.String(100), primary_key=True)
    nome = db.Column(db.String(255), nullable=False)
    artista = db.Column(db.String(255), nullable=False)
    album = db.Column(db.String(255))
    copertina = db.Column(db.String(255))
    durata_ms = db.Column(db.Integer)

    playlist_canzoni = db.relationship('PlaylistCanzoni', backref='canzone', lazy=True)

class PlaylistCanzoni(db.Model):
    __tablename__ = 'playlist_canzoni'

    playlist = db.Column(db.Integer, db.ForeignKey('playlist.id'), primary_key=True)
    canzone = db.Column(db.String(100), db.ForeignKey('canzoni.spotify_id'), primary_key=True)
    posizione = db.Column(db.Integer)
    added_on = db.Column(db.Date, default=datetime.utcnow)
