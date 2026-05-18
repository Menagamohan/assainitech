with open('Curage.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# keep 1-40 (index 0-39) and 1199-end (index 1198-end)
new_lines = lines[:40] + lines[1198:]

with open('Curage.html', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
