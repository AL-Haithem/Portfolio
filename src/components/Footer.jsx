export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-copy">
          &copy; {new Date().getFullYear()} AL Haithem. Built with React & Vite.
        </div>
        <div className="footer-nav">
          <a href="https://github.com/AL-Haithem" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="www.linkedin.com/in/al-haithem-998304423" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="mailto:haithempg@gmail.com">Email</a>
        </div>
      </div>
    </footer>
  )
}
