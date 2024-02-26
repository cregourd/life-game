import Game from "./components/Game";
import { SettingsProvider } from "./utils/useSettingsContext";

const App = () => (
  <SettingsProvider>
    <Game />
  </SettingsProvider>
)

export default App;
