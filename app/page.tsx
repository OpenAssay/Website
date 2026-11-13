import { ResearchField } from "./components/ResearchField";
import { WaitlistForm } from "./components/WaitlistForm";

function Mark({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M7 20h17L33 4M24 20l9 16" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h15m-6-6 6 6-6 6"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header wrap">
        <a className="brand" href="#top" aria-label="OpenAssay home"><span className="brand-icon"><Mark /></span><span>openassay</span></a>
        <nav aria-label="Main navigation">
          <a className="nav-link" href="#idea">The idea</a>
          <a className="nav-link" href="#collection">The collection</a>
          <a className="nav-cta" href="#waitlist">Join the waitlist <Arrow diagonal /></a>
        </nav>
      </header>
      <main id="main">
        <section className="hero wrap" id="top" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span className="status-dot" /> A NEW RESEARCH ENGINE</p>
            <h1 id="hero-title"><em>Curiosity,</em><br />put to work.</h1>
            <p className="hero-description">For the questions that deserve more than an answer. OpenAssay is a research engine for exploring ideas, following evidence, and moving discovery forward.</p>
            <div className="hero-actions"><a href="#waitlist" className="button button-light">Join the waitlist <Arrow diagonal /></a><span className="launch-note">In the making.<br /><span>Launching soon.</span></span></div>
          </div>
          <ResearchField />
          <div className="hero-baseline"><span>AN OPEN QUESTION IS A BEGINNING.</span><a href="#idea" aria-label="Scroll to the idea">KEEP EXPLORING <span>↓</span></a></div>
        </section>
        <section className="idea-section wrap" id="idea" aria-labelledby="idea-title">
          <div className="section-label"><span>01</span> THE IDEA</div>
          <div className="idea-intro"><h2 id="idea-title">A little less friction.<br />A lot more <em>possibility.</em></h2><p>Research starts with a spark. A question you can’t quite leave alone. We’re building OpenAssay to help you take it further—from an idea worth exploring to work worth building on.</p></div>
          <div className="principles">
            <article><div className="principle-symbol question-symbol" aria-hidden="true">?</div><span className="principle-number">01 / ASK</span><h3>Start with a question.</h3><p>Bring your curiosity. The interesting problems rarely come with a clear path.</p></article>
            <article><div className="principle-symbol evidence-symbol" aria-hidden="true"><i /><i /><i /></div><span className="principle-number">02 / EXPLORE</span><h3>Follow the evidence.</h3><p>Find the ideas, connections, and sources that help you see a little further.</p></article>
            <article><div className="principle-symbol branch-symbol" aria-hidden="true"><Mark /></div><span className="principle-number">03 / ADVANCE</span><h3>Make the next move.</h3><p>Turn promising directions into something you can examine, test, and build on.</p></article>
          </div>
        </section>
        <section className="collection-section" id="collection" aria-labelledby="collection-title">
          <div className="collection-inner wrap">
            <div className="section-label"><span>02</span> FROM PAPER TO POSSIBILITY</div>
            <div className="collection-content">
              <div className="collection-stat"><div className="big-number">100<span>+</span></div><p>NeurIPS papers.<br />Reproduced with code.</p><div className="stat-rule">{Array.from({length:30},(_,index)=><span key={index} />)}</div></div>
              <div className="collection-copy"><span className="collection-tag">THE REPRODUCTION COLLECTION</span><h2 id="collection-title">Beyond the abstract.<br /><em>Into the work.</em></h2><p>We’ve reproduced more than 100 NeurIPS papers with code. A collection for researchers who want to pick up an idea, look closer, and take it somewhere new.</p><div className="collection-release"><span className="status-dot" /> COLLECTION RELEASING SOON</div><a href="#waitlist" className="text-link">Be there when it opens <Arrow diagonal /></a></div>
            </div>
            <div className="collection-footnote"><span>READ. REPRODUCE. RETHINK.</span><span>OPENASSAY / AN ONGOING EXPLORATION <span aria-hidden="true">↗</span></span></div>
          </div>
        </section>
        <section className="waitlist-section wrap" id="waitlist" aria-labelledby="waitlist-title">
          <div className="section-label"><span>03</span> WHAT COMES NEXT</div>
          <div className="waitlist-layout"><div className="waitlist-copy"><p className="eyebrow"><span className="status-dot" /> LAUNCHING SOON</p><h2 id="waitlist-title">Stay <em>curious.</em><br />We’ll be in touch.</h2><p>A new research engine. A growing collection of reproduced papers. Join the waitlist for launch news and the first look at what’s next.</p></div><WaitlistForm /></div>
          <div className="closing-note"><Mark /><span>For the questions still keeping you up.</span></div>
        </section>
      </main>
      <footer className="site-footer wrap"><a className="brand footer-brand" href="#top"><Mark /><span>openassay</span></a><p>Curiosity is only the beginning.</p><span>© 2026 OpenAssay</span><a className="back-top" href="#top" aria-label="Back to top">↑</a></footer>
    </>
  );
}
