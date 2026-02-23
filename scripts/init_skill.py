import os
import sys
import argparse
from pathlib import Path

def init_skill(skill_name, output_dir):
    skill_dir = Path(output_dir) / skill_name
    if skill_dir.exists():
        print(f"Error: Skill directory '{skill_dir}' already exists.")
        sys.exit(1)

    skill_dir.mkdir(parents=True)
    (skill_dir / "scripts").mkdir()
    (skill_dir / "references").mkdir()
    (skill_dir / "assets").mkdir()

    skill_md_content = f"""---
name: {skill_name}
description: TODO: Add a clear description of what this skill does and when to use it.
---

# {skill_name.replace('-', ' ').title()}

TODO: Add high-level instructions and guidance for using this skill.

## Workflows

TODO: Describe the sequential steps or conditional logic for tasks supported by this skill.

## Resources

- **scripts/**: TODO: Describe executable code in this directory.
- **references/**: TODO: Describe supporting documentation in this directory.
- **assets/**: TODO: Describe templates or icons in this directory.
"""

    with open(skill_dir / "SKILL.md", "w") as f:
        f.write(skill_md_content)

    print(f"Skill '{skill_name}' initialized at {skill_dir}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Initialize a new AI agent skill.")
    parser.add_argument("name", help="Name of the skill")
    parser.add_argument("--path", default="skills", help="Path to create the skill directory")
    args = parser.parse_args()

    init_skill(args.name, args.path)
