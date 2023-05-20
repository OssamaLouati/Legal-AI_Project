import { Carousel } from 'react-bootstrap';
import 'react-multi-carousel/lib/styles.css';
import { useEffect } from 'react';
import meter1 from "../assets/img/meter1.svg";
import meter2 from "../assets/img/meter2.svg";
import meter3 from "../assets/img/meter3.svg";
import arrow1 from "../assets/img/arrow1.svg";
import arrow2 from "../assets/img/arrow2.svg";

import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'


export const Skills: React.FC = () => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '60px',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
        },
      },
    ],
  };

  useEffect(() => {
    // Perform any necessary side effects here
  }, []);

  return (
    <section className="skill" id="features">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="skill-bx wow zoomIn">
              <h2>Features</h2>
              <p>Our plateform offers variety of fabulous features.</p>
              <Slider {...settings} className="owl-carousel owl-theme skill-slider">
                <div className="item">
                  <img src="https://i.postimg.cc/k41pQ35K/Untitled-design-1.png" alt="Image" />
                  <h5>Automated Legal Document Analysis</h5>
                </div>
                <div className="item">
                  <img src="https://i.postimg.cc/43F6wJzf/Untitled-design.png" alt="Image" />
                  <h5>Ask your contract yourself</h5>
                </div>
                <div className="item">
                  <img src="https://i.postimg.cc/Gp5qSPks/Untitled-design-3.png" alt="Image" />
                  <h5>Identification of Risks and Opportunities</h5>
                </div>
                <div className="item">
                  <img src="https://i.postimg.cc/J0tYz6Mx/Untitled-design-2.png" alt="Image" />
                  <h5>Enhanced Speed and Accuracy</h5>
                </div>
              </Slider>
            </div>
          </div>
        </div>
      </div>
      <img src="https://i.postimg.cc/1Xz09km7/Untitled-design-3.png" className="background-image-left"  alt="Image" />
    </section>
  );
};
