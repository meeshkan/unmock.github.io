/* eslint-disable no-unused-vars */

const React = require("react");

// Silence editor complaining about missing comp library
// https://github.com/facebook/docusaurus/blob/master/docs/api-pages.md#page-require-paths
// @ts-ignore
const CompLibrary = require("../../core/CompLibrary.js");

// const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
  render() {
    const { siteConfig, language = "" } = this.props;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
    const langPart = `${language ? `${language}/` : ""}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = props => (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );

    const ProjectTitle = () => (
      <div className="projectTitle">
        <h2 className="projectTitle__main">{siteConfig.title}</h2>
        <h3 className="projectTitle__secondary">{siteConfig.tagline}</h3>
      </div>
    );

    const PromoSection = props => (
      <div className="section promoSection">
        <div className="promoRow promoCallToAction">
          <div className="pluginRowBlock">
            Unmock helps you test API integrations by creating unreasonably
            effective simulations of external APIs and microservices.
          </div>
        </div>
        <div className="promoRow promoButton">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    );

    const Button = props => (
      <div className="get-started__button">
        <a href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    );

    return (
      <SplashContainer>
        <div className="inner hero">
          <ProjectTitle />
          <PromoSection>
            <Button href={docUrl("introduction.html")}>
              <div className="get-started__button-container">Get started</div>
            </Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const { config: siteConfig, language = "" } = this.props;
    const { baseUrl } = siteConfig;

    const Block = props => (
      <Container
        padding={["bottom", "top"]}
        id={props.id}
        background={props.background}
      >
        <GridBlock
          align="left"
          contents={props.children}
          layout={props.layout}
        />
      </Container>
    );

    const Katacoda = () => (
      <div style={{ backgroundColor: "#f1f1f1" }}>
        <div
          id="katacoda-scenario-1"
          data-katacoda-id="unmock/introduction"
          data-katacoda-color="004d7f"
          style={{
            display: "block",
            margin: "auto",
            height: "600px",
            paddingBottom: "20px",
            paddingTop: "20px",
            width: "80%",
          }}
        ></div>
      </div>
    );

    const Learn = () => (
      <Block background="light">
        {[
          {
            content:
              "With lots of resources and examples, there is something for everyone, from Hello World to advanced API (un)mocking.",
            image: `${baseUrl}img/undraw-knowledge.svg`,
            imageAlign: "left",
            title: "Learn Unmock",
          },
        ]}
      </Block>
    );

    const WhenUnmock = () => (
      <Block>
        {[
          {
            content:
              "Unmock is useful whenever you are testing code that calls an external API. This can be a microservice, a backend server, a third-party API like Stripe or Contentful, or an analytics service like Sentry or Segment.",
            image: `${baseUrl}img/undraw-programmer.svg`,
            imageAlign: "right",
            title: "When should I use Unmock?",
          },
        ]}
      </Block>
    );

    const Thanks = () => (
      <div className="thanks">
        <div className="section promoSection">
          <div className="promoRow">
            <div className="pluginRowBlock">
              <div className="thanks__content">
                <span className="thanks__heading">
                  Thanks for checking out Unmock!
                </span>
                <span className="thanks__secondary">
                  We value your feedback and hope you will join our community
                  through one of the links below. See you soon!
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <div className="container">
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer landing">
          <Katacoda />
          <WhenUnmock />
          <Learn />
          <Thanks />
        </div>
      </div>
    );
  }
}

module.exports = Index;
