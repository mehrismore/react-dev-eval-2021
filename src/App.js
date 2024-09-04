import { useState, useEffect } from "react";
import { createUseStyles } from "react-jss";
import { Link, Switch, Route, Redirect } from "react-router-dom";
import { useWebcamCapture } from "./useWebcamCapture";
import slapImage1 from "./assets/hand-1.png";
import slapImage2 from "./assets/hand-2.png";
import slapImage3 from "./assets/hand-3.png";
import slapImage4 from "./assets/hand-4.png";

const useStyles = createUseStyles((theme) => ({
  "@global body": {
    background: theme.palette.violet,
    color: theme.palette.text,
    fontFamily: "sans-serif",
  },

  App: {
    padding: "20px",
    background: theme.palette.violet,
    maxWidth: "800px",
    minHeight: "600px",
    margin: "auto",
    "& a": {
      color: theme.palette.text,
    },
  },
  Header: {
    "& h1": {
      fontFamily: "sans-serif",
      cursor: "pointer",
      fontSize: "4rem",
      text: theme.palette.hotPink,
      textAlign: "center",
    },
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
  Stickers: {
    "& img": {
      height: "4rem",
    },
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
    padding: "4px",
    position: "relative",
    "& img": {
      width: "150px",
      height: "10rem", // Sets a fixed height for the image
      objectFit: "cover", // Ensures the image maintains its aspect ratio
      marginTop: "16px",
    },
    "& h3": {
      padding: "8px",
      textAlign: "center",
      color: "white",
    },
  },
  inputStyle: {
    padding: "8px",
    border: "2px solid #ccc",
    borderRadius: "4px",
    marginTop: "2px",
    marginBottom: "10px",
    fontSize: "16px",
    color: theme.palette.gray,
    width: "50%",
  },
  link: {
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline", // Adding underline on hover for better UX
      color: theme.palette.hotPink,
    },
  },
  list: {
    display: "flex",
    justifyContent: "flex-end",
    listStyleType: "none",
    padding: 0,
    margin: 0,
  },
  listItem: {
    marginRight: "20px",
  },
  videoStyle: {
    display: "flex",
    alignItems: "center",
  },
  Section: {
    marginTop: "6rem",
  },
  downloadBtn: {
    position: "relative",
    display: "inline-block",
    cursor: "pointer",
    "&:hover $downloadText": {
      visibility: "visible",
      opacity: 1,
    },
  },
  downloadIcon: {
    width: "24px",
    height: "24px",
  },
  downloadText: {
    visibility: "hidden",
    width: "80px",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    color: "white",
    textAlign: "center",
    borderRadius: "6px",
    padding: "7px 0",
    position: "absolute",
    bottom: "125%", // Position the tooltip above the icon
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 1,
    opacity: 0,
    transition: "opacity 0.3s",
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
  const [title, setTitle] = useState("");

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
      <nav>
        <ul className={classes.list}>
          <li className={classes.listItem}>
            <Link to="/" className={classes.link}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/readme" className={classes.link}>
              ReadMe
            </Link>
          </li>
        </ul>
      </nav>
      <header>
        <h1 className={classes.header}>SlapSticker</h1>
      </header>
      <Switch>
        {/* Main app route */}
        <Route path="/" exact>
          <header className={classes.Header}>
            <p>
              Have you ever said something so dumb, you just wanted to slap
              yourself? Well now you can!
            </p>
          </header>
          <main>
            <section>
              <h2>Step 1: Give it a name</h2>
              <div className={classes.Gallery}>
                <input
                  type="text"
                  value={title}
                  placeholder={showPlaceholder ? "slaaaaap!" : ""}
                  className={classes.inputStyle}
                  onChange={(e) => setTitle(e.target.value)}
                  onFocus={() => setShowPlaceholder(false)}
                  onBlur={() => setShowPlaceholder(title === "")}
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
            <section className={classes.Main}>
              <h2>Step 3: Slap yourself!</h2>
              <div className={classes.videoStyle}>
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
                      className={classes.downloadBtn}
                      onClick={() => downloadPicture(picture, index)}
                    >
                      <div className={classes.downloadIcon}>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3 16.5V18.75C3 19.3467 3.23705 19.919 3.65901 20.341C4.08097 20.7629 4.65326 21 5.25 21H18.75C19.3467 21 19.919 20.7629 20.341 20.341C20.7629 19.919 21 19.3467 21 18.75V16.5M16.5 12L12 16.5M12 16.5L7.5 12M12 16.5V3"
                            stroke="black"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                      <span className={classes.downloadText}>Download</span>
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
