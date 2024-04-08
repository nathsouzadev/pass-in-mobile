import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { useBadgeStore } from '@/store/badge-store';
import { colors } from '@/styles/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, Redirect } from 'expo-router';
import { useState } from 'react';
import { View, Image, StatusBar, Alert } from 'react-native';

export default function Home() {
  const [ code, setCode ] = useState<string>('');
  const [ isLoading, setIsLoading ] = useState<boolean>(false)

  const badgeStore = useBadgeStore()

  async function handleAccess() {
    try {
      if(!code.trim()) {
        return Alert.alert('Ingresso', 'Informe o código do ingresso')
      }

      setIsLoading(true)
  
      const response = await fetch(`http://192.168.15.42:5001/api/attendee/${code}/badge`)
      const data = await response.json()

      if(data.statusCode){
        throw new Error(data.message)
      }

      badgeStore.save(data.badge)
    } catch (error) {
      setIsLoading(false)
      console.log(error)
      Alert.alert('Ingresso', `${error}`)
    }
  }

  if(badgeStore.data?.checkInURL){
    return <Redirect href='/ticket' />
  }

  
  return (
    <View className='flex-1 bg-green-500 items-center justify-center'>
      <StatusBar barStyle='light-content' />
      <Image
        source={require('@/assets/logo.png')}
        className='h-16'
        resizeMode='contain'
      />
      <View className='w-full mt-12 gap-3'>
        <Input>
          <MaterialCommunityIcons
            name='ticket-confirmation-outline'
            size={20}
            color={colors.green[200]}
          />
          <Input.Field 
            placeholder='Código do ingresso' 
            onChangeText={setCode}
          />
        </Input>

        <Button 
          title='Acessar credencial'
          onPress={handleAccess}
          isLoading={isLoading}
        />
        <Link href='/register' className='text-gray-100 text-base font-bold text-center mt-8'>Ainda não possui registro</Link> 
      </View>
    </View>
  );
}
