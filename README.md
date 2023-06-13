# fmod-webpage
This project attempts to embed an fmod project within a html page and allow user interaction to determine the state of a piece of music based on some parameters.

# Vasfmod

Vasfmod is a user interface created for the use on the website https://www.vas-achilleas.com/. It allows dynamic changes to be made to music created by Vas Achilleas for a unity game in FMOD, based on the parameters of health and intensity. It is built using range sliders and can be accessed via the website: https://eros-code.github.io/vasfmod/studio/examples/fmod.html as shown below.

<img width="1439" alt="Screenshot 2023-06-13 at 11 51 55" src="https://github.com/Eros-code/vasfmod/assets/67373491/f262d34d-3d02-466d-b239-2679bff28f8e">

The main files Master.bank and Master.strings.bank found in studio/examples/public/js are created as a result of building your FMOD project - they are the almalgamation of all the music files and sequences. These files are loaded in via the prerun() function in the simple_event.js found under the following directory studio/examples/simple_event.js.


It works by calling the fmodstudio.js API for html which can be accessed here: 

https://www.fmod.com/download#fmodengine

<img width="1142" alt="Screenshot 2023-06-13 at 11 49 29" src="https://github.com/Eros-code/vasfmod/assets/67373491/5a2b6867-c347-499b-aab5-7c8bd104aa89">

you will also find several examples with detailed code to help you get started.

# What is FMOD?
FMOD is a proprietary sound effects engine and authoring tool used for video games and applications developed by Firelight Technologies. It is able to play and mix sounds of diverse formats on many operating systems.

