from app import app, db
from models import Apartamento

def cargar_datos():
    # Creamos 3 inmuebles de prueba con todos sus campos
    lista_inmuebles = [
        Apartamento(
            titulo="Apartamento en Cedritos", 
            descripcion="Vista exterior, excelente iluminación y acabados modernos.",
            precio=450000000, 
            ciudad="Bogotá",
            habitaciones=3,
            banos=2,
            parqueadero=1,
            conjunto_cerrado=True,
            estado="Disponible"
        ),
        Apartamento(
            titulo="Casa en El Poblado", 
            descripcion="Casa amplia con jardín privado, zonas verdes y seguridad 24 horas.",
            precio=850000000, 
            ciudad="Medellín",
            habitaciones=4,
            banos=3,
            parqueadero=2,
            conjunto_cerrado=True,
            estado="Disponible"
        ),
        Apartamento(
            titulo="Apartamento amoblado frente al mar", 
            descripcion="Excelente ubicación cerca a la playa, ideal para inversión.",
            precio=320000000, 
            ciudad="Barranquilla",
            habitaciones=2,
            banos=2,
            parqueadero=1,
            conjunto_cerrado=False,
            estado="Reservado"
        )
    ]
    
    with app.app_context():
        # Limpiamos los datos anteriores para evitar duplicados si corres esto varias veces
        Apartamento.query.delete() 
        db.session.add_all(lista_inmuebles)
        db.session.commit()
        print("¡3 apartamentos cargados exitosamente!")

if __name__ == '__main__':
    cargar_datos()

    