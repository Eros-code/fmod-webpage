# fmod-webpage
This project attempts to embed an FMOD project within a html page and allow user interaction to determine the state of a piece of music by adjusting sliders corresponding to their respective parameters. By adjusting these sliders, you can dynamically change the music created for your game in FMOD. This simulates the enhancement of the gameplay experience for your users, making it more immersive and exciting.

# What is FMOD?
FMOD is a proprietary sound effects engine and authoring tool used for video games and applications developed by Firelight Technologies. It is able to play and mix sounds of diverse formats on many operating systems.

# Vasfmod

Vasfmod is a user interface created for the use on the website <a href = "https://www.vas-achilleas.com"> www.vas-achilleas.com </a>. It allows dynamic changes to be made to music created by Vas Achilleas for a unity game in FMOD, based on the parameters of health and intensity. It is built using range sliders and can be accessed via <a href = "https://eros-code.github.io/vasfmod/studio/examples/fmod.html"> this website </a> as shown below.

<img width="1439" alt="Screenshot 2023-06-13 at 11 51 55" src="https://github.com/Eros-code/vasfmod/assets/67373491/f262d34d-3d02-466d-b239-2679bff28f8e">

The main files Master.bank and Master.strings.bank found in studio/examples/public/js are created as a result of building your FMOD project - they are the almalgamation of all the music files and sequences. These files are loaded in via the prerun() function in the simple_event.js found under the following directory studio/examples/simple_event.js.


It works by calling the fmodstudio.js API for html which can be accessed here: 

<a href = "https://www.fmod.com/download#fmodengine"> www.fmod.com/download#fmodengine </a>

<img width="1142" alt="Screenshot 2023-06-13 at 11 49 29" src="https://github.com/Eros-code/vasfmod/assets/67373491/5a2b6867-c347-499b-aab5-7c8bd104aa89">

For this project the API files must be placed in the same directory as the simple_event.js file. Furthermore there are some C files which must be included - these can be found under the directory studio/inc.

Once you download the API files you will also find several examples with detailed code to help you get started. If you would like to see the examples in your web browser then you can do so by accessing this link <a href = "https://www.fmod.com/assets/html5/studio_api/demo.html"> here </a>.

