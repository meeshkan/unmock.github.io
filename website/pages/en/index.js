/* eslint-disable no-unused-vars */

const React = require("react");

// Silence editor complaining about missing comp library
// https://github.com/facebook/docusaurus/blob/master/docs/api-pages.md#page-require-paths
// @ts-ignore
const CompLibrary = require("../../core/CompLibrary.js");

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
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
      <h2 className="projectTitle">
        {siteConfig.title}
        <small>{siteConfig.tagline}</small>
      </h2>
    );

    const PromoSection = props => (
      <div className="section promoSection">
        <img className="promoImage" src={`${baseUrl}img/logo-purple.svg`} alt="Project Logo" />
        <div className="promoRow">
          <div className="pluginRowBlock">Unmock helps you test the business logic of your API integrations by creating unreasonably effective simulations of external APIs and microservices. Property testing, rich assertions, passthrough validation and more await you!</div>
        </div>
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    );

    const Button = props => (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    );

    return (
      <SplashContainer>
        <div className="inner">
          <ProjectTitle />
          <PromoSection>
            <Button href={docUrl("installation.html")}>Get started</Button>
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

const Kataconda = () => (
  <div style={{backgroundColor: "#f1f1f1"}}>
    <div id="katacoda-scenario-1"
        data-katacoda-id="unmock/introduction"
        data-katacoda-color="004d7f"
        style={{display:"block", margin:"auto", height: "600px", paddingBottom: "20px", paddingTop: "20px", width:"80%"}}></div>
  </div>
);

    const Learn = () => (
      <Block background="light">
        {[
          {
            content:
              "With lots of resources and examples, there is something for everyone, from Hello World to advanced API (un)mocking.",
            image: `${baseUrl}img/undraw_knowledge.svg`,
            imageAlign: "left",
            title: "Learn unmock",
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
            image: `${baseUrl}img/undraw_programmer.svg`,
            imageAlign: "right",
            title: "When should I use unmock?",
          },
        ]}
      </Block>
    );

    const Thanks = () => (
      <div className="homeContainer">
        
        <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock" style={{margin:"auto", width:"80%", display:"block"}}>
          Thanks for checking out Unmock! We value your feedback and hope you will join our community through one of the links below. See you soon!
            </div>
      </div>
      </div>
    </div>           
    );

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer">
          <Kataconda />
          <WhenUnmock />
          <Learn />
          <Thanks />
        </div>
      </div>
    );
  }
}

module.exports = Index;
