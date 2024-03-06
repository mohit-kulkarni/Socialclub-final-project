# import os
# import subprocess

# # Windows equivalent of "source" to activate virtual environment
# venv_activate_script = os.path.join(venv_folder_path, "venv", "Scripts", "activate")

# # Path to the folder containing the package.json file
# npm_folder_path = r"socialclub/"  # Use raw string for Windows paths

# # Path to the folder containing the requirements.txt file
# venv_folder_path = r"social_club_backend/"  # Use raw string for Windows paths

# # Activate virtual environment (if already exists)
# if os.path.exists(venv_activate_script):
#     subprocess.Popen(["cmd", "/c", venv_activate_script])  # Use cmd.exe to run activate script

# # Run npm install in the specified folder
# os.chdir(npm_folder_path)
# subprocess.run(["npm", "install"])

# # Create virtual environment if it doesn't exist
# venv_path = os.path.join(venv_folder_path, "venv")
# if not os.path.exists(venv_path):
#     subprocess.run(["python", "-m", "venv", venv_path])

# # Install packages from requirements.txt
# os.chdir(venv_folder_path)
# subprocess.run(["pip", "install", "-r", "requirements.txt"])

import os
import subprocess

# Path to the socialclub directory
socialclub_path = os.path.join(os.getcwd(), "socialclub")

# Run npm install in the socialclub directory
os.chdir(socialclub_path)
subprocess.run(["npm", "install"])

# Create virtual environment in the parent folder (if it doesn't exist)
parent_folder = os.path.dirname(os.getcwd())
venv_path = os.path.join(parent_folder, "venv")
if not os.path.exists(venv_path):
    subprocess.run(["python", "-m", "venv", venv_path])

# Activate virtual environment
venv_activate_script = os.path.join(venv_path, "Scripts", "activate")  # Assuming Windows
subprocess.Popen(["cmd", "/c", venv_activate_script])

# Install packages from requirements.txt
os.chdir(parent_folder)  # Change directory to the parent folder
subprocess.run(["pip", "install", "-r", "requirements.txt"])
