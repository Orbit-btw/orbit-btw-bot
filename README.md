# Orbit-btw-bot

A top-tier GitHub App built with [Probot](https://github.com/probot/probot) that beautifully automates and manages issues for the `Orbit-btw` organization.

## Features & Automation
- **Single Issue Limit:** Prevents contributors from hoarding tasks. A user can only claim 1 open issue at a time per repository.
- **Auto-Labeling:** Automatically adds `in-progress` and removes `help wanted` labels when an issue is claimed. 
- **Smart Reactions:** Reduces comment spam by reacting to commands with emojis (🚀, 👀, ❤️) instead of posting new comments.
- **Welcome Wagon:** Greets first-time issue creators and commenters to the organization.

## Available Commands

| Command | Description | Access Level |
|---------|-------------|--------------|
| `/claim` or `/assign` | Claims the issue. Fails if you already have an active issue. Adds labels and reacts with 🚀 | Anyone |
| `/unclaim` or `/unassign` | Drops your claim on the issue. Reverts labels to `help wanted`. | Assignees |
| `/close` | Instantly closes the issue. | Org Members |
| `/label <name>` | Quickly adds a specific label to the issue (e.g. `/label bug`). | Org Members |
| `/unlabel <name>`| Quickly removes a specific label from the issue. | Org Members |

## Setup & Deployment
See [SETUP.md](./SETUP.md) for instructions on how to configure, run, and host this bot 24/7.
