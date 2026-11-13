import { ResearchField } from "./components/ResearchField";
import { WaitlistForm } from "./components/WaitlistForm";

function Mark() {
  return <svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M7 20h17L33 4M24 20l9 16" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function MailIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>;
}

function PaperIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 3h8l4 4v14H6V3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M14 3v5h4M9 12h6M9 16h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header container">
        <a className="brand" href="#top" aria-label="OpenAssay home"><Mark /><span>OpenAssay</span></a>
        <nav aria-label="Main navigation">
          <a href="#contributions">Contributions</a>
          <a href="#collection">Reproductions</a>
          <a href="#waitlist">Waitlist</a>
        </nav>
      </header>

      <main id="main">
        <section className="project-header container" id="top" aria-labelledby="project-title">
          <h1 id="project-title">OpenAssay</h1>
          <p className="project-subtitle">A research engine</p>
          <p className="project-description">OpenAssay develops a research plan from a single prompt and executes it end to end, with iterative evaluation and self-correction.</p>
          <p className="project-status"><span className="status-dot" aria-hidden="true" /> In development · Public release coming soon</p>
          <div className="resource-links">
            <a href="#waitlist" className="resource-button primary"><MailIcon />Join the waitlist</a>
            <a href="#collection" className="resource-button"><PaperIcon />Paper reproductions</a>
          </div>
          <ResearchField />
        </section>

        <div className="content container">
          <section className="contributions-section section" id="contributions" aria-labelledby="contributions-title">
            <h2 id="contributions-title">Research contributions</h2>
            <div className="research-contributions">
              <div className="contribution-cards">
                <article className="contribution-card" aria-labelledby="execution-title">
                  <span className="card-number" aria-hidden="true">01</span>
                  <h3 id="execution-title">Efficient execution</h3>
                  <p>Adapts experiments to available hardware and uses half the tokens of direct OpenAI prompting.</p>
                </article>
                <article className="contribution-card" aria-labelledby="traceability-title">
                  <span className="card-number" aria-hidden="true">02</span>
                  <h3 id="traceability-title">Traceable research</h3>
                  <p>Links sources, plans, experiments, results, and corrections in one research record.</p>
                </article>
                <article className="contribution-card" id="collection" aria-labelledby="collection-title">
                  <span className="card-number" aria-hidden="true">03</span>
                  <h3 id="collection-title">20+ reproduced papers</h3>
                  <p>Papers from 2026 A* conferences, reproduced with accompanying code.</p>
                </article>
              </div>
              <p className="release-note">All code and papers will be released.</p>

              <div className="performance-summary" aria-labelledby="efficiency-title">
                <h3 id="efficiency-title">Computational Costs</h3>
                <div className="comparison-table-wrap">
                  <table className="comparison-table" aria-describedby="comparison-note">
                    <caption>Comparison on H200 SXM hardware</caption>
                    <thead><tr><th scope="col">System</th><th scope="col">GPU hours per paper ↓</th><th scope="col">OpenAssay speedup ↑</th></tr></thead>
                    <tbody>
                      <tr className="openassay-result"><th scope="row">OpenAssay</th><td><strong>1,300</strong></td><td><strong>1×</strong></td></tr>
                      <tr><th scope="row">OpenAI Sol 6.1</th><td>2,600</td><td>2×</td></tr>
                      <tr><th scope="row">Anthropic Opus 5.5</th><td>2,700</td><td>2.08×</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="measurement-note" id="comparison-note">GPU-hour measurements use the same H200 SXM hardware. OpenAssay speedup is each system’s GPU-hour cost divided by 1,300.</p>
                <p className="result-callout"><strong>50% fewer GPU hours</strong> than Sol 6.1; <strong>51.9% fewer</strong> than Anthropic Opus 5.5.</p>
              </div>
            </div>
          </section>

          <section className="waitlist-section section" id="waitlist" aria-labelledby="waitlist-title">
            <h2 id="waitlist-title">Release updates</h2>
            <p className="section-description">All code and papers will be released. Register to receive updates on OpenAssay and the reproduction collection.</p>
            <WaitlistForm />
          </section>
        </div>
      </main>

      <footer className="site-footer container"><p>© 2026 OpenAssay</p><p>In development</p><a href="#top">Back to top ↑</a></footer>
    </>
  );
}
