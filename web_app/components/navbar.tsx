import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { Navbar, Nav, Container } from "react-bootstrap";
import logo from '/assets/img/new_logo.png';
import navIcon1 from '../assets/img/nav-icon1.svg';
import navIcon2 from '../assets/img/nav-icon2.svg';
import navIcon3 from '../assets/img/nav-icon3.svg';
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export const NavBar = () => {
  const [activeLink, setActiveLink] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [])

  const onUpdateActiveLink = (value: string) => {
    setActiveLink(value);
  }

  return (
    <Navbar expand="md" className={scrolled ? "scrolled" : ""}>
      <Container>
        <Navbar.Brand href="/">
          <img className="logo-css" src="/assets/img/new_logo.png" alt="Logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <span className="navbar-toggler-icon"></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link
              href="#home"
              className={
                activeLink === "home" ? "active navbar-link" : "navbar-link"
              }
              onClick={() => onUpdateActiveLink("home")}
            >
              Home
            </Nav.Link>
            <Nav.Link
              href="#features"
              className={
                activeLink === "skills" ? "active navbar-link" : "navbar-link"
              }
              onClick={() => onUpdateActiveLink("skills")}
            >
              Features
            </Nav.Link>
            <Nav.Link
              href="#dev"
              className={
                activeLink === "projects" ? "active navbar-link" : "navbar-link"
              }
              onClick={() => onUpdateActiveLink("projects")}
            >
              Developers
            </Nav.Link>
          </Nav>

          <span className="navbar-text">
            {!session && (
              <>
                <button
                  className="vvd"
                  onClick={() => {
                    signIn();
                  }}
                >
                  <span>Get Started</span>
                </button>
              </>
            )}

            {session?.user && (
              <>
                <a
                  className="sign-out"
                  onClick={() => {
                    signOut();
                  }}
                >
                  <span style={{cursor: 'pointer'}}>Sign Out</span>
                </a>

                {session.user.image && (
                  <a href="/me">
                  <span
                    style={{ backgroundImage: `url('${session.user.image}')` }}
                    className="avatar-navbar"
                  />
                  </a>
                )}
              </>
            )}
          </span>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
