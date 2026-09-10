import { useEffect, useState } from 'react';

const authSteps = [
	['01. Client', 'The form sends credentials over HTTPS with cookies enabled.'],
	['02. Middleware', 'CORS, security headers, rate limits, and Joi validation reject unsafe requests early.'],
	['03. Controller', 'The controller verifies account state, hashes passwords, and creates the session.'],
	['04. Response', 'The server sets an httpOnly access cookie and never returns private token values.'],
];

const lootSteps = [
	['01. React client', 'The Vite storefront handles navigation, search, accounts, details, and the cart.'],
	['02. Express API', 'The API applies security middleware and serves the relevant public, auth, or admin route.'],
	['03. Prepared data', 'Workers collect, enrich, price, and filter Steam data before visitors request it.'],
	['04. Fast reads', 'Prepared lists and pagination keep public responses compact and fast.'],
];

const authReport = [
	['Registration', 'Joi validates account fields, bcrypt hashes the password, and duplicate accounts are handled without exposing sensitive data.'],
	['Login', 'The server verifies the bcrypt hash, checks active and banned state, then signs a JWT containing the session identity and token version.'],
	['Protected request', 'Protection verifies the JWT, loads the user, checks token version and password-change time, then attaches the trusted user.'],
	['Logout and recovery', 'Logout requires CSRF validation and clears the access cookie. Password recovery uses separate limits and email verification.'],
];

const lootReport = [
	['Steam ingestion', 'The Steam manager fetches new or changed apps, compares them with stored state, and sends only relevant changes to the worker.'],
	['Enrichment and pricing', 'The worker requests missing details and prices in batches, converts currencies, finds the cheapest offer, and applies the configured margin.'],
	['Storage and indexes', 'MongoDB stores the durable catalog. Bulk writes and cursors reduce repeated work, while Redis stores cache data and metrics.'],
	['Fast storefront reads', 'Scheduled filter workers prepare popular, cheapest, newest, and free lists. Public requests then return only a page of results.'],
];

function InfoModal({ title, children, onClose }) {
	return (
		<div className="auth-modal" style={{ zIndex: 9999 }} onClick={onClose}>
			<div className="auth-modal-content" style={{ maxWidth: '900px', width: '90%', maxHeight: '90vh', overflowY: 'auto', padding: '30px' }} onClick={(event) => event.stopPropagation()}>
				<button className="auth-modal-close" onClick={onClose} aria-label="Close">&times;</button>
				<h2 style={{ margin: '0 0 18px', color: 'var(--green, #E67E22)' }}>{title}</h2>
				{title === 'How it works - Loot Website' && <div style={{ marginBottom: '18px' }}><a href="https://loot.alhaithem.site" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: 'inline-block', padding: '9px 14px', textDecoration: 'none', background: 'var(--green, #E67E22)', color: '#000', fontWeight: 'bold' }}>Open Loot Store in New Tab</a></div>}
				{children}
			</div>
		</div>
	);
}

function FlowGrid({ steps }) {
	return (
		<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '12px' }}>
			{steps.map(([heading, text]) => (
				<div key={heading} style={{ padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
					<strong style={{ color: 'var(--green, #E67E22)' }}>{heading}</strong>
					<p style={{ margin: '6px 0 0', fontSize: '12px', lineHeight: 1.6 }}>{text}</p>
				</div>
			))}
		</div>
	);
}

export default function Works({ onOpenAuth }) {
	const [adminModalOpen, setAdminModalOpen] = useState(false);
	const [aboutModalOpen, setAboutModalOpen] = useState(false);
	const [authHowItWorksOpen, setAuthHowItWorksOpen] = useState(false);

	useEffect(() => {
		const reportOpen = adminModalOpen || aboutModalOpen || authHowItWorksOpen;
		const previousOverflow = document.body.style.overflow;

		if (reportOpen) {
			document.body.style.overflow = 'hidden';
		}

		return () => {
			document.body.style.overflow = previousOverflow;
		};
	}, [adminModalOpen, aboutModalOpen, authHowItWorksOpen]);

	return (
		<section id="works" className="section">
			<div className="container">
				<div className="reveal">
					<span className="section-label">Portfolio</span>
					<h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>My Works.<span style={{ fontSize: '14px', color: 'var(--green, #E67E22)', fontWeight: 'normal', background: 'rgba(74, 222, 128, 0.1)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(74, 222, 128, 0.2)' }}>Click on any project below to test it live!</span></h2>
					<p className="section-desc">Projects I've built and experimented with.</p>
				</div>
				<div className="sd2-grid reveal reveal-d1" style={{ marginTop: '36px' }}>
					<div className="sd2-card" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }} onClick={onOpenAuth}>
						<div className="sd2-ready-badge">&#10003; Interactive Demo</div>
						<div className="sd2-title-row"><span className="sd2-icon">&#128274;</span><div><div className="sd2-title">Authentication System</div><div className="sd2-subtitle">Secure Auth - watch the backend pipeline live</div></div></div>
						<div className="sd2-tags"><span className="tag">Express</span><span className="tag">Mongoose</span><span className="tag">Joi</span><span className="tag">JWT</span><span className="tag">bcrypt</span></div>
						<div style={{ marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '10px', flexWrap: 'wrap' }}><button className="btn btn-primary" style={{ flex: '1 1 170px', padding: '10px', pointerEvents: 'none', background: 'var(--green, #E67E22)', color: '#000', fontWeight: 'bold' }}>Click Here To Test It Live</button><button className="btn btn-outline" onClick={(event) => { event.stopPropagation(); setAuthHowItWorksOpen(true); }} style={{ flex: '1 1 140px', padding: '10px' }}>How it works</button></div>
					</div>
					<div className="sd2-card" style={{ display: 'flex', flexDirection: 'column' }}>
						<div className="sd2-ready-badge" style={{ background: 'rgba(234, 179, 8, 0.1)', color: '#eab308' }}>&#128187; Full-Stack Platform</div>
						<div className="sd2-title-row"><span className="sd2-icon">&#127918;</span><div><div className="sd2-title">Loot Store &amp; Operations Platform</div><div className="sd2-subtitle">Steam-powered catalog with automated pricing, data workers, and live monitoring</div></div></div>
						<div className="sd2-tags"><span className="tag">React + Vite</span><span className="tag">Express + MongoDB</span><span className="tag">Upstash Redis</span><span className="tag">Steam Data Workers</span><span className="tag">SSE Monitoring</span></div>
						<div style={{ marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '10px', flexWrap: 'wrap' }}><a href="https://loot.alhaithem.site" target="_blank" rel="noreferrer" className="btn btn-primary" style={{ flex: '1 1 140px', padding: '10px', textAlign: 'center', textDecoration: 'none', background: 'var(--green, #E67E22)', color: '#000', fontWeight: 'bold' }}>Visit Store</a><button onClick={() => setAboutModalOpen(true)} className="btn btn-outline" style={{ flex: '1 1 140px', padding: '10px' }}>How it works - Website</button><button onClick={() => setAdminModalOpen(true)} className="btn btn-outline" style={{ flex: '1 1 140px', padding: '10px', color: '#eab308', borderColor: '#eab308' }}>How it works - Admin</button></div>
					</div>
				</div>
			</div>
			{authHowItWorksOpen && <InfoModal title="How the Authentication System Works" onClose={() => setAuthHowItWorksOpen(false)}><p style={{ color: '#aaa', lineHeight: 1.7 }}>This is a layered authentication system: the client collects input, the API validates and processes it, MongoDB stores account state, and security middleware controls every protected request before it reaches application logic.</p><h3 style={{ margin: '24px 0 12px', color: 'var(--green, #E67E22)' }}>Request flow</h3><FlowGrid steps={authSteps} /><h3 style={{ margin: '24px 0 12px', color: 'var(--green, #E67E22)' }}>Main authentication flows</h3><FlowGrid steps={authReport} /><h3 style={{ margin: '24px 0 12px', color: 'var(--green, #E67E22)' }}>Security layers</h3><ul style={{ lineHeight: 1.8 }}><li><strong>JWT in an httpOnly secure cookie:</strong> client-side code cannot read the access token directly.</li><li><strong>Token versioning:</strong> invalidating account state makes older sessions unusable.</li><li><strong>Password-change invalidation:</strong> tokens created before a password change are rejected.</li><li><strong>CSRF proof:</strong> sensitive requests require a signed token tied to the session and checked with a timing-safe comparison.</li><li><strong>Guest and user guards:</strong> each route stays within its intended trust boundary.</li><li><strong>Rate limits:</strong> login, registration, recovery, CSRF, and admin login have separate request budgets.</li><li><strong>Input validation:</strong> Joi validates body, query, and route parameters before controllers run.</li><li><strong>Defense in depth:</strong> CORS, Helmet, HPP, secure cookies, body limits, and centralized errors protect the API boundary.</li></ul><h3 style={{ margin: '24px 0 12px', color: 'var(--green, #E67E22)' }}>Efficiency and architecture</h3><ul style={{ lineHeight: 1.8 }}><li>Protected requests carry a compact cookie instead of credentials repeatedly.</li><li>User lookups select only the security fields required for verification.</li><li>Rate limits stop repeated expensive password checks and recovery attempts early.</li><li>The JSON body limit is capped at 250 KB to control memory use.</li></ul><p style={{ lineHeight: 1.7 }}>The system is organized as Routes -&gt; Middleware -&gt; Controllers -&gt; Models and utilities. This keeps security decisions centralized and makes each flow easier to test and extend.</p></InfoModal>}
			{aboutModalOpen && <InfoModal title="How it works - Loot Website" onClose={() => setAboutModalOpen(false)}><p style={{ color: '#aaa', lineHeight: 1.7 }}>Loot is a full-stack game discovery and store platform. The browser handles navigation and interaction, the Express API protects and serves data, and background workers prepare expensive Steam work before visitors request it.</p><div style={{ margin: '20px 0', background: '#111', borderRadius: '8px', overflow: 'hidden' }}><iframe src="https://loot.alhaithem.site" title="Loot Store live website" loading="lazy" style={{ width: '100%', height: '480px', display: 'block', border: 0 }} /></div><h3 style={{ color: 'var(--green, #E67E22)' }}>Request flow</h3><FlowGrid steps={lootSteps} /><h3 style={{ margin: '24px 0 12px', color: 'var(--green, #E67E22)' }}>Main system layers</h3><FlowGrid steps={[['Storefront', 'React, Vite, Router, game listings, details, login, profiles, cart, and local persistence.'], ['API and security', 'Express, Joi, JWT cookies, CSRF, bcrypt, CORS, Helmet, HPP, and rate limiting.'], ['Data layer', 'MongoDB stores the durable catalog and users; Upstash Redis supports cache operations and metrics.'], ['Operations', 'The admin panel controls crawler modes and receives live system, HTTP, cache, worker, and error metrics through SSE.']]} /><h3 style={{ margin: '24px 0 12px', color: 'var(--green, #E67E22)' }}>Steam pipeline</h3><FlowGrid steps={lootReport} /><ol style={{ marginTop: '16px', paddingLeft: '22px', lineHeight: 1.8 }}><li>Steam Data Manager scans new or changed apps instead of processing the full catalog every cycle.</li><li>Database synchronization compares the incoming state with MongoDB and sends only changed games to Games Worker.</li><li>Games Worker fetches missing metadata, classifies games, and requests prices only where needed.</li><li>The pricing service converts regional values, selects the cheapest offer, and applies the configured margin.</li><li>Changes are saved through MongoDB bulk operations and progress is sent to the admin metrics.</li><li>The hourly Filter Worker builds popular, cheapest, newest, and free game lists.</li></ol><h3 style={{ margin: '24px 0 12px', color: 'var(--green, #E67E22)' }}>How resources are saved</h3><ul style={{ lineHeight: 1.8 }}><li>Only changed Steam apps are enriched.</li><li>Data and price work can run independently and external requests are grouped into batches.</li><li>MongoDB cursors and projections limit memory while bulk writes reduce database round trips.</li><li>Prepared in-memory lists and Redis cache avoid repeating expensive sorting and external work.</li><li>Public responses return 24 games and only the fields needed by the current page.</li><li>One SSE stream serves admin metrics instead of separate polling requests per widget.</li></ul><h3 style={{ margin: '24px 0 12px', color: 'var(--green, #E67E22)' }}>Data size and limits</h3><p style={{ lineHeight: 1.7 }}>The catalog size is dynamic because it follows Steam. The working set is controlled with filter cursor batches of 200, save and price batches of 100, and public responses of 24 games, keeping resource use proportional to current work.</p></InfoModal>}
			{adminModalOpen && <InfoModal title="How it works - Loot Admin Panel" onClose={() => setAdminModalOpen(false)}><p style={{ color: '#aaa', lineHeight: 1.7 }}>The private admin panel is an operations console for controlling workers and observing the platform without exposing sensitive data to visitors.</p><video src="https://res.cloudinary.com/b6ztyqia/video/upload/v1788917744/dashboard_sky1my.mp4" controls autoPlay loop muted style={{ width: '100%', display: 'block', marginBottom: '20px' }} /><h3 style={{ color: '#eab308' }}>How Loot's data platform works</h3><p style={{ lineHeight: 1.7 }}>Loot prepares expensive Steam work before a visitor opens the store. Workers collect, normalize, price, filter, and prepare the catalog, so public requests remain small and predictable.</p><FlowGrid steps={lootReport} /><h3 style={{ margin: '24px 0 12px', color: '#eab308' }}>Admin panel features</h3><FlowGrid steps={[['Dashboard', 'Analytics, sales overview, and quick statistics.'], ['System', 'Server health, memory, HTTP, and SSE monitoring metrics.'], ['Data crawler', 'Start and stop Steam catalog extraction in both, data-only, or price-only modes.'], ['Games filters', 'Inspect scheduled filter cycles, prepared lists, timing, logs, and errors.'], ['Cache memory', 'Inspect Redis hits, misses, requests, storage, bandwidth, and connections.'], ['Data management', 'Review and manage catalog records and operational data.'], ['Logs and settings', 'Inspect activity logs, error tracking, and global configuration.']]} /><h3 style={{ margin: '24px 0 12px', color: '#eab308' }}>Resource control</h3><ul style={{ lineHeight: 1.8 }}><li>Crawler progress is streamed through one SSE connection updated approximately every second.</li><li>Worker batches of 100 reduce database round trips, while price batches of 100 reduce external request overhead.</li><li>Filter scans use a cursor batch size of 200, and prepared lists keep visitor reads fast.</li><li>Rate limits, delays between external calls, and monitoring logs keep background work observable and controlled.</li></ul></InfoModal>}
		</section>
	);
}