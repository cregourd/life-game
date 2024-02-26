import { PropsWithChildren, createContext, useContext, useState } from "react";

export type Settings = {
  seed: {
    birth: [number, number],
    survive: [number, number]
  }
}

export type SettingsContextProps = {
  settings: Settings,
  setSettings: React.Dispatch<React.SetStateAction<Settings>>
}

// @ts-expect-error
const SettingsContext = createContext<SettingsContextProps>(null)

export const SettingsProvider = ({ children }: PropsWithChildren) => {
  const [settings, setSettings] = useState<Settings>({
    seed: {
      birth: [3, 3],
      survive: [2, 3]
    }
  })

  return <SettingsContext.Provider
    value={{
      settings,
      setSettings
    }}
  >
    {children}
  </SettingsContext.Provider>
}

export const useSettingsContext = () => useContext(SettingsContext)