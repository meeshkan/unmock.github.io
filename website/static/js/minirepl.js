/*global $ ace */

const miniReplExamples = [
  "[1, 2, 3].map(n => n ** 2);",
  "var [a,,b] = [1,2,3];",
  "const x = [1, 2, 3];\nfoo([...x]);",
  'var obj = {\n  shorthand,\n  method() {\n    return "😀";\n  }\n};',
  'var name = "Guy Fieri";\nvar place = "Flavortown";\n\n`Hello ${name}, ready for ${place}?`;',
  'let yourTurn = "Type some code in here!";',
];

let inEditor;

let runDemo = true;

function isMobile() {
  return window.screen.width < 760;
}

function setupEditor(id, readOnly) {
  const editor = ace.edit(id);

  editor.setOptions({
    // editor
    highlightActiveLine: false,
    readOnly: !!readOnly,

    // renderer
    fontSize: "1rem",
    highlightGutterLine: false,
    showGutter: false,
    showLineNumbers: false,
    theme: "ace/theme/tomorrow_night",

    // session
    mode: "ace/mode/javascript",
    tabSize: 2,
    useSoftTabs: true,
    useWorker: false,
    wrap: false,
  });

  editor.renderer.setPadding(24);
  editor.renderer.setScrollMargin(24, 24);
  editor.commands.removeCommands(["gotoline", "find"]);

  return editor;
}

function simulateKeys(inEditor, outEditor, texts) {
  let textIndex = 0;
  let charIndex = 0;
  let timeout;

  function simulateKey(changingText) {
    const delay = changingText ? 4000 : Math.round(Math.random() * 125) + 30;

    timeout = setTimeout(function() {
      if (!runDemo) {
        if (timeout) {
          clearTimeout(timeout);
        }
        return;
      }

      const text = texts[textIndex];

      charIndex++;

      inEditor.setValue(text.substring(0, charIndex), 1);

      if (charIndex < text.length) {
        simulateKey();
      } else if (charIndex === text.length && textIndex < texts.length - 1) {
        textIndex++;
        charIndex = 0;
        simulateKey(true);
      } else {
        inEditor.selection.selectAll();
        inEditor.setReadOnly(false);
        clearTimeout(timeout);
      }
    }, delay);
  }

  simulateKey();
}

const BABEL_MINI_REPL = {
  start: function() {
    // don't init editor on mobile devices
    if (isMobile()) return;

    document.getElementById("hero-repl").style.display = "block";

    // $(".hero-repl").prop("hidden", false);

    inEditor = setupEditor("hero-repl-in", true);

    setTimeout(function() {
      // $(".hero-repl").addClass("hero-repl--visible");
      simulateKeys(inEditor, undefined, miniReplExamples);
    }, 150);
  },

  stopDemo: function() {
    // debouncedUpdate.cancel();
    runDemo = false;
    inEditor.setReadOnly(false);
    inEditor.setValue("");
    // outEditor.setValue("");
  },
};

// relies on zepto being present on the page
window.onload = function() {
  BABEL_MINI_REPL.start();
};
