import { Rnd } from "react-rnd";

function SettingsMenu(): React.ReactElement | null {
  return (
    <Rnd
      default={{
        x: window.innerWidth * 0.25,
        y: window.innerHeight * 0.05,
        width: window.innerWidth * 0.5,
        height: window.innerHeight * 0.9,
      }}
      bounds="window"
      style={{
        backgroundColor: "grey",
        zIndex: 10,
      }}
    >
      <p>Hello</p>
    </Rnd>
  );
}

export default SettingsMenu;
