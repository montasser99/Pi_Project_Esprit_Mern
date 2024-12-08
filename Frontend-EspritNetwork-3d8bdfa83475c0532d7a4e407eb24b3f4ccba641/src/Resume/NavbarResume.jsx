import { Link } from 'react-router-dom';

export function NavbarResume() {
  return (
    <>
      <header id="header" className="fixed-top bg-black">
        <div className="container d-flex align-items-center">
          <h1 className="logo me-auto">
            <img
              src="../../public/assets/img/logo-network.png"
              alt="tes"
              className="mx-3"
            />
            <Link to="/">Esprit Network</Link>
          </h1>
          <nav id="navbar" className="navbar">
            <ul>
              <li>
                <Link className="nav-link scrollto active" to="#monprofil">
                  Mon Profile
                </Link>
              </li>
              <li>
                <Link className="nav-link scrollto" to="#apropos">
                  A Propos
                </Link>
              </li>
              <li>
                <Link className="nav-link scrollto" to="#contacts">
                  Contacts
                </Link>
              </li>
            </ul>
            <i className="bi bi-list mobile-nav-toggle" />
          </nav>
        </div>
      </header>
    </>
  );
}
