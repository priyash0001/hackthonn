import os
import sys
import webbrowser
from pathlib import Path
import uvicorn

# Configure utf-8 encoding for Windows terminals
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Add backend directory to sys.path
backend_dir = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_dir))

def main():
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "127.0.0.1")
    url = f"http://{host}:{port}"

    print("=" * 65)
    print(" 🏛️  SocraticLens - Gemma 4 Multimodal Socratic Tutor")
    print(" Track 1: A Tutor That Won't Give You the Answer")
    print("=" * 65)
    print(f"[*] Starting Fullstack Server on {url}")
    print("[*] Opening your browser...")

    try:
        webbrowser.open(url)
    except Exception:
        pass

    uvicorn.run("app.main:app", host=host, port=port, app_dir=str(backend_dir), reload=False)

if __name__ == "__main__":
    main()
