import os
import sys
import zipfile
import argparse
from pathlib import Path

def package_skill(skill_path, dist_dir):
    skill_path = Path(skill_path)
    if not skill_path.exists() or not skill_path.is_dir():
        print(f"Error: Skill path '{skill_path}' does not exist or is not a directory.")
        sys.exit(1)

    skill_md = skill_path / "SKILL.md"
    if not skill_md.exists():
        print(f"Error: SKILL.md not found in '{skill_path}'.")
        sys.exit(1)

    dist_path = Path(dist_dir)
    dist_path.mkdir(parents=True, exist_ok=True)

    skill_name = skill_path.name
    zip_name = dist_path / f"{skill_name}.skill"

    with zipfile.ZipFile(zip_name, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(skill_path):
            for file in files:
                file_path = Path(root) / file
                arcname = file_path.relative_to(skill_path)
                zipf.write(file_path, arcname)

    print(f"Skill '{skill_name}' packaged at {zip_name}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Package an AI agent skill into a .skill file.")
    parser.add_argument("path", help="Path to the skill directory")
    parser.add_argument("dist", nargs="?", default="dist", help="Output directory for the .skill file")
    args = parser.parse_args()

    package_skill(args.path, args.dist)
