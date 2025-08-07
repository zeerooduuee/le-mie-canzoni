# server/run.py

from app import create_app

app = create_app()

if __name__ == "__main__":
    # Avvia il server in modalità di sviluppo con debug attivo
    app.run(debug=True)
