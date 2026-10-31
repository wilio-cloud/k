#!/usr/bin/env bash
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT="${1:-8080}"
LOCAL_IP="$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo '127.0.0.1')"

echo "========================================================"
echo "  Racó Calmat · Kindle E-Ink Hub"
echo "========================================================"
echo "  1. Connecta el Kindle a la mateixa xarxa Wi-Fi."
echo "  2. Obre el navegador del Kindle i escriu:"
echo ""
echo "       http://${LOCAL_IP}:${PORT}"
echo ""
echo "  3. Desa la pàgina a les adreces d'interès (marcadors)."
echo "     (Prem Ctrl+C aquí quan vulguis aturar el servidor)"
echo "========================================================"

cd "${DIR}/web"
exec python3 -m http.server "${PORT}" --bind 0.0.0.0
