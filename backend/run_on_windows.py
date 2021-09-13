"""
    If you are using windows laptop
    run ->
        python3 -m utils.run_on_windows
"""
from app import run
from waitress import serve

serve(run(), host="127.0.0.1", port=8000)
