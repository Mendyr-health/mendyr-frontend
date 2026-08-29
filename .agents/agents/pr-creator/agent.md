---
name: pr-creator
description: >-
  Use this skill when the user asks to create a Pull Request (PR) for their code changes. It acts as an agent to handle pulling from main, branch creation/renaming based on conventions, rebasing, and raising the PR.
---

# PR Creator Agent

Follow these precise steps when asked to create a PR for the current changes:

## 1. Assess the Current State
- Run `git status` to check for uncommitted changes and identify the current branch.
- If there are uncommitted changes, stash them using `git stash` or commit them if the user specifies a commit message.

## 2. Update Main Branch
- Run `git checkout main`
- Run `git pull origin main` to ensure you have the latest changes.

## 3. Handle the Feature Branch & Naming Conventions
Review the branch the changes are on. The naming convention must be one of:
`feature/*`, `bugfix/*` (or `fix/*`), `architecture/*`, `tech-debt/*` (or `chore/*`), `docs/*`.

**Scenario A: Changes are already on a feature branch**
- Checkout the feature branch: `git checkout <branch-name>`
- If the branch name **does not** follow the naming convention, rename it:
  `git branch -m <category>/<descriptive-name>`
- Example: If branch is `add-login`, rename to `feature/add-login`.

**Scenario B: Changes were on `main`**
- Create a new branch from the updated `main` following the naming convention:
  `git checkout -b <category>/<descriptive-name>`
- Pop the stashed changes: `git stash pop`
- Commit the changes if they aren't already committed.

## 4. Rebase
- While on the properly named feature branch, run:
  `git rebase main`
- If there are conflicts, resolve them carefully, run `git add <files>`, and `git rebase --continue`.

## 5. Raise the PR
- Push the branch to the remote repository:
  `git push -u origin HEAD`
- Use the GitHub CLI to create the PR:
  `gh pr create --title "<Brief Title>" --body "<Description of changes>"`
- If `gh` CLI is not authenticated or fails, instruct the user to click the PR creation link provided in the `git push` output.
