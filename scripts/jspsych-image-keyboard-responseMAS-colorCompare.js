/**
 * jspsych-image-keyboard-response MAS-colorCompare"
 * Josh de Leeuw
 *
 * plugin for displaying a stimulus and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/


jsPsych.plugins["image-keyboard-responseMAS-colorCompare"] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('image-keyboard-response', 'stimulus', 'image');

  plugin.info = {
    name: 'image-keyboard-response',
    description: '',
    parameters: {
      stimulusLeft: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The image to be displayed'
      },
      stimulusRight: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The image to be displayed'
      },
      stimulusFeedLeft: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'StimulusFeed',
        default: null,
        description: 'Border feedback'
      },
      stimulusFeedRight: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'StimulusFeed',
        default: null,
        description: 'Border feedback'
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
        array: true,
        pretty_name: 'Choices',
        default: jsPsych.ALL_KEYS,
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial before it ends.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when subject makes a response.'
      },
      trial_type: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Part of trial',
        default: 'null',
        description: 'Exp vs. Feedback.'
      },
      trial_set: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Type of trial',
        default: 'null',
        description: 'Which trials are being displayed (redundant, generalization, mismatch).'
      },
      target_side: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Side target is on',
        default: 'null',
        description: 'Left (0) or right (1) side the target is on.'
      },
      response_sideSelected: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'sideSelected',
        default: 0,
        description: 'Left vs. right (0 vs. 1) color selected during comparison trial'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

  var html = "";

  // add prompt
  if (trial.prompt !== null){
   // html += trial.prompt;
    html += '<span style="font-size: 30px;">'+trial.prompt+'</span>'
  }

  html += '<br></br>'; 

  html += '<div class = "parent" >' 

    // display left stimulus
    //For feedback, if selected the left item- add border
    if (trial.trial_type == "Feedback" && trial.response_sideSelected == 0){
       html += '<img src="'+trial.stimulusLeft+'" class="image1L" id="jspsych-image-keyboard-response-stimulus" ';
 
       if(trial.stimulus_height !== null){
          html += 'height:'+trial.stimulus_height+'px; '
        if(trial.stimulus_width == null && trial.maintain_aspect_ratio){
            html += 'width: auto; ';
          }         
        }
        if(trial.stimulus_width !== null){
          html += 'width:'+trial.stimulus_width+'px; '
          if(trial.stimulus_height == null && trial.maintain_aspect_ratio){
            html += 'height: auto; ';
          }
        }
        html +='"></img>';

        //Feedback border
        html += '<img src="'+trial.stimulusFeedLeft+'" class="image2L" id="jspsych-image-keyboard-response-stimulus" ';
        if(trial.stimulus_height !== null){
          html += 'height:'+trial.stimulus_height+'px; '
        if(trial.stimulus_width == null && trial.maintain_aspect_ratio){
            html += 'width: auto; ';
          }         
        }
        if(trial.stimulus_width !== null){
          html += 'width:'+trial.stimulus_width+'px; '
          if(trial.stimulus_height == null && trial.maintain_aspect_ratio){
            html += 'height: auto; ';
          }
        }
        html +='"></img>';


      }else{
        //Present squares with gray (invisible) border- for comparison trials & when did not select right color
       html += '<img src="'+trial.stimulusLeft+'" class="image1L" id="jspsych-image-keyboard-response-stimulus" ';
 
       if(trial.stimulus_height !== null){
          html += 'height:'+trial.stimulus_height+'px; '
          if(trial.stimulus_width == null && trial.maintain_aspect_ratio){
            html += 'width: auto; ';
          }
        }
        if(trial.stimulus_width !== null){
          html += 'width:'+trial.stimulus_width+'px; '
          if(trial.stimulus_height == null && trial.maintain_aspect_ratio){
            html += 'height: auto; ';
          }
        }
        html +='"></img>'; 
    }
                      

     // display right stimulus
     //Feedback trial if selected right color 
    if (trial.trial_type == "Feedback" && trial.response_sideSelected == 1){
     html += '<img src="'+trial.stimulusRight+'" class="image1R" id="jspsych-image-keyboard-response-stimulus" ';
   
     if(trial.stimulus_height !== null){
       html += 'height:'+trial.stimulus_height+'px; '
       if(trial.stimulus_width == null && trial.maintain_aspect_ratio){
         html += 'width: auto; ';
       }
     }
     if(trial.stimulus_width !== null){
       html += 'width:'+trial.stimulus_width+'px; '
       if(trial.stimulus_height == null && trial.maintain_aspect_ratio){
         html += 'height: auto; ';
       }
     }
     html +='"></img>';

     //Feedback border
     html += '<img src="'+trial.stimulusFeedRight+'" class="image2R" id="jspsych-image-keyboard-response-stimulus" ';
   
     if(trial.stimulus_height !== null){
       html += 'height:'+trial.stimulus_height+'px; '
       if(trial.stimulus_width == null && trial.maintain_aspect_ratio){
         html += 'width: auto; ';
       }
     }
     if(trial.stimulus_width !== null){
       html += 'width:'+trial.stimulus_width+'px; '
       if(trial.stimulus_height == null && trial.maintain_aspect_ratio){
         html += 'height: auto; ';
       }
     }
     html +='"></img>';
    }else{
      //Present squares with gray (invisible) border- for comparison trials & when did not select right color
      html += '<img src="'+trial.stimulusRight+'" class="image1R" id="jspsych-image-keyboard-response-stimulus" ';
      if(trial.stimulus_height !== null){
        html += 'height:'+trial.stimulus_height+'px; '
        if(trial.stimulus_width == null && trial.maintain_aspect_ratio){
          html += 'width: auto; ';
        }
      }
      if(trial.stimulus_width !== null){
        html += 'width:'+trial.stimulus_width+'px; '
        if(trial.stimulus_height == null && trial.maintain_aspect_ratio){
          html += 'height: auto; ';
        }
      }
      html +='"></img>';
    }
    html+='</div>'; 

    // render
    display_element.innerHTML = html;

    // store response
    var response = {
      rt: null,
      key: null
    };

    // function to end trial when it is time
    var end_trial = function() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      // gather the data to store for the trial
      var trial_data = {
        "rt": response.rt,
        "stimulus": trial.prompt,
        "stimLeft": trial.stimulusLeft,
        "stimRight": trial.stimulusRight,
        "key_press": response.key,
        "prompt": trial.prompt,
        "question_order": trial.trial_set, 
        "targetSide": trial.target_side,
        "success": trial.trial_type
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // function to handle responses by the subject
    var after_response = function(info) {

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      display_element.querySelector('#jspsych-image-keyboard-response-stimulus').className += ' responded';

      // only record the first response
      if (response.key == null) {
        response = info;
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // start the response listener
    if (trial.choices != jsPsych.NO_KEYS) {
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: 'performance',
        persist: false,
        allow_held_key: false
      });
    }

    // hide stimulus if stimulus_duration is set
    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-image-keyboard-response-stimulus').style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

  };

  return plugin;
})();
