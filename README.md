# Simiverse-Web: Web Client for Simiverse

## Overview

**Simiverse-Web** is the web-based client for the **Simiverse** simulation framework. It provides an interactive interface for running, visualizing, and managing simulations. 

---

## Table of Contents

1. [Features](#features)
2. [Get started](#get-started)
3. [How to Run](#how-to-run)
---

## Features

- **3D Rendering**: Leverages Three.js to provide an interactive visualization of simulations.
- **Gesture-Controlled Simulations**: Uses MediaPipe for gesture-based interaction, enabling a more immersive experience.
- **Real-Time Data Visualization**: Displays live updates of simulation data for better analysis and insights.
- **Simulation Data Export**: Allows users to save and share simulation results for further research and analysis.
- **Seamless Integration**: Designed to work in tandem with the Simiverse framework for a streamlined simulation experience.

---

## Get started

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/dev-diaries41/simiverse-web.git
   cd simiverse-web
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment (Optional)**:
   - In order to run LLM based simulations create a `.env` file in the project root and add `OPENAI_API_KEY`
   - If this is not included you can only run simulations of type "sim" and not "llm".

---

## How to Run

To start the development server and launch Simiverse-Web:

```bash
npm run dev
```

This will start a local server at `http://localhost:3000/`, where you can access the web client.

---

