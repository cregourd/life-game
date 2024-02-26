import clsx from "clsx";
import useOutsideClick from "../utils/useOutsideClick";
import { useSettingsContext } from "../utils/useSettingsContext";
import { Close } from "./Icons";
import Range from "./Range";

interface SettingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingModal = ({ isOpen, onClose }: SettingModalProps) => {
  const ref = useOutsideClick(onClose);
  const { settings, setSettings } = useSettingsContext()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [event.target.name]: event.target.value
    })
  }

  return (
    <div className={clsx('fixed grid place-content-center inset-0 bg-gray-900 bg-opacity-50 z-10 cursor-default', !isOpen && 'hidden')}>
      <div ref={ref} className="relative bg-white p-4 rounded-md ">
        <h1 className="text-md font-bold">Settings</h1>
        <section>
          <h2 className="text-md text-gray-600">Seed</h2>
          <div>
            <p>Birth</p>
            <Range min={0} max={8} value={settings.seed.birth} onChange={(value) => setSettings({ ...settings, seed: { ...settings.seed, birth: value } })} />
          </div>
        </section>
        <button onClick={onClose} className="absolute top-2 right-2">
          <Close width="1rem" height="1rem" fill="gray" className="cursor-pointer" />
        </button>
      </div>
    </div>
  );
}

export default SettingModal;
