import * as React from "react";

const Titles: React.FC = ({}) => {
  return (
    <div className="title-content text-aboutMe-aboutMeText">
      <div className="title-content__container inline-flex overflow-hidden font-semibold items-center">
        <p className="title-content__container__text m-0 float-left inline-flex">
          I'm a
        </p>
        <span className="blinker">[</span>
        <ul className="title-content__container__list text-left list-none">
          <li key={0} className="title-content__container__list__item m-0">
            software engineer
          </li>
          <li key={1} className="title-content__container__list__item m-0">
            freelance artist
          </li>
          <li key={2} className="title-content__container__list__item m-0">
            manga/anime lover !
          </li>
          <li key={3} className="title-content__container__list__item m-0">
            cat mom 🐈‍⬛ 🐈
          </li>
        </ul>
        <span className="blinker">]</span>
      </div>
    </div>
  );
};

export default Titles;
