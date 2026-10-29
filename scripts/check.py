"""Validate shared sources and banner generation. Requires Python 3 and Node 18+."""
import json
from pathlib import Path
import subprocess
import tempfile
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SVG = '{http://www.w3.org/2000/svg}'
KIT = ROOT / 'banner-kit/make-banner.mjs'


def generate(*args):
    return subprocess.check_output(['node', str(KIT), *args], cwd=ROOT, text=True)


def check_banners():
    styles = [line.split()[1] for line in generate('--list').splitlines()]
    assert len(styles) == 7 and len(set(styles)) == 7, 'Expected seven distinct banner styles'
    assert generate('--list').splitlines()[0].split()[:2] == ['1a', 'diagonal-drift']
    # Symbols exercise XML escaping, rather than only checking example titles.
    title, tagline, handle = 'Tools & <Data>', 'A "useful" result & more.', '@example'
    with tempfile.TemporaryDirectory(prefix='banner-kit-check-') as temporary:
        for mode in ['true', 'false']:
            destination = Path(temporary) / mode
            generate('--all', '--repo', title, '--tagline', tagline,
                     '--handle', handle, '--seed', '7', '--animate', mode,
                     '--out', str(destination))
            assert len(list(destination.glob('*.svg'))) == 7
            for style in styles:
                text = (destination / f'banner-{style}.svg').read_text()
                root = ET.fromstring(text)
                assert root.attrib['viewBox'] == '0 0 1280 320', style
                assert root.attrib['aria-label'] == title, style
                assert [node.text for node in root.findall(SVG + 'text')] == [handle, title, tagline], style
                assert text.count('data:font/woff2;base64,') == 3, style
                assert 'SIL OPEN FONT LICENSE Version 1.1' in text, style
                assert ('@keyframes' in text) == (mode == 'true'), style
        first = generate('--style', 'diagonal-drift', '--seed', '7')
        assert first == generate('--style', 'diagonal-drift', '--seed', '7'), 'Seed must be repeatable'
        assert first != generate('--style', 'diagonal-drift', '--seed', '8'), 'Seed should change the pattern'
    # The documented command must recreate committed defaults byte for byte.
    args = ['--style', 'diagonal-drift', '--repo', 'Shared Assets', '--tagline',
            'Reusable components for open-source projects.', '--handle', '@aaitor', '--seed', '7']
    assert generate(*args) == (ROOT / 'banners/default.svg').read_text()
    assert generate(*args, '--animate', 'false') == (ROOT / 'banners/default-static.svg').read_text()
    # Exercise the documented programmatic API, including explicit font CSS.
    api = subprocess.check_output(['node', '--input-type=module', '-e', '''
import { readFileSync } from 'node:fs';
import { makeBanner } from './banner-kit/make-banner.mjs';
process.stdout.write(makeBanner({
  style: 'diagonal-drift', repo: 'Shared Assets',
  tagline: 'Reusable components for open-source projects.',
  handle: '@aaitor', seed: 7, animate: false,
  fontCss: readFileSync('./banner-kit/fonts.css', 'utf8'),
}));
'''], cwd=ROOT, text=True)
    assert api == (ROOT / 'banners/default-static.svg').read_text(), 'API and CLI should agree'


def main():
    for folder in ['banners', 'social']:
        for path in (ROOT / folder).glob('*.svg'):
            ET.parse(path)
    json.loads((ROOT / 'brand/tokens.json').read_text())
    assert (ROOT / 'terminal/theme.tape').is_file()
    check_banners()
    print('OK: SVG sources, tokens, terminal theme, seven banner styles, static/animated output,')
    print('    embedded fonts/notices, escaping, deterministic seeds, default regeneration, JS API.')


if __name__ == '__main__':
    main()
