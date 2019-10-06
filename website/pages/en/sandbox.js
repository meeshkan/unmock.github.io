const React = require("react");

// Use the CompLibrary from Docusaurus
// https://docusaurus.io/docs/en/api-pages#page-require-paths
const CompLibrary = require("../../core/CompLibrary.js");

const iframe = `<iframe src="https://codesandbox.io/embed/n9m2w9q8x0?fontsize=14" title="Jest test" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>`;

const Container = CompLibrary.Container;

class Sandbox extends React.Component {
  render() {
    // Can access siteConfig.js from here as follows
    // const { config: siteConfig } = this.props;

    return (
      <div className="mainContainer">
        <Container padding={["bottom", "top"]}>
          <div dangerouslySetInnerHTML={{ __html: iframe }} />
        </Container>
      </div>
    );
  }
}

module.exports = Sandbox;
