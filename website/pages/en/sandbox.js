const React = require("react");

// Use the CompLibrary from Docusaurus
// https://docusaurus.io/docs/en/api-pages#page-require-paths
const CompLibrary = require("../../core/CompLibrary.js");

const iframe = `<iframe src="https://codesandbox.io/embed/node?fontsize=14" title="node" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>`;

const Container = CompLibrary.Container;
const MarkdownBlock = CompLibrary.MarkdownBlock;

class Sandbox extends React.Component {
  render() {
    // Can access siteConfig.js from here as follows
    // const { config: siteConfig } = this.props;

    return (
      <div className="mainContainer">
        <Container padding={["bottom", "top"]}>
          <MarkdownBlock># Play with unmock!</MarkdownBlock>
          <div dangerouslySetInnerHTML={{ __html: iframe }} />
        </Container>
      </div>
    );
  }
}

module.exports = Sandbox;
