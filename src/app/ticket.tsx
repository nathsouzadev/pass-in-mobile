import { Button } from "@/components/button";
import { Credential } from "@/components/credential";
import { Header } from "@/components/header";
import { colors } from "@/styles/colors";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import {
  StatusBar,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Share,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { QRCode } from "@/components/qrcode";
import { useBadgeStore } from "@/store/badge-store";
import { Redirect } from "expo-router";

export default function Ticket() {
  const [ expandQRCode, setExpandQRCode ] = useState<boolean>(false);

  const badgeStore = useBadgeStore();

  async function handleShare(){
    try {
      if(badgeStore.data?.checkInURL){
        await Share.share({
          message: badgeStore.data.checkInURL
        })
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Compartilhar", "Erro ao compartilhar credencial");
    }
  }

  async function handleSelectImage() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
      });
      if (result.assets) {
        badgeStore.updateAvatar(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Foto", "Erro ao selecionar a imagem");
    }
  }

  if (!badgeStore.data) {
    return <Redirect href='/' />;
  }

  return (
    <View className="flex-1 bg-green-500">
      <StatusBar barStyle="light-content" />
      <Header title="Minha credencial" />
      <ScrollView
        className="-mt-28 -z-10"
        contentContainerClassName="px-8 pb-8"
        showsVerticalScrollIndicator
      >
        <Credential 
          data={badgeStore.data}
          onChangeAvatar={handleSelectImage} 
          onExpandQRCode={() => setExpandQRCode(true)}
        />

        <FontAwesome
          name="angle-double-down"
          size={24}
          color={colors.gray[300]}
          className="self-center my-4"
        />

        <Text className="text-white font-blod text-2xl mt-4">
          Compartilhar credencial
        </Text>

        <Text className="text-white font-regular text-base mt-1 mb-6">
          Mostre ao mundo que você está participando do evento
        </Text>
        <Button title="Compartilhar" onPress={handleShare}/>

        <View className="mt-10">
          <TouchableOpacity activeOpacity={0.7} onPress={() => badgeStore.remove()}>
            <Text className="text-base text-white font-bold text-center">
              Remover ingresso
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={expandQRCode} statusBarTranslucent animationType="fade">
        <View className="flex-1 bg-green-500 items-center justify-center">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setExpandQRCode(false)}
          >
            <QRCode value="teste" size={300}/>
            <Text className="mt-10 font-body text-orange-500 text-sm text-center">
              Fechar QR Code
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
