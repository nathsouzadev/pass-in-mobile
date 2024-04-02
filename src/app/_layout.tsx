import '@/styles/global.css';
import { Slot } from 'expo-router';
import { useFonts, Roboto_700Bold, Roboto_500Medium, Roboto_400Regular } from '@expo-google-fonts/roboto';
import { Loading } from '@/components/loading';

export default function Layout() {
  const [fonstLoaded] = useFonts({ Roboto_700Bold, Roboto_500Medium, Roboto_400Regular })

  return fonstLoaded ? <Slot /> : < Loading />
}
