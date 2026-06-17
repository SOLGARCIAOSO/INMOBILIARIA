from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Inmueble(db.Model):
    __tablename__ = 'inmuebles'

    # Identificador
    id = db.Column(db.Integer, primary_key=True)

    # Información básica
    titulo = db.Column(db.String(150), nullable=False)
    descripcion = db.Column(db.Text)
    precio = db.Column(db.Numeric(15, 2), nullable=False, index=True)
    fecha_publicacion = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())

    # Tipo de inmueble
    tipo_inmueble = db.Column(db.String(50), nullable=False)

    # Características generales
    antiguedad = db.Column(db.Integer)
    estrato = db.Column(db.Integer)
    remodelado = db.Column(db.Boolean, default=False)

    # Distribución
    area = db.Column(db.Float)
    habitaciones = db.Column(db.Integer, default=0)
    banos = db.Column(db.Integer, default=0)
    cantidad_garajes = db.Column(db.Integer, default=0)

    # Servicios y características (Booleanos)
    deposito = db.Column(db.Boolean, default=False)
    porteria = db.Column(db.Boolean, default=False)
    zona_lavanderia = db.Column(db.Boolean, default=False)
    gas = db.Column(db.Boolean, default=False)
    parqueadero = db.Column(db.Boolean, default=False)

    # Ubicación
    ciudad = db.Column(db.String(100), nullable=False, index=True)
    localidad = db.Column(db.String(100))
    direccion = db.Column(db.String(200), nullable=False)
    enlace_maps = db.Column(db.String(500))

    # Estado de publicación
    estado = db.Column(db.String(50), default='Disponible')

    # Relaciones
    imagenes = db.relationship(
        'Imagen',
        backref='inmueble',
        lazy=True,
        cascade="all, delete-orphan"
    )

class Imagen(db.Model):
    __tablename__ = 'imagenes'

    id = db.Column(db.Integer, primary_key=True)
    ruta = db.Column(db.String(255), nullable=False)
    inmueble_id = db.Column(db.Integer, db.ForeignKey('inmuebles.id'), nullable=False)

class Contacto(db.Model):
    __tablename__ = 'contactos'

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(150), nullable=False)
    documento_identidad = db.Column(db.String(50))
    telefono = db.Column(db.String(30))
    email = db.Column(db.String(100))
    tipo_solicitud = db.Column(db.String(50))
    mensaje = db.Column(db.Text)
    fecha_registro = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())

    inmueble_id = db.Column(db.Integer, db.ForeignKey('inmuebles.id'), nullable=False)