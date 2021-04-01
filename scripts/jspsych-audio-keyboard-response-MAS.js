/**
 * jspsych-audio-keyboard-response
 * Josh de Leeuw
 *
 * plugin for playing an audio file and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins["audio-keyboard-response-MAS"] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('audio-keyboard-response-MAS', 'audioStimulus1', 'audio');

  plugin.info = {
    name: 'audio-keyboard-response-MAS',
    description: '',
    parameters: {
      audioStimulus1: {
        type: jsPsych.plugins.parameterType.AUDIO,
        pretty_name: 'Stimulus1',
        default: undefined,
        description: 'The audio to be played.'
      },
      audioStimulus2: {
        type: jsPsych.plugins.parameterType.AUDIO,
        pretty_name: 'Stimulus2',
        default: null,
        description: 'The audio to be played.'
      },
      imageStimulus: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Image Stimulus',
        default: null,
        description: 'The image to be displayed'
      },
      stimulus_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Image height',
        default: null,
        description: 'Set the image height in pixels'
      },
      stimulus_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Image width',
        default: null,
        description: 'Set the image width in pixels'
      },
      maintain_aspect_ratio: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Maintain aspect ratio',
        default: true,
        description: 'Maintain the aspect ratio after setting width or height'
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Choices',
        array: true,
        default: jsPsych.ALL_KEYS,
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'The maximum duration to wait for a response.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, the trial will end when user makes a response.'
      },
      trial_ends_after_audio: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Trial ends after audio',
        default: false,
        description: 'If true, then the trial will end as soon as the audio file finishes playing.'
      },
      response_allowed_while_playing: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response allowed while playing',
        default: true,
        description: 'If true, then responses are allowed while the audio is playing. '+
          'If false, then the audio must finish playing before a response is accepted.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

   // var html = "";
    //html += '<img src="'+trial.imageStimulus+'" id="jspsych-image-keyboard-response-stimulus" style="';


    // setup stimulus
    var context = jsPsych.pluginAPI.audioContext();
    if(context !== null){
      var source = context.createBufferSource();
      source.buffer = jsPsych.pluginAPI.getAudioBuffer(trial.audioStimulus1);
      //source.buffer = jsPsych.pluginAPI.getAudioBuffer(trial.audioStimulus2);

      source.connect(context.destination);
    } else {
      var audio = jsPsych.pluginAPI.getAudioBuffer(trial.audioStimulus1);
     // var audio = jsPsych.pluginAPI.getAudioBuffer(trial.audioStimulus2);

      audio.currentTime = 0;
    }

    // set up end event if trial needs it
    if(trial.trial_ends_after_audio){
      if(context !== null){
        source.addEventListener('ended', end_trial);
      } else {
        audio.addEventListener('ended', end_trial);
      }
    }

    // show prompt if there is one
    if (trial.prompt !== null) {
      display_element.innerHTML = trial.prompt;
     // display_element.IMAGE = trial.imageStimulus; 
    }





    // store response
    var response = {
      rt: null,
      key: null
    };

    // function to end trial when it is time
    function end_trial() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // stop the audio file if it is playing
      // remove end event listeners if they exist
      if(context !== null){
        source.stop();
        source.removeEventListener('ended', end_trial);
        source.removeEventListener('ended', setup_keyboard_listener);
      } else {
        audio.pause();
        audio.removeEventListener('ended', end_trial);
        audio.removeEventListener('ended', setup_keyboard_listener);
      }

      // kill keyboard listeners
      jsPsych.pluginAPI.cancelAllKeyboardResponses();

      // gather the data to store for the trial
      if(context !== null && response.rt !== null){
        response.rt = Math.round(response.rt * 1000);
      }
      var trial_data = {
        "rt": response.rt,
        "audioStimulus1": trial.audioStimulus1,
        "audioStimulus2": trial.audioStimulus2,
        "imageStimulus": trial.imageStimulus,
        "key_press": response.key
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    }

    // function to handle responses by the subject
    var after_response = function(info) {

      // only record the first response
      if (response.key == null) {
        response = info;
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    function setup_keyboard_listener() {
      // start the response listener
      if(context !== null) {
        var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
          callback_function: after_response,
          valid_responses: trial.choices,
          rt_method: 'audio',
          persist: false,
          allow_held_key: false,
          audio_context: context,
          audio_context_start_time: startTime
        });
      } else {
        var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
          callback_function: after_response,
          valid_responses: trial.choices,
          rt_method: 'performance',
          persist: false,
          allow_held_key: false
        });
      }
    }

    // start audio
    if(context !== null){
      var startTime = context.currentTime;
      source.start(startTime);
    } else {
      audio.play();
    }

    // start keyboard listener when trial starts or sound ends
    if (trial.response_allowed_while_playing) {
      setup_keyboard_listener();
    } else if (!trial.trial_ends_after_audio) {
      if(context !== null){
        source.addEventListener('ended', setup_keyboard_listener);
      } else {
        audio.addEventListener('ended', setup_keyboard_listener);
      }
    }

    // end trial if time limit is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

  };

  return plugin;
})();
