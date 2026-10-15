# Skills

Agent Skills are expert playbooks the Gardely agent loads on demand. Each skill is a folder with a `SKILL.md` (YAML frontmatter `name` + `description`, then instructions). They follow the open SKILL.md convention, so they also work in other agents that support skills.

| Skill | Use it for |
|---|---|
| [landing-page](landing-page/SKILL.md) | Beautiful one-page sites with plain HTML/CSS/JS |
| [browser-game](browser-game/SKILL.md) | Small canvas games that feel great on desktop and phones |
| [polish-ui](polish-ui/SKILL.md) | Making an existing interface look premium |

## Install a skill

Copy the skill folder into your project's `.gardely/skills/` (or `.agents/skills/` / `.claude/skills/`), or into `%APPDATA%\com.gardely.code\skills\` to use it in every project. GardelyCode picks it up automatically — the agent sees the name and description and loads the full playbook when your task matches.

## Contribute

Made a skill that helps people build something? Open a pull request with a new folder here. Keep it focused, practical, and MIT-licensed.
