from flask import Flask, render_template, request, redirect, url_for, flash
from config import Config
from flask_mail import Mail, Message

from modelos_db import db, Inmueble, Contacto, Imagen
import os
from werkzeug.utils import secure_filename

app = Flask(__name__, template_folder='templates')

# 1. Cargar configuraciones desde el objeto Config
app.config.from_object(Config)

# Asegurar configuración clave
app.secret_key = 'una_clave_muy_secreta_y_larga'
app.config['UPLOAD_FOLDER'] = 'static/uploads'

# Configuración de Flask-Mail
# --- Configuración para enviar correos REALES desde Gmail ---
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = 'garciaosorio04@gmail.com'
# Quitamos los espacios a la contraseña: vjfmqpkqhdnjgpam
app.config['MAIL_PASSWORD'] = 'vjfmqpkqhdnjgpam' 
app.config['MAIL_DEFAULT_SENDER'] = 'garciaosorio04@gmail.com'

mail = Mail(app)

# 2. Inicializar DB UNA SOLA VEZ
db.init_app(app)

# 3. Crear tablas (esto solo se ejecutará al iniciar la app)
with app.app_context():
    # Nota: db.drop_all() borra todo cada vez que reinicias el servidor.
    # Úsalo solo mientras estás en fase de pruebas iniciales.
    #db.drop_all() 
    db.create_all()
    
    # Crear carpeta de subidas si no existe
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])

# --- RUTAS ---

@app.route('/')
def inicio():
    return render_template('inicio.html')


@app.route('/quienes-somos')
def quienes_somos():
    return render_template('quienes_somos.html')


@app.route('/catalogo')
def catalogo():
    # 1. Recuperamos todo desde la tabla Inmueble
    inmuebles = Inmueble.query.all()
    
    # 2. Imprimimos en consola para ver si realmente encontró algo
    print(f"DEBUG: Se encontraron {len(inmuebles)} inmuebles en la base de datos.")
    
    # 3. Enviamos 'apartamentos' al template
    return render_template('catalogo.html', apartamentos=inmuebles)


@app.route('/politicas')
def politicas():
    return render_template('politicas.html')


@app.route('/inmueble/<int:id>')
def detalle_inmueble(id):
    inmueble = Inmueble.query.get_or_404(id) # Asegúrate de usar Inmueble
    return render_template('detalle.html', inmueble=inmueble)


# Esta ruta muestra el formulario (GET)
@app.route('/inmueble_form', methods=['GET'])
def registrar_inmueble():
    return render_template('inmueble_form.html')


# Esta ruta procesa los datos (POST)
import time # Añade esta importación arriba en tu app.py

@app.route('/admin/guardar', methods=['POST'])
def guardar_inmueble():
    # 1. Crear el objeto Inmueble
    nuevo_inmueble = Inmueble(
        titulo=request.form.get('titulo'),
        descripcion=request.form.get('descripcion'),
        precio=float(request.form.get('precio', 0)),
        tipo_inmueble=request.form.get('tipo_inmueble'),
        antiguedad=int(request.form.get('antiguedad', 0)),
        estrato=int(request.form.get('estrato', 0)),
        remodelado=True if request.form.get('remodelado') == 'on' else False,
        area=float(request.form.get('area', 0)),
        habitaciones=int(request.form.get('habitaciones', 0)),
        banos=int(request.form.get('banos', 0)),
        cantidad_garajes=int(request.form.get('cantidad_garajes', 0)),
        deposito=True if request.form.get('deposito') == 'on' else False,
        porteria=True if request.form.get('porteria') == 'on' else False,
        zona_lavanderia=True if request.form.get('zona_lavanderia') == 'on' else False,
        gas=True if request.form.get('gas') == 'on' else False,
        parqueadero=True if request.form.get('parqueadero') == 'on' else False,
        ciudad=request.form.get('ciudad'),
        localidad=request.form.get('localidad'),
        direccion=request.form.get('direccion'),
        enlace_maps=request.form.get('enlace_maps'),
        estado=request.form.get('estado')
    )
    
    db.session.add(nuevo_inmueble)
    db.session.commit() # Importante: commit aquí para que nuevo_inmueble tenga su ID
    
    # 2. Procesar imágenes con nombres únicos
    for i in range(6):
            archivo = request.files.get(f'imagen_{i}') # Buscamos imagen_0, imagen_1...
            if archivo and archivo.filename != '':
                timestamp = str(int(time.time()))
                nombre_archivo = f"{timestamp}_{i}_{secure_filename(archivo.filename)}"
                
                ruta_guardado = os.path.join(app.config['UPLOAD_FOLDER'], nombre_archivo)
                archivo.save(ruta_guardado)
                
                nueva_imagen = Imagen(ruta=nombre_archivo, inmueble_id=nuevo_inmueble.id)
                db.session.add(nueva_imagen)
        
    db.session.commit()
    flash("Inmueble guardado.", "success")
    return redirect(url_for('catalogo'))


@app.route('/contacto', methods=['GET', 'POST'])
def contacto():
    if request.method == 'POST':
        # 1. Captura de datos
        nombre = request.form.get('nombre')
        email = request.form.get('email')
        mensaje = request.form.get('mensaje')
        inmueble_id_str = request.form.get('inmueble_id')
        
        # 2. Validación robusta del ID
        if not inmueble_id_str or not inmueble_id_str.isdigit():
            flash("Error: No se pudo identificar la propiedad correctamente.", "danger")
            return redirect(url_for('catalogo'))
            
        inmueble_id = int(inmueble_id_str)

        # 3. Guardado en Base de Datos
        try:
            nuevo_contacto = Contacto(
                nombre=nombre,
                email=email,
                mensaje=mensaje,
                inmueble_id=inmueble_id
            )
            db.session.add(nuevo_contacto)
            db.session.commit()
        except Exception as e:
            db.session.rollback() # Si falla BD, revertimos cambios
            print(f"Error de Base de Datos: {e}")
            flash("Hubo un problema al guardar tu solicitud. Intenta de nuevo.", "danger")
            return redirect(url_for('catalogo'))

        # 4. Envío de Correo
        try:
            msg = Message(
                subject=f"Interés en propiedad ID: {inmueble_id}",
                recipients=['garciaosorio04@gmail.com']
            )
            msg.html = f"""
            <h3>Nueva solicitud de información</h3>
            <p><b>Cliente:</b> {nombre}</p>
            <p><b>Email:</b> {email}</p>
            <p><b>Propiedad ID:</b> {inmueble_id}</p>
            <p><b>Mensaje:</b> {mensaje if mensaje else 'El usuario solicita más información.'}</p>
            """
            mail.send(msg)
            flash("Solicitud recibida y notificada correctamente.", "success")
        except Exception as e:
            print(f"Error enviando email: {e}")
            # Guardamos en BD, pero notificamos el error de correo
            flash("Tu solicitud fue guardada, pero ocurrió un problema al enviar la notificación.", "warning")

        return redirect(url_for('catalogo'))

    # Si es GET: Pasamos 'ref' al template para que el formulario lo pinte
    ref = request.args.get('ref')
    return render_template('contacto.html', ref=ref)


@app.route('/editar/<int:id>', methods=['GET', 'POST'])
def editar_inmueble(id):
    inmueble = Inmueble.query.get_or_404(id) 

    if request.method == 'POST':
        # Asignación de campos de texto y números
        inmueble.titulo = request.form.get('titulo')
        inmueble.descripcion = request.form.get('descripcion')
        inmueble.precio = request.form.get('precio')
        inmueble.tipo_inmueble = request.form.get('tipo_inmueble')
        inmueble.ciudad = request.form.get('ciudad')
        inmueble.localidad = request.form.get('localidad')
        inmueble.direccion = request.form.get('direccion')
        inmueble.antiguedad = request.form.get('antiguedad')
        inmueble.estrato = request.form.get('estrato')
        inmueble.area = request.form.get('area')
        inmueble.habitaciones = request.form.get('habitaciones')
        inmueble.banos = request.form.get('banos')
        inmueble.cantidad_garajes = request.form.get('cantidad_garajes')
        inmueble.estado = request.form.get('estado')
        
        # Asignación de Checkboxes (esto convierte 'on' a True o None a False)
        inmueble.remodelado = bool(request.form.get('remodelado'))
        inmueble.deposito = bool(request.form.get('deposito'))
        inmueble.porteria = bool(request.form.get('porteria'))
        inmueble.gas = bool(request.form.get('gas'))
        
        db.session.commit()
        return redirect(url_for('catalogo'))

    return render_template('inmueble_form.html', inmueble=inmueble)

@app.route('/eliminar/<int:id>')
def eliminar_inmueble(id):
    inmueble = Inmueble.query.get_or_404(id)
    db.session.delete(inmueble)
    db.session.commit()
    return redirect(url_for('catalogo'))





if __name__ == '__main__':
    # host='0.0.0.0' permite que otros dispositivos vean tu app
    app.run(host='0.0.0.0', port=5000, debug=True)