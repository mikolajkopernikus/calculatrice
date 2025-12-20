from PIL import Image, ImageDraw, ImageFont

# Créer l'icône 512x512
img = Image.new('RGB', (512, 512), color="#042E52")
draw = ImageDraw.Draw(img)

# Fond blanc arrondi
draw.rounded_rectangle([50, 50, 462, 462], radius=60, fill='white')

# Texte "="
font_size = 300
try:
    font = ImageFont.truetype('arial.ttf', font_size)
except:
    try:
        font = ImageFont.truetype('C:\\Windows\\Fonts\\arial.ttf', font_size)
    except:
        font = ImageFont.load_default()

text = '='
bbox = draw.textbbox((0, 0), text, font=font)
text_width = bbox[2] - bbox[0]
text_height = bbox[3] - bbox[1]
x = (512 - text_width) // 2 - bbox[0]
y = (512 - text_height) // 2 - bbox[1]
draw.text((x, y), text, fill='#2196F3', font=font)

# Sauvegarder 512x512
img.save('icon-512.png')
print('✓ icon-512.png créée')

# Créer 192x192
img_192 = img.resize((192, 192), Image.LANCZOS)
img_192.save('icon-192.png')
print('✓ icon-192.png créée')

print('\n✅ Icônes créées avec succès!')
