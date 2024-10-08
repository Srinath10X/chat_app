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
import { Text } from "react-native-paper";
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

  const customtInputToolbar = (props: any) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: "#1e1e1e",
          color: "white",
          padding: 6,
        }}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 10,
        }}
      >
        <Pressable
          style={{ paddingLeft: 10, marginRight: 15, marginVertical: "5%" }}
          onPress={() => router.back()}
        >
          {({ pressed }) => (
            <FontAwesome
              name="chevron-left"
              size={24}
              color={"white"}
              style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
            />
          )}
        </Pressable>

        <Text
          style={{ marginLeft: 20 }}
          variant="titleMedium"
          ellipsizeMode="tail"
        >
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
        renderInputToolbar={(props) => customtInputToolbar(props)}
        renderSend={(props) => {
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
              <FontAwesome name="paper-plane" size={20} color={"#FFF"} />
            </Send>
          );
        }}
        renderBubble={(props) => {
          return (
            <Bubble
              {...props}
              textStyle={{
                right: {
                  color: "white",
                },
              }}
            />
          );
        }}
        renderComposer={(props) => (
          <Composer {...props} textInputStyle={{ color: "white" }} />
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
