---
name: antigravity-skill-selection
description: >-
  Helps users discover, search, and adapt skills from the open agent skills ecosystem (including Antigravity skills) and convert found skills to the Antigravity format. Use this skill when the user asks to find, install, or adapt agent skills.
---

# Antigravity Skill Selection

This skill enables the agent to discover skills from the open agent skills ecosystem (e.g., from Vercel's Skills directory) and adapt them to work seamlessly within the Google Antigravity system.

## When to Use This Skill

Activate this skill when the user:
- Asks "how do I do X" where X might have an existing skill in the ecosystem.
- Says "find a skill for X", "install skill X", or "add skill X".
- Wants to import or convert a Antigravity skill to Antigravity.
- Mentions extending agent capabilities with custom templates or tools.

## How to Discover Skills

1. **Check the Web Directory**: Use `search_web` to search the [skills.sh](https://skills.sh/) directory or search GitHub (e.g., `site:github.com/vercel-labs/skills` or `site:github.com/ owner/repo`) to find relevant skills.
2. **Use the Skills CLI**: Run the CLI search command:
   ```bash
   npx skills find [query]
   ```
   This will show available open-source skills matching your query.

## How to Import and Convert Skills

When you find a Antigravity skill (which uses tools like `run_command`, `view_file`, `replace_file_content`, etc.), you must convert it to Antigravity's native format and toolset (`run_command`, `view_file`, `replace_file_content`).

To do this, use the helper conversion script:

1. **Locate the target `SKILL.md` URL or file path.** For GitHub repos, obtain the raw URL (e.g. `https://raw.githubusercontent.com/owner/repo/main/skills/name/SKILL.md`).
2. **Determine the target directory**:
   - For **Workspace-specific** skills: `.agents/skills/`
   - For **Global** skills: `~/.gemini/config/skills/` (resolves to `C:\Users\<username>\.gemini\config\skills\` on Windows).
3. **Run the conversion script**:
   ```bash
   node <path-to-antigravity-skill-selection>/scripts/convert.js <url_or_path_to_source_skill> <target_skills_directory>
   ```
   *Example*:
   ```bash
   node path/to/Antigravity-skill-selection/scripts/convert.js https://raw.githubusercontent.com/vercel-labs/skills/main/skills/testing/SKILL.md .agents/skills
   ```
4. **Verify**: Ensure that the skill is saved under `<target_skills_directory>/<skill-name>/SKILL.md` and that all tools have been translated correctly.
5. **Notify the User**: Tell the user that the skill has been successfully adapted and is ready for use in their workspace.
