from PIL import Image, ImageDraw
import os
import sys

def remove_background(image_path):
    try:
        img = Image.open(image_path).convert("RGBA")
        datas = img.getdata()
        
        # Strategy: Flood fill from corners to identify background
        # 1. Create a binary image where white-ish pixels are 1, others 0
        width, height = img.size
        # Threshold for "white"
        threshold = 240
        
        # Create a mask for flood filling
        # We'll do a BFS/Flood fill from (0,0), (w,0), (0,h), (w,h)
        # on pixels that are > threshold
        
        visited = set()
        queue = []
        
        # Check corners
        corners = [(0, 0), (width-1, 0), (0, height-1), (width-1, height-1)]
        for x, y in corners:
            r, g, b, a = img.getpixel((x, y))
            if r > threshold and g > threshold and b > threshold:
                queue.append((x, y))
                visited.add((x, y))
        
        # If queue is empty, maybe the corner isn't white? 
        # But let's assume it is based on the generation prompt.
        
        newData = list(datas)
        
        while queue:
            x, y = queue.pop(0)
            # Make this pixel transparent in our list
            # Index in flat data list is y * width + x
            idx = y * width + x
            newData[idx] = (255, 255, 255, 0) # Transparent
            
            # Check neighbors
            for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                nx, ny = x + dx, y + dy
                if 0 <= nx < width and 0 <= ny < height:
                    if (nx, ny) not in visited:
                        # Check color
                        r, g, b, a = img.getpixel((nx, ny))
                        if r > threshold and g > threshold and b > threshold:
                            visited.add((nx, ny))
                            queue.append((nx, ny))
                            
        # Update image data
        img.putdata(newData)
        img.save(image_path, "PNG")
        print(f"Processed: {image_path}")
        
    except Exception as e:
        print(f"Error processing {image_path}: {e}")

if __name__ == "__main__":
    directory = "public/assets/items"
    if not os.path.exists(directory):
        print(f"Directory not found: {directory}")
        sys.exit(1)
        
    for filename in os.listdir(directory):
        if filename.lower().endswith(".png"):
            remove_background(os.path.join(directory, filename))
