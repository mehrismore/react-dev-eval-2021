import { useState, useEffect } from "react";
import { createUseStyles } from "react-jss";
import { Link, Switch, Route, Redirect } from "react-router-dom";
import { useWebcamCapture } from "./useWebcamCapture";
import slapImage1 from "./assets/hand-1.png";
import slapImage2 from "./assets/hand-2.png";
import slapImage3 from "./assets/hand-3.png";
import slapImage4 from "./assets/hand-4.png";
import logo from "./assets/slapsticker-logo.png";

const useStyles = createUseStyles((theme) => ({
  "@import":
    "url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&display=swap')",
  "@global body": {
    background: theme.palette.violet,
    color: theme.palette.text,
    fontFamily: "'Comfortaa', sans-serif",
  },

  App: {
    padding: "10px",
    background: theme.palette.violet,
    maxWidth: "1200px",
    minHeight: "900px",
    margin: "auto",
    "& a": {
      color: theme.palette.text,
    },
  },
  Header: {
    textAlign: "center",
    fontSize: "4rem",
    fontWeight: "bold",
    marginTop: "4rem",
    color: theme.palette.hotPink,
  },
  Main: {
    background: theme.palette.violet,

    "& canvas": {
      width: "100%",
      height: "auto",
    },
    "& video": {
      display: "none",
    },
  },
  Menu: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  Stickers: {
    marginTop: "4rem",
    "& h2": {
      fontSize: "4rem",
      marginTop: "6px",
    },
    "& img": {
      height: "8rem",
    },
  },
  Section: {
    marginTop: "4rem",
    "& h2": {
      fontSize: "4rem",
      marginTop: "6px",
    },
  },
  Logo: {
    width: "100px",
    height: "100px",
  },
  Gallery: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "10px",
    "& img": {
      height: "10rem",
    },
  },
  Picture: {
    background: theme.palette.hotPink,
    padding: "8px",
    position: "relative",
    "& img": {
      width: "150px",
      height: "8rem", // Sets a fixed height for the image
      objectFit: "cover", // Ensures the image maintains its aspect ratio
      marginTop: "16px",
    },
    "& h3": {
      padding: "2px",
      fontSize: "2rem",
      textAlign: "center",
      color: "white",
    },
  },
  InputStyle: {
    padding: "8px",
    border: "none",
    borderBottom: "2px solid #fff",
    fontSize: "32px",
    marginTop: "2px",
    background: "none",
    marginBottom: "10px",
    color: "rgba(255, 255, 255, 0.5)", // White with 50% opacity
    width: "50%",
    outline: "none",
    "&:focus": {
      background: theme.palette.purple, // Hot pink background when focused
      color: "white",
    },
  },
  Link: {
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline", // Adding underline on hover for better UX
      color: theme.palette.hotPink,
    },
  },
  List: {
    display: "flex",
    justifyContent: "flex-end",
    listStyleType: "none",
    padding: 0,
    margin: 0,
  },
  ListItem: {
    marginRight: "20px",
  },
  VideoStyle: {
    display: "flex",
    alignItems: "center",
  },
  DownloadBtn: {
    position: "relative",
    display: "flex",
    justifyContent: "flex-end",
    cursor: "pointer",
    "&:hover $DownloadText": {
      visibility: "visible",
      opacity: 1,
    },
  },
  DownloadIcon: {
    width: "24px",
    height: "24px",
  },
  DownloadText: {
    visibility: "hidden",
    width: "80px",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    color: "white",
    textAlign: "center",
    borderRadius: "6px",
    padding: "7px 0",
    position: "absolute",
    bottom: "125%", // Position the tooltip above the icon
    left: "90%",
    transform: "translateX(-50%)",
    zIndex: 1,
    opacity: 0,
    transition: "opacity 0.3s",
  },
  PlayButton: {
    fontSize: "10rem",
    background: theme.palette.green,
    padding: "20px 100px",
    textDecoration: "none",
    display: "inline-block", // Makes the link behave more like a button
    textAlign: "center",
    cursor: "pointer", // Makes it act like a button with a pointer cursor
    borderRadius: "5px", // Border radius to make it look like a button

    "@media (max-width: 768px)": {
      fontSize: "5rem",
      padding: "10px 50px",
    },
  },
  HeaderContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",

    // Media query for mobile screens
    "@media (max-width: 768px)": {
      alignItems: "left", // Switch to column on mobile
    },
  },
}));

const stickers = [slapImage1, slapImage2, slapImage3, slapImage4].map((url) => {
  const img = document.createElement("img");
  img.src = url;
  return { img, url };
});

function App(props) {
  // css classes from JSS hook
  const classes = useStyles(props);

  // currently active sticker
  const [sticker, setSticker] = useState();

  // title for the picture that will be captured
  const [title, setTitle] = useState("slaaaaap!");

  const [showPlaceholder, setShowPlaceholder] = useState(true);

  // create an array for all the pictures taken by user
  const [pictures, setPictures] = useState([]);

  const handleStickerClick = (sticker) => {
    setSticker(sticker);
  };

  // webcam behavior hook
  const [
    handleVideoRef, // callback function to set ref for invisible video element
    handleCanvasRef, // callback function to set ref for main canvas element
    handleCapture, // callback function to trigger taking the picture
    picture, // latest captured picture data object
  ] = useWebcamCapture(sticker?.img, title);

  // Update the pictures array when a new picture is captured
  useEffect(() => {
    if (picture) {
      setPictures((prevPictures) => [...prevPictures, picture]);
    }
  }, [picture]); // This effect runs whenever the `picture` changes (after a capture)

  // Function to trigger the picture download
  const downloadPicture = (picture, index) => {
    const link = document.createElement("a");
    link.href = picture.dataUri;
    link.download = `slap-pic-${index + 1}.png`;
    link.click(); // Programmatically trigger the download
  };

  return (
    <div className={classes.App}>
      <div className={classes.Menu}>
        <img className={classes.Logo} src={logo} alt="" />
        <nav>
          <ul className={classes.List}>
            <li className={classes.ListItem}>
              <Link to="/" className={classes.Link}>
                Home
              </Link>
            </li>
            <li className={classes.ListItem}>
              <Link to="/play" className={classes.Link}>
                Play!
              </Link>
            </li>
            <li>
              <Link to="/readme" className={classes.Link}>
                ReadMe
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* <h1 className={classes.Header}>SlapSticker</h1> */}

      <Switch>
        {/* Main app route(Landing Page) */}
        <Route path="/" exact>
          <div className={classes.HeaderContainer}>
            <p className={classes.Header}>
              Have you ever said something so dumb, you just wanted to slap
              yourself? Well now you can!
            </p>
            <Link to="/play" className={classes.PlayButton}>
              Play!
            </Link>
          </div>
          {/* <button className={classes.PlayButton}>Play!</button> */}
        </Route>
        {/* Play page */}
        <Route path="/play" exact>
          <main className={classes.Main}>
            <section className={classes.Section}>
              <h2>Step 1: Give it a name</h2>
              <div className={classes.Gallery}>
                <input
                  type="text"
                  value={title}
                  placeholder={
                    showPlaceholder && title === "" ? "slaaaaap!" : ""
                  }
                  className={classes.InputStyle}
                  onChange={(e) => setTitle(e.target.value)}
                  onFocus={() => {
                    if (title === "slaaaaap!") setTitle(""); // Clear the placeholder value on focus if it's still there
                    setShowPlaceholder(false);
                  }}
                  onBlur={() => {
                    if (title === "") {
                      setTitle("slaaaaap!"); // Restore the placeholder value if input is empty
                      setShowPlaceholder(true);
                    }
                  }}
                />
              </div>
            </section>
            <section className={classes.Stickers}>
              <h2>Step 2: Pick your sticker simply by clicking on it</h2>
              <div>
                {stickers.map((sticker, index) => (
                  <button
                    key={index}
                    onClick={() => handleStickerClick(sticker)}
                  >
                    <img src={sticker.url} alt={`Sticker ${index + 1}`} />
                  </button>
                ))}
              </div>
            </section>
            <section className={classes.Section}>
              <h2>Step 3: Slap yourself!</h2>
              <div className={classes.VideoStyle}>
                <video ref={handleVideoRef} />
                <canvas
                  ref={handleCanvasRef}
                  width={2}
                  height={2}
                  onClick={handleCapture}
                />
              </div>
            </section>
            <section className={classes.Section}>
              <h2>Step 4: Cherish this moment forever :D</h2>
              <div className={classes.Gallery}>
                {pictures.map((picture, index) => (
                  <div key={index} className={classes.Picture}>
                    <img src={picture.dataUri} alt="" />
                    <br />
                    <div
                      className={classes.DownloadBtn}
                      onClick={() => downloadPicture(picture, index)}
                    >
                      <div className={classes.DownloadIcon}>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3 16.5V18.75C3 19.3467 3.23705 19.919 3.65901 20.341C4.08097 20.7629 4.65326 21 5.25 21H18.75C19.3467 21 19.919 20.7629 20.341 20.341C20.7629 19.919 21 19.3467 21 18.75V16.5M16.5 12L12 16.5M12 16.5L7.5 12M12 16.5V3"
                            stroke="white"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                      <span className={classes.DownloadText}>Download</span>
                    </div>
                    <h3>{picture.title}</h3>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </Route>
        {/* Readme route  */}
        <Route path="/readme">
          <main>
            <h2>DevTest README</h2>
            <p>
              Hello candidate! Welcome to our little dev test. The goal of this
              exercise, is to asses your general skill level, and give us
              something to talk about at our next appointment.
            </p>
            <section>
              <h3>What this app should do!</h3>
              <p>
                SlapSticker is an app that lets users to slap stickers on their
                face, using their webcam. Functionality wise the app works, but
                the ui needs some love. We'd like for you to extend this
                prototype to make it look and feel it bit better.
              </p>
              <p>These are the basic requirements:</p>
              <ul>
                <li>User can pick a sticker</li>
                <li>User can give the captured image a title</li>
                <li>User can place the sticker over the webcam image</li>
                <li>User can capture the webcam image with sticker</li>
              </ul>
            </section>
            <section>
              <h3>What we want you to do</h3>
              <p>
                Of course we didn't expect you to build a full-fledged app in
                such a short time frame. That's why the basic requirements are
                already implemented.
              </p>
              <p>
                However, we would like for you to show off your strengths as a
                developer by improving the app.
              </p>
              <p>Some ideas (no need to do all):</p>
              <ul>
                <li>Make it look really nice</li>
                <li>Let users pick from multiple (custom) stickers</li>
                <li>Improve the workflow and ux</li>
                <li>Show multiple captured images in a gallery</li>
                <li>Let users download or share the captured pics</li>
                <li>Add super cool effects to webcam feed</li>
                <li>Organize, document and test the code</li>
                <li>Integrate with zoom, teams, meet etc.</li>
              </ul>
            </section>
            <section>
              <h3>Quickstart</h3>
              <ul>
                <li>You can clone this repo to get started </li>
                <li>run `$ npm install` to install deps</li>
                <li>run `$ npm run start` to start dev environment</li>
                <li>push it to github or gitlab to share it with us. </li>
              </ul>
            </section>
            <section>
              <p>
                P.s. We've already added some libraries to make your life easier
                (Create React App, Jss, React Router), but feel free to add
                more.
              </p>
            </section>
          </main>
        </Route>
        <Redirect to="/" />
      </Switch>
    </div>
  );
}

export default App;
