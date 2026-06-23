"""GCJ settings package.

This repo contains both:
- gcj_backend/settings.py (root module)
- gcj_backend/settings/ (package)

Depending on Python import resolution, Django may accidentally import the
package instead of the root settings.py, which can lead to misconfigured
DATABASES.

This __init__ prefers the root-level gcj_backend/settings.py when available;
otherwise it falls back to the package-based base/development/production.
"""

from importlib import import_module
import os

# The root module is gcj_backend/settings.py, but this package file is also
# imported as gcj_backend.settings, so importing by that same name would recurse.
# Load the root settings.py by its file path instead.

try:
    from importlib.util import spec_from_file_location, module_from_spec
    from pathlib import Path

    root_settings_path = Path(__file__).resolve().parent.parent / 'settings.py'
    spec = spec_from_file_location('gcj_backend._root_settings', str(root_settings_path))
    if spec and spec.loader:
        _mod = module_from_spec(spec)
        spec.loader.exec_module(_mod)
        globals().update(_mod.__dict__)
    else:
        raise ImportError('Unable to load root settings.py')
except Exception:
    if os.environ.get('DEBUG', 'True') == 'True':
        from .base import *  # type: ignore
        from .development import *  # type: ignore
    else:
        from .production import *  # type: ignore


