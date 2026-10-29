"""Generate a project banner and social-card SVG using the shared renderer."""
import argparse
from pathlib import Path
from branding import artwork

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--repo', required=True)
parser.add_argument('--title', required=True)
parser.add_argument('--tagline', required=True)
args = parser.parse_args()
import re
if not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9_.-]{0,99}', args.repo):
    parser.error('Use a repository name without path separators.')
for key, limit in [('title', 32), ('tagline', 76)]:
    value = getattr(args, key)
    if not value.strip() or len(value) > limit or any(ord(c) < 32 for c in value):
        parser.error(f'{key} must contain 1–{limit} printable characters.')
root = Path(__file__).resolve().parents[1]
for folder, height in [('banners',420), ('social',640)]:
    path = root / folder / (args.repo + '.svg')
    path.write_text(artwork(args.title, args.tagline, 'aaitor', 'Aitor Argomaniz', height)+'\n')
    print(path.relative_to(root))
