
const oneTimeFunctionExecutor = function () {
  let isFirstCall = true; // Flag to ensure the inner function is executed only once.

  // This returned function will be called with a context (this) and a function to execute.
  return function (context, funcToExecute) {
    // The executorFunction is defined based on whether it's the first call.
    const executorFunction = isFirstCall ? function () {
      // If funcToExecute exists (i.e., not nullified yet)
      if (funcToExecute) {
        // Apply the funcToExecute with the given context and arguments.
        const result = funcToExecute.apply(context, arguments);
        funcToExecute = null; // Nullify the function to prevent re-execution.
        return result; // Return the result of the executed function.
      }
    } : function () {}; // After the first call, it becomes a no-op function.

    isFirstCall = false; // Set the flag to false after the first call.
    return executorFunction; // Return the actual function that will perform the execution.
  };
}();

// selfDefendingCheck is assigned the result of calling oneTimeFunctionExecutor.
// The function passed to it contains a 'catastrophic backtracking' regex.
// This is a common technique used by obfuscators to detect if the code's toString()
// representation has been altered, which often happens during deobfuscation attempts.
const selfDefendingCheck = oneTimeFunctionExecutor(this, function () {
  // This line attempts to trigger a catastrophic backtracking regex if the toString()
  // method of functions has been modified, which is a sign of tampering.
  // The specific regex "(((.+)+)+)+$" is known for this behavior.
  return selfDefendingCheck.toString().search("(((.+)+)+)+$").toString().constructor(selfDefendingCheck).search("(((.+)+)+)+$");
});

// Execute the self-defending check. If tampering is detected, this might cause
// a runtime error or unexpected behavior, preventing further execution or analysis.
selfDefendingCheck();

// Get references to the HTML elements
const securitySlider = document.getElementById("securitySlider");
const levelValue = document.getElementById("levelValue");
const inputCode = document.getElementById("inputCode");
const outputCode = document.getElementById("outputCode");
const obfuscateBtn = document.getElementById("obfuscateBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const dots = document.querySelectorAll(".dot");

// Define basic obfuscation options
const basicObfuscationOptions = {
  compact: true,
  controlFlowFlattening: false, // Disabled for basic
  deadCodeInjection: false, // Disabled for basic
  stringArray: false, // Disabled for basic
  numbersToExpressions: false // Disabled for basic
};

// Configuration for the BASIC obfuscation level
const basicLevelConfig = {
  label: "BASIC",
  options: basicObfuscationOptions
};

// Define medium obfuscation options
const mediumObfuscationOptions = {
  compact: true,
  controlFlowFlattening: true, // Enabled for medium
  controlFlowFlatteningThreshold: 0.5, // 50% of control flow will be flattened
  deadCodeInjection: true, // Enabled for medium
  deadCodeInjectionThreshold: 0.2, // 20% of dead code will be injected
  stringArray: true, // Enabled for medium
  stringArrayThreshold: 0.7, // 70% of strings will be moved to string array
  numbersToExpressions: true, // Enabled for medium
  splitStrings: false // Disabled for medium
};

// Configuration for the MEDIUM obfuscation level
const mediumLevelConfig = {
  label: "MEDIUM",
  options: mediumObfuscationOptions
};

// Define advanced obfuscation options
const advancedObfuscationOptions = {
  compact: true,
  controlFlowFlattening: true, // Enabled for advanced
  controlFlowFlatteningThreshold: 0x1, // 100% of control flow will be flattened
  deadCodeInjection: true, // Enabled for advanced
  deadCodeInjectionThreshold: 0x1, // 100% of dead code will be injected
  stringArray: true, // Enabled for advanced
  stringArrayThreshold: 0x1, // 100% of strings will be moved to string array
  splitStrings: true, // Enabled for advanced
  splitStringsChunkLength: 0x4, // Strings split into chunks of 4 characters
  numbersToExpressions: true, // Enabled for advanced
  simplify: true, // Enabled for advanced (simplifies expressions)
  rotateStringArray: true, // Enabled for advanced (rotates string array)
  selfDefending: true, // Enabled for advanced (adds anti-tampering)
  transformObjectKeys: true // Enabled for advanced (transforms object keys)
};

// Configuration for the ADVANCED obfuscation level
const advancedLevelConfig = {
  label: "ADVANCED",
  options: advancedObfuscationOptions
};

// Map slider values (1, 2, 3) to their respective obfuscation configurations
const obfuscationLevelsMap = {
  '1': basicLevelConfig,
  '2': mediumLevelConfig,
  '3': advancedLevelConfig
};

// Event listener for the security slider input
securitySlider.addEventListener("input", () => {
  const sliderValueInt = parseInt(securitySlider.value, 10); // Get slider value as integer
  levelValue.textContent = obfuscationLevelsMap[sliderValueInt].label; // Update level text

  // Update active dot indicator based on slider value
  dots.forEach((dotElement, dotIndex) =>
    dotElement.classList.toggle("active", dotIndex === sliderValueInt - 1)
  );
});

// Event listener for the Obfuscate button click
obfuscateBtn.addEventListener("click", () => {
  const inputCodeValue = inputCode.value; // Get the code from the input textarea

  // If input code is empty or just whitespace, display a message
  if (!inputCodeValue.trim()) {
    outputCode.value = "// Tafadhali andika JavaScript code kwanza (Black-Tappy)"; // Message in Swahili
    return;
  }

  try {
    // Get the selected obfuscation options based on the slider value
    const selectedOptions = obfuscationLevelsMap[securitySlider.value].options;

    // Obfuscate the code using the JavaScriptObfuscator library
    // window.JavaScriptObfuscator is expected to be globally available (loaded from a script tag)
    const obfuscatedCodeResult = window.JavaScriptObfuscator.obfuscate(inputCodeValue, selectedOptions);

    // Display the obfuscated code in the output textarea
    outputCode.value = "// Obfuscated by Black-Tappy [" + obfuscationLevelsMap[securitySlider.value].label + "]\n" + obfuscatedCodeResult.getObfuscatedCode();
  } catch (error) {
    // If an error occurs during obfuscation, display the error message
    outputCode.value = "// Error: " + error.message;
  }
});

// Event listener for the Copy button click
copyBtn.addEventListener("click", () => {
  outputCode.select(); // Select all text in the output textarea
  document.execCommand("copy"); // Copy the selected text to clipboard
});

// Event listener for the Download button click
downloadBtn.addEventListener("click", () => {
  const blobOptions = {
    type: "text/javascript"
  }; // Define blob type as JavaScript

  // Create a Blob containing the obfuscated code
  const codeBlob = new Blob([outputCode.value], blobOptions);

  //
