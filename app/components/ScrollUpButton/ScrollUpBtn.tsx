import * as React from "react";
import { BsArrowUpCircle } from "react-icons/bs";
import { LinksFunction } from "remix";
import { useTheme } from "~/providers/ThemeProvider";
import { SupportedTheme } from "~/types";
import styles from "./ScrollUpBtn.css";
interface Props {}

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

const ScrollUpBtn: React.FC<Props> = ({}) => {
  const [showScrollUpBtn, setShowScrollUpBtn] = React.useState<boolean>(false);
  const { theme } = useTheme();

  function handleDisplayScrollBtn() {
    const introductionContainer = document.getElementById("AboutMe");
    if (introductionContainer) {
      const introContainerHeight = introductionContainer.clientHeight;
      const shouldDisplayScrollBtn =
        window.scrollY >= introContainerHeight - 300;
      setShowScrollUpBtn(shouldDisplayScrollBtn);
    }
  }

  React.useEffect(() => {
    document.addEventListener("scroll", handleDisplayScrollBtn);
  }, []);

  return (
    <button
      className={`ScrollUp__Button ${!showScrollUpBtn ? "hidden" : ""}`}
      id="scrollUpBtn"
      name="Scroll to top"
      aria-label="Scroll to top"
      onClick={scrollToTop}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 ${
          theme === SupportedTheme.LIGHT
            ? "text-gray-400 hover:text-black"
            : "text-gray-500 hover:text-white"
        } ease-in duration-100`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"
        />
      </svg>
    </button>
  );
};

export default ScrollUpBtn;