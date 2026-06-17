class Config:
    # Nota: root:@localhost indica que el usuario es 'root' y la contraseña está vacía
    SQLALCHEMY_DATABASE_URI = 'mysql+mysqlconnector://root:@localhost/inmobiliaria_db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False