"""Validate shared asset sources without third-party dependencies."""
import json
from pathlib import Path
import xml.etree.ElementTree as ET
root = Path(__file__).resolve().parents[1]
for folder in ['banners','social']:
    for path in (root/folder).glob('*.svg'):
        ET.parse(path)
json.loads((root/'brand/tokens.json').read_text())
assert (root/'terminal/theme.tape').is_file()
print('OK: SVG sources, brand tokens, terminal theme.')
