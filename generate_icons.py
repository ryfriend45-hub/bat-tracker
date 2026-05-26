#!/usr/bin/env python3
"""Generate simple SVG icons and convert to PNG for the PWA manifest."""
import struct, zlib, base64

def make_png(size, color_hex):
    """Create a minimal solid-color PNG."""
    r = int(color_hex[1:3], 16)
    g = int(color_hex[3:5], 16)
    b = int(color_hex[5:7], 16)

    def chunk(name, data):
        c = zlib.crc32(name + data) & 0xffffffff
        return struct.pack('>I', len(data)) + name + data + struct.pack('>I', c)

    header = b'\x89PNG\r\n\x1a\n'
    ihdr = chunk(b'IHDR', struct.pack('>IIBBBBB', size, size, 8, 2, 0, 0, 0))

    # Build image data
    raw = b''
    for y in range(size):
        raw += b'\x00'  # filter type none
        for x in range(size):
            # simple baseball-ish: dark bg circle with accent
            cx, cy = size/2, size/2
            dist = ((x-cx)**2 + (y-cy)**2)**0.5
            if dist < size*0.45:
                raw += bytes([r, g, b])
            else:
                raw += bytes([10, 10, 15])  # bg color

    compressed = zlib.compress(raw)
    idat = chunk(b'IDAT', compressed)
    iend = chunk(b'IEND', b'')
    return header + ihdr + idat + iend

for size in [192, 512]:
    data = make_png(size, '#3b82f6')
    with open(f'icon-{size}.png', 'wb') as f:
        f.write(data)
    print(f'Generated icon-{size}.png')
