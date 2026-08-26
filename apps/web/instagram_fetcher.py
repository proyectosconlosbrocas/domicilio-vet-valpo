import instaloader
import json
import itertools
import os
from datetime import datetime

# --- Configuración ---
USERNAME = "domicilio.vet.valpo"
SESSION_FILE_ACCOUNT = "frente.calamari"
TARGET_DIR = "assets/instagram"
JSON_OUTPUT_FILE = 'instagram_posts.json'
POST_COUNT = 9

# --- Script ---
print("Iniciando la actualización del feed de Instagram...")

# Crear una instancia de Instaloader
# No descargaremos videos ni metadatos para hacerlo más rápido
L = instaloader.Instaloader(
    download_videos=False,
    download_geotags=False,
    download_comments=False,
    save_metadata=False,
    compress_json=False,
    filename_pattern='{shortcode}' # Usamos el shortcode como nombre de archivo base
)

try:
    # Cargar la sesión de la cuenta que usamos para el login
    print(f"Cargando sesión de la cuenta '{SESSION_FILE_ACCOUNT}'...")
    L.load_session_from_file(SESSION_FILE_ACCOUNT)
    print("Sesión cargada con éxito.")

    # Crear el directorio de destino si no existe
    if not os.path.exists(TARGET_DIR):
        os.makedirs(TARGET_DIR)
        print(f"Directorio '{TARGET_DIR}' creado.")

    posts_data = []
    print(f"Obteniendo las últimas {POST_COUNT} publicaciones de '{USERNAME}'...")

    # Obtener el perfil
    profile = instaloader.Profile.from_username(L.context, USERNAME)

    # Descargar las imágenes y recolectar datos
    for post in itertools.islice(profile.get_posts(), POST_COUNT):
        # Construir la ruta local donde se guardará la imagen
        local_path = os.path.join(TARGET_DIR, f"{post.shortcode}.jpg").replace('\\', '/')
        post_page_url = f"https://www.instagram.com/p/{post.shortcode}/"

        # Descargar la imagen del post a la ruta especificada
        # Instaloader es suficientemente inteligente para no volver a descargar si el archivo ya existe
        if not os.path.exists(local_path):
            L.download_pic(filename=local_path, url=post.url, mtime=post.date)
            print(f"Descargada: {local_path}")
        
        # Añadir la información a nuestra lista
        posts_data.append({
            "image_local_url": local_path,
            "post_page_url": post_page_url
        })

    # Guardar los datos en el archivo JSON
    with open(JSON_OUTPUT_FILE, 'w') as f:
        json.dump(posts_data, f, indent=4)

    print(f"\n¡Éxito! Se han procesado las {len(posts_data)} publicaciones más recientes.")
    print(f"Las imágenes están en la carpeta '{TARGET_DIR}'.")
    print(f"El archivo '{JSON_OUTPUT_FILE}' ha sido actualizado.")

except FileNotFoundError:
    print(f"Error: No se encontró el archivo de sesión 'session-{SESSION_FILE_ACCOUNT}'.")
    print(f"Por favor, ejecuta 'instaloader --login={SESSION_FILE_ACCOUNT}' en tu terminal para iniciar sesión.")
except Exception as e:
    print(f"\nOcurrió un error inesperado: {e}")
    print("Asegúrate de que el perfil de Instagram sea público y que tu sesión no haya expirado.")