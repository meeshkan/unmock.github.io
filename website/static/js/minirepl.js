/* global ace */

const REPL_CONTAINER_ID = "hero-repl";
const REPL_EDITOR_ID = "hero-repl-in";

const miniReplExamples = [
  {
    title: "Define services",
    content: `unmock
  .nock("https://zodiac.com", "zodiac")
  .get("/horoscope/{user}")
  .reply(200, {
    id: u.integer(),
    name: u.string("name.firstName"),
  })
  .get("/horoscope/{user}")
  .reply(404, { message: "Not authorized." });`,
  },
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

function showText(inEditor, example) {
  inEditor.setValue(example.content, 1);
  document.getElementById("hero-repl__title").innerText = example.title;
}

const BABEL_MINI_REPL = {
  start: function() {
    // don't init editor on mobile devices
    if (isMobile()) return;

    // Display container
    document.getElementById(REPL_CONTAINER_ID).style.display = "block";

    inEditor = setupEditor(REPL_EDITOR_ID, true);

    showText(inEditor, miniReplExamples[0]);
  },
};

window.onload = function() {
  BABEL_MINI_REPL.start();
};
