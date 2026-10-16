# Estación de bomberos (app Android)

App que reúne tus tres páginas de trabajo y funciona sin conexión:

1. Programa de espacios (tabla dinámica, diagrama de flujo, matriz de relaciones)
2. Flujos de la estación (recorridos editables y simulación)
3. Zonificación del terreno

Lo que editas en cada página se guarda en el teléfono. Los archivos que descargas (CSV, SVG, PNG, JSON) van a la carpeta **Descargas**.

## Cómo obtener el APK

Necesitas Android Studio **Ladybug (2024.2)** o más reciente.

1. Abre Android Studio y elige **Open**. Selecciona esta carpeta (`bomberos-android`).
2. Espera a que termine **Gradle Sync**. La primera vez descarga componentes y necesita internet.
3. Menú **Build > Build App Bundle(s) / APK(s) > Build APK(s)**.
4. Cuando termine, pulsa **locate** en el aviso. El archivo es `app/build/outputs/apk/debug/app-debug.apk`.
5. Pasa el APK al teléfono y ábrelo. Android te pedirá permitir instalar apps de esa fuente.

Desde la terminal también sirve:

```
./gradlew assembleDebug
```

Para probar en un teléfono conectado por USB (con depuración USB activada), pulsa **Run** en Android Studio.

## Cómo actualizar una página

Cuando tengas una versión nueva de un HTML, no lo copies a mano. Usa el script, que le agrega el adaptador de descargas:

```
python3 tools/instalar_html.py RUTA/nuevo.html flujos.html
```

Los nombres de destino son `programa.html`, `flujos.html` y `zonificacion.html`. Después vuelve a compilar.

## Notas

- Las tipografías (Barlow Condensed e IBM Plex) se descargan de Google Fonts cuando hay internet y quedan en caché. Sin conexión y sin caché, la app usa las tipografías del sistema.
- Versión mínima de Android: 10.
- El APK de `assembleRelease` queda firmado con la llave de depuración. Sirve para instalar directo. Para subirlo a Google Play necesitas tu propia llave de firma.
- El icono es una llama blanca sobre fondo rojo. Se cambia en `app/src/main/res/drawable/ic_launcher_foreground.xml`.
