README📖

# The Turning Point of Time
Introduction：
This project explores the irreversible transformation within the experience of time through an interactive, character-based temporal flow. Commencing from a stable, uniform state of flux, the timeline gradually becomes disrupted by audience intervention, ultimately collapsing and solidifying to reveal time’s transition from “continuous flow” to the “cessation of flow”.

Author
Lexin Li

Date
12/012026

Optional Blurb (Project Description)

The Turning Point of Time is an interactive creative coding project that explores the irreversible transformation of time through a dynamic textual flow system.
The project visualises time as a continuously moving stream of characters. Audience interaction introduces “anchor events”, which locally disturb the flow and gradually lead the system through three stages: flow → deflection → collapse.
As more anchors are introduced, the temporal flow slows down, loses stability, and eventually collapses into a single point, symbolising the transition of time from continuous movement to cessation.
The work draws conceptual inspiration from discussions of vector motion, flow fields, and forces introduced in The Nature of Code and The Coding Train tutorials.

Instructions (Operation Manual)

Running the Project
1. Download and unzip the project folder.
2. Open the folder in VS Code or another code editor.
3. Run the project using a local server (for example: Live Server extension).
4. Open the sketch in a web browser.

Interaction

Mouse interaction controls the behaviour of the system.
Click on the canvas
• Each click creates an anchor point
• Anchor points locally disturb the direction of the flowing timeline
System behaviour evolves through three stages:
1. Flow stage
Characters move downward as a continuous time stream.
2. Deflection stage
When the timeline approaches an anchor point, its direction bends based on vector forces.
3. Collapse stage
After multiple anchor events occur, the system's energy decreases and the time stream gradually slows down and collapses into a single point.

Technical Notes

The system is implemented using p5.js.
Key techniques used in the project include:
• p5.Vector for position and velocity systems
• Flow field logic for directional disturbance
• Vector interpolation (lerp) to smoothly adjust direction
• Anchor-triggered events to introduce local perturbations
• Energy-based collapse system to simulate the irreversible breakdown of the time flow
The project transitions from a simple linear timeline to a dynamic system affected by interaction and forces.

Acknowledgements

This project was developed with reference to the following resources:
1. The Nature of Code – Daniel Shiffman
https://natureofcode.com
2. The Coding Train
https://thecodingtrain.com
3. Relevant tutorials include:
• Vector Math
• Flow Fields
• Gravitational Attraction
• Steering Behaviour
These resources informed the implementation of vector systems and flow-based movement logic.

AI Usage

ChatGPT was used for limited assistance in:
• translating Chinese code comments into English
• suggesting vector-related functions
• helping organise code comments and documentation
All conceptual development, system design, and core implementation were completed by the author.
