# VPS Hosting Setup
Website & Cloud, Self-Hosted in Europe

## Overview
I set up a personal VPS on Hetzner Cloud, an EU-based provider, to host a Nextcloud instance for file sync, calendar, notes, and tasks, alongside my static website at `andrearossetti.me`. Docker containerizes the setup, AND an Nginx reverse proxy with Let’s Encrypt SSL secures access to both services.

## Key Components
- **Hetzner Cloud VPS**: An affordable, EU-based server.
- **Docker**: Open-source container runtime for isolated, manageable services.
- **Docker Compose**: Simplifies multi-container setups like Nextcloud and its database.
- **Nextcloud**: Open-source app for personal productivity, optimized with essential apps for a lightweight experience.
- **MariaDB**: A lightweight, open-source database chosen for Nextcloud, keeping resource use minimal.
- **Nginx**: Open-source reverse proxy for secure domain routing.
- **Let’s Encrypt**: Free, open-source SSL for HTTPS security.

## Setup Process
- **Server Setup**: Provisioned the VPS, installed Ubuntu, and set up Docker for container management.
- **Nextcloud Deployment**: Used Docker Compose to run Nextcloud with MariaDB, exposing it on a non-standard port, and completed the initial setup.
- **Nginx Configuration**: Set up Nginx to proxy Nextcloud to a subdomain and serve the main site with a simple config.
- **SSL Security**: Obtained a Let’s Encrypt certificate for all domains, ensuring secure access.

## Why This Setup?
This open-source, lightweight solution on an EU server offers a private, personal alternative to commercial cloud services—and a hands-on way to learn about server management, containerization, secure web hosting, and open-source tools

