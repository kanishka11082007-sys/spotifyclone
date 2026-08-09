import os
import json

songs_folder = "songs"
song_data = {}

# Songs directly inside /songs
song_data[""] = [
    file for file in os.listdir(songs_folder)
    if file.lower().endswith(".mp3")
]

# Songs inside playlist folders
for folder in os.listdir(songs_folder):

    folder_path = os.path.join(songs_folder, folder)

    if os.path.isdir(folder_path):

        song_data[folder] = [
            file for file in os.listdir(folder_path)
            if file.lower().endswith(".mp3")
        ]

with open("songs.json", "w", encoding="utf-8") as file:
    json.dump(song_data, file, indent=4, ensure_ascii=False)

print("songs.json generated successfully! 🎵")