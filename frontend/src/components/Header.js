/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import {
  Navbar,
  Nav,
  NavItem,
  NavLink,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
} from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import { useLogoutUserMutation } from "../redux/api/authAPI";
import { useSelector } from "react-redux";
import logoImg from "../assets/images/logo.png";
import { toast } from "react-toastify";
import { useWaterReminder } from "../context/WaterReminderContext";
import { Bell } from "react-feather";

/* ────────────── simple in-memory music library ────────────── */
const musicLibrary = {
  pop: [
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  ],
  jazz: [
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  ],
  classical: [
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
  ],
};

const Header = () => {
  /* ──────────────── Navbar basics ──────────────── */
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((p) => !p);
  const location = useLocation();
  const isActive = (p) => (location.pathname === p ? "active-link" : "");

  /* ──────────────── Auth handling ──────────────── */
  const user = useSelector((s) => s.userState.user);
  const [
    logoutUser,
    { isLoading, isSuccess, error, isError },
  ] = useLogoutUserMutation();

  const handleLogout = () => logoutUser();

  useEffect(() => {
    if (isSuccess) window.location.href = "/login";
    if (isError) {
      const errs = error?.data?.error;
      (Array.isArray(errs) ? errs : [error?.data]).forEach((e) =>
        toast.error(e?.message || "Error", { position: "top-right" })
      );
    }
  }, [isSuccess, isError, error]);

  /* ──────────────── Water-reminder ─────────────── */
  const {
    showNotification,
    dismissNotification,
    recordDrink,
  } = useWaterReminder();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen((p) => !p);
  const handleDismissNotificationClick = () => {
    dismissNotification();
    toggleDropdown();
  };
  const handleRecordDrink = () => {
    recordDrink();
    dismissNotification();
    toggleDropdown();
  };

  /* ──────────────── Music player ──────────────── */
  const [selectedMusic, setSelectedMusic] = useState("");
  const [audioSrc, setAudioSrc] = useState("");
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef(null);

  const handleMusicChange = (e) => {
    const genre = e.target.value;
    setSelectedMusic(genre);

    if (genre && musicLibrary[genre]) {
      const rand = Math.floor(Math.random() * musicLibrary[genre].length);
      setAudioSrc(musicLibrary[genre][rand]);
      setIsPlayingMusic(true);
    } else {
      setAudioSrc("");
      setIsPlayingMusic(false);
    }
  };

  const handleMusicControl = () => {
    if (!audioSrc) return;
    if (isPlayingMusic) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlayingMusic((p) => !p);
  };

  /* ──────────────── Render ──────────────── */
  return (
    <header className="header">
      <div className="container">
        <Navbar expand="md" className="py-1">
          <NavbarBrand href="/">
            <img src={logoImg} alt="Self-Care" className="logo-image" />
          </NavbarBrand>

          <NavbarToggler onClick={toggle} className="ms-auto" />

          <Collapse isOpen={isOpen} navbar>
            <Nav className="ms-auto d-flex align-items-center" navbar>
              {/* --------- links by role --------- */}
              {user?.role === "user" && (
                <>
                  <NavItem>
                    <NavLink tag={Link} to="/user/dashboard" className={isActive("/user/dashboard")}>
                      Dashboard
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink tag={Link} to="/user/profile" className={isActive("/user/profile")}>
                      Profile
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink tag={Link} to="/user/recipes" className={isActive("/user/recipes")}>
                      Recipes
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink tag={Link} to="/user/shop" className={isActive("/user/shop")}>
                      Shop
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink tag={Link} to="/user/favorites" className={isActive("/user/favorites")}>
                      Favorite
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink tag={Link} to="/user/mycart" className={isActive("/user/mycart")}>
                      Cart
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink tag={Link} to="/user/order" className={isActive("/user/order")}>
                      Order
                    </NavLink>
                  </NavItem>
                  {/* ---- notification bell ---- */}
                  <NavItem className="notification-wrapper">
                    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                      <DropdownToggle className="notification-btn" tag="div">
                        <Bell size={24} />
                        {showNotification && <span className="notification-badge"></span>}
                      </DropdownToggle>
                      <DropdownMenu end>
                        {showNotification ? (
                          <div className="notification-text">
                            🔔 Time to drink water! 💧
                            <div className="notification-buttons">
                              <button className="record-btn" onClick={handleRecordDrink}>
                                Record
                              </button>
                              <button className="dismiss-btn" onClick={handleDismissNotificationClick}>
                                Dismiss
                              </button>
                            </div>
                          </div>
                        ) : (
                          <DropdownItem className="no-notification">No new notifications</DropdownItem>
                        )}
                      </DropdownMenu>
                    </Dropdown>
                  </NavItem>
                </>
              )}

              {user?.role === "content-manager" && (
                <>
                  <NavItem>
                    <NavLink tag={Link} to="/content-manager/recipes" className={isActive("/content-manager/recipes")}>
                      Manage Recipes
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink tag={Link} to="/content-manager/products" className={isActive("/content-manager/products")}>
                      Manage Products
                    </NavLink>
                  </NavItem>
                </>
              )}

              {user?.role === "admin" && (
                <>
                  <NavItem>
                    <NavLink tag={Link} to="/admin/users" className={isActive("/admin/users")}>
                      User Management
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink tag={Link} to="/admin/recipes" className={isActive("/admin/recipes")}>
                      Recipes
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink tag={Link} to="/admin/products" className={isActive("/admin/products")}>
                      Products
                    </NavLink>
                  </NavItem>
                </>
              )}

              {/* --------- global music player --------- */}
              <NavItem className="d-flex align-items-center mx-3 music-player-wrapper">
                <Input
                  bsSize="sm"
                  type="select"
                  value={selectedMusic}
                  onChange={handleMusicChange}
                  className="me-2"
                >
                  <option value="">🎵 Music</option>
                  <option value="pop">Pop</option>
                  <option value="jazz">Jazz</option>
                  <option value="classical">Classical</option>
                </Input>

                {audioSrc && (
                  <>
                    <audio
                      ref={audioRef}
                      src={audioSrc}
                      onEnded={() => setIsPlayingMusic(false)}
                      controls
                      style={{ width: 240, minWidth: 240 }}
                    />
                    <Button
                      color="secondary"
                      size="sm"
                      onClick={handleMusicControl}
                      className="ms-2"
                    >
                      {isPlayingMusic ? "Pause" : "Play"}
                    </Button>
                  </>
                )}
              </NavItem>

              {/* --------- login / logout --------- */}
              {user ? (
                <NavItem>
                  <Button
                    color="danger"
                    onClick={handleLogout}
                    disabled={isLoading}   /* <-- now used */
                    className="logout-button"
                  >
                    Logout
                  </Button>
                </NavItem>
              ) : (
                <NavItem>
                  <NavLink tag={Link} to="/login" className={isActive("/login")}>
                    Login
                  </NavLink>
                </NavItem>
              )}
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    </header>
  );
};

export default Header;
