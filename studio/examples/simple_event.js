/*==============================================================================

#### Cancel Event ####
This instance is started and if already playing, restarted.

For information on using FMOD example code in your own programs, visit
https://www.fmod.com/legal
==============================================================================*/

//==============================================================================
// Prerequisite code needed to set up FMOD object.  See documentation.
//==============================================================================

var FMOD = {}; // FMOD global object which must be declared to enable 'main' and 'preRun' and then call the constructor function.
FMOD["preRun"] = prerun; // Will be called before FMOD runs, but after the Emscripten runtime has initialized
FMOD["onRuntimeInitialized"] = main; // Called when the Emscripten runtime has initialized
FMOD["INITIAL_MEMORY"] = 64 * 1024 * 1024; // FMOD Heap defaults to 16mb which is enough for this demo, but set it differently here for demonstration (64mb)
FMODModule(FMOD); // Calling the constructor function with our object

//==============================================================================
// Example code
//==============================================================================

var gSystem; // Global 'System' object which has the Studio API functions.
var gSystemCore; // Global 'SystemCore' object which has the Core API functions.
// var explosionDescription = {}; // Global Event Description for the explosion event.  This event is played as a one-shot and released immediately after it has been created.
var eventDescription = {}; // Global Event Instance for the looping ambience event.  A single instance is started or stopped based on user input.
// var cancelInstance = {}; // Global Event Instance for the cancel event.  This instance is started and if already playing, restarted.
var eventInstanceOut = {};
var gEventInstance = {}; // Global Event Instance for the footstep event.
var gHealthInstance = 100;
var gIntensityInstance = 0;
// Simple error checking function for all FMOD return values.
function CHECK_RESULT(result) {
  if (result != FMOD.OK) {
    var msg = "Error!!! '" + FMOD.ErrorString(result) + "'";

    alert(msg);

    throw msg;
  }
}

// Will be called before FMOD runs, but after the Emscripten runtime has initialized
// Call FMOD file preloading functions here to mount local files.  Otherwise load custom data from memory or use own file system.
function prerun() {
  var fileUrl = "public/js/";
  var fileName;
  var folderName = "/";
  var canRead = true;
  var canWrite = false;

  fileName = ["Master.bank", "Master.strings.bank"];

  for (var count = 0; count < fileName.length; count++) {
    document.querySelector("#display_out2").value =
      "Loading " + fileName[count] + "...";

    FMOD.FS_createPreloadedFile(
      folderName,
      fileName[count],
      fileUrl + fileName[count],
      canRead,
      canWrite
    );
  }
}

// Called when the Emscripten runtime has initialized
function main() {
  // A temporary empty object to hold our system
  var outval = {};
  var result;

  console.log("Creating FMOD System object\n");

  // Create the system and check the result
  result = FMOD.Studio_System_Create(outval);
  CHECK_RESULT(result);

  console.log("grabbing system object from temporary and storing it\n");

  // Take out our System object
  gSystem = outval.val;

  result = gSystem.getCoreSystem(outval);
  CHECK_RESULT(result);

  gSystemCore = outval.val;

  // Optional.  Setting DSP Buffer size can affect latency and stability.
  // Processing is currently done in the main thread so anything lower than 2048 samples can cause stuttering on some devices.
  console.log("set DSP Buffer size.\n");
  result = gSystemCore.setDSPBufferSize(2048, 2);
  CHECK_RESULT(result);

  // Optional.  Set sample rate of mixer to be the same as the OS output rate.
  // This can save CPU time and latency by avoiding the automatic insertion of a resampler at the output stage.
  console.log("Set mixer sample rate");
  result = gSystemCore.getDriverInfo(0, null, null, outval, null, null);
  CHECK_RESULT(result);
  result = gSystemCore.setSoftwareFormat(
    outval.val,
    FMOD.SPEAKERMODE_DEFAULT,
    0
  );
  CHECK_RESULT(result);

  console.log("initialize FMOD\n");

  // 1024 virtual channels
  result = gSystem.initialize(
    1024,
    FMOD.STUDIO_INIT_NORMAL,
    FMOD.INIT_NORMAL,
    null
  );
  CHECK_RESULT(result);

  // Starting up your typical JavaScript application loop
  console.log("initialize Application\n");

  initApplication();

  // Set the framerate to 50 frames per second, or 20ms.
  console.log("Start game loop\n");

  window.setInterval(updateApplication, 20);

  return FMOD.OK;
}

// Function called when user drags HTML range slider.
function paramChanged(val) {
  stateChanged();
  document.querySelector("#surfaceparameter_out").value = val;
  if (gEventInstance) {
    var result = gEventInstance.setParameterByID(
      gHealthID,
      parseFloat(val),
      false
    );
    CHECK_RESULT(result);
  }
}

function paramChanged2(val) {
  stateChanged();
  document.querySelector("#surfaceparameter2_out").value = val;
  if (gEventInstance) {
    var result = gEventInstance.setParameterByID(
      gIntensityID,
      parseFloat(val),
      false
    );
    CHECK_RESULT(result);
  }
}

// function for initial state when play button pressed:

function playState() {
  var intenseVal = document.getElementById("intensity_slide").value;
  var healthVal = document.getElementById("health_slide").value;

  if ((intenseVal >= 0) & (intenseVal <= 20) & (healthVal > 0)) {
    document.querySelector("#state_out").value = "Idle";
    document.querySelector("#state_out").style.color = "#68DCFF";
  } else if ((intenseVal >= 21) & (intenseVal <= 60) & (healthVal > 0)) {
    document.querySelector("#state_out").value = "Exploration";
    document.querySelector("#state_out").style.color = "#FFF200";
  } else if ((intenseVal >= 61) & (intenseVal <= 99) & (healthVal > 0)) {
    document.querySelector("#state_out").value = "Action";
    document.querySelector("#state_out").style.color = "#FFb300";
  } else if ((intenseVal == 100) & (healthVal > 0)) {
    document.querySelector("#state_out").value = "Win";
    document.querySelector("#state_out").style.color = "#00FF1D";
  } else if (healthVal == 0) {
    document.querySelector("#state_out").value = "Dead";
    document.querySelector("#state_out").style.color = "#FF0000";
  }
}

// function to output the state of the music depending on intensity and health.

function stateChanged() {
  var channelsplaying = {};
  result = gSystemCore.getChannelsPlaying(channelsplaying, null);

  if (channelsplaying.val == 0) {
    document.querySelector("#state_out").value = "Stopped / OFF";
    document.querySelector("#state_out").style.color = "#ff00fe";
  } else {
    playState();
  }
}

// Function called when user presses HTML Play Sound button, with parameter 1 or 2.
function playEvent(soundid) {
  if (soundid == 1) {
    CHECK_RESULT(eventInstanceOut.val.start());
    playState();
    changeFontColor();
  } else if (soundid == 2) {
    CHECK_RESULT(eventInstanceOut.val.stop(FMOD.STUDIO_STOP_IMMEDIATE));
    document.querySelector("#state_out").value = "Stopped / OFF";
  }
}

// Helper function to load a bank by name.
function loadBank(name) {
  var bankhandle = {};
  CHECK_RESULT(
    gSystem.loadBankFile("/" + name, FMOD.STUDIO_LOAD_BANK_NORMAL, bankhandle)
  );
}

// Called from main, does some application setup.  In our case we will load some sounds and the parameters

function initApplication() {
  var guid = FMOD.GUID();

  console.log("Loading events\n");

  loadBank("Master.bank");
  loadBank("Master.strings.bank");

  var eventDescription = {};
  CHECK_RESULT(gSystem.getEvent("event:/GA2 Vas Achilleas", eventDescription));

  var HealthparamDesc = {};
  CHECK_RESULT(
    eventDescription.val.getParameterDescriptionByName(
      "Health",
      HealthparamDesc
    )
  );
  gHealthID = HealthparamDesc.id;

  var IntensityparamDesc = {};
  CHECK_RESULT(
    eventDescription.val.getParameterDescriptionByName(
      "Intensity",
      IntensityparamDesc
    )
  );
  gIntensityID = IntensityparamDesc.id;

  // Get the game music loop event
  CHECK_RESULT(eventDescription.val.createInstance(eventInstanceOut));
  gEventInstance = eventInstanceOut.val;

  // set Health to 100 and intensity to 0 to start with
  var HealthParameterValue = 100;
  var IntensityParameterValue = 0.0;

  CHECK_RESULT(
    gEventInstance.setParameterByName("Health", HealthParameterValue, false)
  );
  CHECK_RESULT(
    gEventInstance.setParameterByName(
      "Intensity",
      IntensityParameterValue,
      false
    )
  );

  document.getElementById("playEvent1").disabled = false;
  document.getElementById("playEvent2").disabled = false;
  document.getElementById("health_slide").disabled = false;
  document.getElementById("intensity_slide").disabled = false;
}

function updateApplication() {
  var result;
  var cpu = {};

  result = gSystemCore.getCPUUsage(cpu);
  CHECK_RESULT(result);

  var channelsplaying = {};
  result = gSystemCore.getChannelsPlaying(channelsplaying, null);
  CHECK_RESULT(result);

  document.querySelector("#display_out").value =
    "Channels Playing = " +
    channelsplaying.val +
    " : CPU = dsp " +
    cpu.dsp.toFixed(2) +
    "% stream " +
    cpu.stream.toFixed(2) +
    "% update " +
    cpu.update.toFixed(2) +
    "% total " +
    (cpu.dsp + cpu.stream + cpu.update).toFixed(2) +
    "%";

  var numbuffers = {};
  var buffersize = {};
  result = gSystemCore.getDSPBufferSize(buffersize, numbuffers);
  CHECK_RESULT(result);

  var rate = {};
  result = gSystemCore.getSoftwareFormat(rate, null, null);
  CHECK_RESULT(result);

  var sysrate = {};
  result = gSystemCore.getDriverInfo(0, null, null, sysrate, null, null);
  CHECK_RESULT(result);

  var ms = (numbuffers.val * buffersize.val * 1000) / rate.val;
  document.querySelector("#display_out2").value =
    "Mixer rate = " +
    rate.val +
    "hz : System rate = " +
    sysrate.val +
    "hz : DSP buffer size = " +
    numbuffers.val +
    " buffers of " +
    buffersize.val +
    " samples (" +
    ms.toFixed(2) +
    " ms)";

  // Update FMOD
  result = gSystem.update();
  CHECK_RESULT(result);
}
