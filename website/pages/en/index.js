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

    const Logo = props => (
      <div className="projectLogo">
        <img src={props.img_src} alt="Project Logo" />
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
        {/*<Logo img_src={`${baseUrl}img/undraw_monitor.svg`} />*/}
        <div className="inner">
          <ProjectTitle />
          <PromoSection>
            <Button href={docUrl("introduction.html")}>Get started</Button>
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
          align="center"
          contents={props.children}
          layout={props.layout}
        />
      </Container>
    );

    const FeatureCallout = () => (
      <div
        className="productShowcaseSection paddingBottom"
        style={{ textAlign: "center" }}
      >
        <h2>Feature Callout</h2>
        <MarkdownBlock>These are features of this project</MarkdownBlock>
      </div>
    );

    const TryOut = () => (
      <Block id="try">
        {[
          {
            content:
              "Bring your own OpenAPI specification or use those provided by us to create your mocks",
            image: `${baseUrl}img/undraw_code_review.svg`,
            imageAlign: "left",
            title: "Tight integration with OpenAPI",
          },
        ]}
      </Block>
    );

    const Description = () => (
      <Block background="dark">
        {[
          {
            content:
              "Install our GitHub app to see all the APIs used by your organization",
            image: `${baseUrl}img/undraw_note_list.svg`,
            imageAlign: "right",
            title: "GitHub integration",
          },
        ]}
      </Block>
    );

    const LearnHow = () => (
      <Block background="light">
        {[
          {
            content:
              "Easily browse tests and mocks in browser or your favorite IDE",
            image: `${baseUrl}img/undraw_youtube_tutorial.svg`,
            imageAlign: "right",
            title: "All your mocks in one place",
          },
        ]}
      </Block>
    );

    const Features = () => (
      <Block layout="fourColumn">
        {[
          {
            content: "Create mocks from editor",
            image: `${baseUrl}img/undraw_react.svg`,
            imageAlign: "top",
            title: "Easy creation of mocks",
          },
          {
            content: "Opinionated organization of mocks",
            image: `${baseUrl}img/undraw_operating_system.svg`,
            imageAlign: "top",
            title: "Manage mocks",
          },
        ]}
      </Block>
    );

    const Showcase = () => {
      if ((siteConfig.users || []).length === 0) {
        return null;
      }

      const showcase = siteConfig.users
        .filter(user => user.pinned)
        .map(user => (
          <a href={user.infoLink} key={user.infoLink}>
            <img src={user.image} alt={user.caption} title={user.caption} />
          </a>
        ));

      const pageUrl = page => baseUrl + (language ? `${language}/` : "") + page;

      return (
        <div className="productShowcaseSection paddingBottom">
          <h2>Who is Using This?</h2>
          <p>This project is used by all these people</p>
          <div className="logos">{showcase}</div>
          <div className="more-users">
            <a className="button" href={pageUrl("users.html")}>
              More {siteConfig.title} Users
            </a>
          </div>
        </div>
      );
    };

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer">
          <Features />
          {/*<FeatureCallout />*/}
          <LearnHow />
          <TryOut />
          <Description />
          {/*<Showcase />*/}
        </div>
      </div>
    );
  }
}

module.exports = Index;
