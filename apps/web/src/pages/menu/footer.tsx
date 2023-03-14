import React from "react";
import { Grid, Typography, Link, makeStyles } from "@material-ui/core";
import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";
import InstagramIcon from "@material-ui/icons/Instagram";
import LinkedInIcon from "@material-ui/icons/LinkedIn";

interface FooterProps {
  Name: string;
  Address: string;
  Phone: string;
  Email: string;
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  linkedInUrl: string;
}

const useStyles = makeStyles((theme) => ({
  socialIcon: {
    marginRight: theme.spacing(1),
  },
}));

const Footer: React.FC<FooterProps> = ({
  Name,
  Address,
  Phone,
  Email,
  facebookUrl,
  twitterUrl,
  instagramUrl,
  linkedInUrl,
}) => {
  const classes = useStyles();

  return (
    <div style={{ backgroundColor: "#F5F5F5", padding: "20px" }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Typography variant="h5">{Name}</Typography>
          <Typography variant="body2">{Address}</Typography>
          <Typography variant="body2">
            Phone:{" "}
            <Link href={`tel:${Phone}`} color="inherit">
              {Phone}
            </Link>
          </Typography>
          <Typography variant="body2">
            Email:{" "}
            <Link href={`mailto:${Email}`} color="inherit">
              {Email}
            </Link>
          </Typography>
        </Grid>
        <Grid item xs={12} md={8} container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Typography variant="h6">Liens utiles</Typography>
            <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
              <li>
                <Link href="/" color="inherit">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/services" color="inherit">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/blog" color="inherit">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" color="inherit">
                  Contact
                </Link>
              </li>
            </ul>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="h6">Suivez-nous</Typography>
            <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
              <li>
                <Link href={facebookUrl} color="inherit">
                  <FacebookIcon className={classes.socialIcon} />
                  Facebook
                </Link>
              </li>
              <li>
                <Link href={twitterUrl} color="inherit">
                  <TwitterIcon className={classes.socialIcon} />
                  Twitter
                </Link>
              </li>
              <li>
                <Link href={instagramUrl} color="inherit">
                  <InstagramIcon className={classes.socialIcon} />
                  Instagram
                </Link>
              </li>
              <li>
                <Link href={linkedInUrl} color="inherit">
                  <LinkedInIcon className={classes.socialIcon} />
                  LinkedIn
                </Link>
              </li>
            </ul>
            </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">
              Abonnez-vous à notre newsletter
            </Typography>
            <Typography variant="body2">
              Entrez votre adresse email pour recevoir nos dernières
              actualités
            </Typography>
            <form style={{ marginTop: "16px" }}>
              <input
                type="email"
                placeholder="Votre adresse email"
                style={{
                  padding: "8px",
                  border: "none",
                  borderRadius: "4px",
                  marginRight: "8px",
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: "#1E90FF",
                  color: "white",
                  padding: "8px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                S'abonner
              </button>
            </form>
          </Grid>
        </Grid>
      </Grid>
    </div>//</Grid>
  //</Grid>
//</div>

);
};

export default Footer;