import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useState,useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Slider from 'react-slick';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

interface  Images {
    url: string;
    title: string;
    description: string;
}

const images : Images = ([
  {
    url: "https://imagespocauniversitepariscite.s3.eu-central-1.amazonaws.com/image1.gif",
    title: "Découvrir",
    description: "le Team Roquette",
  },
  {
    url: "https://imagespocauniversitepariscite.s3.eu-central-1.amazonaws.com/cute-4784545_960_720.png",
    title: "Découvrir",
    description: "l'histoire de Pokémon cute ",
  },
  {
    url: "https://imagespocauniversitepariscite.s3.eu-central-1.amazonaws.com/image3.gif",
    title: "Découvrir",
    description: "le Team Roquette",
  },
  {
    url: "https://imagespocauniversitepariscite.s3.eu-central-1.amazonaws.com/image2.gif",
    title: "Découvrir",
    description: "le Team Roquette",
  }
]);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(10),
    position: 'relative',
    marginLeft: "5px",
    marginRight: "5px",
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', 
  },
  cardContent: {
    flexGrow: 1,
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
    },
  },
  navButtonIcon: {
    fontSize: 48,
  },
  prevButton: {
    left: 0,
  },
  nextButton: {
    right: 0,
  },
}));

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
};

const AdCarousel = () => {
  const classes = useStyles();
  const [slider, setSlider] = useState<any>(null);
  const [sliderSettings, setSliderSettings] = useState({});
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let slidesToShow = 3;

      if (width < 950) {
        slidesToShow = 1;
      } else if (width < 1000) {
        slidesToShow = 3;
      }

      setSliderSettings({
        dots: true,
        infinite: true,
        slidesToShow,
        slidesToScroll: 1,
        // ... autres propriétés de configuration
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handlePrevClick = () => {
    slider?.slickPrev();
  };

  const handleNextClick = () => {
    slider?.slickNext();
  };

  const handleSliderRef = (slider: any) => {
    setSlider(slider);
  };

  const handleClick = (image : Images) => {
   // window.location.href = image.url
    window.open(image.url,'_blank')
  }

  return (
    <div className={classes.root}>
      <IconButton className={`${classes.navButton} ${classes.prevButton}`} onClick={handlePrevClick}>
        <ArrowBackIosIcon className={classes.navButtonIcon} />
        </IconButton>
      <IconButton className={`${classes.navButton} ${classes.nextButton}`} onClick={handleNextClick}>
        <ArrowForwardIosIcon className={classes.navButtonIcon} />
      </IconButton>
      <Slider {...sliderSettings} ref={handleSliderRef}>
        {images.map((image, index) => (
          <Grid item key={index}>
            <Card className={classes.card}>
              <CardActionArea>
                <CardMedia
                  className={classes.cardMedia}
                  image={image.url}
                  title={image.title}
                  onClick={() => handleClick(image)}
                />
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {image.title}
                  </Typography>
                  <Typography>
                    {image.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Slider>
    </div>
  );
};

export default AdCarousel;
