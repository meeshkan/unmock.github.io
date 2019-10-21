const React = require("react");

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
    const langPart = `${language ? `${language}/` : ""}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : "") + doc;
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <a href={this.props.config.baseUrl} className="nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width="66"
                height="58"
              />
            )}
          </a>
          <div>
            <h5>Docs</h5>
            <a href={this.docUrl("introduction")}>Introduction</a>
            <a href={"https://github.com/unmock/unmock-examples"}>Examples</a>
          </div>
          <div>
            <h5>Community</h5>
            <a href="https://gitter.im/unmock/community">Gitter</a>
            <a
              href="https://twitter.com/unmockapis?lang=en"
              target="_blank"
              rel="noreferrer noopener"
            >
              Twitter
            </a>
          </div>
          <div>
            <h5>More</h5>
            <a href="https://github.com/unmock">GitHub</a>
            <a href="https://github.com/unmock/code-of-conduct">Code of Conduct</a>
          </div>
        </section>
        {/*<section className="copyright">{this.props.config.copyright}</section>*/}
        <section className="copyright">Copyright © {new Date().getFullYear()} <a href="https://meeshkan.com">Meeshkan</a></section>
      </footer>
    );
  }
}

module.exports = Footer;
