import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { useBadgeStore } from '@/store/badge-store';
import { colors } from '@/styles/colors';
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { View, Image, StatusBar, Alert } from 'react-native';

export default function Register() {
  const [ name, setName ] = useState<string>('')
  const [ email, setEmail ] = useState<string>('')
  const [ isLoading, setIsLoading ] = useState<boolean>(false)

  const badgeStore = useBadgeStore()
  
  async function handleRegister() {
    try {
      if(!name.trim() || !email.trim()) {
        return Alert.alert('Inscrição', 'Preencha todos os campos')
      }
  
      setIsLoading(true)

      const response = await fetch('http://192.168.15.42:5001/api/event/9e9bd979-9d10-4915-b339-3786b1634f33/attendees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email })
      })
      const data = await response.json()

      if(data.statusCode != 201){
        throw new Error(data.message)
      }

      const attendee = await fetch(`http://192.168.15.42:5001/api/attendee/${data.id}/badge`)
      const attendeeData  = await attendee.json()
      badgeStore.save(attendeeData.badge)

      Alert.alert('Inscrição', 'Inscrição realizada com sucesso', [
        { text: 'OK', onPress: () => router.push('/ticket')}
      ])
    } catch (error) {
      setIsLoading(false)
      Alert.alert('Inscrição', `${error}`)
    }
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
          <FontAwesome6
            name='user-circle'
            size={20}
            color={colors.green[200]}
          />
          <Input.Field placeholder='Nome completo' onChangeText={setName}/>
        </Input>

        <Input>
          <MaterialIcons
            name='alternate-email'
            size={20}
            color={colors.green[200]}
          />
          <Input.Field placeholder='E-mail' keyboardType='email-address' onChangeText={setEmail}/>
        </Input>

        <Button title='Realizar inscrição' onPress={handleRegister} isLoading={isLoading}/>
        <Link href='/' className='text-gray-100 text-base font-bold text-center mt-8'>Já possui ingresso</Link> 
      </View>
    </View>
  );
}
