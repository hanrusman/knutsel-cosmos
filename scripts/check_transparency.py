from PIL import Image
import sys

try:
    img = Image.open('public/assets/sparky-jar.png').convert('RGBA')
    # Check top-left corner
    r, g, b, a = img.getpixel((0, 0))
    print(f"Top-Left Pixel Alpha: {a}")
    
    # Check a few random pixels that should be background
    # This is a heuristic
    if a == 0:
        print("Transparency Detected.")
    else:
        print("Image is Opaque.")
        
except Exception as e:
    print(f"Error: {e}")
