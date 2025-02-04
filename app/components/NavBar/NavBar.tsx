import * as React from "react";
import { Link, useLocation } from "remix";
import ThemeButton from "../ThemeButton/ThemeButton";
import { useModalContext } from "~/providers/ModalProvider";
import { fixedWidthLayoutClasses, NAVBAR_ID, topLevelLinks } from "~/constants";
import NavLink from "./NavLink";
import MobileMenu from "./MobileMenu";
import { useTheme } from "~/providers/ThemeProvider";
import { SupportedTheme } from "~/types";

const Navbar: React.FC = () => {
  const location = useLocation();
  const hasStripeBackground = !location.pathname.startsWith("/blog");
  const { modalIsOpen } = useModalContext();
  const { theme } = useTheme();
  const currentTopLevelRoute = location.pathname.split("/")[1];

  return (
    <>
      <div
        className={fixedWidthLayoutClasses + " mb-10 md:mb-16 lg:mb-20"}
        id={NAVBAR_ID}
      >
        <nav className="px-5vw nav-bar-wrapper py-10 pb-15 w-full flex mx-auto flex max-w-8xl items-center justify-between">
          <div>
            <NavLogo
              hasStripeBackground={hasStripeBackground}
              isCurrentRoute={getIsActiveRoute(
                "/",
                currentTopLevelRoute === undefined ? "" : currentTopLevelRoute
              )}
            />
          </div>

          <ul className="hidden lg:flex lg:w-1/2 justify-between">
            {topLevelLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                hasStripeBackground={hasStripeBackground}
                isCurrentRoute={getIsActiveRoute(
                  link.href,
                  currentTopLevelRoute === undefined ? "" : currentTopLevelRoute
                )}
              >
                {link.displayName}
              </NavLink>
            ))}
          </ul>

          <div className="flex items-center justify-center">
            <div className="block lg:hidden">
              <MobileMenu hasStripeHeader={hasStripeBackground} theme={theme} />
            </div>
            <div className="noscript-hidden hidden lg:block">
              <ThemeButton hasStripeHeader={hasStripeBackground} />
            </div>
          </div>
        </nav>
      </div>
      {hasStripeBackground && !modalIsOpen && (
        <div id="stripes">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}
    </>
  );
};

const getIsActiveRoute = (href: string, currentTopLevelRoute: string) => {
  if (href.startsWith("/#")) {
    return false;
  }

  return "/" + currentTopLevelRoute === href;
};

export default Navbar;

interface Props {
  hasStripeBackground: boolean;
  isCurrentRoute: boolean;
}
const NavLogo: React.FC<Props> = (props) => {
  const { theme } = useTheme();
  const { modalIsOpen } = useModalContext();

  const logoText = getLogoClassName(
    props.hasStripeBackground,
    theme,
    modalIsOpen
  );

  const IS_CURRENT_ROUTE_CLASSNAME = "NavLink--is-active-route";
  return (
    <Link
      prefetch="intent"
      to="/"
      className={`logo underlined focus:outline-none block whitespace-nowrap text-2xl font-medium transition uppercase ${logoText} ${
        props.isCurrentRoute ? IS_CURRENT_ROUTE_CLASSNAME : null
      }`}
    >
      <h1 className={logoText}>Alissa Nguyen</h1>
    </Link>
  );
};

const getLogoClassName = (
  hasStripeBg: boolean,
  theme: SupportedTheme,
  modalIsOpen: boolean
) => {
  if (modalIsOpen) {
    return theme === SupportedTheme.LIGHT
      ? "text-gray-500 hover:text-black"
      : "text-gray-400 hover:text-white";
  }
  if (hasStripeBg) {
    return theme === SupportedTheme.LIGHT ? "text-cyan-100" : "text-cyan-200";
  }
  return theme === SupportedTheme.LIGHT
    ? "text-gray-500 hover:text-black"
    : "text-gray-400 hover:text-white";
};
