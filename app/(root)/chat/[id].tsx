import { Pressable, View } from "react-native";
import { useEffect, useState } from "react";
import {
  Bubble,
  Composer,
  GiftedChat,
  IMessage,
  InputToolbar,
  Send,
} from "react-native-gifted-chat";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { getAuth } from "firebase/auth";
import {
  and,
  arrayUnion,
  collection,
  doc,
  getFirestore,
  onSnapshot,
  or,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { FontAwesome } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

const ChatMessageScreen = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [conversationId, setConversationId] = useState<string>("");
  const { id, email } = useLocalSearchParams();
  const { currentUser } = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const q = query(
      collection(db, "conversations"),
      or(
        and(where("u1._id", "==", currentUser?.uid), where("u2._id", "==", id)),
        and(where("u2._id", "==", currentUser?.uid), where("u1._id", "==", id)),
      ),
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      if (snap?.docs && snap?.docs.length > 0) {
        if (!conversationId) setConversationId(snap.docs[0].data()._id);
        setMessages([...snap.docs[0].data().messages]);
      }
    });

    return () => unsubscribe();
  }, []);

  const onSend = async (messages: IMessage[]) => {
    const previousMessages = [...messages];

    try {
      const conversationRef = conversationId
        ? doc(db, "conversations", conversationId)
        : doc(collection(db, "conversations"));
      let message = messages[0];
      message.user = {
        _id: currentUser?.uid as string,
        name: currentUser?.email as string,
      };

      const createdAt = Date.now();

      message._id = message._id;
      message.createdAt = createdAt;

      setMessages((previousMessages: IMessage[]) =>
        GiftedChat.append(previousMessages, [message], false),
      );

      if (!conversationId) {
        await setDoc(conversationRef, {
          u1: { _id: currentUser?.uid, email: currentUser?.email },
          u2: { _id: id, email },
          _id: conversationRef.id,
          messages: [message],
          createdAt,
          updatedAt: createdAt,
        });
        setConversationId(conversationRef.id);
      } else {
        await updateDoc(conversationRef, {
          updatedAt: createdAt,
          messages: arrayUnion(message),
        });
      }
    } catch (error) {
      alert("Unable to send message");
      setMessages(previousMessages);
    }
  };

  const customInputToolbar = (props: any) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          padding: 6,
        }}
      />
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center mx-2.5">
        <Pressable className="pl-2.5 mr-3.5 my-2" onPress={() => router.back()}>
          {({ pressed }) => (
            <FontAwesome
              name="chevron-left"
              size={24}
              style={{ opacity: pressed ? 0.5 : 1 }}
            />
          )}
        </Pressable>

        <Text className="ml-5 text-lg font-medium" numberOfLines={1}>
          {email}
        </Text>
      </View>

      <GiftedChat
        user={{
          _id: currentUser?.uid as string,
          name: currentUser?.email as string,
        }}
        inverted={false}
        messages={messages}
        keyboardShouldPersistTaps={"handled"}
        renderInputToolbar={(props: any) => customInputToolbar(props)}
        renderSend={(props: any) => {
          return (
            <Send
              {...props}
              containerStyle={{
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                marginRight: 15,
              }}
            >
              <FontAwesome name="paper-plane" size={20} />
            </Send>
          );
        }}
        renderBubble={(props: any) => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: "black",
                },
                left: {
                  backgroundColor: "#E5E5EA",
                },
              }}
            />
          );
        }}
        renderComposer={(props: any) => (
          <Composer {...props} textInputStyle={{ color: "black" }} />
        )}
        alwaysShowSend
        renderAvatar={null}
        onSend={onSend}
      />
      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default ChatMessageScreen;
