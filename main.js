var workspace = Blockly.inject('blocklyDiv',
    {toolbox: document.getElementById('toolbox')});

// Custom block for bitwise operations
Blockly.Blocks['bitwise_operations'] = {
  init: function() {
    this.appendValueInput('A')
      .setCheck('Number');
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown([["&","AND"], ["|","OR"], ["^","XOR"]]), "OP");
    this.appendValueInput('B')
      .setCheck('Number');
    this.setOutput(true, 'Number');
    this.setInputsInline(true);
  }
};

Blockly.JavaScript['bitwise_operations'] = function(block) {
  var dropdown_op = block.getFieldValue('OP');
  var value_a = Blockly.JavaScript.valueToCode(block, 'A', Blockly.JavaScript.ORDER_ATOMIC);
  var value_b = Blockly.JavaScript.valueToCode(block, 'B', Blockly.JavaScript.ORDER_ATOMIC);
  var code = value_a + ' ' + dropdown_op + ' ' + value_b;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

function generateByteBeat() {
  var code = Blockly.JavaScript.workspaceToCode(workspace);

  // Generate ByteBeat
  var freq = 8000,
      bufferSize = 4096,
      audio = new AudioContext(),
      buffer = audio.createBuffer(1, bufferSize, freq),
      output = buffer.getChannelData(0),
      t = 0;

  for (var i = 0; i < bufferSize; i++) {
    output[i] = eval(code);
    t++;
  }

  var source = audio.createBufferSource();
  source.buffer = buffer;
  source.connect(audio.destination);
  source.start();

  document.getElementById('audio').src = URL.createObjectURL(bufferToWave(buffer, bufferSize));
}

// Convert audio buffer to WAV format
function bufferToWave(buffer, len) {
  var wav = new Uint8Array(44 + len),
      view = new DataView(wav.buffer);

  // Write WAV header
  view.setUint32(0, 0x46464952, false); // "RIFF"
  // ...

  // Write PCM data
  for (var i = 0; i < len; i++) {
    view.setInt16(44 + i * 2, buffer.getChannelData(0)[i] * 0x7FFF, true);
  }

  return new Blob([wav], {type: "audio/wav"});
}
