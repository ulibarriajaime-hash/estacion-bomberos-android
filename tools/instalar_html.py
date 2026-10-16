#!/usr/bin/env python3
"""Copia una página HTML a la app y la prepara para Android.

Uso:
    python3 tools/instalar_html.py ORIGEN.html NOMBRE_DESTINO.html

Ejemplo, para actualizar la página de flujos:
    python3 tools/instalar_html.py ~/Descargas/flujos-estacion-bomberos.html flujos.html

Qué hace: agrega el adaptador de descargas (shim.js) justo antes de cerrar <head>
y guarda el archivo en app/src/main/assets/www/.
"""
import pathlib
import sys

SHIM = '<script src="shim.js"></script>'


def main() -> int:
    if len(sys.argv) != 3:
        print(__doc__)
        return 1
    origen = pathlib.Path(sys.argv[1]).expanduser()
    destino = pathlib.Path(__file__).resolve().parent.parent / "app/src/main/assets/www" / sys.argv[2]
    html = origen.read_text(encoding="utf-8")
    if SHIM not in html:
        if "</head>" not in html:
            print("El archivo no tiene </head>; no se pudo agregar el adaptador.")
            return 1
        html = html.replace("</head>", SHIM + "</head>", 1)
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_text(html, encoding="utf-8")
    print(f"Listo: {destino}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
